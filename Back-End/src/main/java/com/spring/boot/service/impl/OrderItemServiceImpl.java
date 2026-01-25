package com.spring.boot.service.impl;

import com.spring.boot.dto.OrderItemDto;
import com.spring.boot.mapper.OrderItemMapper;
import com.spring.boot.model.Order;
import com.spring.boot.model.OrderItem;
import com.spring.boot.model.Product;
import com.spring.boot.repo.OrderItemRepo;
import com.spring.boot.repo.OrderRepo;
import com.spring.boot.repo.ProductRepo;
import com.spring.boot.service.OrderItemService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class OrderItemServiceImpl implements OrderItemService {

    private final OrderItemMapper orderItemMapper;
    private final OrderItemRepo orderItemRepo;
    private final OrderRepo orderRepo;
    private final ProductRepo productRepo;

    @Autowired
    public OrderItemServiceImpl(OrderItemMapper orderItemMapper,
                                OrderItemRepo orderItemRepo,
                                OrderRepo orderRepo,
                                ProductRepo productRepo) {
        this.orderItemMapper = orderItemMapper;
        this.orderItemRepo = orderItemRepo;
        this.orderRepo = orderRepo;
        this.productRepo = productRepo;
    }

    @Override
    public List<OrderItemDto> getOrderItemsByOrderId(Long orderId) {
        return orderItemRepo.findAllByOrder_Id(orderId).stream()
                .map(orderItemMapper::toOrderItemDto)
                .toList();
    }

    @Override
    public OrderItemDto addOrderItem(OrderItemDto orderItemDto) {
        OrderItem orderItem = orderItemMapper.toOrderItemEntity(orderItemDto);

        // Handle order relationship
        if (orderItem.getOrder() != null && orderItem.getOrder().getId() != null) {
            Order existingOrder = orderRepo.findById(orderItem.getOrder().getId())
                    .orElseThrow(() -> new RuntimeException("order.not.found"));
            orderItem.setOrder(existingOrder);
        } else if (orderItem.getOrder() != null) {
            throw new RuntimeException("order.id.required");
        }

        // Handle product relationship
        if (orderItem.getProduct() != null && orderItem.getProduct().getId() != null) {
            Product existingProduct = productRepo.findById(orderItem.getProduct().getId())
                    .orElseThrow(() -> new RuntimeException("product.not.found"));
            orderItem.setProduct(existingProduct);
        } else if (orderItem.getProduct() != null) {
            throw new RuntimeException("product.id.required");
        }

        OrderItem savedOrderItem = orderItemRepo.save(orderItem);
        return orderItemMapper.toOrderItemDto(savedOrderItem);
    }

    @Override
    public OrderItemDto updateOrderItem(OrderItemDto orderItemDto) {
        // First check if order item exists
        OrderItem existingOrderItem = orderItemRepo.findById(orderItemDto.getId())
                .orElseThrow(() -> new RuntimeException("order.item.not.found"));

        // Map DTO to entity
        OrderItem updatedOrderItem = orderItemMapper.toOrderItemEntity(orderItemDto);
        updatedOrderItem.setId(existingOrderItem.getId()); // Preserve the ID

        // Handle order relationship
        if (updatedOrderItem.getOrder() != null && updatedOrderItem.getOrder().getId() != null) {
            Order existingOrder = orderRepo.findById(updatedOrderItem.getOrder().getId())
                    .orElseThrow(() -> new RuntimeException("order.not.found"));
            updatedOrderItem.setOrder(existingOrder);
        }

        // Handle product relationship
        if (updatedOrderItem.getProduct() != null && updatedOrderItem.getProduct().getId() != null) {
            Product existingProduct = productRepo.findById(updatedOrderItem.getProduct().getId())
                    .orElseThrow(() -> new RuntimeException("product.not.found"));
            updatedOrderItem.setProduct(existingProduct);
        }

        OrderItem savedOrderItem = orderItemRepo.save(updatedOrderItem);
        return orderItemMapper.toOrderItemDto(savedOrderItem);
    }

    @Override
    public void deleteOrderItem(Long orderItemId) {
        // Check if order item exists
        OrderItem orderItem = orderItemRepo.findById(orderItemId)
                .orElseThrow(() -> new RuntimeException("order.item.not.found"));

        // Delete the order item
        orderItemRepo.deleteById(orderItemId);
    }
}