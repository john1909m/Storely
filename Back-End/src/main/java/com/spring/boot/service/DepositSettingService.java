package com.spring.boot.service;

import com.spring.boot.dto.DepositSettingDto;

import java.util.UUID;

public interface DepositSettingService {
    DepositSettingDto saveOrUpdate(DepositSettingDto dto);
    DepositSettingDto getByStoreId(UUID storeId);
}
