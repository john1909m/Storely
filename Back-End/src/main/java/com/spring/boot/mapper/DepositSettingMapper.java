package com.spring.boot.mapper;

import com.spring.boot.dto.DepositSettingDto;
import com.spring.boot.model.DepositSetting;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

@Mapper(componentModel = "spring")
public interface DepositSettingMapper {
    @Mapping(source = "store.id",target = "storeId")
    DepositSettingDto toDto(DepositSetting entity);

    @Mapping(source = "storeId",target = "store.id")
    DepositSetting toEntity(DepositSettingDto dto);
}
