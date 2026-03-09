package com.spring.boot.service.impl;

import com.spring.boot.dto.ProductDto;
import com.spring.boot.dto.ProductImageDto;
import com.spring.boot.dto.ProductVariantDto;
import com.spring.boot.enums.SubscriptionStatus;
import com.spring.boot.mapper.ProductMapper;
import com.spring.boot.model.*;
import com.spring.boot.repo.CategoryRepo;
import com.spring.boot.repo.ProductRepo;
import com.spring.boot.repo.StoreRepo;
import com.spring.boot.repo.VendorSubscriptionRepo;
import com.spring.boot.service.ProductService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import java.util.*;
import java.util.stream.Collectors;

@Service
public class ProductServiceImpl implements ProductService {

    private ProductMapper productMapper;
    private ProductRepo productRepo;
    private StoreRepo storeRepo;
    private CategoryRepo categoryRepo;
    private VendorSubscriptionRepo vendorSubscriptionRepo;

    private R2StorageService r2StorageService;

    @Autowired
    public ProductServiceImpl(ProductMapper productMapper, ProductRepo productRepo,
                              StoreRepo storeRepo, CategoryRepo categoryRepo, R2StorageService r2StorageService,
                              VendorSubscriptionRepo vendorSubscriptionRepo) {
        this.productMapper = productMapper;
        this.productRepo = productRepo;
        this.storeRepo = storeRepo;
        this.categoryRepo = categoryRepo;
        this.r2StorageService = r2StorageService;
        this.vendorSubscriptionRepo = vendorSubscriptionRepo;
    }

    @Override
    public List<ProductDto> getAllProductsByStoreId(UUID storeId) {
        return productRepo.findByStore_Id(storeId).stream()
                .map(productMapper::toProductDto)
                .toList();
    }

    @Override
    public ProductDto getProductByIdInStoreId(UUID productId, UUID storeId) {
        return productRepo.findByIdAndStore_Id(productId, storeId)
                .map(productMapper::toProductDto)
                .orElseThrow(() -> new RuntimeException("product.not.found.in.store"));
    }

    @Override
    public List<ProductDto> getAllProductsByCategoryId(UUID categoryId, UUID storeId) {
        return productRepo.findByCategory_IdAndStore_Id(categoryId, storeId)
                .orElse(Collections.emptyList())
                .stream()
                .map(productMapper::toProductDto)
                .toList();
    }


    private void validateProductLimit(Store store) {

        Vendor vendor = store.getVendor();

        // عدد المنتجات الحالية في الستور
        Integer currentProductCount =
                productRepo.countByStoreId(store.getId());

        // subscription active؟
        Optional<VendorSubscription> subscriptionOpt =
                vendorSubscriptionRepo
                        .findByVendorIdAndStatus(
                                vendor.getId(),
                                SubscriptionStatus.ACTIVE
                        );

        // لو مفيش subscription
        if (subscriptionOpt.isEmpty()) {
            if (currentProductCount >= 3) {
                throw new RuntimeException("product.limit.reached.free.vendor");
            }
            return;
        }

        VendorSubscription subscription = subscriptionOpt.get();
        Integer productLimit =
                subscription.getSubscriptionPlan().getProductLimit();

        // unlimited
        if (productLimit == null) {
            return;
        }

        // check limit
        if (currentProductCount >= productLimit) {
            throw new RuntimeException("product.limit.reached");
        }
    }


    @Transactional
    @Override
    public ProductDto addProduct(ProductDto productDto) {
        Store store = storeRepo.findById(productDto.getStoreId())
                .orElseThrow(() -> new RuntimeException("store.not.found"));

        Vendor vendor = store.getVendor();
        if (vendor == null) {
            throw new RuntimeException("vendor.not.found");
        }

        validateProductLimit(store);


        Product product = new Product();
        product.setName(productDto.getName());
        product.setDescription(productDto.getDescription());
        product.setPrice(productDto.getPrice());
        product.setOldPrice(productDto.getOldPrice());

        if (productRepo.findByName(product.getName()).isPresent()) {
            throw new RuntimeException("product.name.already.exists");
        }
        // store

        product.setStore(store);

        // category
        if (productDto.getCategoryId() != null) {
            Category category = categoryRepo.findById(productDto.getCategoryId())
                    .orElseThrow(() -> new RuntimeException("category.not.found"));
            product.setCategory(category);
        }

        // images
        if (product.getImages() != null) {
            product.getImages().forEach(img -> img.setProduct(product));
        }

        // variants with validation
        if (productDto.getVariants() != null) {
            Set<String> variantSet = new HashSet<>();
            for (ProductVariantDto dto : productDto.getVariants()) {
                String key = dto.getProductColor() + "-" + dto.getProductSize();
                if (!variantSet.add(key)) {
                    throw new RuntimeException("duplicate.variant.for.product");
                }
            }

            List<ProductVariant> variants = productDto.getVariants().stream()
                    .map(dto -> {
                        ProductVariant variant = new ProductVariant();
                        variant.setProductColor(dto.getProductColor());
                        variant.setProductSize(dto.getProductSize());
                        variant.setQuantity(dto.getQuantity());
                        variant.setPrice(dto.getPrice());
                        variant.setProduct(product);
                        return variant;
                    })
                    .toList();

            product.setVariants(variants);

            int totalQuantity = variants.stream()
                    .mapToInt(ProductVariant::getQuantity)
                    .sum();

            product.setQuantity(totalQuantity);
        }
        if (product.getQuantity() == null || product.getQuantity() == 0) {
            product.setQuantity(productDto.getQuantity());
        }

        Product savedProduct = productRepo.save(product);
        return productMapper.toProductDto(savedProduct);
    }



    @Transactional
    @Override
    public ProductDto updateProduct(ProductDto productDto) {

        Product product = productRepo.findById(productDto.getId())
                .orElseThrow(() -> new RuntimeException("product.not.found"));

        // update basic fields
        product.setName(productDto.getName());
        product.setDescription(productDto.getDescription());
        product.setPrice(productDto.getPrice());
        product.setOldPrice(productDto.getOldPrice());

        // store (rarely changes, but safe)
        if (productDto.getStoreId() != null) {
            Store store = storeRepo.findById(productDto.getStoreId())
                    .orElseThrow(() -> new RuntimeException("store.not.found"));
            product.setStore(store);
        }

        // category
        if (productDto.getCategoryId() != null) {
            Category category = categoryRepo.findById(productDto.getCategoryId())
                    .orElseThrow(() -> new RuntimeException("category.not.found"));
            product.setCategory(category);
        } else {
            product.setCategory(null);
        }

        // images
        if (product.getImages() != null) {
            product.getImages().forEach(img -> img.setProduct(product));
        }

        // ============ معالجة الـ variants بشكل صحيح ============
        if (productDto.getVariants() != null || productDto.getVariants().isEmpty()) {
            // 1. التحقق من عدم وجود duplicates
            Set<String> variantSet = new HashSet<>();
            for (ProductVariantDto dto : productDto.getVariants()) {
                String key = dto.getProductColor() + "-" + dto.getProductSize();
                if (!variantSet.add(key)) {
                    throw new RuntimeException("duplicate.variant.for.product");
                }
            }

            // 2. إنشاء خريطة للـ variants الموجودة
            Map<String, ProductVariant> existingVariantsMap = new HashMap<>();
            for (ProductVariant existing : product.getVariants()) {
                String key = existing.getProductColor() + "-" + existing.getProductSize();
                existingVariantsMap.put(key, existing);
            }

            // 3. قائمة للـ variants الجديدة
            List<ProductVariant> updatedVariants = new ArrayList<>();

            for (ProductVariantDto dto : productDto.getVariants()) {
                String key = dto.getProductColor() + "-" + dto.getProductSize();

                ProductVariant variant;

                // لو موجودة قديماً، استخدمها
                if (existingVariantsMap.containsKey(key)) {
                    variant = existingVariantsMap.get(key);
                    existingVariantsMap.remove(key); // عشان نعرف الباقي للـ delete
                } else {
                    // لو جديدة، أنشئها
                    variant = new ProductVariant();
                    variant.setProduct(product);
                }


                variant.setProductColor(dto.getProductColor());
                variant.setProductSize(dto.getProductSize());
                variant.setQuantity(dto.getQuantity());
                variant.setPrice(dto.getPrice());

                updatedVariants.add(variant);
            }

            // 4. الـ variants القديمة اللي مش في القائمة الجديدة تتشال
            // (دي هتتحذف تلقائياً بسبب orphanRemoval = true)
            product.getVariants().clear();
            product.getVariants().addAll(updatedVariants);

            // 5. حساب total quantity
            int totalQuantity = updatedVariants.stream()
                    .mapToInt(ProductVariant::getQuantity)
                    .sum();
            product.setQuantity(totalQuantity);

        } else {
            // لو مفيش variants، امسح الكل وخلي quantity = 0
            product.getVariants().clear();
            product.setQuantity(productDto.getQuantity());
        }
        if (product.getQuantity() == null || product.getQuantity() == 0) {
            product.setQuantity(productDto.getQuantity());
        }

        Product savedProduct = productRepo.save(product);
        return productMapper.toProductDto(savedProduct);
    }

    @Override
    public void deleteProduct(UUID id) {
        Optional<Product> optionalProduct = productRepo.findById(id);
        if (optionalProduct.isEmpty()) {
            throw new RuntimeException("product.not.found");
        }
        productRepo.deleteById(id);
    }

    @Override
    public List<ProductDto> getProductsByNameStartingWithInStoreId(String productName, UUID storeId){
        List<Product> products = productRepo.findByNameStartingWithAndStore_Id(productName, storeId);

        if (products.isEmpty()) {
            throw new RuntimeException("No.products.found");
        }

        return products.stream()
                .map(productMapper::toProductDto)
                .toList();
    }

    @Override
    @Transactional
    public List<String> uploadProductImages(UUID productId, List<MultipartFile> files) {

        Product product = productRepo.findById(productId)
                .orElseThrow(() -> new RuntimeException("product.not.found"));

        List<ProductImage> images = product.getImages();
        if (images == null) {
            images = new ArrayList<>();
            product.setImages(images);
        }

        int startPosition = images.size();
        List<String> uploadedUrls = new ArrayList<>();

        for (int i = 0; i < files.size(); i++) {

            MultipartFile file = files.get(i);
            String extension = getFileExtension(file.getOriginalFilename());
            String fileName = UUID.randomUUID() + "." + extension;

            String objectKey =
                    "stores/" + product.getStore().getId()
                            + "/products/" + productId
                            + "/" + fileName;

            String imageUrl = r2StorageService.uploadFile(objectKey, file);

            ProductImage image = new ProductImage();
            image.setUrl(imageUrl);
            image.setAltText("Product image " + (startPosition + i + 1));
            image.setPosition(startPosition + i);
            image.setProduct(product);

            images.add(image);
            uploadedUrls.add(imageUrl);
        }

        productRepo.save(product);

        return uploadedUrls;
    }


    private String getFileExtension(String filename) {
        if (filename == null || !filename.contains(".")) {
            return "png";
        }
        return filename.substring(filename.lastIndexOf(".") + 1);
    }
}