package com.spring.boot.service;

import com.spring.boot.dto.CheckoutDto;
import com.spring.boot.dto.OrderDto;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;
import java.util.UUID;

public interface OrderService {

    List<OrderDto> getAllOrdersByStore(UUID storeId);

    OrderDto getOrderById(UUID orderId, UUID storeId);

    OrderDto addOrder(OrderDto orderDto);

    OrderDto updateOrder(OrderDto orderDto);

    void deleteOrder(UUID orderId);

    OrderDto checkout(CheckoutDto dto);

    OrderDto uploadDeposit(UUID orderId, MultipartFile screenshot);

}
