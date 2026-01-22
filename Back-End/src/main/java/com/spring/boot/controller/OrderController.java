package com.spring.boot.controller;

import com.spring.boot.dto.OrderDto;
import com.spring.boot.service.OrderService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.net.URI;
import java.net.URISyntaxException;
import java.util.List;

@RestController
@RequestMapping("/order")
public class OrderController {
    private OrderService orderService;

    @Autowired
    public OrderController(OrderService orderService) {
        this.orderService = orderService;
    }

    @GetMapping("/get/all")
    public ResponseEntity<List<OrderDto>> getAllOrders() {
        return ResponseEntity.ok(orderService.getAllOrders());
    }

    @GetMapping("/get/store/{storeId}")
    public ResponseEntity<List<OrderDto>> getAllOrdersByStore(@PathVariable("storeId") Long storeId) {
        return ResponseEntity.ok(orderService.getAllOrdersByStore(storeId));
    }

    @GetMapping("/get/{orderId}/store/{storeId}")
    public ResponseEntity<OrderDto> getOrderById(
            @PathVariable("orderId") Long orderId,
            @PathVariable("storeId") Long storeId) {
        return ResponseEntity.ok(orderService.getOrderById(orderId, storeId));
    }

    @PostMapping("/add")
    public ResponseEntity<OrderDto> addOrder(@RequestBody OrderDto orderDto) throws URISyntaxException {
        return ResponseEntity.created(new URI("/order/add")).body(orderService.addOrder(orderDto));
    }

    @PutMapping("/update")
    public ResponseEntity<OrderDto> updateOrder(@RequestBody OrderDto orderDto) {
        OrderDto updatedOrder = orderService.updateOrder(orderDto);
        return ResponseEntity.ok(updatedOrder);
    }

    @DeleteMapping("/delete/{orderId}")
    public ResponseEntity<Void> deleteOrder(@PathVariable("orderId") Long orderId) {
        orderService.deleteOrder(orderId);
        return ResponseEntity.noContent().build();
    }
}
