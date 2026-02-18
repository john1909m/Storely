package com.spring.boot.service;

import com.spring.boot.dto.ProductImageDto;

import java.util.List;
import java.util.UUID;

public interface ProductImageService {
    List<ProductImageDto> getProductImageByProductId(UUID productId);

    ProductImageDto addProductImageToProduct(ProductImageDto productImageDto);

    ProductImageDto updateProductImageToProduct(ProductImageDto productImageDto);

    void deleteProductImageFromProduct(UUID productImageId);


}
