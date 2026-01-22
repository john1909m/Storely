package com.spring.boot.service.impl;

import com.spring.boot.dto.CategoryDto;
import com.spring.boot.service.AdminService;
import com.spring.boot.service.CategoryService;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class CategoryServiceImpl implements CategoryService {
    @Override
    public List<CategoryDto> getCategoriesByStoreId(Long storeId) {
        return List.of();
    }

    @Override
    public CategoryDto getCategoryById(Long id) {
        return null;
    }

    @Override
    public CategoryDto getCategoryByName(String name) {
        return null;
    }

    @Override
    public CategoryDto addCategory(CategoryDto categoryDto) {
        return null;
    }

    @Override
    public CategoryDto updateCategory(CategoryDto categoryDto) {
        return null;
    }

    @Override
    public CategoryDto deleteCategory(Long id) {
        return null;
    }
}
