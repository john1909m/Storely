package com.spring.boot.repo;

import com.spring.boot.model.Order;
import com.spring.boot.model.OrderItem;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface OrderRepo extends JpaRepository<Order,Long> {
    List<Order> findByStore_Id(Long storeId);
    Optional<Order> findByIdAndStore_Id(Long orderId,Long storeId);
}
