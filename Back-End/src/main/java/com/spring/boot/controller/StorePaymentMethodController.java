package com.spring.boot.controller;

import com.spring.boot.dto.PaymentMethodDto;
import com.spring.boot.dto.StorePaymentMethodDto;
import com.spring.boot.service.StorePaymentMethodService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.net.URI;
import java.net.URISyntaxException;
import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/store-payment-methods")
@RequiredArgsConstructor
public class StorePaymentMethodController {

    private final StorePaymentMethodService storePaymentMethodService;

    @GetMapping("/{storeId}")
    public ResponseEntity<List<StorePaymentMethodDto>> getByStoreId(@PathVariable("storeId") UUID storeId) {
        return ResponseEntity.ok(storePaymentMethodService.getStorePaymentMethods(storeId));

    }

    @PostMapping("/{storeId}/add")
    @PreAuthorize("hasAnyRole('VENDOR','ADMIN')")
    public ResponseEntity<List<StorePaymentMethodDto>> updateStorePaymentMethods(
            @PathVariable UUID storeId,
            @RequestBody List<StorePaymentMethodDto> storePaymentMethods) throws URISyntaxException {
        return ResponseEntity.created(new URI("/store-payment-methods/{storeId}/add")).body(
                storePaymentMethodService.updateStorePaymentMethods(storeId,storePaymentMethods)
        );
    }

}
