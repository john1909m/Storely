package com.spring.boot.dto;

import com.spring.boot.model.Product;
import lombok.Getter;
import lombok.RequiredArgsConstructor;
import lombok.Setter;

import java.util.UUID;

@Getter
@Setter
@RequiredArgsConstructor
public class ProductVariantDto {

    private UUID id;
    private String productSize;
    private String productColor;
    private Integer quantity;
    private Double price;   // optional override


}
