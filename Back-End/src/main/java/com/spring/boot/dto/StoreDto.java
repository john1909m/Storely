package com.spring.boot.dto;

import com.spring.boot.enums.StoreStatus;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import lombok.Getter;
import lombok.RequiredArgsConstructor;
import lombok.Setter;

import java.time.LocalDateTime;

@Getter
@Setter
@RequiredArgsConstructor
public class StoreDto {
    private String id;

    private String storeName;

    private LocalDateTime createdAt = LocalDateTime.now();

    private String storeAddress;

    private String storeDescription;

    private String storePhone;

    private String storeLogoUrl;

    private String primaryColor;

    private String secondaryColor;

    private String fontFamily;

    private StoreStatus storeStatus;
}
