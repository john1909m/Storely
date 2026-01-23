package com.spring.boot.service.impl;

import com.spring.boot.dto.VendorDto;
import com.spring.boot.mapper.VendorMapper;
import com.spring.boot.model.Vendor;
import com.spring.boot.repo.VendorRepo;
import com.spring.boot.service.VendorService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class VendorServiceImpl implements VendorService {

    private VendorMapper vendorMapper;
    private VendorRepo vendorRepo;
    @Autowired
    public VendorServiceImpl(VendorMapper vendorMapper, VendorRepo vendorRepo) {
        this.vendorMapper = vendorMapper;
        this.vendorRepo = vendorRepo;
    }

    @Override
    public List<VendorDto> getVendors() {
        return vendorRepo.findAll().stream().map(vendorMapper::toVendorDto).toList();
    }

    @Override
    public VendorDto getVendorById(Long id) {
        return vendorRepo.findById(id)
                .map(vendorMapper::toVendorDto)
                .orElseThrow(() -> new RuntimeException("vendor.not.found") );
    }

    @Override
    public VendorDto addVendor(VendorDto vendorDto) {
        Vendor vendor = vendorMapper.toVendorEntity(vendorDto);
        Vendor saved = vendorRepo.save(vendor);
        return vendorMapper.toVendorDto(saved);
    }

    @Override
    public VendorDto updateVendor(VendorDto vendorDto) {
        Vendor existing = vendorRepo.findById(vendorDto.getId())
                .orElseThrow(() -> new RuntimeException("vendor.not.found"));
        vendorMapper.toVendorEntity(vendorDto);
        vendorRepo.save(existing);
        return vendorMapper.toVendorDto(existing);
    }

    @Override
    public void deleteVendor(Long id) {
        Optional<Vendor> optionalVendor = vendorRepo.findById(id);
        if (optionalVendor.isEmpty()) {
            throw new RuntimeException("Vendor.not.found");
        }
        vendorRepo.deleteById(id);
    }

    @Override
    public VendorDto getVendorByName(String name) {
        return vendorRepo.findVendorByName(name)
                .map(vendorMapper::toVendorDto)
                .orElseThrow(()-> new RuntimeException("vendor.not.found"));
    }

    @Override
    public VendorDto getVendorByStoreId(Long storeId) {
        return vendorRepo.findVendorBystoreId(storeId)
                .map(vendorMapper::toVendorDto)
                .orElseThrow(()-> new RuntimeException("vendor.not.found"));
    }

    @Override
    public VendorDto getVendorByStoreName(String storeName) {
        Vendor vendor = vendorRepo.findByStore_storeName(storeName)
                .orElseThrow(() -> new RuntimeException("Vendor.not.found"));
        return vendorMapper.toVendorDto(vendor);
    }
}
