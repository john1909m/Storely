package com.spring.boot.service.impl;

import com.spring.boot.dto.CustomerDto;
import com.spring.boot.service.CustomerService;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class CustomerServiceImpl implements CustomerService {
    @Override
    public List<CustomerDto> getCustomersByOrderId(Long orderId) {
        return List.of();
    }

    @Override
    public List<CustomerDto> getCustomersByStoreId(Long storeId) {
        return List.of();
    }

    @Override
    public List<CustomerDto> getCustomersByCity(String city, Long storeId) {
        return List.of();
    }
}
