package com.spring.boot.dto;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class CheckoutItemDto {
    private Long productId;
    private Integer quantity;
}
