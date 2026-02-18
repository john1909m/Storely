package com.spring.boot.service;

import com.spring.boot.dto.VendorDto;

import java.util.List;
import java.util.UUID;

public interface VendorService {
    List<VendorDto> getVendors();
    VendorDto getVendorById(UUID id);
    VendorDto addVendor(VendorDto vendorDto);
    VendorDto updateVendor(VendorDto vendorDto);
    void deleteVendor(UUID id);
    VendorDto getVendorByName(String name);
    VendorDto getVendorByStoreId(UUID storeId);
    VendorDto getVendorByStoreName(String storeName);
}
