package com.spring.boot.service;

import com.spring.boot.dto.CustomerDto;
import com.spring.boot.model.Customer;

import java.util.List;
import java.util.UUID;

public interface CustomerService {
    CustomerDto getCustomerByOrderId(UUID orderId);
    List<CustomerDto> getCustomersByStoreId(UUID storeId);
    List<CustomerDto> getCustomersByCity(String city,UUID storeId);
    CustomerDto addCustomer(CustomerDto customerDto);
    CustomerDto updateCustomer(CustomerDto customerDto);
    void deleteCustomer(UUID id);


}
