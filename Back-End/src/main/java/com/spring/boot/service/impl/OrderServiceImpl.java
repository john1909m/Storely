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
    public List<OrderDto> getAllOrdersByStore(Long storeId) {
        return orderRepo.findByStore_Id(storeId).stream()
                .map(orderMapper::toOrderDto)
                .toList();
    }

    @Override
    public OrderDto getOrderById(Long orderId, Long storeId) {
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

    @Override
    public OrderDto updateOrder(OrderDto orderDto) {
        // First check if order exists
        Order existingOrder = orderRepo.findById(orderDto.getId())
                .orElseThrow(() -> new RuntimeException("order.not.found"));

        // Map DTO to entity
        Order updatedOrder = orderMapper.toOrderEntity(orderDto);
        updatedOrder.setId(existingOrder.getId()); // Preserve the ID

        // Handle store relationship
        if (updatedOrder.getStore() != null && updatedOrder.getStore().getId() != null) {
            Store existingStore = storeRepo.findById(updatedOrder.getStore().getId())
                    .orElseThrow(() -> new RuntimeException("store.not.found"));
            updatedOrder.setStore(existingStore);
        }

        Order savedOrder = orderRepo.save(updatedOrder);
        return orderMapper.toOrderDto(savedOrder);
    }

    @Override
    public void deleteOrder(Long orderId) {
        // Check if order exists
        Order order = orderRepo.findById(orderId)
                .orElseThrow(() -> new RuntimeException("order.not.found"));

        // Delete the order
        orderRepo.deleteById(orderId);
    }

    @Transactional
    public OrderDto checkout(CheckoutDto dto) {

        // 1️⃣ هات الـ Store
        Store store = storeRepo.findById(dto.getStoreId())
                .orElseThrow(() -> new RuntimeException("store.not.found"));

        // 2️⃣ أنشئ Order
        Order order = new Order();
        order.setStore(store);
        order.setCustomer(
                customerRepo.findById(dto.getCustomerId())
                        .orElseThrow(() -> new RuntimeException("customer.not.found"))
        );
        order.setStatus(OrderStatus.PENDING);

        // 3️⃣ OrderItems
        List<OrderItem> orderItems = dto.getItems().stream().map(i -> {
            Product product = productRepo.findById(i.getProductId())
                    .orElseThrow(() -> new RuntimeException("product.not.found"));

            OrderItem item = new OrderItem();
            item.setOrder(order);
            item.setProduct(product);
            item.setQuantity(i.getQuantity());
            item.setPrice(product.getPrice());

            return item;
        }).toList();

        // 4️⃣ اربطهم بالـ Order
        order.setOrderItems(orderItems);

        // 5️⃣ احسب totalPrice
        double totalPrice = orderItems.stream()
                .mapToDouble(i -> i.getPrice() * i.getQuantity())
                .sum();
        order.setTotalPrice(totalPrice);

        // 6️⃣ احفظ Order (هيحفظ items تلقائي)
        Order savedOrder = orderRepo.save(order);

        return orderMapper.toOrderDto(savedOrder);
    }

}