package com.spring.boot.model;

import com.spring.boot.enums.StoreStatus;
import com.spring.boot.enums.ThemeType;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.RequiredArgsConstructor;
import lombok.Setter;

import java.io.File;
import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;



@Entity
@Getter
@Setter
@RequiredArgsConstructor
@Table(name = "stores")
public class Store {
    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    private String storeName;

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

    private Long totalVisits;

    @Column(columnDefinition = "CLOB")
    private String layoutConfig;

    private String themeType = "CLASSIC";

    @OneToMany(mappedBy = "store",cascade = CascadeType.ALL)
    private List<ShippingCost> shippingCosts;

    @Enumerated(EnumType.STRING)
    private StoreStatus storeStatus;

    @OneToOne
    @JoinColumn(name = "vendor_id",nullable = true)
    private Vendor vendor;

    @OneToMany(mappedBy = "store", cascade = CascadeType.ALL)
    private List<Product> products;

    @OneToMany(mappedBy = "store", cascade = CascadeType.ALL)
    private List<Category> categories;

    @OneToMany(mappedBy = "store")
    private List<Order> orders;

    @ManyToMany(mappedBy = "stores")
    private List<Customer> customers;

    @OneToOne(mappedBy = "store",cascade = CascadeType.ALL)
    private DepositSetting depositSetting;

    @OneToMany(mappedBy = "store",cascade = CascadeType.ALL,orphanRemoval = true)
    private List<StorePaymentMethod> storePaymentMethods;




    @PrePersist
    public void setDefaultLayout()
    {



        if (this.layoutConfig == null){
            this.layoutConfig = """
        {
          "pages": {
            "home": true,
            "allProducts": true
          },
          "sections": [
            {
              "type": "BANNER",
              "image": ""
            },
            {
              "type": "FEATURED_PRODUCTS",
              "productIds": []
            }
          ]
        }
        """;
        }
    }






}
