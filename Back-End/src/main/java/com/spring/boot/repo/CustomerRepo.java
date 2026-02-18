package com.spring.boot.repo;

import com.spring.boot.model.Customer;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.UUID;

@Repository
public interface CustomerRepo extends JpaRepository<Customer, UUID> {
    List<Customer> findAllByStores_Id(UUID storeId);
    List<Customer> findAllByCityAndStores_Id(String city, UUID storeId);
}
