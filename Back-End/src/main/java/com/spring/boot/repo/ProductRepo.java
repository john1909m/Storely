package com.spring.boot.repo;

import com.spring.boot.model.Product;
import com.spring.boot.model.ProductImage;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Repository
public interface ProductRepo extends JpaRepository<Product, UUID> {
    List<Product> findByStore_Id(UUID id);
    Optional<Product> findByName(String name);
    Optional<Product> findByIdAndStore_Id(UUID id,UUID storeId);
    Optional<List<Product>> findByCategory_IdAndStore_Id(UUID categoryId,UUID storeId);

    List<Product> findByNameStartingWithAndStore_Id(String name, UUID storeId);

    Integer countByStoreId(UUID storeId);

}
