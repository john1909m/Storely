package com.spring.boot.service;

import com.spring.boot.dto.OrderItemDto;

import java.util.List;

public interface OrderItemService {
    List<OrderItemDto> getOrderItemsByOrderId(Long orderId);
    OrderItemDto addOrderItem(OrderItemDto orderItemDto);
    OrderItemDto updateOrderItem(OrderItemDto orderItemDto);
    void deleteOrderItem(Long orderItemId);
}
