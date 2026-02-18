package com.spring.boot.repo;

import com.spring.boot.model.Store;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;
import java.util.UUID;

@Repository
public interface StoreRepo extends JpaRepository<Store, UUID> {
    Optional<Store> findStoreByStoreName(String storeName);

    Optional<Store> findStoreByVendor_Id(UUID vendorId);

    Optional<Store> findStoreByVendor_Name(String vendorName);
}
