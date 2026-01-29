package com.spring.boot.service.impl;

import com.spring.boot.config.jwt.TokenHandler;
import com.spring.boot.controller.vm.LoginRequestVM;
import com.spring.boot.controller.vm.LoginResponseVM;
import com.spring.boot.dto.AdminDto;
import com.spring.boot.dto.UserDto;
import com.spring.boot.dto.VendorDto;
import com.spring.boot.mapper.AdminMapper;
import com.spring.boot.mapper.UserMapper;
import com.spring.boot.mapper.VendorMapper;
import com.spring.boot.model.User;
import com.spring.boot.repo.UserRepo;
import com.spring.boot.service.AuthService;
import com.spring.boot.service.UserService;
import jakarta.transaction.SystemException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
public class AuthServiceImpl implements AuthService {

    @Autowired
    private AuthenticationManager authenticationManager;

    @Autowired
    private UserService userService;

    @Autowired
    private UserMapper userMapper;

    @Autowired
    private VendorMapper vendorMapper;

    @Autowired
    private AdminMapper adminMapper;

    @Autowired
    private UserRepo userRepo;

    @Autowired
    private TokenHandler tokenHandler;

    @Autowired
    private PasswordEncoder passwordEncoder;


    @Override
    public void signUp(UserDto userDto) throws SystemException {
        userService.addUser(userDto);
    }

    @Override
    public LoginResponseVM login(LoginRequestVM loginRequestVm) throws SystemException {


        User user = userRepo.findByEmail(loginRequestVm.getEmail())
                .orElseThrow(() -> new RuntimeException("User not found"));



        if (!passwordEncoder.matches(loginRequestVm.getPassword(), user.getPassword())) {
            throw new SystemException("invalid.password.error");
        }

        // هنا ممكن تعمل authentication يدوي بدون استدعاء authenticationManager
        UserDto userDto = userMapper.toDto(user);
        userDto.setPassword(null);

        VendorDto vendorDto = null;
        AdminDto adminDto = null;
        if (user.getVendor() != null) {
            vendorDto = vendorMapper.toVendorDto(user.getVendor());
            vendorDto.setPassword(null);
        }
        if (user.getAdmin() != null) {
            adminDto=adminMapper.toAdminDto(user.getAdmin());
            adminDto.setPassword(null);
        }

        // إنشاء token
        String token = tokenHandler.createToken(userDto);

        return new LoginResponseVM(token, userDto, vendorDto,adminDto);
    }
}
