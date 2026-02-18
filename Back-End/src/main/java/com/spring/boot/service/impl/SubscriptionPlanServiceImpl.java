package com.spring.boot.service.impl;

import com.spring.boot.dto.SubscriptionPlanDto;
import com.spring.boot.mapper.SubscriptionPlanMapper;
import com.spring.boot.model.SubscriptionPlan;
import com.spring.boot.repo.SubscriptionPlanRepo;
import com.spring.boot.service.SubscriptionPlanService;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
public class SubscriptionPlanServiceImpl implements SubscriptionPlanService {
    private SubscriptionPlanRepo subscriptionPlanRepo;
    private SubscriptionPlanMapper subscriptionPlanMapper;



    public SubscriptionPlanServiceImpl(SubscriptionPlanRepo subscriptionPlanRepo,SubscriptionPlanMapper subscriptionPlanMapper) {
        this.subscriptionPlanRepo = subscriptionPlanRepo;
        this.subscriptionPlanMapper = subscriptionPlanMapper;

    }


    @Override
    public List<SubscriptionPlanDto> findAllPlans() {
        return subscriptionPlanRepo.findAll().stream()
                .map(subscriptionPlanMapper::toDto)
                .collect(Collectors.toList());
    }

    @Override
    public SubscriptionPlanDto addSubscriptionPlan(SubscriptionPlanDto subscriptionPlanDto) {
        SubscriptionPlan subscriptionPlan = subscriptionPlanMapper.toEntity(subscriptionPlanDto);
        subscriptionPlanRepo.save(subscriptionPlan);
        return subscriptionPlanMapper.toDto(subscriptionPlan);
    }

    @Override
    public SubscriptionPlanDto updateSubscriptionPlan(SubscriptionPlanDto subscriptionPlanDto) {

        SubscriptionPlan subscriptionPlan = subscriptionPlanMapper.toEntity(subscriptionPlanDto);
        Optional<SubscriptionPlan> planExist=subscriptionPlanRepo.findById(subscriptionPlanDto.getId());
        if(planExist.isEmpty()){
            throw new RuntimeException("Plan.Not.Found");
        }
        subscriptionPlanRepo.save(subscriptionPlan);
        return subscriptionPlanMapper.toDto(subscriptionPlan);
    }

    @Override
    public void deleteSubscriptionPlan(UUID id) {
        Optional<SubscriptionPlan> planExist=subscriptionPlanRepo.findById(id);
        if(planExist.isEmpty()){
            throw new RuntimeException("Plan.Not.Found");
        }
        subscriptionPlanRepo.delete(planExist.get());
    }

    @Override
    public SubscriptionPlanDto getSubscriptionPlanById(UUID id) {
        Optional<SubscriptionPlan> planExist=subscriptionPlanRepo.findById(id);
        if(planExist.isEmpty()){
            throw new RuntimeException("Plan.Not.Found");
        }
        return subscriptionPlanMapper.toDto(planExist.get());
    }
}
