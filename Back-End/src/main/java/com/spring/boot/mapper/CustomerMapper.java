package com.spring.boot.mapper;

import com.spring.boot.dto.CategoryDto;
import com.spring.boot.dto.CustomerDto;
import com.spring.boot.model.Category;
import com.spring.boot.model.Customer;
import com.spring.boot.model.Store;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

import java.util.List;
import java.util.UUID;

@Mapper(componentModel = "spring")
public interface CustomerMapper {
    @Mapping(target = "storeIds", source = "stores")
    @Mapping(source = "role",target = "role")
    CustomerDto toCustomerDto(Customer customer);

    default List<UUID> mapStoresToIds(List<Store> stores) {
        if (stores == null) return List.of();
        return stores.stream().map(Store::getId).toList();
    }

    @Mapping(target = "stores", ignore = true)
    @Mapping(source = "role",target = "role")
    Customer toCustomerEntity(CustomerDto dto);
}
