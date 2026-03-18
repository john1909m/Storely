package com.spring.boot.repo;

import com.spring.boot.model.PaymentMethod;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.UUID;

@Repository
public interface PaymentMethodRepo extends JpaRepository<PaymentMethod, Long> {
}
