package com.spring.boot.controller;

import com.spring.boot.dto.VendorSubscriptionDto;
import com.spring.boot.service.VendorSubscriptionService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.net.URI;
import java.net.URISyntaxException;
import java.util.List;

@RestController
@RequestMapping("/vendor-subscription")
public class VendorSubscriptionController {
    private VendorSubscriptionService vendorSubscriptionService;
    @Autowired
    public void setVendorSubscriptionService(VendorSubscriptionService vendorSubscriptionService) {
        this.vendorSubscriptionService = vendorSubscriptionService;
    }

    @GetMapping("/get/all")
    public ResponseEntity<List<VendorSubscriptionDto>> getAllVendorSubscriptions() {
        return ResponseEntity.ok().body(vendorSubscriptionService.findAllVendorSubscriptions());
    }

    @GetMapping("/get/{id}")
    public ResponseEntity<VendorSubscriptionDto> getVendorSubscriptionById(@PathVariable Long id) {
        return ResponseEntity.ok().body(vendorSubscriptionService.findVendorSubscriptionById(id));
    }

    @PutMapping("/update")
    public ResponseEntity<VendorSubscriptionDto> updateVendorSubscription(@RequestBody VendorSubscriptionDto vendorSubscriptionDto) {
        return ResponseEntity.ok().body(vendorSubscriptionService.updateVendorSubscription(vendorSubscriptionDto));
    }

    @DeleteMapping("/delete/{id}")
    public ResponseEntity<Void> deleteVendorSubscription(@PathVariable Long id) {
        vendorSubscriptionService.deleteVendorSubscriptionById(id);
        return ResponseEntity.ok().build();
    }


    @PostMapping("/add")
    public ResponseEntity<VendorSubscriptionDto> addVendorSubscription(@RequestBody VendorSubscriptionDto vendorSubscriptionDto) throws URISyntaxException {
        return ResponseEntity.created(new URI("/vendor-subscription/add")).body(vendorSubscriptionService.addVendorSubscription(vendorSubscriptionDto));
    }




}
