package com.spring.boot.service.impl;

import com.spring.boot.dto.DepositSettingDto;
import com.spring.boot.enums.DepositType;
import com.spring.boot.mapper.DepositSettingMapper;
import com.spring.boot.model.DepositSetting;
import com.spring.boot.model.Store;
import com.spring.boot.repo.DepositSettingRepo;
import com.spring.boot.repo.StoreRepo;
import com.spring.boot.service.DepositSettingService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.UUID;

@Service
@RequiredArgsConstructor
public class DepositSettingServiceImpl implements DepositSettingService {

    private final DepositSettingMapper depositSettingMapper;
    private final DepositSettingRepo depositSettingRepo;
    private final StoreRepo storeRepo;

    @Override
    public DepositSettingDto saveOrUpdate(DepositSettingDto dto) {
        Store store = storeRepo.findById(dto.getStoreId())
                .orElseThrow(()-> new RuntimeException("store.not.found"));

        DepositSetting setting = depositSettingRepo.findByStoreId(dto.getStoreId())
                .orElseThrow(() -> new RuntimeException("store.not.found"));

        setting.setStore(store);
        setting.setDepositType(DepositType.valueOf(dto.getDepositType()));
        setting.setDepositValue(dto.getDepositValue());
        setting.setInstapayNumber(dto.getInstapayNumber());
        setting.setVodafoneCashNumber(dto.getVodafoneCashNumber());
        setting.setDepositRequired(dto.getDepositRequired());

        return depositSettingMapper.toDto(depositSettingRepo.save(setting));


    }

    @Override
    public DepositSettingDto getByStoreId(UUID storeId) {
        DepositSetting setting = depositSettingRepo.findByStoreId(storeId)
                .orElseThrow(()-> new RuntimeException("store.not.found"));

        return depositSettingMapper.toDto(setting);
    }
}
