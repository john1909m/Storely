package com.spring.boot.model;

import com.spring.boot.enums.Role;
import jakarta.persistence.Entity;
import lombok.Getter;
import lombok.RequiredArgsConstructor;
import lombok.Setter;

@Entity
@Getter
@Setter
@RequiredArgsConstructor
public class Admin extends User {
    public Admin() {
        super.setRole(Role.ADMIN);
    }

}
