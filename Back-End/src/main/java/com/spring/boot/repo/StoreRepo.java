package com.spring.boot.repo;

import com.spring.boot.model.Store;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface StoreRepo extends JpaRepository<Store,Long> {
    Optional<Store> findStoreByStoreName(String storeName);

    Optional<Store> findStoreByVendor_Id(Long vendorId);

    Optional<Store> findStoreByVendor_Name(String vendorName);
}
