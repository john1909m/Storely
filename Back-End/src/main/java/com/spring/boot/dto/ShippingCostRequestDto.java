package com.spring.boot.dto;

import lombok.Data;

import java.util.List;
import java.util.UUID;

@Data
public class ShippingCostRequestDto {
    private UUID storeId;
    private List<ShippingCostItemDto> shippingCosts;
}
