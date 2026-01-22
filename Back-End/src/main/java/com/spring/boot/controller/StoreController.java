package com.spring.boot.controller;

import com.spring.boot.dto.StoreDto;
import com.spring.boot.dto.VendorDto;
import com.spring.boot.service.StoreService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.net.URI;
import java.net.URISyntaxException;
import java.util.List;

@RestController
@RequestMapping("/store")
public class StoreController {
    StoreService storeService;
    @Autowired
    public StoreController(StoreService storeService) {
        this.storeService = storeService;
    }

    @GetMapping("/get/all")
    public ResponseEntity<List<StoreDto>> getAllStores() {
        return ResponseEntity.ok(storeService.getAllStores());
    }

    @GetMapping("/get/{storeId}")
    public ResponseEntity<StoreDto> getStoreById(@PathVariable("storeId") Long storeId) {
        return ResponseEntity.ok(storeService.getStoreByStoreId(storeId));
    }

    @GetMapping("/get/{storeName}")
    public ResponseEntity<StoreDto> getStoreByName(@PathVariable("storeName") String storeName) {
        return ResponseEntity.ok(storeService.getStoreByStoreName(storeName));
    }

    @GetMapping("/get/vendor/{vendorId}")
    public ResponseEntity<StoreDto> getStoreByVendor(@PathVariable("vendorId") Long vendorId) {
        return ResponseEntity.ok(storeService.getStoreByVendorId(vendorId));
    }

    @GetMapping("/get/vendor/{vendorName}")
    public ResponseEntity<StoreDto> getStoreByVendorName(@PathVariable("vendorName") String vendorName) {
        return ResponseEntity.ok(storeService.getStoreByVendorName(vendorName));
    }

    @PostMapping("/add")
    public ResponseEntity<StoreDto> addStore(@RequestBody StoreDto storeDto) throws URISyntaxException {
        return ResponseEntity.created(new URI("store/add")).body(storeService.addStore(storeDto));
    }

    @PutMapping("/update")
    public ResponseEntity<StoreDto> updateStore(@RequestBody StoreDto storeDto) throws URISyntaxException {
        return ResponseEntity.created(new URI("store/update")).body(storeService.updateStore(storeDto));
    }

    @DeleteMapping("/delete/{storeId}")
    public ResponseEntity<Void> deleteStore(@PathVariable("storeId") Long storeId) {
        storeService.deleteStore(storeId);
        return ResponseEntity.noContent().build();
    }



}
