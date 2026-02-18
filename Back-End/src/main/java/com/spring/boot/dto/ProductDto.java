package com.spring.boot.dto;

import lombok.Getter;
import lombok.RequiredArgsConstructor;
import lombok.Setter;

import java.util.List;
import java.util.UUID;

@Getter
@Setter
@RequiredArgsConstructor
public class ProductDto {

    private UUID id;

    private String name;

    private String description;

    private Double price;

    private Double oldPrice;

    private List<ProductVariantDto> variants;

    private Integer quantity;

    private List<String> imageUrls;
    private List<String> altText;
    private List<Integer> position;


    private UUID categoryId;
    private String categoryName;

    private UUID storeId;
}
