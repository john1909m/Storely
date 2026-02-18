package com.spring.boot.controller;

import com.spring.boot.controller.vm.LoginRequestVM;
import com.spring.boot.controller.vm.LoginResponseVM;
import com.spring.boot.dto.UserDto;
import com.spring.boot.service.AuthService;
import com.spring.boot.service.UserService;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
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
    public ResponseEntity<LoginResponseVM> login(@RequestBody @Valid LoginRequestVM loginRequestVM, HttpServletResponse response) throws SystemException{

        return ResponseEntity.ok(authService.login(loginRequestVM, response));
    }

    @PostMapping("/logout")
    public ResponseEntity<String> logout(HttpServletRequest request,
                                         HttpServletResponse response) {

        authService.logout(request, response);
        return ResponseEntity.ok("Logged.out.successfully");
    }



}
