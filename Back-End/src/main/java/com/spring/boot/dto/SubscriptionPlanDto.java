package com.spring.boot.dto;

import lombok.Getter;
import lombok.Setter;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Getter
@Setter

public class SubscriptionPlanDto {
    private Long id;

    private String name;

    private Double price;

    private Integer durationInDays;

    private ArrayList<String> features;

    private Boolean isActive;

    private LocalDateTime createdAt;

    private LocalDateTime updatedAt;

    private Integer productLimit;

    private Boolean popular;
}
