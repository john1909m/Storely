package com.spring.boot.dto;

import lombok.Getter;
import lombok.RequiredArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@RequiredArgsConstructor
public class OrderItemDto {
    private Long id;
    private Integer quantity;
    private Double price;
    private Long productId;
    private Long orderId;
}
