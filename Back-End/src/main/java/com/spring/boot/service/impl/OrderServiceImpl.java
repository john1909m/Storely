package com.spring.boot.service.impl;

import com.spring.boot.dto.CheckoutDto;
import com.spring.boot.dto.OrderDto;
import com.spring.boot.enums.OrderStatus;
import com.spring.boot.mapper.OrderMapper;
import com.spring.boot.model.*;
import com.spring.boot.repo.*;
import com.spring.boot.service.OrderService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

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

    @Autowired
    public OrderServiceImpl(OrderMapper orderMapper,
                            OrderRepo orderRepo,
                            StoreRepo storeRepo,
                            ProductRepo productRepo,
                            CustomerRepo customerRepo) {
        this.orderMapper = orderMapper;
        this.orderRepo = orderRepo;
        this.storeRepo = storeRepo;
        this.productRepo = productRepo;
        this.customerRepo = customerRepo;
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
            throw new RuntimeException(
                    "invalid.status.transition"
            );
        }

        // ✅ restore stock لو اتلغى
        if (oldStatus != OrderStatus.CANCELLED &&
                newStatus == OrderStatus.CANCELLED) {

            restoreStock(existingOrder);
        }

        existingOrder.setStatus(newStatus);

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


    @Transactional
    public OrderDto checkout(CheckoutDto dto) {

        Store store = storeRepo.findById(dto.getStoreId())
                .orElseThrow(() -> new RuntimeException("store.not.found"));

        Order order = new Order();
        order.setStore(store);
        order.setCustomer(
                customerRepo.findById(dto.getCustomerId())
                        .orElseThrow(() -> new RuntimeException("customer.not.found"))
        );
        order.setStatus(OrderStatus.PENDING);

        List<OrderItem> orderItems = dto.getItems().stream().map(i -> {

            Product product = productRepo.findById(i.getProductId())
                    .orElseThrow(() -> new RuntimeException("product.not.found"));


            deductStock(
                    product,
                    i.getProductColor(),
                    i.getProductSize(),
                    i.getQuantity()
            );


            // ✅ VALIDATE VARIANT + STOCK HERE (later)
            OrderItem item = new OrderItem();
            item.setOrder(order);
            item.setProduct(product);
            item.setQuantity(i.getQuantity());
            item.setPrice(product.getPrice());

            // ✅ SNAPSHOT
            item.setProductColor(i.getProductColor());
            item.setProductSize(i.getProductSize());

            return item;
        }).toList();

        order.setOrderItems(orderItems);

        double totalPrice = orderItems.stream()
                .mapToDouble(i -> i.getPrice() * i.getQuantity())
                .sum();

        order.setTotalPrice(totalPrice);

        Order savedOrder = orderRepo.save(order);

        return orderMapper.toOrderDto(savedOrder);
    }


}