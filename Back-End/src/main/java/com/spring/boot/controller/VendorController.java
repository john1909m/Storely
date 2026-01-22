package com.spring.boot.controller;

import com.spring.boot.dto.VendorDto;
import com.spring.boot.service.VendorService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
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
    public ResponseEntity<List<VendorDto>> getAllVendors() {
        return ResponseEntity.ok(vendorService.getVendors());
    }

    @GetMapping("/get/{vendorId}")
    public ResponseEntity<VendorDto> getVendorById(@PathVariable("vendorId") Long vendorId) {
        return ResponseEntity.ok(vendorService.getVendorById(vendorId));
    }

    @PostMapping("/add")
    public ResponseEntity<VendorDto> addVendor(@RequestBody VendorDto vendorDto) throws URISyntaxException {
        return ResponseEntity.created(new URI("/vendor/add")).body(vendorService.addVendor(vendorDto));
    }

    @PutMapping("/update")
    public ResponseEntity<VendorDto> updateVendor(@RequestBody VendorDto vendorDto) throws URISyntaxException {
        return ResponseEntity.created(new URI("/vendor/update")).body(vendorService.updateVendor(vendorDto));
    }

    @DeleteMapping("/delete/{vendorId}")
    public ResponseEntity<Void> deleteVendor(@PathVariable("vendorId") Long id){
        vendorService.deleteVendor(id);
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/get/{vendorName}")
    public ResponseEntity<VendorDto> getVendorByName(@PathVariable("vendorName") String vendorName) {
        return ResponseEntity.ok(vendorService.getVendorByName(vendorName));
    }

    @GetMapping("/get/store/{storeId}")
    public ResponseEntity<VendorDto> getVendorByStoreId(@PathVariable("storeId") Long storeId) {
        return ResponseEntity.ok(vendorService.getVendorByStoreId(storeId));
    }

    @GetMapping("/get/store/{storeName}")
    public ResponseEntity<VendorDto> getVendorByStoreName(@PathVariable("storeName") String storeName) {
        return ResponseEntity.ok(vendorService.getVendorByStoreName(storeName));
    }


}
