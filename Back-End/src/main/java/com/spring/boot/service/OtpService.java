package com.spring.boot.service;

import com.spring.boot.model.Otp;

public interface OtpService {
    void sendOtp(String email);
    boolean verifyOtp(String email, String inputCode);
}
