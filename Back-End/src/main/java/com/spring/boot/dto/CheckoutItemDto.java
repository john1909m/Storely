package com.spring.boot.dto;

import lombok.Getter;
import lombok.Setter;

import java.util.UUID;

@Getter
@Setter
public class CheckoutItemDto {
    private UUID productId;
    private Integer quantity;
    private Double price;
    private String productColor;
    private String productSize;

}
