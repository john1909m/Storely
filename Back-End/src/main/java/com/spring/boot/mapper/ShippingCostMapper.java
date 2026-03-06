package com.spring.boot.mapper;

import com.spring.boot.dto.ShippingCostDto;
import com.spring.boot.model.ShippingCost;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

@Mapper(componentModel = "spring")
public interface ShippingCostMapper {

    @Mapping(source = "governorate.id",target = "governorateId")
    @Mapping(source = "governorate.name",target = "governorateName")
    @Mapping(source = "store.id",target = "storeId")
    ShippingCostDto toDto(ShippingCost shippingCost);

    @Mapping(target = "governorate.id",source = "governorateId")
    @Mapping(target = "governorate.name",source = "governorateName")
    @Mapping(target = "store.id",source = "storeId")
    ShippingCost toEntity(ShippingCostDto shippingCostDto);
}
