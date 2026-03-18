package com.spring.boot.service;

import com.spring.boot.dto.StorePaymentMethodDto;
import com.spring.boot.model.StorePaymentMethod;

import java.util.List;
import java.util.UUID;

public interface StorePaymentMethodService {
    List<StorePaymentMethodDto> getStorePaymentMethods(UUID storeId);
    List<StorePaymentMethodDto> updateStorePaymentMethods(UUID storeId, List<StorePaymentMethodDto> storePaymentMethodDtos);
}
