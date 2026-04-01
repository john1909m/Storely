package com.spring.boot.service.impl;

import jakarta.mail.internet.MimeMessage;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.stereotype.Service;

@Service
public class EmailService {
    private final JavaMailSender mailSender;
    public EmailService(JavaMailSender mailSender) {
        this.mailSender = mailSender;
    }

    public void sendEmail(String to, String subject, String body) {
//        SimpleMailMessage message = new SimpleMailMessage();
//        message.setTo(to);
//        message.setSubject(subject);
//        message.setText(body);
//        mailSender.send(message);

        try {
            MimeMessage mimeMessage = mailSender.createMimeMessage();
            MimeMessageHelper helper = new MimeMessageHelper(mimeMessage, true);

            helper.setTo(to);
            helper.setSubject(subject);
            helper.setText(body, true);

//            mimeMessage.setHeader("X-Priority", "3");
//            mimeMessage.setHeader("X-Mailer", "storelyeg@gmail.com");
//            mimeMessage.setHeader("Precedence", "bulk");
//
//            // Set a valid From address (don't use no-reply)
//            helper.setFrom("storely-eg.com");
//            helper.setReplyTo("<mailto:storelyeg@gmail.com>");


            mailSender.send(mimeMessage);

        }catch (Exception e) {
            e.printStackTrace();
        }
    }

}
