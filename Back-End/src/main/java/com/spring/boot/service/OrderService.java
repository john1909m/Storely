package com.spring.boot.service;

import com.spring.boot.dto.OrderDto;

import java.util.List;

public interface OrderService {
    List<OrderDto> getAllOrders();

    List<OrderDto> getAllOrdersByStore(Long storeId);

    OrderDto getOrderById(Long orderId, Long storeId);

    OrderDto addOrder(OrderDto orderDto, Long storeId);

    OrderDto updateOrder(OrderDto orderDto, Long storeId);

    void deleteOrder(Long orderId, Long storeId);

}
