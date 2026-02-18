package com.spring.boot.service;

import com.spring.boot.dto.StoreDto;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;
import java.util.UUID;

public interface StoreService {
    List<StoreDto> getAllStores();

    StoreDto getStoreByStoreId(UUID storeId);

    StoreDto getStoreByStoreName(String storeName);

    StoreDto getStoreByVendorId(UUID VendorId);

    StoreDto getStoreByVendorName(String VendorName);

    StoreDto addStore(StoreDto storeDto);

    StoreDto updateStore(StoreDto storeDto);

    void deleteStore(UUID storeId);

    String uploadStoreImage(UUID storeId, MultipartFile file, String type);





}
