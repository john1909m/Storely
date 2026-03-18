package com.spring.boot.dto;

import com.spring.boot.enums.StoreStatus;
import com.spring.boot.model.Category;
import com.spring.boot.model.Order;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import lombok.Getter;
import lombok.RequiredArgsConstructor;
import lombok.Setter;

import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

@Getter
@Setter
@RequiredArgsConstructor
public class StoreDto {
    private UUID id;

    private UUID vendorId;

    private String storeName;

    private String vendorName;

    private LocalDateTime createdAt = LocalDateTime.now();

    private String storeAddress;

    private String storeDescription;

    private String storePhone;

    private String storeLogoUrl;

    private String primaryColor;

    private String secondaryColor;

    private String fontFamily;

    private String facebook;

    private String instagram;

    private String storeStatus="Inactive";

    private List<ProductDto> products;

    private List<CategoryDto> categories;

    private List<OrderDto> orders;

    private List<Long> customerIds;

    private List<ShippingCostDto> shippingCosts;

    private List<StorePaymentMethodDto> storePaymentMethods;




}
