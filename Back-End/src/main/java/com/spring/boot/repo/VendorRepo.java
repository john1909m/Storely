package com.spring.boot.repo;

import com.spring.boot.model.Vendor;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;
import java.util.UUID;

@Repository
public interface VendorRepo extends JpaRepository<Vendor, UUID> {
    Optional<Vendor> findVendorByName(String name);
    Optional<Vendor> findVendorBystoreId(UUID storeId);

    Optional<Vendor> findByStore_storeName(String storeStoreName);

}
