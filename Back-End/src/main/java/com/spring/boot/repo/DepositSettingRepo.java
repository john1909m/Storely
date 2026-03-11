package com.spring.boot.repo;

import com.spring.boot.model.DepositSetting;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;
import java.util.UUID;

@Repository
public interface DepositSettingRepo extends JpaRepository<DepositSetting,Long> {
    Optional<DepositSetting> findByStoreId(UUID storeId);
}
