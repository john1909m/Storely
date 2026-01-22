package com.spring.boot.service;

import com.spring.boot.dto.CustomerDto;
import com.spring.boot.model.Customer;

import java.util.List;

public interface CustomerService {
    List<CustomerDto> getCustomersByOrderId(Long orderId);
    List<CustomerDto> getCustomersByStoreId(Long storeId);
    List<CustomerDto> getCustomersByCity(String city,Long storeId);


}
