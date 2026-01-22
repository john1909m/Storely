package com.spring.boot.controller;

import com.spring.boot.dto.CustomerDto;
import com.spring.boot.service.CustomerService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.net.URI;
import java.net.URISyntaxException;
import java.util.List;

@RestController
@RequestMapping("/customer")
public class CustomerController {
    CustomerService customerService;
    @Autowired
    public CustomerController(CustomerService customerService) {
        this.customerService = customerService;
    }

    @GetMapping("/get/order/{orderId}")
    public ResponseEntity<CustomerDto> getCustomerByOrderId(@PathVariable("orderId") Long orderId) {
        return ResponseEntity.ok(customerService.getCustomerByOrderId(orderId));
    }

    @GetMapping("/get/store/{storeId}")
    public ResponseEntity<List<CustomerDto>> getCustomerByStoreId(@PathVariable("storeId") Long storeId) {
        return ResponseEntity.ok(customerService.getCustomersByStoreId(storeId));
    }

    @GetMapping("/get/city/store/{city}/{storeId}")
    public ResponseEntity<List<CustomerDto>> getCustomerByCity(@PathVariable("city") String city,@PathVariable("storeId") Long storeId) {
        return ResponseEntity.ok(customerService.getCustomersByCity(city,storeId));
    }

    @PostMapping("/add")
    public ResponseEntity<CustomerDto> addCustomer(@RequestBody CustomerDto customerDto) throws URISyntaxException {
        return ResponseEntity.created(new URI("/customer/add")).body(customerService.addCustomer(customerDto));
    }

    @PutMapping("/update")
    public ResponseEntity<CustomerDto> updateCustomer(@RequestBody CustomerDto customerDto) throws URISyntaxException {
        return ResponseEntity.created(new URI("/customer/add")).body(customerService.updateCustomer(customerDto));
    }

    @DeleteMapping("/delete/{customerId}")
    public ResponseEntity<Void> deleteCustomer(@PathVariable("customerId") Long customerId) {
        customerService.deleteCustomer(customerId);
        return ResponseEntity.noContent().build();
    }



}
