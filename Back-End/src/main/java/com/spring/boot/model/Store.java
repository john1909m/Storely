package com.spring.boot.model;

import com.spring.boot.enums.StoreStatus;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.RequiredArgsConstructor;
import lombok.Setter;

import java.io.File;
import java.time.LocalDateTime;
import java.util.List;

@Entity
@Getter
@Setter
@RequiredArgsConstructor
public class Store {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private String id;

    private String storeName;

    private LocalDateTime createdAt = LocalDateTime.now();

    private String storeAddress;

    private String storeDescription;

    private String storePhone;

    private String storeLogoUrl;

    @Enumerated(EnumType.STRING)
    private StoreStatus storeStatus;

    @OneToOne
    @JoinColumn(name = "vendor_id")
    private Vendor vendor;

    @OneToMany(mappedBy = "store", cascade = CascadeType.ALL)
    private List<Product> products;

    @OneToMany(mappedBy = "store", cascade = CascadeType.ALL)
    private List<Category> categories;


}
