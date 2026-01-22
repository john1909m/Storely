package com.spring.boot.service.impl;

import com.spring.boot.dto.OrderDto;
import com.spring.boot.service.OrderService;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class OrderServiceImpl implements OrderService {

    @Override
    public List<OrderDto> getAllOrders() {
        return List.of();
    }

    @Override
    public List<OrderDto> getAllOrdersByStore(Long storeId) {
        return List.of();
    }

    @Override
    public OrderDto getOrderById(Long orderId, Long storeId) {
        return null;
    }

    @Override
    public OrderDto addOrder(OrderDto orderDto) {
        return null;
    }

    @Override
    public OrderDto updateOrder(OrderDto orderDto) {
        return null;
    }

    @Override
    public void deleteOrder(Long orderId) {

    }
}
