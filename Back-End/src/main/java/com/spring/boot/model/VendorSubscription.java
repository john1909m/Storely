package com.spring.boot.model;

import com.spring.boot.enums.SubscriptionStatus;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.UUID;

@Entity
@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Table(name = "vendor_subscriptions")
public class VendorSubscription {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    private LocalDate startDate;
    private LocalDate endDate;

    private String billingCycle;


    @Enumerated(EnumType.STRING)
    private SubscriptionStatus status;
    // ACTIVE, EXPIRED, CANCELED, PENDING

    private Boolean autoRenew = false;

    private Boolean analytics = false;

    @ManyToOne
    @JoinColumn(name = "vendor_id", nullable = false)
    private Vendor vendor;


    @ManyToOne
    @JoinColumn(name = "plan_id", nullable = false)
    private SubscriptionPlan subscriptionPlan;

}
