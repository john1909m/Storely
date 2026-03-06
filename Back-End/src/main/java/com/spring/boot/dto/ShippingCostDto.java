package com.spring.boot.dto;

import lombok.Getter;
import lombok.RequiredArgsConstructor;
import lombok.Setter;

import java.util.UUID;

@Getter
@Setter
@RequiredArgsConstructor
public class ShippingCostDto {

    private Long id;

    private UUID storeId;

    private Long governorateId;

    private String governorateName;

    private Double price;
}
