package com.spring.boot.model;

import com.spring.boot.enums.DepositType;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity
@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class DepositSetting {

    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    private Long id;

    @OneToOne
    @JoinColumn(name = "store_id")
    private Store store;

    @Enumerated(EnumType.STRING)
    private DepositType depositType;

    private Double depositValue;

    private String instapayNumber;

    private String vodafoneCashNumber;

    private Boolean depositRequired;
}
