package com.spring.boot.service;

import com.spring.boot.dto.OrderItemDto;

import java.util.List;
import java.util.UUID;

public interface OrderItemService {
    List<OrderItemDto> getOrderItemsByOrderId(UUID orderId);
    OrderItemDto addOrderItem(OrderItemDto orderItemDto);
    OrderItemDto updateOrderItem(OrderItemDto orderItemDto);
    void deleteOrderItem(UUID orderItemId);
}
