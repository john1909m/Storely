package com.spring.boot.controller;

import com.spring.boot.dto.ProductImageDto;
import com.spring.boot.service.ProductImageService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.net.URI;
import java.net.URISyntaxException;
import java.util.List;

@RestController
@RequestMapping("/product/images")
public class ProductImageController {
    ProductImageService productImageService;
    @Autowired
    public ProductImageController(ProductImageService productImageService) {
        this.productImageService = productImageService;
    }

    @GetMapping("/get/{productId}")
    public ResponseEntity<List<ProductImageDto>> getProductImage(@PathVariable Long productId) {
        return ResponseEntity.ok(productImageService.getProductImageByProductId(productId));
    }

    @PostMapping("/add")
    public ResponseEntity<ProductImageDto> addProductImage(@RequestBody ProductImageDto productImageDto) throws URISyntaxException {
        return ResponseEntity.created(new URI("/product/images/add")).body(productImageService.addProductImageToProduct(productImageDto));
    }

    @PutMapping("/update")
    public ResponseEntity<ProductImageDto> updateProductImage(@RequestBody ProductImageDto productImageDto) throws URISyntaxException {
        return ResponseEntity.created(new URI("/product/images/update")).body(productImageService.updateProductImageToProduct(productImageDto));
    }

    @DeleteMapping("/delete/{productImageId}")
    public ResponseEntity<Void> deleteProductImage(@PathVariable Long productImageId) {
        productImageService.deleteProductImageFromProduct(productImageId);
        return ResponseEntity.noContent().build();
    }
}
