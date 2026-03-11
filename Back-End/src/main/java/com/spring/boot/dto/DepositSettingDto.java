package com.spring.boot.dto;

import lombok.Getter;
import lombok.Setter;

import java.util.UUID;

@Getter
@Setter
public class DepositSettingDto {
    private Long id;
    private UUID storeId;
    private String depositType;
    private Double depositValue;
    private String instapayNumber;
    private String vodafoneCashNumber;
    private Boolean depositRequired;
}
