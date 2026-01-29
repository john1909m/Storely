package com.spring.boot.mapper;

import com.spring.boot.dto.VendorDto;
import com.spring.boot.model.Vendor;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.Mappings;

@Mapper(componentModel = "spring")
public interface VendorMapper {
    @Mapping(source = "role",target = "role")
    @Mapping(source = "user.id",target = "userId")
    VendorDto toVendorDto(Vendor vendor);

    @Mapping(source = "role",target = "role")
    @Mapping(source = "userId",target = "user.id")
    Vendor toVendorEntity(VendorDto vendorDto);
}
