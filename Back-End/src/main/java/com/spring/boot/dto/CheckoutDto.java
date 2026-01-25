package com.spring.boot.dto;

import lombok.Getter;
import lombok.Setter;

import java.util.List;

@Getter
@Setter
public class CheckoutDto {
    private Long storeId;
    private Long customerId;
    private List<CheckoutItemDto> items;
}
