package com.spring.boot.repo;

import com.spring.boot.enums.SubscriptionStatus;
import com.spring.boot.model.VendorSubscription;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;
import java.util.UUID;

@Repository
public interface VendorSubscriptionRepo extends JpaRepository<VendorSubscription,UUID> {
    Optional<VendorSubscription> findByVendorId(UUID id);
    Optional<VendorSubscription> findByVendorIdAndStatus(UUID vendorId, SubscriptionStatus status);
}
