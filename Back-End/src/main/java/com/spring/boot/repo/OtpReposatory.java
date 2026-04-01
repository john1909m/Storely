package com.spring.boot.repo;

import com.spring.boot.model.Otp;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;
import java.util.UUID;

@Repository
public interface OtpReposatory extends JpaRepository<Otp, UUID> {
    Optional<Otp> findByEmail(String email);

    void deleteByEmail(String email);
}
