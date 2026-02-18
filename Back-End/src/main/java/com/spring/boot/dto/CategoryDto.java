package com.spring.boot.dto;

import com.spring.boot.model.Product;
import com.spring.boot.model.Store;
import lombok.Getter;
import lombok.RequiredArgsConstructor;
import lombok.Setter;

import java.util.List;
import java.util.UUID;

@Getter
@Setter
@RequiredArgsConstructor
public class CategoryDto {
    private UUID id;

    private String name;

    private List<ProductDto> products;

    private UUID storeId;
}
