package com.spring.boot.model;

import com.spring.boot.enums.SubscriptionStatus;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalDateTime;

@Entity
@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Table(name = "vendor_subscriptions")
public class VendorSubscription {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private LocalDateTime startTime;
    private LocalDateTime endTime;

    @Enumerated(EnumType.STRING)
    private SubscriptionStatus status;
    // ACTIVE, EXPIRED, CANCELED, PENDING

    private Boolean autoRenew = false;

    @ManyToOne
    @JoinColumn(name = "vendor_id", nullable = false)
    private Vendor vendor;


    @ManyToOne
    @JoinColumn(name = "plan_id", nullable = false)
    private SubscriptionPlan subscriptionPlan;

}
