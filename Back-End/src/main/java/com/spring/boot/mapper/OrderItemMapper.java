package com.spring.boot.mapper;

import com.spring.boot.dto.OrderItemDto;
import com.spring.boot.model.OrderItem;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

@Mapper(componentModel = "spring")
public interface OrderItemMapper {

    @Mapping(source = "product.id", target = "productId")
    @Mapping(source = "order.id",target = "orderId")
    OrderItemDto toOrderItemDto(OrderItem orderItem);

    @Mapping(source = "productId",target = "product.id")
    @Mapping(source = "orderId",target = "order.id")
    OrderItem toOrderItemEntity(OrderItemDto orderItemDto);
}
