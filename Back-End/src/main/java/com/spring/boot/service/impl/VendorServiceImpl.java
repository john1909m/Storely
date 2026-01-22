package com.spring.boot.service.impl;

import com.spring.boot.dto.VendorDto;
import com.spring.boot.service.VendorService;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class VendorServiceImpl implements VendorService {
    @Override
    public List<VendorDto> getVendors() {
        return List.of();
    }

    @Override
    public VendorDto getVendorById(Long id) {
        return null;
    }

    @Override
    public VendorDto addVendor(VendorDto vendorDto) {
        return null;
    }

    @Override
    public VendorDto updateVendor(VendorDto vendorDto) {
        return null;
    }

    @Override
    public void deleteVendor(Long id) {

    }

    @Override
    public VendorDto getVendorByName(String name) {
        return null;
    }

    @Override
    public VendorDto getVendorByStoreId(Long storeId) {
        return null;
    }

    @Override
    public VendorDto getVendorByStoreName(String storeName) {
        return null;
    }
}
