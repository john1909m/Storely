package com.spring.boot.service.impl;

import com.spring.boot.dto.CustomerDto;
import com.spring.boot.mapper.CustomerMapper;
import com.spring.boot.model.Customer;
import com.spring.boot.model.Order;
import com.spring.boot.model.Store;
import com.spring.boot.repo.CustomerRepo;
import com.spring.boot.repo.OrderRepo;
import com.spring.boot.repo.StoreRepo;
import com.spring.boot.service.CustomerService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class CustomerServiceImpl implements CustomerService {

    private final CustomerMapper customerMapper;
    private final CustomerRepo customerRepo;
    private final StoreRepo storeRepo;
    private final OrderRepo orderRepo;

    @Autowired
    public CustomerServiceImpl(CustomerMapper customerMapper,
                               CustomerRepo customerRepo,
                               StoreRepo storeRepo,
                               OrderRepo orderRepo) {
        this.customerMapper = customerMapper;
        this.customerRepo = customerRepo;
        this.storeRepo = storeRepo;
        this.orderRepo = orderRepo;
    }

    @Override
    public CustomerDto getCustomerByOrderId(Long orderId) {
        // First get the order
        Order order = orderRepo.findById(orderId)
                .orElseThrow(() -> new RuntimeException("order.not.found"));

        // Check if order has a customer
        if (order.getCustomer() == null) {
            throw new RuntimeException("customer.not.found.for.order");
        }

        return customerMapper.toCustomerDto(order.getCustomer());
    }

    @Override
    public List<CustomerDto> getCustomersByStoreId(Long storeId) {
        return customerRepo.findAllByStores_Id(storeId).stream()
                .map(customerMapper::toCustomerDto)
                .toList();
    }

    @Override
    public List<CustomerDto> getCustomersByCity(String city, Long storeId) {
        return customerRepo.findAllByCityAndStores_Id(city, storeId).stream()
                .map(customerMapper::toCustomerDto)
                .toList();
    }

    @Override
    public CustomerDto addCustomer(CustomerDto customerDto) {

        Customer customer = customerMapper.toCustomerEntity(customerDto);

        if (customerDto.getStoreIds() != null && !customerDto.getStoreIds().isEmpty()) {
            List<Store> stores = storeRepo.findAllById(customerDto.getStoreIds());
            customer.setStores(stores);
        }

        Customer savedCustomer = customerRepo.save(customer);
        return customerMapper.toCustomerDto(savedCustomer);
    }

    @Override
    public CustomerDto updateCustomer(CustomerDto customerDto) {

        // 1️⃣ تأكد إن الـ Customer موجود
        Customer existingCustomer = customerRepo.findById(customerDto.getId())
                .orElseThrow(() -> new RuntimeException("customer.not.found"));

        // 2️⃣ حدّث الحقول البسيطة
        existingCustomer.setFirstName(customerDto.getFirstName());
        existingCustomer.setLastName(customerDto.getLastName());
        existingCustomer.setAddress(customerDto.getAddress());

        // 3️⃣ حدّث علاقة الـ Stores (Many-to-Many)
        if (customerDto.getStoreIds() != null) {
            List<Store> stores = storeRepo.findAllById(customerDto.getStoreIds());
            existingCustomer.setStores(stores);
        }

        // 4️⃣ احفظ
        Customer savedCustomer = customerRepo.save(existingCustomer);

        return customerMapper.toCustomerDto(savedCustomer);
    }


    @Override
    public void deleteCustomer(Long id) {
        // Check if customer exists
        Customer customer = customerRepo.findById(id)
                .orElseThrow(() -> new RuntimeException("customer.not.found"));

        // Delete the customer
        customerRepo.deleteById(id);
    }
}