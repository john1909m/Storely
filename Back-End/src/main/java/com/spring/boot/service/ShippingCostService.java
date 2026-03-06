package com.spring.boot.service;

import com.spring.boot.dto.ShippingCostDto;
import com.spring.boot.dto.ShippingCostRequestDto;
import com.spring.boot.model.ShippingCost;

import java.util.List;
import java.util.UUID;

public interface ShippingCostService {
    ShippingCostDto updateShippingCost(ShippingCostDto shippingCostDto);
    List<ShippingCostDto> findStoreShippingCostsByStoreId(UUID storeId);
    void saveShippingCosts(ShippingCostRequestDto request);
}
