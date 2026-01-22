package com.spring.boot.service.impl;

import com.spring.boot.dto.ProductDto;
import com.spring.boot.service.ProductService;
import org.springframework.stereotype.Service;

import java.util.List;
@Service
public class ProductServiceImpl implements ProductService {
    @Override
    public List<ProductDto> getAllProductsByStoreId(Long storeId) {
        return List.of();
    }

    @Override
    public ProductDto getProductByIdInStoreId(Long productId, Long storeId) {
        return null;
    }

    @Override
    public List<ProductDto> getAllProductsByCategoryId(Long categoryId, Long storeId) {
        return List.of();
    }

    @Override
    public ProductDto addProduct(ProductDto productDto) {
        return null;
    }

    @Override
    public ProductDto updateProduct(ProductDto productDto) {
        return null;
    }

    @Override
    public void deleteProduct(Long id) {

    }

    @Override
    public ProductDto getProductByNameInStoreId(String productName, Long storeId) {
        return null;
    }
}
