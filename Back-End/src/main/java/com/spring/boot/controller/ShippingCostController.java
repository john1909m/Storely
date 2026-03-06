package com.spring.boot.controller;

import com.spring.boot.dto.ShippingCostDto;
import com.spring.boot.dto.ShippingCostRequestDto;
import com.spring.boot.model.Governorate;
import com.spring.boot.model.ShippingCost;
import com.spring.boot.repo.GovernorateRepo;
import com.spring.boot.service.ShippingCostService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@Controller
@RequiredArgsConstructor
@RequestMapping("/shipping-cost")
public class ShippingCostController {
    private final ShippingCostService shippingCostService;
    private final GovernorateRepo governorateRepo;


    @GetMapping("governorates")
    public ResponseEntity<List<Governorate>> findAllGovernorates(){
        return ResponseEntity.ok(governorateRepo.findAll());
    }

    @PutMapping("/update")
    @PreAuthorize("hasAnyRole('VENDOR','ADMIN')")
    public ResponseEntity<ShippingCostDto> updateShippingCost(
            @RequestBody ShippingCostDto dto) {

        return ResponseEntity.ok(
                shippingCostService.updateShippingCost(dto)
        );
    }

    @GetMapping("/store/{storeId}")
    public ResponseEntity<List<ShippingCostDto>> findByStoreId(@PathVariable UUID storeId) {
        return ResponseEntity.ok(shippingCostService.findStoreShippingCostsByStoreId(storeId));
    }

    @PostMapping("/add")
    @PreAuthorize("hasAnyRole('VENDOR','ADMIN')")
    public ResponseEntity<Void> addShippingCost(@RequestBody ShippingCostRequestDto dto) {
        shippingCostService.saveShippingCosts(dto);
        return ResponseEntity.ok().build();
    }




}
