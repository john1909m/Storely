package com.spring.boot.repo;

import com.spring.boot.model.ShippingCost;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Repository
public interface ShippingCostRepo extends JpaRepository<ShippingCost,Long> {
    List<ShippingCost> findByStoreId(UUID storeId);
    Optional<ShippingCost> findByStoreIdAndGovernorateId(UUID storeId, Long id);

    @Modifying
    @Transactional
    @Query("DELETE FROM ShippingCost s WHERE s.store.id = :storeId")
    void deleteByStoreId(@Param("storeId") UUID storeId);

}
