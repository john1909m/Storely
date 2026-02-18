package com.spring.boot.controller;

import com.spring.boot.dto.ProductDto;
import com.spring.boot.service.ProductService;
import com.spring.boot.service.StoreService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.net.URI;
import java.net.URISyntaxException;
import java.util.List;
import java.util.Map;
import java.util.UUID;

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
    public ResponseEntity<List<ProductDto>> getProductByStoreId(@PathVariable UUID storeId) {
        return ResponseEntity.ok(productService.getAllProductsByStoreId(storeId));
    }

    @GetMapping("/get/{productId}/{storeId}")
    public ResponseEntity<ProductDto> getProductById(@PathVariable UUID productId, @PathVariable UUID storeId) {
        return ResponseEntity.ok(productService.getProductByIdInStoreId(productId, storeId));
    }

    @GetMapping("/get/search/{productName}/{storeId}")
    public ResponseEntity<List<ProductDto>> getProductByName(@PathVariable String productName, @PathVariable UUID storeId) {
        return ResponseEntity.ok(productService.getProductsByNameStartingWithInStoreId(productName, storeId));
    }

    @GetMapping("/get/category/{categoryId}/{storeId}")
    public ResponseEntity<List<ProductDto>> getProductByCategoryId(@PathVariable UUID categoryId, @PathVariable UUID storeId) {
        return ResponseEntity.ok(productService.getAllProductsByCategoryId(categoryId, storeId));
    }

    @PostMapping("/add")
    @PreAuthorize("hasAnyRole('VENDOR','ADMIN')")
    public ResponseEntity<ProductDto> addProduct(@RequestBody ProductDto productDto) throws URISyntaxException {
        return ResponseEntity.created(new URI("/product/add")).body(productService.addProduct(productDto));
    }

    @PutMapping("/update")
    @PreAuthorize("hasAnyRole('VENDOR','ADMIN')")
    public ResponseEntity<ProductDto> updateProduct(@RequestBody ProductDto productDto){
        return ResponseEntity.ok(productService.updateProduct(productDto));
    }

    @DeleteMapping("/delete/{productId}")
    @PreAuthorize("hasAnyRole('VENDOR','ADMIN')")
    public ResponseEntity<Void> deleteProduct(@PathVariable UUID productId) {
        productService.deleteProduct(productId);
        return ResponseEntity.noContent().build();
    }

    @PostMapping("/{productId}/upload-product-images")
    @PreAuthorize("hasAnyRole('ADMIN','VENDOR')")
    public ResponseEntity<Map<String, Object>> uploadProductImages(@PathVariable UUID productId,
                                                                   @RequestParam("files") List<MultipartFile> files){
        List<String> imageUrls = productService.uploadProductImages(productId, files);

        return ResponseEntity.ok(
                Map.of("url", imageUrls)
        );
    }

}
