package com.spring.boot.mapper;

import com.spring.boot.dto.AdminDto;
import com.spring.boot.model.Admin;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

@Mapper(componentModel = "spring")
public interface AdminMapper {
    @Mapping(source = "user.id",target = "userId")
    AdminDto toAdminDto(Admin admin);

    @Mapping(source = "userId",target = "user.id")
    Admin toAdminEntity(AdminDto adminDto);
}
