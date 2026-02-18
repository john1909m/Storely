package com.spring.boot.repo;

import com.spring.boot.model.Category;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Repository
public interface CategoryRepo extends JpaRepository<Category, UUID> {
    List<Category> findByStore_Id(UUID storeId);
    Optional<Category> findByNameAndStore_Id(String name, UUID storeId);
    boolean existsByNameIgnoreCaseAndStoreId(String name, UUID storeId);

    boolean existsByNameIgnoreCaseAndStoreIdAndIdNot(
            String name,
            UUID storeId,
            UUID id
    );

}
