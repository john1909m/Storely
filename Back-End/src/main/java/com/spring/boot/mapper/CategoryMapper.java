package com.spring.boot.mapper;

import com.spring.boot.dto.CategoryDto;
import com.spring.boot.model.Category;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

@Mapper(componentModel = "spring")
public interface CategoryMapper {

    @Mapping(source = "store.id",target = "storeId")
    CategoryDto toCategoryDto(Category category);

    @Mapping(source = "storeId",target = "store.id")
    Category toCategoryEntity(CategoryDto categoryDto);
}
