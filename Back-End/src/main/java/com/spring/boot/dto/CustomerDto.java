package com.spring.boot.dto;

import com.spring.boot.enums.Role;
import lombok.Getter;
import lombok.RequiredArgsConstructor;
import lombok.Setter;

import java.time.LocalDateTime;
import java.util.List;

@Getter
@Setter
@RequiredArgsConstructor
public class CustomerDto {
    private Long id;

    private String firstName;

    private String lastName;

    private String address;

    private String city;

    private String role="CUSTOMER";

    private String phoneNumber;

    private String whatsappNumber;

    private LocalDateTime createdDate;

    private List<Long> storeIds;

}
