package com.spring.boot.dto;

import com.spring.boot.model.Store;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import lombok.Getter;
import lombok.RequiredArgsConstructor;
import lombok.Setter;

import java.util.List;

@Getter
@Setter
@RequiredArgsConstructor
public class ProductDto {

    private Long id;

    private String name;

    private String description;

    private Double price;

    private Integer quantity;

    private List<String> imageUrls;
    private List<String> altText;
    private List<Integer> position;


    private Long categoryId;
    private String categoryName;

    private Long storeId;
}
