package com.spring.boot.dto;

import lombok.Getter;
import lombok.RequiredArgsConstructor;
import lombok.Setter;

import java.time.LocalDateTime;

@Getter
@Setter
@RequiredArgsConstructor
public class VendorDto{

    private Long id;
    private String name;
    private String email;
    private String password;
    private String phoneNumber;
    private String role = "VENDOR";
    private LocalDateTime createdAt=LocalDateTime.now();
    private Long userId;
}
