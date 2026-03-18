package com.spring.boot.dto;

import lombok.Getter;
import lombok.Setter;

import java.util.UUID;

@Getter
@Setter
public class StorePaymentMethodDto {

    private Long id;
    private UUID storeId;
    private Long paymentMethodId;
    private String paymentMethodName;
    private String accountNumber;
    private String accountName;
    private Boolean isActive;

}
