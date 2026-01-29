package com.spring.boot.model;

import com.spring.boot.enums.Role;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.RequiredArgsConstructor;
import lombok.Setter;

import java.time.LocalDateTime;

@Entity
@Getter
@Setter
@RequiredArgsConstructor
@Table(name = "users")
public class User {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String name;

    private String email;

    private String phoneNumber;

    private String password;

    private LocalDateTime createdAt=LocalDateTime.now();

    @Enumerated(EnumType.STRING)
    private Role role;

    @OneToOne(mappedBy = "user",fetch = FetchType.EAGER)
    private Vendor vendor;

    @OneToOne(mappedBy = "user",fetch = FetchType.EAGER)
    private Admin admin;

    @OneToOne(mappedBy = "user",fetch = FetchType.EAGER)
    private Customer customer;

}
