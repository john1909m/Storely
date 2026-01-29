package com.spring.boot.service.impl;

import com.spring.boot.dto.UserDto;
import com.spring.boot.dto.VendorDto;
import com.spring.boot.enums.Role;
import com.spring.boot.mapper.UserMapper;
import com.spring.boot.mapper.VendorMapper;
import com.spring.boot.model.User;
import com.spring.boot.model.Vendor;
import com.spring.boot.repo.UserRepo;
import com.spring.boot.repo.VendorRepo;
import com.spring.boot.service.UserService;
import com.spring.boot.service.VendorService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class UserServiceImpl implements UserService {
    private final UserMapper userMapper;
    private final UserRepo userRepo;
    private final VendorMapper vendorMapper;
    private PasswordEncoder passwordEncoder;
    private VendorService vendorService;
    private VendorRepo vendorRepo;

    @Autowired
    public UserServiceImpl(UserMapper userMapper, UserRepo userRepo,
                           PasswordEncoder passwordEncoder,
                           VendorService vendorService,
                           VendorRepo vendorRepo,
                           VendorMapper vendorMapper) {
        this.userMapper = userMapper;
        this.userRepo = userRepo;
        this.passwordEncoder = passwordEncoder;
        this.vendorService = vendorService;
        this.vendorRepo = vendorRepo;
        this.vendorMapper = vendorMapper;
    }

    @Override
    public List<UserDto> getAllUsers() {
        return List.of();
    }

    @Override
    public UserDto getUserById(Long id) {
        return null;
    }

    @Override
    public UserDto getUserByName(String name) {
        return null;
    }

    @Override
    public UserDto addUser(UserDto userDto) {
        User user=userMapper.toEntity(userDto);
        user.setPassword(passwordEncoder.encode(user.getPassword()));
        user.setRole(Role.VENDOR);
        User savedUser=userRepo.saveAndFlush(user);
        UserDto userResponse=userMapper.toDto(savedUser);
        Vendor vendor= new Vendor();
        vendor.setName(savedUser.getName());
        vendor.setEmail(savedUser.getEmail());
        vendor.setPassword(savedUser.getPassword());
        vendor.setPhoneNumber(savedUser.getPhoneNumber());
        vendor.setRole(savedUser.getRole());
        vendor.setUser(savedUser);



        VendorDto vendorDto=vendorService.addVendor(vendorMapper.toVendorDto(vendor));
        userDto.setVendorDto(vendorDto);
        userResponse.setVendorDto(vendorDto);


        return userResponse;
    }

    @Override
    public UserDto updateUser(UserDto userDto) {
        return null;
    }

    @Override
    public void deleteUser(Long id) {

    }
}
