package com.spring.boot.model;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.RequiredArgsConstructor;
import lombok.Setter;

import java.util.UUID;

@Entity
@Getter
@Setter
@RequiredArgsConstructor
public class ProductVariant {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    private String productColor;   // black, white
    private String productSize;    // S, M, L

    private Integer quantity;

    private Double price;   // optional override

    @ManyToOne
    @JoinColumn(name = "product_id")
    private Product product;
}
