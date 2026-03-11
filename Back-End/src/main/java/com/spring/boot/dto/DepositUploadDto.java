package com.spring.boot.dto;

import lombok.Getter;
import lombok.Setter;
import org.springframework.web.multipart.MultipartFile;

import java.util.UUID;

@Getter
@Setter
public class DepositUploadDto {
    private UUID orderId;
    private MultipartFile screenshot;
}
