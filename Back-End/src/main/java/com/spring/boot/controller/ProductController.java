package com.spring.boot.controller;

import com.spring.boot.dto.ProductDto;
import com.spring.boot.service.ProductService;
import com.spring.boot.service.StoreService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.net.URI;
import java.net.URISyntaxException;
import java.util.List;

@RestController
@RequestMapping("/product")
public class ProductController {
    private final StoreService storeService;
    ProductService productService;
    @Autowired
    public ProductController(ProductService productService, StoreService storeService) {
        this.productService = productService;
        this.storeService = storeService;
    }

    @GetMapping("/get/all/{storeId}")
    public ResponseEntity<List<ProductDto>> getProductByStoreId(@PathVariable Long storeId) {
        return ResponseEntity.ok(productService.getAllProductsByStoreId(storeId));
    }

    @GetMapping("/get/{productId}/{storeId}")
    public ResponseEntity<ProductDto> getProductById(@PathVariable Long productId, @PathVariable Long storeId) {
        return ResponseEntity.ok(productService.getProductByIdInStoreId(productId, storeId));
    }

    @GetMapping("/get/search/{productName}/{storeId}")
    public ResponseEntity<List<ProductDto>> getProductByName(@PathVariable String productName, @PathVariable Long storeId) {
        return ResponseEntity.ok(productService.getProductsByNameStartingWithInStoreId(productName, storeId));
    }

    @GetMapping("/get/category/{categoryId}/{storeId}")
    public ResponseEntity<List<ProductDto>> getProductByCategoryId(@PathVariable Long categoryId, @PathVariable Long storeId) {
        return ResponseEntity.ok(productService.getAllProductsByCategoryId(categoryId, storeId));
    }

    @PostMapping("/add")
    @PreAuthorize("hasAnyRole('VENDOR','ADMIN')")
    public ResponseEntity<ProductDto> addProduct(@RequestBody ProductDto productDto) throws URISyntaxException {
        return ResponseEntity.created(new URI("/product/add")).body(productService.addProduct(productDto));
    }

    @PutMapping("/update")
    @PreAuthorize("hasAnyRole('VENDOR','ADMIN')")
    public ResponseEntity<ProductDto> updateProduct(@RequestBody ProductDto productDto) throws URISyntaxException {
        return ResponseEntity.ok(productService.updateProduct(productDto));
    }

    @DeleteMapping("/delete/{productId}")
    @PreAuthorize("hasAnyRole('VENDOR','ADMIN')")
    public ResponseEntity<Void> deleteProduct(@PathVariable Long productId) {
        productService.deleteProduct(productId);
        return ResponseEntity.noContent().build();
    }

}
