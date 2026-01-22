package com.spring.boot.dto;

import com.spring.boot.model.Customer;
import lombok.Getter;
import lombok.RequiredArgsConstructor;
import lombok.Setter;

import java.time.LocalDateTime;
import java.util.List;

@Getter
@Setter
@RequiredArgsConstructor
public class OrderDto {

    private Long id;

    private Double totalPrice;

    private String status;

    private LocalDateTime createdAt;

    private CustomerDto customer;

    private List<OrderItemDto> orderItems;

    private Long storeId;
}
