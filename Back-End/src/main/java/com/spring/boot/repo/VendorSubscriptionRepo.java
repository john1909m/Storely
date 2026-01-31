package com.spring.boot.repo;

import com.spring.boot.model.VendorSubscription;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface VendorSubscriptionRepo extends JpaRepository<VendorSubscription,Long> {
}
