package com.spring.boot.mapper;

import com.spring.boot.dto.VendorSubscriptionDto;
import com.spring.boot.model.VendorSubscription;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

@Mapper(componentModel = "spring")
public interface VendorSubscriptionMapper {
    @Mapping(source = "vendor.id",target = "vendorId")
    @Mapping(source = "subscriptionPlan.id",target = "planId")
    @Mapping(source = "subscriptionPlan.name",target = "planName")
    @Mapping(source = "status",target = "status")
    VendorSubscriptionDto toDto(VendorSubscription vendorSubscription);

    @Mapping(source = "vendorId",target = "vendor.id")
    @Mapping(source = "planId",target = "subscriptionPlan.id")
    @Mapping(source = "planName",target = "subscriptionPlan.name")
    @Mapping(source = "status",target = "status")
    VendorSubscription toEntity(VendorSubscriptionDto vendorSubscriptionDto);
}
