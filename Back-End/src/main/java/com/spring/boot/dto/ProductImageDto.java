package com.spring.boot.dto;

import lombok.Getter;
import lombok.RequiredArgsConstructor;
import lombok.Setter;

import java.util.UUID;

@Getter
@Setter
@RequiredArgsConstructor
public class ProductImageDto {
    private UUID id;
    private String url;
    private String altText;
    private Integer position;
    private UUID productId;
}
