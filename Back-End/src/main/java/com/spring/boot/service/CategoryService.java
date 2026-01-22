package com.spring.boot.service;

import com.spring.boot.dto.CategoryDto;

import java.util.List;

public interface CategoryService {
    List<CategoryDto> getCategoriesByStoreId(Long storeId);
    CategoryDto getCategoryById(Long id);
    CategoryDto getCategoryByName(String name);
    CategoryDto addCategory(CategoryDto categoryDto, Long storeId);
    CategoryDto updateCategory(CategoryDto categoryDto, Long storeId);
    CategoryDto deleteCategory(Long id, Long storeId);
}
