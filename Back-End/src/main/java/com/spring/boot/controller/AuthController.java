package com.spring.boot.controller;

import com.spring.boot.controller.vm.LoginRequestVM;
import com.spring.boot.controller.vm.LoginResponseVM;
import com.spring.boot.dto.ResetPasswordDto;
import com.spring.boot.dto.SendOtpDto;
import com.spring.boot.dto.UserDto;
import com.spring.boot.service.AuthService;
import com.spring.boot.service.OtpService;
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
    @Autowired
    private OtpService otpService;



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

    @PostMapping("/send-otp")
    public void sendOtp(@RequestBody SendOtpDto dto){
        otpService.sendOtp(dto.getEmail());
    }



    @PostMapping("/reset-password")
    public String resetPassword(@RequestBody ResetPasswordDto dto) throws SystemException {
        boolean valid=otpService.verifyOtp(dto.getEmail(),dto.getCode());

        if(!valid){
            throw new RuntimeException("Invalid.OTP");

        }

        authService.resetPassword(dto.getEmail(), dto.getNewPassword());
        return "Password reset successfully";
    }


}
