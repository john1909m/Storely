package com.spring.boot.repo;

import com.spring.boot.model.Product;
import com.spring.boot.model.ProductImage;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface ProductRepo extends JpaRepository<Product,Long> {
    List<Product> findByStore_Id(Long id);
    Optional<Product> findByIdAndStore_Id(Long id,Long storeId);
    Optional<Product> findByCategory_IdAndStore_Id(Long categoryId,Long storeId);

    List<Product> findByNameStartingWithAndStore_Id(String name, Long storeId);
}
