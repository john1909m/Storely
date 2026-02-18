package com.spring.boot.service;

import com.spring.boot.dto.ProductDto;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;
import java.util.UUID;

public interface ProductService {
    List<ProductDto> getAllProductsByStoreId(UUID storeId);

    ProductDto getProductByIdInStoreId(UUID productId, UUID storeId);

    List<ProductDto> getAllProductsByCategoryId(UUID categoryId, UUID storeId);

    ProductDto addProduct(ProductDto productDto);

    ProductDto updateProduct(ProductDto productDto);

    void deleteProduct(UUID id);

    List<ProductDto> getProductsByNameStartingWithInStoreId(String productName, UUID storeId);

    List<String> uploadProductImages(UUID productId, List<MultipartFile> files);
}
