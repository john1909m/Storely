package com.spring.boot.controller;

import com.spring.boot.dto.VendorSubscriptionDto;
import com.spring.boot.service.VendorSubscriptionService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.net.URI;
import java.net.URISyntaxException;
import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/vendor-subscription")
public class VendorSubscriptionController {
    private VendorSubscriptionService vendorSubscriptionService;
    @Autowired
    public void setVendorSubscriptionService(VendorSubscriptionService vendorSubscriptionService) {
        this.vendorSubscriptionService = vendorSubscriptionService;
    }

    @GetMapping("/get/all")
    @PreAuthorize("hasAnyRole('ADMIN')")
    public ResponseEntity<List<VendorSubscriptionDto>> getAllVendorSubscriptions() {
        return ResponseEntity.ok().body(vendorSubscriptionService.findAllVendorSubscriptions());
    }

    @GetMapping("/get/{id}")
    @PreAuthorize("hasAnyRole('ADMIN')")
    public ResponseEntity<VendorSubscriptionDto> getVendorSubscriptionById(@PathVariable UUID id) {
        return ResponseEntity.ok().body(vendorSubscriptionService.findVendorSubscriptionById(id));
    }

    @GetMapping("/get/vendor/{id}")
    @PreAuthorize("hasAnyRole('ADMIN','VENDOR')")
    public ResponseEntity<VendorSubscriptionDto> getVendorSubscriptionByVendorId(@PathVariable UUID id) {
        return ResponseEntity.ok().body(vendorSubscriptionService.findVendorSubscriptionByVendorId(id));
    }

    @PutMapping("/update")
    @PreAuthorize("hasAnyRole('ADMIN','VENDOR')")
    public ResponseEntity<VendorSubscriptionDto> updateVendorSubscription(@RequestBody VendorSubscriptionDto vendorSubscriptionDto) {
        return ResponseEntity.ok().body(vendorSubscriptionService.updateVendorSubscription(vendorSubscriptionDto));
    }

    @DeleteMapping("/delete/{id}")
    @PreAuthorize("hasAnyRole('ADMIN','VENDOR')")
    public ResponseEntity<Void> deleteVendorSubscription(@PathVariable UUID id) {
        vendorSubscriptionService.deleteVendorSubscriptionById(id);
        return ResponseEntity.ok().build();
    }


    @PostMapping("/add")
    @PreAuthorize("hasAnyRole('ADMIN','Vendor')")
    public ResponseEntity<VendorSubscriptionDto> addVendorSubscription(@RequestBody VendorSubscriptionDto vendorSubscriptionDto) throws URISyntaxException {
        return ResponseEntity.created(new URI("/vendor-subscription/add")).body(vendorSubscriptionService.addVendorSubscription(vendorSubscriptionDto));
    }




}
