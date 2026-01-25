package com.spring.boot.repo;

import com.spring.boot.model.Customer;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface CustomerRepo extends JpaRepository<Customer,Long> {
    List<Customer> findAllByStores_Id(Long storeId);
    List<Customer> findAllByCityAndStores_Id(String city, Long storeId);
}
