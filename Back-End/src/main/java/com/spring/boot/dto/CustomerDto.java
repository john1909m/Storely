package com.spring.boot.dto;

import lombok.Getter;
import lombok.RequiredArgsConstructor;
import lombok.Setter;

import java.time.LocalDateTime;
import java.util.List;

@Getter
@Setter
@RequiredArgsConstructor
public class CustomerDto extends UserDto {
    private Long id;

    private String firstName;

    private String lastName;

    private String address;

    private String city;

    private String phoneNumber;

    private String whatsappNumber;

    private LocalDateTime createdDate;

    private List<OrderDto> orders;

}
