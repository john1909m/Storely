package com.spring.boot.service;

import com.spring.boot.dto.CategoryDto;

import java.util.List;

public interface CategoryService {
    List<CategoryDto> getCategoriesByStoreId(Long storeId);
    CategoryDto getCategoryById(Long id);
    CategoryDto getCategoryByName(String name);
    CategoryDto addCategory(CategoryDto categoryDto);
    CategoryDto updateCategory(CategoryDto categoryDto);
    CategoryDto deleteCategory(Long id);
}
