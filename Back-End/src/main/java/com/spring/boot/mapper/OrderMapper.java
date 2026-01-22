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
    OrderDto toOrderDto(Order order);

    @Mapping(source = "status", target = "status")
    @Mapping(source = "customer",target = "customer")
    @Mapping(source = "storeId",target = "store.id")
    @Mapping(source = "orderItems",target = "orderItems")
    Order toOrderEntity(OrderDto orderDto);
}
