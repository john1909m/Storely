package com.spring.boot.repo;

import com.spring.boot.model.Order;
import com.spring.boot.model.OrderItem;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Repository
public interface OrderRepo extends JpaRepository<Order, UUID> {
    List<Order> findByStore_Id(UUID storeId);
    Optional<Order> findByIdAndStore_Id(UUID orderId,UUID storeId);
}
