package com.spring.boot.service.impl;

import com.spring.boot.dto.StorePaymentMethodDto;
import com.spring.boot.mapper.StorePaymentMethodMapper;
import com.spring.boot.model.PaymentMethod;
import com.spring.boot.model.Store;
import com.spring.boot.model.StorePaymentMethod;
import com.spring.boot.repo.PaymentMethodRepo;
import com.spring.boot.repo.StorePaymentMethodRepo;
import com.spring.boot.repo.StoreRepo;
import com.spring.boot.service.StorePaymentMethodService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class StorePaymentMethodServiceImpl implements StorePaymentMethodService {

    private final StorePaymentMethodRepo storePaymentMethodRepo;
    private final StoreRepo storeRepo;
    private final PaymentMethodRepo  paymentMethodRepo;
    private final StorePaymentMethodMapper storePaymentMethodMapper;

    @Override
    public List<StorePaymentMethodDto> getStorePaymentMethods(UUID storeId) {
        return storePaymentMethodRepo.findByStoreId(storeId)
                .stream()
                .map(storePaymentMethodMapper::toDto)
                .toList();
    }

    @Override
    @Transactional
    public List<StorePaymentMethodDto> updateStorePaymentMethods(UUID storeId, List<StorePaymentMethodDto> storePaymentMethodDtos) {

        Store store= storeRepo.findById(storeId).orElse(null);

        storePaymentMethodRepo.deleteByStoreId(storeId);

        List<StorePaymentMethod> storePaymentMethods = storePaymentMethodDtos.stream()
                .map(dto -> {
                    PaymentMethod paymentMethod = paymentMethodRepo.findById(dto.getPaymentMethodId()).orElse(null);

                    StorePaymentMethod storePaymentMethod = new StorePaymentMethod();
                    storePaymentMethod.setStore(store);
                    storePaymentMethod.setPaymentMethod(paymentMethod);
                    storePaymentMethod.setAccountName(dto.getAccountName());
                    storePaymentMethod.setAccountNumber(dto.getAccountNumber());
                    storePaymentMethod.setIsActive(dto.getIsActive());

                    return storePaymentMethod;

                }).toList();
        storePaymentMethodRepo.saveAll(storePaymentMethods);

        return storePaymentMethods.stream().map(storePaymentMethodMapper::toDto).toList();
    }
}
