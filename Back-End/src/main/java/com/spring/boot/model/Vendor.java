package com.spring.boot.model;

import com.spring.boot.enums.Role;
import jakarta.persistence.Entity;
import jakarta.persistence.OneToOne;
import lombok.Getter;
import lombok.RequiredArgsConstructor;
import lombok.Setter;

@Entity
@Getter
@Setter
@RequiredArgsConstructor
public class Vendor extends  User {
    public Vendor() {
        super.setRole(Role.VENDOR);
    }
    @OneToOne(mappedBy = "vendor")
    private Store store;

}
