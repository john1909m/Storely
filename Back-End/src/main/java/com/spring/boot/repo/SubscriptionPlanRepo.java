package com.spring.boot.repo;

import com.spring.boot.model.SubscriptionPlan;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface SubscriptionPlanRepo extends JpaRepository<SubscriptionPlan,Long> {

}
