package com.spring.boot.repo;

import com.spring.boot.model.OrderItem;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.UUID;

@Repository
public interface OrderItemRepo extends JpaRepository<OrderItem,UUID> {
    List<OrderItem> findAllByOrder_Id(UUID orderId);
}
