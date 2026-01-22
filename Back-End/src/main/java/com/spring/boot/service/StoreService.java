package com.spring.boot.service;

import com.spring.boot.dto.StoreDto;

import java.util.List;

public interface StoreService {
    List<StoreDto> getAllStores();

    StoreDto getStoreByStoreId(Long storeId);

    StoreDto getStoreByStoreName(String storeName);

    StoreDto getStoreByVendorId(Long VendorId);

    StoreDto getStoreByVendorName(String VendorName);

    StoreDto addStore(StoreDto storeDto);

    StoreDto updateStore(StoreDto storeDto);

    void deleteStore(Long storeId);

}
