package com.spring.boot.mapper;

import com.spring.boot.dto.ShippingCostDto;
import com.spring.boot.dto.StoreDto;
import com.spring.boot.model.Store;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

@Mapper(componentModel = "spring", uses = {CategoryMapper.class, ProductMapper.class, ShippingCostMapper.class})
public interface StoreMapper {

    @Mapping(source = "storeStatus",target = "storeStatus")
    @Mapping(source = "products",target = "products")
    @Mapping(source = "categories",target = "categories")
    @Mapping(source = "vendor.id" , target = "vendorId")
    @Mapping(source = "vendor.name",target = "vendorName")
    @Mapping(source = "shippingCosts",target = "shippingCosts")
    StoreDto toStoreDto(Store store);

    @Mapping(source = "storeStatus",target = "storeStatus")
    @Mapping(source = "products",target = "products")
    @Mapping(source = "categories",target = "categories")
    @Mapping(source = "shippingCosts",target = "shippingCosts")
    @Mapping(target = "vendor", ignore = true)
    Store toStoreEntity(StoreDto storeDto);
}
