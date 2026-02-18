package com.spring.boot.controller;

import com.spring.boot.dto.OrderItemDto;
import com.spring.boot.service.OrderItemService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.net.URI;
import java.net.URISyntaxException;
import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/orderItem")
public class OrderItemController {
    private OrderItemService orderItemService;

    @Autowired
    public OrderItemController(OrderItemService orderItemService) {
        this.orderItemService = orderItemService;
    }

    @GetMapping("/get/order/{orderId}")
    public ResponseEntity<List<OrderItemDto>> getOrderItemsByOrderId(@PathVariable UUID orderId) {
        return ResponseEntity.ok(orderItemService.getOrderItemsByOrderId(orderId));
    }

    @PostMapping("/add")
    public ResponseEntity<OrderItemDto> addOrderItem(
            @RequestBody OrderItemDto orderItemDto) throws URISyntaxException {
        OrderItemDto createdOrderItem = orderItemService.addOrderItem(orderItemDto);
        return ResponseEntity.created(
                        new URI("/orderItem/add"))
                .body(createdOrderItem);
    }

    @PutMapping("/update")
    public ResponseEntity<OrderItemDto> updateOrderItem(
            @RequestBody OrderItemDto orderItemDto) {
        OrderItemDto updatedOrderItem = orderItemService.updateOrderItem(orderItemDto);
        return ResponseEntity.ok(updatedOrderItem);
    }

    @DeleteMapping("/delete/{orderItemId}")
    public ResponseEntity<Void> deleteOrderItem(
            @PathVariable UUID orderItemId) {
        orderItemService.deleteOrderItem(orderItemId);
        return ResponseEntity.noContent().build();
    }
}
