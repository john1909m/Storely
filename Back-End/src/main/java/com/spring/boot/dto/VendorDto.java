package com.spring.boot.dto;

import lombok.Getter;
import lombok.RequiredArgsConstructor;
import lombok.Setter;

import java.time.LocalDateTime;
import java.util.UUID;

@Getter
@Setter
@RequiredArgsConstructor
public class VendorDto{

    private UUID id;
    private String name;
    private String email;
    private String password;
    private String phoneNumber;
    private String role = "VENDOR";
    private LocalDateTime createdAt=LocalDateTime.now();
    private UUID userId;
}
