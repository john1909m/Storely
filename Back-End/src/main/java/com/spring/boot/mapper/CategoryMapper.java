package com.spring.boot.mapper;

import com.spring.boot.dto.CategoryDto;
import com.spring.boot.model.Category;
import org.mapstruct.Mapper;

@Mapper(componentModel = "spring")
public interface CategoryMapper {
    CategoryDto toCategoryDto(Category category);
    Category toCategoryEntity(CategoryDto categoryDto);
}
