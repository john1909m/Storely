package com.spring.boot.service.impl;

import com.spring.boot.dto.OrderItemDto;
import com.spring.boot.service.OrderItemService;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class OrderItemServiceImpl implements OrderItemService {
    @Override
    public List<OrderItemDto> getOrderItemsByOrderId(Long orderId) {
        return List.of();
    }

    @Override
    public OrderItemDto addOrderItem(OrderItemDto orderItemDto, Long orderId) {
        return null;
    }

    @Override
    public OrderItemDto updateOrderItem(OrderItemDto orderItemDto, Long orderId) {
        return null;
    }

    @Override
    public void deleteOrderItem(Long orderItemId, Long orderId) {

    }
}
