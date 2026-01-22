package com.spring.boot.service;

import com.spring.boot.dto.VendorDto;

import java.util.List;

public interface VendorService {
    List<VendorDto> getVendors();
    VendorDto getVendorById(Long id);
    VendorDto addVendor(VendorDto vendorDto);
    VendorDto updateVendor(VendorDto vendorDto);
    void deleteVendor(Long id);
    VendorDto getVendorByName(String name);
    VendorDto getVendorByStoreId(Long storeId);
    VendorDto getVendorByStoreName(String storeName);
}
