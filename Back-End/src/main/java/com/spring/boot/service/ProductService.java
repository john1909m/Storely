package com.spring.boot.service;

import com.spring.boot.dto.ProductDto;

import java.util.List;

public interface ProductService {
    List<ProductDto> getAllProductsByStoreId(Long storeId);

    ProductDto getProductByIdInStoreId(Long productId, Long storeId);

    ProductDto addProduct(ProductDto productDto);

    ProductDto updateProduct(ProductDto productDto);

    void deleteProduct(Long id);

    ProductDto getProductByNameInStoreId(String productName,Long storeId);
}
