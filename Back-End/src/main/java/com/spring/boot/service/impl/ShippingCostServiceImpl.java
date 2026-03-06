package com.spring.boot.service.impl;

import com.spring.boot.dto.ShippingCostDto;
import com.spring.boot.dto.ShippingCostItemDto;
import com.spring.boot.dto.ShippingCostRequestDto;
import com.spring.boot.mapper.ShippingCostMapper;

import com.spring.boot.model.Governorate;
import com.spring.boot.model.ShippingCost;
import com.spring.boot.model.Store;
import com.spring.boot.repo.GovernorateRepo;
import com.spring.boot.repo.ShippingCostRepo;
import com.spring.boot.repo.StoreRepo;
import com.spring.boot.service.ShippingCostService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class ShippingCostServiceImpl implements ShippingCostService {

    private final ShippingCostRepo shippingCostRepo;
    private final ShippingCostMapper shippingCostMapper;
    private final StoreRepo storeRepo;
    private final GovernorateRepo governorateRepo;


    @Override
    public ShippingCostDto updateShippingCost(ShippingCostDto shippingCostDto) {
        Optional<ShippingCost> existing=
                shippingCostRepo.findByStoreIdAndGovernorateId(
                        shippingCostDto.getStoreId(), shippingCostDto.getGovernorateId()
                );
        ShippingCost shippingCost;
        if (existing.isPresent()) {
            shippingCost=existing.get();
            shippingCost.setPrice(shippingCostDto.getPrice());
        }else {
          shippingCost=shippingCostMapper.toEntity(shippingCostDto);
        }
        shippingCost=shippingCostRepo.save(shippingCost);
        return shippingCostMapper.toDto(shippingCost);
    }

    @Override
    public List<ShippingCostDto> findStoreShippingCostsByStoreId(UUID storeId) {
        return shippingCostRepo
                .findByStoreId(storeId)
                .stream().map(shippingCostMapper::toDto).collect(Collectors.toList());
    }

    @Override
    @Transactional
    public void saveShippingCosts(ShippingCostRequestDto request) {

        Store store = storeRepo.findById(request.getStoreId())
                .orElseThrow(() -> new RuntimeException("Store not found"));

        // delete old shipping costs
        shippingCostRepo.deleteByStoreId(store.getId());

        for (ShippingCostItemDto item : request.getShippingCosts()) {

            Governorate governorate = governorateRepo
                    .findById(item.getGovernorateId())
                    .orElseThrow(() -> new RuntimeException("Governorate not found"));

            ShippingCost shippingCost = new ShippingCost();

            shippingCost.setStore(store);
            shippingCost.setGovernorate(governorate);
            shippingCost.setPrice(item.getPrice());

            shippingCostRepo.save(shippingCost);
        }
    }
}
