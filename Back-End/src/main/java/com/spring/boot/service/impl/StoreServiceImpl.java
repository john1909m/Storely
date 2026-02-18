package com.spring.boot.service.impl;

import com.spring.boot.dto.ProductDto;
import com.spring.boot.dto.StoreDto;
import com.spring.boot.mapper.ProductMapper;
import com.spring.boot.mapper.StoreMapper;
import com.spring.boot.model.Product;
import com.spring.boot.model.Store;
import com.spring.boot.model.Vendor;
import com.spring.boot.repo.ProductRepo;
import com.spring.boot.repo.StoreRepo;
import com.spring.boot.repo.VendorRepo;
import com.spring.boot.service.StoreService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Service
public class StoreServiceImpl implements StoreService {
    private StoreMapper storeMapper;
    private StoreRepo storeRepo;
    private VendorRepo vendorRepo;
    private R2StorageService r2StorageService;
    private ProductRepo productRepo;
    private ProductMapper productMapper;

    @Autowired
    public StoreServiceImpl(StoreMapper storeMapper,ProductMapper productMapper, StoreRepo storeRepo, VendorRepo vendorRepo, R2StorageService r2StorageService, ProductRepo productRepo) {
        this.storeMapper = storeMapper;
        this.storeRepo = storeRepo;
        this.vendorRepo = vendorRepo;
        this.r2StorageService = r2StorageService;
        this.productRepo = productRepo;
        this.productMapper = productMapper;
    }

    @Override
    public List<StoreDto> getAllStores() {
        return storeRepo.findAll().stream()
                .map(storeMapper::toStoreDto)
                .toList();
    }

    @Override
    public StoreDto getStoreByStoreId(UUID storeId) {
        return storeRepo.findById(storeId)
                .map(storeMapper::toStoreDto)
                .orElseThrow(() -> new RuntimeException("store.not.found"));
    }

    @Override
    public StoreDto getStoreByStoreName(String storeName) {
        return storeRepo.findStoreByStoreName(storeName)
                .map(storeMapper::toStoreDto)
                .orElseThrow(() -> new RuntimeException("store.not.found"));
    }

    @Override
    public StoreDto getStoreByVendorId(UUID vendorId) {
        return storeRepo.findStoreByVendor_Id(vendorId)
                .map(storeMapper::toStoreDto)
                .orElseThrow(() -> new RuntimeException("store.not.found"));
    }

    @Override
    public StoreDto getStoreByVendorName(String vendorName) {
        return storeRepo.findStoreByVendor_Name(vendorName)
                .map(storeMapper::toStoreDto)
                .orElseThrow(() -> new RuntimeException("store.not.found"));
    }

    @Override
    public StoreDto addStore(StoreDto storeDto) {
        if(storeDto.getStoreName().contains(" ")){
            throw new RuntimeException("store.must.not.have.spaces");
        }
        Store store = storeMapper.toStoreEntity(storeDto);
        Vendor vendor = vendorRepo.findById(storeDto.getVendorId())
                .orElseThrow(() -> new RuntimeException("Vendor.not.found"));

        store.setVendor(vendor);
        Store savedStore = storeRepo.save(store);
        return storeMapper.toStoreDto(savedStore);
    }

    @Override
    public StoreDto updateStore(StoreDto storeDto) {
        Store existingStore = storeRepo.findById(storeDto.getId())
                .orElseThrow(() -> new RuntimeException("store.not.found"));

        Store updatedStore = storeMapper.toStoreEntity(storeDto);
        updatedStore.setId(existingStore.getId());
        updatedStore.setVendor(existingStore.getVendor());
        updatedStore.setCategories(existingStore.getCategories());
        updatedStore.setProducts(existingStore.getProducts());
        updatedStore.setOrders(existingStore.getOrders());
        updatedStore.setCustomers(existingStore.getCustomers());

        Store savedStore = storeRepo.save(updatedStore);
        return storeMapper.toStoreDto(savedStore);
    }

    @Override
    public void deleteStore(UUID storeId) {
        Optional<Store> optionalStore = storeRepo.findById(storeId);
        if (optionalStore.isEmpty()) {
            throw new RuntimeException("store.not.found");
        }
        storeRepo.deleteById(storeId);
    }

    @Override
    public String uploadStoreImage(UUID storeId, MultipartFile file, String type) {
        Store store = storeRepo.findById(storeId)
                .orElseThrow(() -> new RuntimeException("store.not.found"));



        String extension = getFileExtension(file.getOriginalFilename());
        String fileName = type + "." + extension;

        String objectKey = "stores/" + storeId + "/" + fileName;

        String imageUrl = r2StorageService.uploadFile(objectKey, file);

        // update store
        if (type.equalsIgnoreCase("logo")) {
            store.setStoreLogoUrl(imageUrl);
        }

        storeRepo.save(store);

        return imageUrl;

    }

    private String getFileExtension(String filename) {
        if (filename == null || !filename.contains(".")) {
            return "png";
        }
        return filename.substring(filename.lastIndexOf(".") + 1);
    }
}
