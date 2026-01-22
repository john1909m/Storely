package com.spring.boot.service;

import com.spring.boot.dto.CustomerDto;
import com.spring.boot.model.Customer;

import java.util.List;

public interface CustomerService {
    CustomerDto getCustomerByOrderId(Long orderId);
    List<CustomerDto> getCustomersByStoreId(Long storeId);
    List<CustomerDto> getCustomersByCity(String city,Long storeId);
    CustomerDto addCustomer(CustomerDto customerDto);
    CustomerDto updateCustomer(CustomerDto customerDto);
    void deleteCustomer(Long id);


}
