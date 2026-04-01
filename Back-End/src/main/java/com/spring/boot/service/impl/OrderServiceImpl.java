package com.spring.boot.service.impl;

import com.spring.boot.dto.CheckoutDto;
import com.spring.boot.dto.OrderDto;
import com.spring.boot.enums.DepositStatus;
import com.spring.boot.enums.DepositType;
import com.spring.boot.enums.OrderStatus;
import com.spring.boot.enums.PaymentStatus;
import com.spring.boot.mapper.OrderMapper;
import com.spring.boot.model.*;
import com.spring.boot.repo.*;
import com.spring.boot.service.OrderService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Service
public class OrderServiceImpl implements OrderService {

    private OrderMapper orderMapper;
    private OrderRepo orderRepo;
    private StoreRepo storeRepo;
    private ProductRepo productRepo;
    private CustomerRepo customerRepo;
    private ShippingCostRepo shippingCostRepo;
    private GovernorateRepo governorateRepo;
    private DepositSettingRepo depositSettingRepo;
    private R2StorageService storageService;
    private PaymentMethodRepo paymentMethodRepo;
    private StorePaymentMethodRepo storePaymentMethodRepo;
    private EmailService emailService;

    @Autowired
    public OrderServiceImpl(OrderMapper orderMapper,
                            OrderRepo orderRepo,
                            StoreRepo storeRepo,
                            ProductRepo productRepo,
                            CustomerRepo customerRepo,
                            ShippingCostRepo shippingCostRepo,
                            GovernorateRepo governorateRepo,
                            DepositSettingRepo depositSettingRepo,
                            R2StorageService storageService,
                            PaymentMethodRepo paymentMethodRepo,
                            StorePaymentMethodRepo storePaymentMethodRepo,
                            EmailService emailService) {
        this.orderMapper = orderMapper;
        this.orderRepo = orderRepo;
        this.storeRepo = storeRepo;
        this.productRepo = productRepo;
        this.customerRepo = customerRepo;
        this.shippingCostRepo = shippingCostRepo;
        this.governorateRepo = governorateRepo;
        this.depositSettingRepo = depositSettingRepo;
        this.storageService = storageService;
        this.paymentMethodRepo = paymentMethodRepo;
        this.storePaymentMethodRepo = storePaymentMethodRepo;
        this.emailService = emailService;

    }

    @Override
    public List<OrderDto> getAllOrdersByStore(UUID storeId) {
        return orderRepo.findByStore_Id(storeId).stream()
                .map(orderMapper::toOrderDto)
                .toList();
    }

    @Override
    public OrderDto getOrderById(UUID orderId, UUID storeId) {
        return orderRepo.findByIdAndStore_Id(orderId, storeId)
                .map(orderMapper::toOrderDto)
                .orElseThrow(() -> new RuntimeException("order.not.found.in.store"));
    }

    @Override
    public OrderDto addOrder(OrderDto orderDto) {
        Order order = orderMapper.toOrderEntity(orderDto);

        // Handle store relationship
        if (order.getStore() != null && order.getStore().getId() != null) {
            Store existingStore = storeRepo.findById(order.getStore().getId())
                    .orElseThrow(() -> new RuntimeException("store.not.found"));
            order.setStore(existingStore);
        } else if (order.getStore() != null) {
            throw new RuntimeException("store.id.required");
        }

        Order savedOrder = orderRepo.save(order);
        return orderMapper.toOrderDto(savedOrder);
    }

    private void restoreStock(Order order) {

        for (OrderItem item : order.getOrderItems()) {

            Product product = item.getProduct();
            int qty = item.getQuantity();

            // 1️⃣ Product بدون variants
            if (product.getVariants().isEmpty()) {
                product.setQuantity(product.getQuantity() + qty);
                continue;
            }

            // 2️⃣ Product فيه variants
            ProductVariant variant = product.getVariants().stream()
                    .filter(v ->
                            (item.getProductColor() == null || item.getProductColor().equals(v.getProductColor())) &&
                                    (item.getProductSize() == null || item.getProductSize().equals(v.getProductSize()))
                    )
                    .findFirst()
                    .orElseThrow(() -> new RuntimeException("variant.not.found"));

            variant.setQuantity(variant.getQuantity() + qty);
        }
    }

    private boolean isValidStatusTransition(OrderStatus oldStatus, OrderStatus newStatus) {

        // ✅ cancelled مسموح دايمًا
        if (newStatus == OrderStatus.CANCELLED) {
            return true;
        }

        // ❌ ممنوع أي انتقال بعد delivered
        if (oldStatus == OrderStatus.DELIVERED) {
            return false;
        }

        // ترتيب الـ flow
        List<OrderStatus> flow = List.of(
                OrderStatus.PENDING,
                OrderStatus.CONFIRMED,
                OrderStatus.PROCESSING,
                OrderStatus.SHIPPED,
                OrderStatus.DELIVERED
        );

        int oldIndex = flow.indexOf(oldStatus);
        int newIndex = flow.indexOf(newStatus);

        // لازم يتحرك خطوة لقدّام بس
        return newIndex == oldIndex + 1;
    }



    @Override
    @Transactional
    public OrderDto updateOrder(OrderDto orderDto) {

        Order existingOrder = orderRepo.findById(orderDto.getId())
                .orElseThrow(() -> new RuntimeException("order.not.found"));

        OrderStatus oldStatus = existingOrder.getStatus();
        OrderStatus newStatus = OrderStatus.valueOf(orderDto.getStatus());

        // ❌ validate sequence
        if (!isValidStatusTransition(oldStatus, newStatus)) {
            throw new RuntimeException("invalid.status.transition");
        }

        // ✅ restore stock لو اتلغى
        if (oldStatus != OrderStatus.CANCELLED &&
                newStatus == OrderStatus.CANCELLED) {
            restoreStock(existingOrder);
        }

        // ✅ تحديث حالة الطلب
        existingOrder.setStatus(newStatus);

        // ✅ تحديث حالة الدفع (للدفع الكامل)
        if (orderDto.getPaymentStatus() != null) {
            existingOrder.setPaymentStatus(PaymentStatus.valueOf(orderDto.getPaymentStatus()));

            // لو الدفع اكتمل، نأكد الطلب
            if (orderDto.getPaymentStatus().equals("PAID") &&
                    newStatus == OrderStatus.PENDING) {
                existingOrder.setStatus(OrderStatus.CONFIRMED);
            }

            // لو الدفع فشل، نلغي الطلب
            if (orderDto.getPaymentStatus().equals("FAILED") &&
                    newStatus != OrderStatus.CANCELLED) {
                existingOrder.setStatus(OrderStatus.CANCELLED);
            }
        }

        // ✅ تحديث حالة الإيداع
        if (orderDto.getDepositStatus() != null) {
            existingOrder.setDepositStatus(DepositStatus.valueOf(orderDto.getDepositStatus()));

            // تحديث depositPaid بناء على الحالة
            if (orderDto.getDepositStatus().equals("CONFIRMED")) {
                existingOrder.setDepositPaid(true);

                // لو الإيداع اتأكد والطلب لسه pending، نأكد الطلب
                if (newStatus == OrderStatus.PENDING) {
                    existingOrder.setStatus(OrderStatus.CONFIRMED);
                }
            } else if (orderDto.getDepositStatus().equals("REJECTED")) {
                existingOrder.setDepositPaid(false);

                // لو الإيداع اترفض، نلغي الطلب
                if (newStatus != OrderStatus.CANCELLED) {
                    existingOrder.setStatus(OrderStatus.CANCELLED);
                }
            }
        }

        // ✅ تحديث depositPaid لو موجود في الـ DTO
        if (orderDto.getDepositPaid() != null) {
            existingOrder.setDepositPaid(orderDto.getDepositPaid());
        }

        Order savedOrder = orderRepo.save(existingOrder);
        return orderMapper.toOrderDto(savedOrder);
    }



    @Override
    public void deleteOrder(UUID orderId) {
        // Check if order exists
        Order order = orderRepo.findById(orderId)
                .orElseThrow(() -> new RuntimeException("order.not.found"));

        // Delete the order
        orderRepo.deleteById(orderId);
    }


    private void deductStock(Product product, String color, String size, int requestedQty) {

        // 1️⃣ Product بدون variants
        if (product.getVariants().isEmpty()) {
            if (product.getQuantity() < requestedQty) {
                throw new RuntimeException("out.of.stock");
            }
            product.setQuantity(product.getQuantity() - requestedQty);
            return;
        }

        // 2️⃣ Product فيه variants
        ProductVariant variant = product.getVariants().stream()
                .filter(v ->
                        (color == null || color.equals(v.getProductColor())) &&
                                (size == null || size.equals(v.getProductSize()))
                )
                .findFirst()
                .orElseThrow(() -> new RuntimeException("variant.not.found"));

        if (variant.getQuantity() < requestedQty) {
            throw new RuntimeException("out.of.stock");
        }

        variant.setQuantity(variant.getQuantity() - requestedQty);
    }

    public void sendNewOrderEmail(Order order) {
        String email = order.getStore().getVendor().getEmail();

        String subject = "New Order Received 🎉";

        String body= """
                <!DOCTYPE html>
                            <html>
                            <head>
                                <meta charset="UTF-8">
                                <title>Order Confirmation - %s</title>
                            </head>
                            <body style="margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; background-color: #f4f4f4;">
                                <div style="max-width: 500px; margin: 20px auto; background: white; border-radius: 8px; overflow: hidden; box-shadow: 0 2px 4px rgba(0,0,0,0.1);">
                
                                    <!-- Header with store name instead of generic text -->
                                    <div style="background: #f97316; padding: 20px; text-align: center;">
                                        <h2 style="color: white; margin: 0; font-size: 20px;">%s</h2>
                                        <p style="color: #ffedd5; margin: 5px 0 0 0; font-size: 12px;">Order Confirmation</p>
                                    </div>
                
                                    <div style="padding: 25px;">
                                        <div style="background: #fef9e8; padding: 15px; border-radius: 6px; margin-bottom: 20px; border-left: 3px solid #f97316;">
                                            <p style="margin: 0; color: #92400e; font-size: 14px;">Hello %s,</p>
                                            <p style="margin: 8px 0 0 0; color: #92400e; font-size: 14px;">You've received a new order!</p>
                                        </div>
                
                                        <div style="margin-bottom: 20px;">
                                            <table style="width: 100%%; border-collapse: collapse;">
                                                <tr>
                                                    <td style="padding: 8px 0; color: #6b7280; width: 100px;">Order ID:</td>
                                                    <td style="padding: 8px 0; font-weight: bold; color: #f97316;">#%s</td>
                                                </tr>
                                                <tr>
                                                    <td style="padding: 8px 0; color: #6b7280;">Customer:</td>
                                                    <td style="padding: 8px 0; font-weight: 500;">%s</td>
                                                </tr>
                                                <tr>
                                                    <td style="padding: 8px 0; color: #6b7280;">Total:</td>
                                                    <td style="padding: 8px 0; font-weight: bold; color: #f97316; font-size: 18px;">%s</td>
                                                </tr>
                                            </table>
                                        </div>
                
                                        <hr style="border: none; border-top: 1px solid #e5e7eb; margin: 20px 0;">
                
                                        <p style="color: #6b7280; font-size: 12px; text-align: center; margin: 0;">
                                            View this order in your vendor dashboard.<br>
                                            This is an automated message from %s.
                                        </p>
                                    </div>
                                </div>
                            </body>
                            </html>
                
                """.formatted(
                        order.getId(),
                         order.getStore().getStoreName(),
                order.getStore().getStoreName(),
                order.getId(),
                order.getCustomer().getFirstName()+" "+order.getCustomer().getLastName(),
                order.getTotalPrice(),
                order.getStore().getStoreName()
                );

        emailService.sendEmail(email, subject, body);

    }


    @Transactional
    @Override
    public OrderDto checkout(CheckoutDto dto) {

        // =========================
        // FETCH DATA
        // =========================

        Store store = storeRepo.findById(dto.getStoreId())
                .orElseThrow(() -> new RuntimeException("store.not.found"));

        Customer customer = customerRepo.findById(dto.getCustomerId())
                .orElseThrow(() -> new RuntimeException("customer.not.found"));

        PaymentMethod paymentMethod = paymentMethodRepo.findById(dto.getPaymentMethodId())
                .orElseThrow(() -> new RuntimeException("payment.method.not.found"));

        // =========================
        // VALIDATE PAYMENT METHOD
        // =========================

        boolean isAllowed = storePaymentMethodRepo
                .findByStoreId(store.getId())
                .stream()
                .anyMatch(pm ->
                        pm.getPaymentMethod().getId().equals(paymentMethod.getId())
                                && Boolean.TRUE.equals(pm.getIsActive())
                );

        if (!isAllowed) {
            throw new RuntimeException("payment.method.not.allowed");
        }

        // =========================
        // CREATE ORDER
        // =========================

        Order order = new Order();
        order.setStore(store);
        order.setCustomer(customer);
        order.setStatus(OrderStatus.PENDING);
        order.setPaymentMethod(paymentMethod);
        order.setPaymentStatus(PaymentStatus.PENDING);

        // =========================
        // ORDER ITEMS
        // =========================

        List<OrderItem> orderItems = dto.getItems().stream().map(i -> {

            Product product = productRepo.findById(i.getProductId())
                    .orElseThrow(() -> new RuntimeException("product.not.found"));

            deductStock(
                    product,
                    i.getProductColor(),
                    i.getProductSize(),
                    i.getQuantity()
            );

            OrderItem item = new OrderItem();
            item.setOrder(order);
            item.setProduct(product);
            item.setQuantity(i.getQuantity());
            item.setPrice(product.getPrice());

            // snapshot
            item.setProductColor(i.getProductColor());
            item.setProductSize(i.getProductSize());

            return item;

        }).toList();

        order.setOrderItems(orderItems);

        // =========================
        // ITEMS TOTAL
        // =========================

        double itemsTotal = orderItems.stream()
                .mapToDouble(i -> i.getPrice() * i.getQuantity())
                .sum();

        order.setItemsTotal(itemsTotal);

        // =========================
        // SHIPPING COST
        // =========================

        String governorateName = customer.getCity();

        Long governorateId = governorateRepo.findByName(governorateName)
                .orElseThrow(() -> new RuntimeException("governorate.not.found"))
                .getId();

        ShippingCost shippingCost = shippingCostRepo
                .findByStoreIdAndGovernorateId(store.getId(), governorateId)
                .orElseThrow(() -> new RuntimeException("shipping.cost.not.found"));

        double shippingPrice = shippingCost.getPrice();

        order.setShippingCost(shippingPrice);

        // =========================
        // TOTAL PRICE
        // =========================

        double totalPrice = itemsTotal + shippingPrice;
        order.setTotalPrice(totalPrice);

        // =========================
        // DEPOSIT SETTINGS
        // =========================

        DepositSetting depositSetting = depositSettingRepo
                .findByStoreId(store.getId())
                .orElse(null);

        // =========================
        // PAYMENT LOGIC
        // =========================

        String method = paymentMethod.getName();

        // 🟢 ONLINE PAYMENT (Instapay / Vodafone Cash)
        if (method.equals("INSTAPAY") || method.equals("VODAFONE_CASH")) {

            // لازم يدفع كامل
            order.setDepositValue(totalPrice);
            order.setDepositStatus(DepositStatus.PENDING);
            order.setDepositPaid(false);

            order.setPaymentStatus(PaymentStatus.PENDING);

        }

        // 🟡 CASH ON DELIVERY
        else if (method.equals("COD")) {

            if (depositSetting != null && Boolean.TRUE.equals(depositSetting.getDepositRequired())) {

                double depositAmount = 0;

                if (depositSetting.getDepositType() == DepositType.SHIPPING) {
                    depositAmount = shippingPrice;

                } else if (depositSetting.getDepositType() == DepositType.PERCENTAGE) {
                    depositAmount = itemsTotal * depositSetting.getDepositValue() / 100;
                }

                order.setDepositValue(depositAmount);
                order.setDepositStatus(DepositStatus.PENDING);
                order.setDepositPaid(false);

            } else {

                order.setDepositStatus(DepositStatus.NOT_REQUIRED);
            }

            order.setPaymentStatus(PaymentStatus.PENDING);
        }

        // =========================
        // SAVE ORDER
        // =========================

        Order savedOrder = orderRepo.save(order);

        sendNewOrderEmail(savedOrder);

        return orderMapper.toOrderDto(savedOrder);
    }




    @Override
    public OrderDto uploadDeposit(UUID orderId, MultipartFile screenshot) {
        Order order = orderRepo.findById(orderId).orElseThrow(() -> new RuntimeException("order.not.found"));
        String objectKey = "orders/" + orderId + "/";
        String imageUrl=storageService.uploadFile(objectKey,screenshot);
        order.setDepositScreenShotUrl(imageUrl);
        order.setDepositStatus(DepositStatus.UNDER_REVIEW);
        orderRepo.save(order);

        return orderMapper.toOrderDto(order);
    }

}