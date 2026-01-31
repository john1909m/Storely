package com.spring.boot.dto;

import lombok.Getter;
import lombok.Setter;

import java.time.LocalDateTime;

@Getter
@Setter
public class VendorSubscriptionDto {
    private Long id;

    private Long vendorId;
    private Long planId;

    private String planName;

    private LocalDateTime startDate;
    private LocalDateTime endDate;

    private String status;
    private Boolean autoRenew;
}
