package com.spring.boot.service.impl;

import com.spring.boot.dto.ProductDto;
import com.spring.boot.mapper.ProductMapper;
import com.spring.boot.model.Category;
import com.spring.boot.model.Product;
import com.spring.boot.model.Store;
import com.spring.boot.repo.CategoryRepo;
import com.spring.boot.repo.ProductRepo;
import com.spring.boot.repo.StoreRepo;
import com.spring.boot.service.ProductService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class ProductServiceImpl implements ProductService {

    private ProductMapper productMapper;
    private ProductRepo productRepo;
    private StoreRepo storeRepo;
    private CategoryRepo categoryRepo;

    @Autowired
    public ProductServiceImpl(ProductMapper productMapper, ProductRepo productRepo,
                              StoreRepo storeRepo, CategoryRepo categoryRepo) {
        this.productMapper = productMapper;
        this.productRepo = productRepo;
        this.storeRepo = storeRepo;
        this.categoryRepo = categoryRepo;
    }

    @Override
    public List<ProductDto> getAllProductsByStoreId(Long storeId) {
        return productRepo.findByStore_Id(storeId).stream()
                .map(productMapper::toProductDto)
                .toList();
    }

    @Override
    public ProductDto getProductByIdInStoreId(Long productId, Long storeId) {
        return productRepo.findByIdAndStore_Id(productId, storeId)
                .map(productMapper::toProductDto)
                .orElseThrow(() -> new RuntimeException("product.not.found.in.store"));
    }

    @Override
    public List<ProductDto> getAllProductsByCategoryId(Long categoryId, Long storeId) {
        return productRepo.findByCategory_IdAndStore_Id(categoryId, storeId).stream()
                .map(productMapper::toProductDto)
                .toList();
    }

    @Override
    public ProductDto addProduct(ProductDto productDto) {
        Product product = productMapper.toProductEntity(productDto);

        // Handle relationships - ensure store and category are managed entities
        if (product.getStore() != null && product.getStore().getId() != null) {
            // You'll need StoreRepo injected for this - see note below
             Store existingStore = storeRepo.findById(product.getStore().getId())
                     .orElseThrow(() -> new RuntimeException("store.not.found"));
             product.setStore(existingStore);
        }

        if (product.getCategory() != null && product.getCategory().getId() != null) {
            // You'll need CategoryRepo injected for this - see note below
             Category existingCategory = categoryRepo.findById(product.getCategory().getId())
                     .orElseThrow(() -> new RuntimeException("category.not.found"));
             product.setCategory(existingCategory);
        }

        if (product.getImages() != null) {
            product.getImages().forEach(img -> img.setProduct(product));
        }

        Product savedProduct = productRepo.save(product);
        return productMapper.toProductDto(savedProduct);
    }

    @Override
    public ProductDto updateProduct(ProductDto productDto) {
        // First, check if product exists
        Product existingProduct = productRepo.findById(productDto.getId())
                .orElseThrow(() -> new RuntimeException("product.not.found"));

        // Map DTO to entity
        Product updatedProduct = productMapper.toProductEntity(productDto);
        updatedProduct.setId(existingProduct.getId()); // Preserve the ID

        // Handle relationships - ensure store and category are managed entities
        // Similar to addProduct method
        if (updatedProduct.getStore() != null && updatedProduct.getStore().getId() != null) {
            // You'll need StoreRepo injected for this - see note below
            Store existingStore = storeRepo.findById(updatedProduct.getStore().getId())
                    .orElseThrow(() -> new RuntimeException("store.not.found"));
            updatedProduct.setStore(existingStore);
        }

        if (updatedProduct.getCategory() != null && updatedProduct.getCategory().getId() != null) {
            // You'll need CategoryRepo injected for this - see note below
            Category existingCategory = categoryRepo.findById(updatedProduct.getCategory().getId())
                    .orElseThrow(() -> new RuntimeException("category.not.found"));
            updatedProduct.setCategory(existingCategory);
        }

        if (updatedProduct.getImages() != null) {
            updatedProduct.getImages().forEach(img -> img.setProduct(updatedProduct));
        }
        Product savedProduct = productRepo.save(updatedProduct);
        return productMapper.toProductDto(savedProduct);
    }

    @Override
    public void deleteProduct(Long id) {
        Optional<Product> optionalProduct = productRepo.findById(id);
        if (optionalProduct.isEmpty()) {
            throw new RuntimeException("product.not.found");
        }
        productRepo.deleteById(id);
    }

    @Override
    public List<ProductDto> getProductsByNameStartingWithInStoreId(String productName, Long storeId){
        List<Product> products = productRepo.findByNameStartingWithAndStore_Id(productName, storeId);

        if (products.isEmpty()) {
            throw new RuntimeException("No.products.found");
        }

        return products.stream()
                .map(productMapper::toProductDto)
                .toList();
    }
}