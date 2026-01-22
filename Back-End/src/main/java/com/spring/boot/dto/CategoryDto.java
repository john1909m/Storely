package com.spring.boot.dto;

import com.spring.boot.model.Product;
import com.spring.boot.model.Store;
import lombok.Getter;
import lombok.RequiredArgsConstructor;
import lombok.Setter;

import java.util.List;

@Getter
@Setter
@RequiredArgsConstructor
public class CategoryDto {
    private Long id;

    private String name;

    private List<ProductDto> products;

    private Long storeId;
}
