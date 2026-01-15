package com.spring.boot.mapper;

import com.spring.boot.dto.StoreDto;
import com.spring.boot.model.Store;
import org.mapstruct.Mapper;

@Mapper(componentModel = "spring", uses = {CategoryMapper.class, ProductMapper.class})
public interface StoreMapper {

    StoreDto toStoreDto(Store store);
    Store toStoreEntity(StoreDto storeDto);
}
