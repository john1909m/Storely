package com.spring.boot.mapper;

import com.spring.boot.dto.OrderDto;
import com.spring.boot.model.Order;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

@Mapper(componentModel = "spring", uses = {OrderItemMapper.class})
public interface OrderMapper {

    @Mapping(source = "status", target = "status")
    @Mapping(source = "customer",target = "customer")
    @Mapping(source = "store.id",target = "storeId")
    @Mapping(source = "orderItems",target = "orderItems")
    @Mapping(source = "paymentMethod.id" , target = "paymentMethodId")
    @Mapping(source = "paymentMethod.name" , target = "paymentMethodName")
    @Mapping(source = "paymentStatus",target = "paymentStatus")
    OrderDto toOrderDto(Order order);

    @Mapping(source = "status", target = "status")
    @Mapping(source = "customer",target = "customer")
    @Mapping(source = "storeId",target = "store.id")
    @Mapping(source = "orderItems",target = "orderItems")
    @Mapping(source = "paymentMethodId" , target = "paymentMethod.id")
    @Mapping(source = "paymentMethodName" , target = "paymentMethod.name")
    @Mapping(source = "paymentStatus",target = "paymentStatus")
    Order toOrderEntity(OrderDto orderDto);
}
