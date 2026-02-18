package com.spring.boot.service.impl;
import com.spring.boot.helper.MessageResponse;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.support.ResourceBundleMessageSource;
import org.springframework.stereotype.Component;

import java.util.Locale;

@Component
public class BundleMessageService {

    @Autowired
    private ResourceBundleMessageSource messageSource;

    public String getMessageAr(String key){
        try {
            Locale arLocale = new Locale("ar");
            return messageSource.getMessage(key, null, arLocale);
        } catch (Exception e) {
            return key; // لو مش لاقيها، يرجع الكود نفسه
        }
    }
    public String getMessageEn(String key){
        try {
            Locale enLocale = new Locale("en");
            return messageSource.getMessage(key, null, enLocale);
        } catch (Exception e) {
            return key; // لو مش لاقيها، يرجع الكود نفسه
        }

    }
    public MessageResponse getMessage(String key){
        return new MessageResponse(
                getMessageEn(key));
    }


}
