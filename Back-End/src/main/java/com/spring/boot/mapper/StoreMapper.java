package com.spring.boot.mapper;

import com.spring.boot.dto.StoreDto;
import com.spring.boot.model.Store;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

@Mapper(componentModel = "spring", uses = {CategoryMapper.class, ProductMapper.class})
public interface StoreMapper {

    @Mapping(source = "storeStatus",target = "storeStatus")
    @Mapping(source = "products",target = "products")
    @Mapping(source = "categories",target = "categories")
    StoreDto toStoreDto(Store store);

    @Mapping(source = "storeStatus",target = "storeStatus")
    @Mapping(source = "products",target = "products")
    @Mapping(source = "categories",target = "categories")
    Store toStoreEntity(StoreDto storeDto);
}
