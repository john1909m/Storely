package com.spring.boot.dto;

import lombok.Getter;
import lombok.RequiredArgsConstructor;
import lombok.Setter;

import java.util.UUID;

@Getter
@Setter
@RequiredArgsConstructor
public class OrderItemDto {
    private UUID id;
    private Integer quantity;
    private Double price;
    private UUID productId;
    private String productName;
    private String productColor;
    private String productSize;
}
