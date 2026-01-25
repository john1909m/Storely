package com.spring.boot.repo;

import com.spring.boot.model.Category;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface CategoryRepo extends JpaRepository<Category,Long> {
    List<Category> findByStore_Id(Long storeId);
    Optional<Category> findByNameAndStore_Id(String name, Long storeId);
}
