package com.spring.boot.controller;

import com.spring.boot.dto.CategoryDto;
import com.spring.boot.service.CategoryService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.net.URI;
import java.net.URISyntaxException;
import java.util.List;

@RestController
@RequestMapping("/category")
public class CategoryController {
    CategoryService categoryService;
    @Autowired
    public CategoryController(CategoryService categoryService) {
        this.categoryService = categoryService;
    }

    @GetMapping("/get/store/{storeId}")
    public ResponseEntity<List<CategoryDto>> getCategoriesByStoreId(@PathVariable("storeId") Long storeId) {
        return ResponseEntity.ok().body(categoryService.getCategoriesByStoreId(storeId));
    }

    @GetMapping("/get/{categoryId}")
    public ResponseEntity<CategoryDto> getCategoryById(@PathVariable("categoryId") Long categoryId) {
        return ResponseEntity.ok().body(categoryService.getCategoryById(categoryId));
    }

    @GetMapping("/get/{categoryName}")
    public ResponseEntity<CategoryDto> getCategoryByName(@PathVariable("categoryName") String categoryName) {
        return ResponseEntity.ok().body(categoryService.getCategoryByName(categoryName));
    }

    @PostMapping("/add")
    public ResponseEntity<CategoryDto> addCategory(@RequestBody CategoryDto categoryDto) throws URISyntaxException {
        return ResponseEntity.created(new URI("/category/add")).body(categoryService.addCategory(categoryDto));
    }

    @PutMapping("/update")
    public ResponseEntity<CategoryDto> updateCategory(@RequestBody CategoryDto categoryDto) throws URISyntaxException {
        return ResponseEntity.created(new URI("/category/update")).body(categoryService.updateCategory(categoryDto));
    }

    @DeleteMapping("/delete/{categoryId}")
    public ResponseEntity<Void> deleteCategory(@PathVariable Long categoryId){
        categoryService.deleteCategory(categoryId);
        return ResponseEntity.noContent().build();
    }

}
