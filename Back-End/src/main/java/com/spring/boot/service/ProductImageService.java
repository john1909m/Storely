package com.spring.boot.service;

import com.spring.boot.dto.ProductImageDto;

import java.util.List;

public interface ProductImageService {
    List<ProductImageDto> getProductImageByProductId(Long productId);

    ProductImageDto addProductImageToProduct(ProductImageDto productImageDto);

    ProductImageDto updateProductImageToProduct(ProductImageDto productImageDto);

    void deleteProductImageFromProduct(Long productImageId);
}
