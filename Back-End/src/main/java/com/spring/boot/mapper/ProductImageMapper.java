package com.spring.boot.mapper;

import com.spring.boot.dto.ProductImageDto;
import com.spring.boot.model.ProductImage;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

@Mapper(componentModel = "spring")
public interface ProductImageMapper {

    @Mapping(source = "product.id", target = "productId")
    ProductImageDto toProductImageDto(ProductImage productImage);

    @Mapping(source = "productId", target = "product.id")
    ProductImage toProductImageEntity(ProductImageDto productImageDto);
}