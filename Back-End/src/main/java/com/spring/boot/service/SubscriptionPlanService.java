package com.spring.boot.service;

import com.spring.boot.dto.SubscriptionPlanDto;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.UUID;

@Service
public interface SubscriptionPlanService {
    List<SubscriptionPlanDto> findAllPlans();
    SubscriptionPlanDto addSubscriptionPlan(SubscriptionPlanDto subscriptionPlanDto);
    SubscriptionPlanDto updateSubscriptionPlan(SubscriptionPlanDto subscriptionPlanDto);
    void deleteSubscriptionPlan(UUID id);
    SubscriptionPlanDto getSubscriptionPlanById(UUID id);
}
