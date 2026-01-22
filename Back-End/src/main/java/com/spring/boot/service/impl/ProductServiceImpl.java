package com.spring.boot.service.impl;

import com.spring.boot.dto.ProductDto;
import com.spring.boot.service.ProductService;

import java.util.List;

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
