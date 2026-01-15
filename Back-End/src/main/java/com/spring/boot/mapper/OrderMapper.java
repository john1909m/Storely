package com.spring.boot.mapper;

import com.spring.boot.dto.OrderDto;
import com.spring.boot.model.Order;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

@Mapper(componentModel = "spring", uses = {OrderItemMapper.class})
public interface OrderMapper {

    @Mapping(source = "status", target = "status")
    OrderDto toOrderDto(Order order);
    Order toOrderEntity(OrderDto orderDto);
}
