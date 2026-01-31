package com.spring.boot.service;

import com.spring.boot.dto.VendorSubscriptionDto;

import java.util.List;

public interface VendorSubscriptionService {
    List<VendorSubscriptionDto> findAllVendorSubscriptions();
    VendorSubscriptionDto findVendorSubscriptionById(Long id);
    VendorSubscriptionDto addVendorSubscription(VendorSubscriptionDto vendorSubscriptionDto);
    VendorSubscriptionDto updateVendorSubscription(VendorSubscriptionDto vendorSubscriptionDto);
    void deleteVendorSubscriptionById(Long id);
}
