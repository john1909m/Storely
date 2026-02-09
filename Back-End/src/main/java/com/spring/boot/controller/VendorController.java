package com.spring.boot.controller;

import com.spring.boot.dto.VendorDto;
import com.spring.boot.service.VendorService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.net.URI;
import java.net.URISyntaxException;
import java.util.List;

@RestController
@RequestMapping("/vendor")
public class VendorController {
    VendorService vendorService;
    @Autowired
    public VendorController(VendorService vendorService) {
        this.vendorService = vendorService;

    }

    @GetMapping("/get/all")
    @PreAuthorize("hasAnyRole('ADMIN')")
    public ResponseEntity<List<VendorDto>> getAllVendors() {
        return ResponseEntity.ok(vendorService.getVendors());
    }

    @GetMapping("/get/{vendorId}")
    @PreAuthorize("hasAnyRole('ADMIN')")
    public ResponseEntity<VendorDto> getVendorById(@PathVariable("vendorId") Long vendorId) {
        return ResponseEntity.ok(vendorService.getVendorById(vendorId));
    }

    @PostMapping("/add")
    @PreAuthorize("hasAnyRole('ADMIN','Vendor')")
    public ResponseEntity<VendorDto> addVendor(@RequestBody VendorDto vendorDto) throws URISyntaxException {
        return ResponseEntity.created(new URI("/vendor/add")).body(vendorService.addVendor(vendorDto));
    }

    @PutMapping("/update")
    @PreAuthorize("hasAnyRole('ADMIN','Vendor')")
    public ResponseEntity<VendorDto> updateVendor(@RequestBody VendorDto vendorDto) throws URISyntaxException {
        return ResponseEntity.created(new URI("/vendor/update")).body(vendorService.updateVendor(vendorDto));
    }


    @DeleteMapping("/delete/{vendorId}")
    @PreAuthorize("hasAnyRole('ADMIN')")
    public ResponseEntity<Void> deleteVendor(@PathVariable("vendorId") Long id){
        vendorService.deleteVendor(id);
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/get/name/{vendorName}")
    @PreAuthorize("hasAnyRole('ADMIN')")
    public ResponseEntity<VendorDto> getVendorByName(@PathVariable("vendorName") String vendorName) {
        return ResponseEntity.ok(vendorService.getVendorByName(vendorName));
    }

    @GetMapping("/get/store/{storeId}")
    @PreAuthorize("hasAnyRole('ADMIN')")
    public ResponseEntity<VendorDto> getVendorByStoreId(@PathVariable("storeId") Long storeId) {
        return ResponseEntity.ok(vendorService.getVendorByStoreId(storeId));
    }

    @GetMapping("/get/store/{storeName}")
    @PreAuthorize("hasAnyRole('ADMIN')")
    public ResponseEntity<VendorDto> getVendorByStoreName(@PathVariable("storeName") String storeName) {
        return ResponseEntity.ok(vendorService.getVendorByStoreName(storeName));
    }


}
