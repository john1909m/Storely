package com.spring.boot.controller;

import com.spring.boot.dto.CheckoutDto;
import com.spring.boot.dto.OrderDto;
import com.spring.boot.service.OrderService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.net.URI;
import java.net.URISyntaxException;
import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/order")
public class OrderController {
    private OrderService orderService;

    @Autowired
    public OrderController(OrderService orderService) {
        this.orderService = orderService;
    }

    @GetMapping("/get/store/{storeId}")
    @PreAuthorize("hasAnyRole('VENDOR','ADMIN')")
    public ResponseEntity<List<OrderDto>> getAllOrdersByStore(@PathVariable("storeId") UUID storeId) {
        return ResponseEntity.ok(orderService.getAllOrdersByStore(storeId));
    }

    @GetMapping("/get/{orderId}/store/{storeId}")
    @PreAuthorize("hasAnyRole('VENDOR','ADMIN')")
    public ResponseEntity<OrderDto> getOrderById(
            @PathVariable("orderId") UUID orderId,
            @PathVariable("storeId") UUID storeId) {
        return ResponseEntity.ok(orderService.getOrderById(orderId, storeId));
    }

    @PostMapping("/add")
    @PreAuthorize("hasAnyRole('VENDOR','ADMIN','CUSTOMER')")
    public ResponseEntity<OrderDto> addOrder(@RequestBody OrderDto orderDto) throws URISyntaxException {
        return ResponseEntity.created(new URI("/order/add")).body(orderService.addOrder(orderDto));
    }

    @PutMapping("/update")
    @PreAuthorize("hasAnyRole('VENDOR','ADMIN')")
    public ResponseEntity<OrderDto> updateOrder(@RequestBody OrderDto orderDto) {
        OrderDto updatedOrder = orderService.updateOrder(orderDto);
        return ResponseEntity.ok(updatedOrder);
    }

    @DeleteMapping("/delete/{orderId}")
    @PreAuthorize("hasAnyRole('VENDOR','ADMIN','CUSTOMER')")
    public ResponseEntity<Void> deleteOrder(@PathVariable("orderId") UUID orderId) {
        orderService.deleteOrder(orderId);
        return ResponseEntity.noContent().build();
    }

    @PostMapping("/checkout")
    public ResponseEntity<OrderDto> checkout(@RequestBody CheckoutDto checkoutDto) {
        OrderDto order = orderService.checkout(checkoutDto);
        return ResponseEntity.ok(order);
    }

    @PostMapping("/{orderId}/deposit")
    public ResponseEntity<OrderDto> uploadDeposit(@PathVariable("orderId") UUID orderId,
                                                  @RequestParam("screenshot") MultipartFile screenshot) {

        return ResponseEntity.ok(orderService.uploadDeposit(orderId, screenshot));
    }
}
