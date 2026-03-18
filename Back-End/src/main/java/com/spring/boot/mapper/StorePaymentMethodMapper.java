package com.spring.boot.mapper;

import com.spring.boot.dto.StorePaymentMethodDto;
import com.spring.boot.model.StorePaymentMethod;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

@Mapper(componentModel = "spring")
public interface StorePaymentMethodMapper {

    @Mapping(source = "paymentMethod.id" , target = "paymentMethodId")
    @Mapping(source = "paymentMethod.name",target = "paymentMethodName")
    @Mapping(source = "store.id",target = "storeId")
    StorePaymentMethodDto toDto(StorePaymentMethod storePaymentMethod);

    @Mapping(source = "paymentMethodId" , target = "paymentMethod.id")
    @Mapping(source = "storeId",target = "store.id")
    StorePaymentMethod toEntity(StorePaymentMethodDto storePaymentMethodDto);


}
