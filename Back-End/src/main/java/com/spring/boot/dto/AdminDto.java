package com.spring.boot.dto;

import com.spring.boot.enums.Role;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import lombok.Getter;
import lombok.RequiredArgsConstructor;
import lombok.Setter;

import java.time.LocalDateTime;
import java.util.UUID;

@Getter
@Setter
@RequiredArgsConstructor
public class AdminDto {
    private UUID id;

    private String name;

    private String email;

    private String phoneNumber;

    private String password;

    private LocalDateTime createdAt=LocalDateTime.now();

    private String role="ADMIN";

    private UUID userId;
}
