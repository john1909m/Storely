package com.spring.boot.mapper;

import com.spring.boot.dto.OrderItemDto;
import com.spring.boot.model.OrderItem;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

@Mapper(componentModel = "spring")
public interface OrderItemMapper {

    @Mapping(source = "product.id", target = "productId")
    @Mapping(source = "product.name" , target = "productName")
    OrderItemDto toOrderItemDto(OrderItem orderItem);

    @Mapping(source = "productName" , target = "product.name")
    @Mapping(source = "productId",target = "product.id")
    OrderItem toOrderItemEntity(OrderItemDto orderItemDto);
}
