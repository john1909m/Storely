package com.spring.boot.mapper;

import com.spring.boot.dto.ProductVariantDto;
import com.spring.boot.model.ProductVariant;
import org.mapstruct.Mapper;

@Mapper(componentModel = "spring")
public interface ProductVariantMapper {


    ProductVariantDto toDto(ProductVariant entity);

    ProductVariant toEntity(ProductVariantDto dto);


}
