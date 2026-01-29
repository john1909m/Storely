package com.spring.boot.controller;

import com.spring.boot.controller.vm.LoginRequestVM;
import com.spring.boot.controller.vm.LoginResponseVM;
import com.spring.boot.dto.UserDto;
import com.spring.boot.service.AuthService;
import com.spring.boot.service.UserService;
import jakarta.transaction.SystemException;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/auth")
@CrossOrigin(origins = "http://localhost:5174/")
public class AuthController {

    @Autowired
    private AuthService authService;
    @Autowired
    private UserService userService;



    @PostMapping("/signup")
    public ResponseEntity<Void> signUp(@RequestBody @Valid UserDto userDto) throws SystemException {
        authService.signUp(userDto);
//        UserDto savedUser=userService.addUser(userDto);
        return ResponseEntity.ok().build();
    }
    @PostMapping("/login")
    public ResponseEntity<LoginResponseVM> login(@RequestBody @Valid LoginRequestVM loginRequestVM) throws SystemException{
        return ResponseEntity.ok(authService.login(loginRequestVM));
    }



}
