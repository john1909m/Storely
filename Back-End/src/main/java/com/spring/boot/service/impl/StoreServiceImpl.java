package com.spring.boot.service.impl;

import com.spring.boot.dto.StoreDto;
import com.spring.boot.mapper.StoreMapper;
import com.spring.boot.model.Store;
import com.spring.boot.model.Vendor;
import com.spring.boot.repo.StoreRepo;
import com.spring.boot.repo.VendorRepo;
import com.spring.boot.service.StoreService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class StoreServiceImpl implements StoreService {
    private StoreMapper storeMapper;
    private StoreRepo storeRepo;
    private VendorRepo vendorRepo;

    @Autowired
    public StoreServiceImpl(StoreMapper storeMapper, StoreRepo storeRepo, VendorRepo vendorRepo) {
        this.storeMapper = storeMapper;
        this.storeRepo = storeRepo;
        this.vendorRepo = vendorRepo;
    }

    @Override
    public List<StoreDto> getAllStores() {
        return storeRepo.findAll().stream()
                .map(storeMapper::toStoreDto)
                .toList();
    }

    @Override
    public StoreDto getStoreByStoreId(Long storeId) {
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
    public StoreDto getStoreByVendorId(Long vendorId) {
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

        Store savedStore = storeRepo.save(updatedStore);
        return storeMapper.toStoreDto(savedStore);
    }

    @Override
    public void deleteStore(Long storeId) {
        Optional<Store> optionalStore = storeRepo.findById(storeId);
        if (optionalStore.isEmpty()) {
            throw new RuntimeException("store.not.found");
        }
        storeRepo.deleteById(storeId);
    }
}
