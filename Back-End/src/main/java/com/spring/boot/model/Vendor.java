package com.spring.boot.model;

import com.spring.boot.enums.Role;
import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;
import java.util.UUID;

@Entity
@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class Vendor{
    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    private String name;

    private String email;

    private String phoneNumber;

    private String password;

    private LocalDateTime createdAt=LocalDateTime.now();

    @Enumerated(EnumType.STRING)
    private Role role;

    @OneToOne(mappedBy = "vendor")
    private Store store;

    @OneToOne
    @JoinColumn(name = "user_id")
    private User user;

}
