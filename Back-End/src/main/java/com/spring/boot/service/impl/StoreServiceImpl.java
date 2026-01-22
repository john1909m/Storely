package com.spring.boot.service.impl;

import com.spring.boot.dto.StoreDto;
import com.spring.boot.service.StoreService;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class StoreServiceImpl implements StoreService {
    @Override
    public List<StoreDto> getAllStores() {
        return List.of();
    }

    @Override
    public StoreDto getStoreByStoreId(Long storeId) {
        return null;
    }

    @Override
    public StoreDto getStoreByStoreName(String storeName) {
        return null;
    }

    @Override
    public StoreDto getStoreByVendorId(Long VendorId) {
        return null;
    }

    @Override
    public StoreDto getStoreByVendorName(String VendorName) {
        return null;
    }

    @Override
    public StoreDto addStore(StoreDto storeDto) {
        return null;
    }

    @Override
    public StoreDto updateStore(StoreDto storeDto) {
        return null;
    }

    @Override
    public void deleteStore(Long storeId) {

    }
}
