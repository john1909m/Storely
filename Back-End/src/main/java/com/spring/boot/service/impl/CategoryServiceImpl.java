package com.spring.boot.service.impl;

import com.spring.boot.dto.CategoryDto;
import com.spring.boot.mapper.CategoryMapper;
import com.spring.boot.model.Category;
import com.spring.boot.model.Store;
import com.spring.boot.repo.CategoryRepo;
import com.spring.boot.repo.StoreRepo;
import com.spring.boot.service.CategoryService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class CategoryServiceImpl implements CategoryService {

    private CategoryMapper categoryMapper;
    private CategoryRepo categoryRepo;
    private StoreRepo storeRepo; // Add this

    @Autowired
    public CategoryServiceImpl(CategoryMapper categoryMapper, CategoryRepo categoryRepo,
                               StoreRepo storeRepo) {
        this.categoryMapper = categoryMapper;
        this.categoryRepo = categoryRepo;
        this.storeRepo = storeRepo;
    }

    @Override
    public List<CategoryDto> getCategoriesByStoreId(Long storeId) {
        return categoryRepo.findByStore_Id(storeId).stream()
                .map(categoryMapper::toCategoryDto)
                .toList();
    }

    @Override
    public CategoryDto getCategoryById(Long id) {
        return categoryRepo.findById(id)
                .map(categoryMapper::toCategoryDto)
                .orElseThrow(() -> new RuntimeException("category.not.found"));
    }

    @Override
    public CategoryDto getCategoryByNameAndStoreId(String name, Long storeId) {
        return categoryRepo.findByNameAndStore_Id(name,storeId)
                .map(categoryMapper::toCategoryDto)
                .orElseThrow(() -> new RuntimeException("category.not.found"));
    }

    @Override
    public CategoryDto addCategory(CategoryDto categoryDto) {
        Category category = categoryMapper.toCategoryEntity(categoryDto);

        // Handle store relationship
        if (category.getStore() != null && category.getStore().getId() != null) {
            // Fetch the managed store entity
            Store existingStore = storeRepo.findById(category.getStore().getId())
                    .orElseThrow(() -> new RuntimeException("store.not.found"));
            category.setStore(existingStore);
        } else if (category.getStore() != null) {
            throw new RuntimeException("store.id.required");
        }

        Category savedCategory = categoryRepo.save(category);
        return categoryMapper.toCategoryDto(savedCategory);
    }

    @Override
    public CategoryDto updateCategory(CategoryDto categoryDto) {
        Category existingCategory = categoryRepo.findById(categoryDto.getId())
                .orElseThrow(() -> new RuntimeException("category.not.found"));

        Category updatedCategory = categoryMapper.toCategoryEntity(categoryDto);
        updatedCategory.setId(existingCategory.getId());

        // Handle store relationship
        if (updatedCategory.getStore() != null && updatedCategory.getStore().getId() != null) {
            Store existingStore = storeRepo.findById(updatedCategory.getStore().getId())
                    .orElseThrow(() -> new RuntimeException("store.not.found"));
            updatedCategory.setStore(existingStore);
        }

        Category savedCategory = categoryRepo.save(updatedCategory);
        return categoryMapper.toCategoryDto(savedCategory);
    }

    @Override
    public CategoryDto deleteCategory(Long id) {
        // Check if category exists
        Category category = categoryRepo.findById(id)
                .orElseThrow(() -> new RuntimeException("category.not.found"));

        // Delete the category
        categoryRepo.deleteById(id);

        // Return the deleted category DTO
        return categoryMapper.toCategoryDto(category);
    }

    // Other methods remain the same
}