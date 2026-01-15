package com.spring.boot.mapper;

import com.spring.boot.dto.ProductImageDto;
import com.spring.boot.model.ProductImage;
import org.mapstruct.Mapper;

@Mapper(componentModel = "spring")
public interface ProductImageMapper {

    ProductImageDto toProductImageDto(ProductImage productImage);
    ProductImage toProductImageEntity(ProductImageDto productImageDto);
}