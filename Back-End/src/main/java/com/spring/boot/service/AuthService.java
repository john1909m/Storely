package com.spring.boot.service;

import com.spring.boot.controller.vm.LoginRequestVM;
import com.spring.boot.controller.vm.LoginResponseVM;
import com.spring.boot.dto.UserDto;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import jakarta.transaction.SystemException;

public interface AuthService {
    void signUp(UserDto userDto) throws SystemException;
    LoginResponseVM login(LoginRequestVM loginRequestVm, HttpServletResponse response) throws SystemException;
    void logout(HttpServletRequest request, HttpServletResponse response);
    void resetPassword(String email,String newPassword) throws SystemException;
}
