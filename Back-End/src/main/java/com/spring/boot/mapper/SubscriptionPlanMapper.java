package com.spring.boot.mapper;

import com.spring.boot.dto.SubscriptionPlanDto;
import com.spring.boot.model.SubscriptionPlan;
import org.mapstruct.Mapper;

@Mapper(componentModel = "spring")

public interface SubscriptionPlanMapper {
    SubscriptionPlanDto toDto(SubscriptionPlan subscriptionPlan);


    SubscriptionPlan toEntity(SubscriptionPlanDto subscriptionPlanDto);
}
