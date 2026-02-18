package com.spring.boot.dto;

import lombok.Getter;
import lombok.Setter;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.UUID;

@Getter
@Setter
public class VendorSubscriptionDto {
    private UUID id;

    private UUID vendorId;
    private UUID planId;

    private String planName;

    private String billingCycle;

    private LocalDate startDate;
    private LocalDate endDate;

    private String status;
    private Boolean autoRenew;
    private Boolean analytics;
}
