package com.spring.boot.dto;

import lombok.Getter;
import lombok.Setter;

import java.util.List;
import java.util.UUID;

@Getter
@Setter
public class CheckoutDto {
    private UUID storeId;
    private UUID customerId;
    private List<CheckoutItemDto> items;
}
