package com.spring.boot.service.impl;

import com.spring.boot.dto.ProductImageDto;
import com.spring.boot.service.ProductImageService;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.UUID;

@Service
public class ProductImageServiceImpl implements ProductImageService {
    @Override
    public List<ProductImageDto> getProductImageByProductId(UUID productId) {
        return List.of();
    }

    @Override
    public ProductImageDto addProductImageToProduct(ProductImageDto productImageDto) {
        return null;
    }

    @Override
    public ProductImageDto updateProductImageToProduct(ProductImageDto productImageDto) {
        return null;
    }

    @Override
    public void deleteProductImageFromProduct(UUID productImageId) {

    }
}
