package com.spring.boot.service;

import com.spring.boot.dto.OrderDto;

import java.util.List;

public interface OrderService {
    List<OrderDto> getAllOrders();

    List<OrderDto> getAllOrdersByStore(Long storeId);

    OrderDto getOrderById(Long orderId, Long storeId);

    OrderDto addOrder(OrderDto orderDto);

    OrderDto updateOrder(OrderDto orderDto);

    void deleteOrder(Long orderId);

}
