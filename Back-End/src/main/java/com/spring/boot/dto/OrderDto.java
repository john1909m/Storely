package com.spring.boot.dto;

import com.spring.boot.model.Customer;
import lombok.Getter;
import lombok.RequiredArgsConstructor;
import lombok.Setter;

import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

@Getter
@Setter
@RequiredArgsConstructor
public class OrderDto {

    private UUID id;

    private Double totalPrice;

    private String status;

    private LocalDateTime createdAt;

    private CustomerDto customer;

    private List<OrderItemDto> orderItems;

    private UUID storeId;

    private Double depositValue;

    private Boolean depositPaid;

    private String depositScreenShotUrl;

    private String depositStatus;

    private Long paymentMethodId;

    private String paymentMethodName;

    private String paymentStatus;
}
