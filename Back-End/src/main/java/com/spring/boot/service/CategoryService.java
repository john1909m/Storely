package com.spring.boot.service;

import com.spring.boot.dto.CategoryDto;

import java.util.List;
import java.util.UUID;

public interface CategoryService {
    List<CategoryDto> getCategoriesByStoreId(UUID storeId);
    CategoryDto getCategoryById(UUID id);
    CategoryDto getCategoryByNameAndStoreId(String name, UUID storeId);
    CategoryDto addCategory(CategoryDto categoryDto);
    CategoryDto updateCategory(CategoryDto categoryDto);
    CategoryDto deleteCategory(UUID id);
}
