package com.spring.boot.service;

import com.spring.boot.dto.ProductImageDto;

import java.util.List;

public interface ProductImageService {
    List<ProductImageDto> getProductImageByProductId(Long productId);

    ProductImageDto addProductImageToProduct(ProductImageDto productImageDto, Long productId);

    ProductImageDto updateProductImageToProduct(ProductImageDto productImageDto, Long productId);

    void deleteProductImageFromProduct(Long productImageId, Long productId);
}
