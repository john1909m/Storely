package com.spring.boot.repo;

import com.spring.boot.model.StorePaymentMethod;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.UUID;

@Repository
public interface StorePaymentMethodRepo extends JpaRepository<StorePaymentMethod,Long> {
    List<StorePaymentMethod> findByStoreId(UUID storeId);

    void deleteByStoreId(UUID storeId);


}
