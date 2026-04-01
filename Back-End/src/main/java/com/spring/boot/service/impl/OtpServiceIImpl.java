package com.spring.boot.service.impl;

import com.spring.boot.model.Otp;
import com.spring.boot.repo.OtpReposatory;
import com.spring.boot.service.OtpService;
import org.springframework.stereotype.Service;

@Service
public class OtpServiceIImpl implements OtpService {

    private final OtpReposatory otpReposatory;
    private final EmailService emailService;

    public OtpServiceIImpl(EmailService emailService, OtpReposatory otpReposatory) {
        this.emailService = emailService;
        this.otpReposatory = otpReposatory;
    }

    @Override
    public void sendOtp(String email) {
        otpReposatory.deleteByEmail(email);

        String code =String.valueOf((int)(Math.random() * 900000) + 100000);

        Otp otp = new Otp();
        otp.setEmail(email);
        otp.setOtp(code);
        otp.setUsed(false);
        otp.setExpiryTime(System.currentTimeMillis() + (5 * 60 * 1000)); //5 minutes

        otpReposatory.save(otp);

        String html= """
                    <div style="font-family: Arial, sans-serif; max-width: 500px; margin: auto; padding: 20px; text-align: center; border: 1px solid #eee; border-radius: 10px;">
                
                                        <h2 style="color:#333;">Password Reset Request 🔐</h2>
                
                                        <p style="color:#555; font-size:14px;">
                                          We received a request to reset your password for your Storely account.
                                        </p>
                
                                        <p style="color:#555; font-size:14px;">
                                          Please use the verification code below to continue:
                                        </p>
                
                                        <h1 style="letter-spacing:6px; color:#000;">%s</h1>
                
                                        <p style="color:#777; font-size:13px;">
                                          This code is valid for the next <b>5 minutes</b>.
                                        </p>
                
                                        <p style="color:#555; font-size:14px;">
                                          If you did not request this action, you can safely ignore this email. Your account will remain secure.
                                        </p>
                
                                        <hr style="margin:20px 0;">
                
                                        <p style="font-size:12px; color:#999;">
                                          This email was sent by Storely platform to help you manage your account securely.
                                        </p>
                
                                        <p style="font-size:12px; color:#bbb;">
                                          Please do not share this code with anyone for security reasons.
                                        </p>
                
                                      </div>
                """.formatted(code);


        emailService.sendEmail(email, "Password Reset Confirmation ⚠️", html);

    }

    @Override
    public boolean verifyOtp(String email, String inputCode) {
        Otp otp =otpReposatory.findByEmail(email).orElseThrow(()-> new RuntimeException("otp.not.found"));
        if (otp .isUsed()) return false;

        if (System.currentTimeMillis() > otp.getExpiryTime()) return false;

        if (!otp.getOtp().equals(inputCode)) return false;

        otp.setUsed(true);

        otpReposatory.save(otp);
        return true;
    }
}
