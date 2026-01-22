package com.spring.boot.mapper;

import com.spring.boot.dto.AdminDto;
import com.spring.boot.dto.CustomerDto;
import com.spring.boot.dto.VendorDto;
import com.spring.boot.model.Admin;
import com.spring.boot.model.Customer;
import com.spring.boot.model.Vendor;
import org.mapstruct.Mapper;

@Mapper(componentModel = "spring", uses = {StoreMapper.class, OrderMapper.class})
public interface UserMapper {

}
