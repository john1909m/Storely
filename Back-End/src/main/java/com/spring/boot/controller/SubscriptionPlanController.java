package com.spring.boot.controller;

import com.spring.boot.dto.SubscriptionPlanDto;
import com.spring.boot.model.SubscriptionPlan;
import com.spring.boot.service.SubscriptionPlanService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.net.URI;
import java.net.URISyntaxException;
import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/subscription-plan")
public class SubscriptionPlanController {
    private SubscriptionPlanService subscriptionPlanService;
    @Autowired
    public void setSubscriptionPlanService(SubscriptionPlanService subscriptionPlanService) {
        this.subscriptionPlanService = subscriptionPlanService;
    }


    @GetMapping("/get/all")
    public ResponseEntity<List<SubscriptionPlanDto>> getAllSubscriptionPlan() {
        return ResponseEntity.ok(subscriptionPlanService.findAllPlans());
    }

    @GetMapping("/get/{planId}")
    @PreAuthorize("hasAnyRole('ADMIN','VENDOR')")
    public ResponseEntity<SubscriptionPlanDto> getSubscriptionPlan(@PathVariable("planId") UUID planId) {
        return ResponseEntity.ok(subscriptionPlanService.getSubscriptionPlanById(planId));
    }

    @PostMapping("/add")
    @PreAuthorize("hasAnyRole('ADMIN','VENDOR')")
    public ResponseEntity<SubscriptionPlanDto> addSubscriptionPlan(@RequestBody SubscriptionPlanDto subscriptionPlanDto) throws URISyntaxException {
        return ResponseEntity.created(new URI("/subscription-plan/add")).body(subscriptionPlanService.addSubscriptionPlan(subscriptionPlanDto));
    }

    @PutMapping("/update")
    @PreAuthorize("hasAnyRole('ADMIN','VENDOR')")
    public ResponseEntity<SubscriptionPlanDto> updateSubscriptionPlan(@RequestBody SubscriptionPlanDto subscriptionPlanDto) {
        return ResponseEntity.ok(subscriptionPlanService.updateSubscriptionPlan(subscriptionPlanDto));
    }

    @DeleteMapping("/delete/{id}")
    @PreAuthorize("hasAnyRole('ADMIN')")
    public ResponseEntity<Void> deleteSubscriptionPlan(@PathVariable UUID id) {
        subscriptionPlanService.deleteSubscriptionPlan(id);
        return ResponseEntity.noContent().build();

    }
}
