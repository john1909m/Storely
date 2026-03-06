package com.spring.boot.repo;

import com.spring.boot.model.Governorate;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface GovernorateRepo extends JpaRepository<Governorate,Long> {
}
