package com.spring.boot.service;

import com.spring.boot.dto.VendorSubscriptionDto;

import java.util.List;
import java.util.UUID;

public interface VendorSubscriptionService {
    List<VendorSubscriptionDto> findAllVendorSubscriptions();
    VendorSubscriptionDto findVendorSubscriptionById(UUID id);
    VendorSubscriptionDto findVendorSubscriptionByVendorId(UUID id);
    VendorSubscriptionDto addVendorSubscription(VendorSubscriptionDto vendorSubscriptionDto);
    VendorSubscriptionDto updateVendorSubscription(VendorSubscriptionDto vendorSubscriptionDto);
    void deleteVendorSubscriptionById(UUID id);
}
