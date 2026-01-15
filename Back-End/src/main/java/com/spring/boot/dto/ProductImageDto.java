package com.spring.boot.dto;

import lombok.Getter;
import lombok.RequiredArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@RequiredArgsConstructor
public class ProductImageDto {
    private Long id;
    private String url;
    private String altText;
    private Integer position;
}
