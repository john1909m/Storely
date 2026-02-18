package com.spring.boot.controller;

import com.spring.boot.dto.StoreDto;
import com.spring.boot.dto.VendorDto;
import com.spring.boot.service.StoreService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.net.URI;
import java.net.URISyntaxException;
import java.util.List;
import java.util.Map;
import java.util.Objects;
import java.util.UUID;

@RestController
@RequestMapping("/store")
public class StoreController {
    StoreService storeService;
    @Autowired
    public StoreController(StoreService storeService) {
        this.storeService = storeService;
    }

    @GetMapping("/get/all")
    @PreAuthorize("hasAnyRole('ADMIN')")
    public ResponseEntity<List<StoreDto>> getAllStores() {
        return ResponseEntity.ok(storeService.getAllStores());
    }

    @GetMapping("/get/{storeId}")
    public ResponseEntity<StoreDto> getStoreById(@PathVariable("storeId") UUID storeId) {
        return ResponseEntity.ok(storeService.getStoreByStoreId(storeId));
    }

    @GetMapping("/get/name/{storeName}")
    public ResponseEntity<StoreDto> getStoreByName(@PathVariable("storeName") String storeName) {
        return ResponseEntity.ok(storeService.getStoreByStoreName(storeName));
    }

    @GetMapping("/get/vendor/{vendorId}")
    @PreAuthorize("hasAnyRole('ADMIN','VENDOR')")
    public ResponseEntity<StoreDto> getStoreByVendor(@PathVariable("vendorId") UUID vendorId) {
        return ResponseEntity.ok(storeService.getStoreByVendorId(vendorId));
    }

    @GetMapping("/get/vendor/name/{vendorName}")
    @PreAuthorize("hasAnyRole('ADMIN')")
    public ResponseEntity<StoreDto> getStoreByVendorName(@PathVariable("vendorName") String vendorName) {
        return ResponseEntity.ok(storeService.getStoreByVendorName(vendorName));
    }

    @PostMapping("/add")
    @PreAuthorize("hasAnyRole('VENDOR','ADMIN')")
    public ResponseEntity<StoreDto> addStore(@RequestBody StoreDto storeDto) throws URISyntaxException {
        return ResponseEntity.created(new URI("store/add")).body(storeService.addStore(storeDto));
    }

    @PutMapping("/update")
    @PreAuthorize("hasAnyRole('VENDOR','ADMIN')")
    public ResponseEntity<StoreDto> updateStore(@RequestBody StoreDto storeDto) throws URISyntaxException {
        return ResponseEntity.created(new URI("store/update")).body(storeService.updateStore(storeDto));
    }

    @DeleteMapping("/delete/{storeId}")
    @PreAuthorize("hasAnyRole('ADMIN')")
    public ResponseEntity<Void> deleteStore(@PathVariable("storeId") UUID storeId) {
        storeService.deleteStore(storeId);
        return ResponseEntity.noContent().build();
    }

    @PostMapping("/{storeId}/upload-image")
    @PreAuthorize("hasAnyRole('ADMIN','VENDOR')")
    public ResponseEntity<Map<String,String>> uploadStoreImage(@PathVariable UUID storeId,
                                                               @RequestParam("file") MultipartFile file,
                                                               @RequestParam("type") String type ){
        String imageUrl = storeService.uploadStoreImage(storeId, file, type);

        return ResponseEntity.ok(
                Map.of("url", imageUrl)
        );
    }





}
