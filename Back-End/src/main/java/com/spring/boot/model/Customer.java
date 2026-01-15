package com.spring.boot.model;

import com.spring.boot.enums.Role;
import jakarta.persistence.CascadeType;
import jakarta.persistence.Entity;
import jakarta.persistence.OneToMany;
import jakarta.persistence.OneToOne;
import lombok.Getter;
import lombok.RequiredArgsConstructor;
import lombok.Setter;

import java.util.List;

@Entity
@Getter
@Setter
@RequiredArgsConstructor
public class Customer extends User{
    public Customer() {
        super.setRole(Role.CUSTOMER);
    }
    @OneToMany(mappedBy = "customer",cascade = CascadeType.ALL)
    private List<Order> orders;
}
