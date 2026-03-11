package com.spring.boot.controller;

import com.spring.boot.dto.DepositSettingDto;
import com.spring.boot.service.DepositSettingService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.*;

import java.util.UUID;

@Controller
@RequestMapping("/deposit-settings")
@RequiredArgsConstructor
public class DepositSettingController {

    private final DepositSettingService depositSettingService;


    @PostMapping("/update")
    public ResponseEntity<DepositSettingDto> update(@RequestBody DepositSettingDto dto) {
        return ResponseEntity.ok(depositSettingService.saveOrUpdate(dto));
    }

    @GetMapping("/get/{storeId}")
    public ResponseEntity<DepositSettingDto> getByStoreId(@PathVariable UUID storeId) {
        return ResponseEntity.ok(depositSettingService.getByStoreId(storeId));
    }

}
