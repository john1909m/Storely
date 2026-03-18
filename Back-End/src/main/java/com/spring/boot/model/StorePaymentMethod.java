package com.spring.boot.model;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

@Entity
@Getter
@Setter
public class StorePaymentMethod {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String accountNumber;

    private String accountName;

    private Boolean isActive;

    @ManyToOne
    private Store store;

    @ManyToOne
    private PaymentMethod paymentMethod;
}
