package com.spring.boot.service.impl;

import com.spring.boot.dto.VendorSubscriptionDto;
import com.spring.boot.mapper.VendorSubscriptionMapper;
import com.spring.boot.model.VendorSubscription;
import com.spring.boot.repo.VendorSubscriptionRepo;
import com.spring.boot.service.VendorSubscriptionService;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
public class VendorSubscriptionServiceImpl implements VendorSubscriptionService {

    private VendorSubscriptionRepo vendorSubscriptionRepo;
    private VendorSubscriptionMapper vendorSubscriptionMapper;


    public VendorSubscriptionServiceImpl( VendorSubscriptionRepo vendorSubscriptionRepo, VendorSubscriptionMapper vendorSubscriptionMapper) {
        this.vendorSubscriptionRepo = vendorSubscriptionRepo;
        this.vendorSubscriptionMapper = vendorSubscriptionMapper;
    }

    @Override
    public List<VendorSubscriptionDto> findAllVendorSubscriptions() {
        return vendorSubscriptionRepo.findAll().stream().map(vendorSubscriptionMapper::toDto).collect(Collectors.toList());
    }

    @Override
    public VendorSubscriptionDto findVendorSubscriptionById(Long id) {
        return vendorSubscriptionRepo.findById(id).
                map(vendorSubscriptionMapper::toDto).orElse(null);
    }

    @Override
    public VendorSubscriptionDto addVendorSubscription(VendorSubscriptionDto vendorSubscriptionDto) {
        VendorSubscription vendorSubscription = vendorSubscriptionMapper.toEntity(vendorSubscriptionDto);
        vendorSubscriptionRepo.save(vendorSubscription);
        return vendorSubscriptionMapper.toDto(vendorSubscription);
    }

    @Override
    public VendorSubscriptionDto updateVendorSubscription(VendorSubscriptionDto vendorSubscriptionDto) {
        Optional<VendorSubscription> existVendorSubscription=vendorSubscriptionRepo.findById(vendorSubscriptionDto.getId());
        if(existVendorSubscription.isEmpty()){
            throw new RuntimeException("vendor.subscription.does.not.exist");

        }
        VendorSubscription vendorSubscription = existVendorSubscription.get();
        vendorSubscriptionRepo.save(vendorSubscription);
        return vendorSubscriptionMapper.toDto(vendorSubscription);
    }

    @Override
    public void deleteVendorSubscriptionById(Long id) {
        Optional<VendorSubscription> existVendorSubscription=vendorSubscriptionRepo.findById(id);
        if(existVendorSubscription.isEmpty()){
            throw new RuntimeException("vendor.subscription.does.not.exist");

        }
        vendorSubscriptionRepo.delete(existVendorSubscription.get());
    }
}
