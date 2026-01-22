package com.spring.boot.service;

import com.spring.boot.dto.OrderItemDto;

import java.util.List;

public interface OrderItemService {
    List<OrderItemDto> getOrderItemsByOrderId(Long orderId);
    OrderItemDto addOrderItem(OrderItemDto orderItemDto, Long orderId);
    OrderItemDto updateOrderItem(OrderItemDto orderItemDto, Long orderId);
    void deleteOrderItem(Long orderItemId,Long orderId);
}
