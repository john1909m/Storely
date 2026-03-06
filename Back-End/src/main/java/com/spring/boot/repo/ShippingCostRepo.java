package com.spring.boot.repo;

import com.spring.boot.model.ShippingCost;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Repository
public interface ShippingCostRepo extends JpaRepository<ShippingCost,Long> {
    List<ShippingCost> findByStoreId(UUID storeId);
    Optional<ShippingCost> findByStoreIdAndGovernorateId(UUID storeId, Long id);
    void deleteByStoreId(UUID storeId);
}
