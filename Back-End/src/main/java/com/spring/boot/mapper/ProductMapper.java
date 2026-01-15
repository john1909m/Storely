package com.spring.boot.mapper;

import com.spring.boot.dto.ProductDto;
import com.spring.boot.model.Product;
import com.spring.boot.model.ProductImage;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

import java.util.Collections;
import java.util.List;
import java.util.stream.Collectors;

@Mapper(componentModel = "spring")
public interface ProductMapper {

    @Mapping(target = "imageUrls", source = "images")
    @Mapping(source = "category.id", target = "categoryId")
    ProductDto toProductDto(Product product);

    default List<String> mapImagesToUrls(List<ProductImage> images) {
        if (images == null) return Collections.emptyList();
        return images.stream()
                .map(ProductImage::getUrl)
                .collect(Collectors.toList());
    }

    @Mapping(target = "images", ignore = true) // handle images separately
    @Mapping(source = "categoryId", target = "category.id")
    Product toProductEntity(ProductDto dto);
}