package com.spring.boot.dto;

import lombok.Getter;
import lombok.RequiredArgsConstructor;
import lombok.Setter;

import java.time.LocalDateTime;
import java.util.UUID;

@Getter
@Setter
@RequiredArgsConstructor
public class UserDto {
    private UUID id;
    private String name;
    private String email;
    private String role="VENDOR";
    private String password;
    private String phoneNumber;
    private LocalDateTime createdAt=LocalDateTime.now();

    private VendorDto vendorDto;
    private AdminDto adminDto;
    private CustomerDto customerDto;
}
