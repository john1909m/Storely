package com.spring.boot.service.impl;

import com.spring.boot.dto.ProductImageDto;
import com.spring.boot.service.ProductImageService;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class ProductImageServiceImpl implements ProductImageService {
    @Override
    public List<ProductImageDto> getProductImageByProductId(Long productId) {
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
    public void deleteProductImageFromProduct(Long productImageId) {

    }
}
