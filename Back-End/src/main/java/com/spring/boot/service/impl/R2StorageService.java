package com.spring.boot.service.impl;

import com.spring.boot.config.R2Config;
import lombok.AllArgsConstructor;
import lombok.NoArgsConstructor;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;
import software.amazon.awssdk.core.sync.RequestBody;
import software.amazon.awssdk.services.s3.S3Client;
import software.amazon.awssdk.services.s3.model.PutObjectRequest;

@Service
@RequiredArgsConstructor
@AllArgsConstructor
public class R2StorageService {

    private S3Client s3Client;
    private R2Config r2Config;
    @Autowired
    public R2StorageService(R2Config r2Config, S3Client s3Client) {
        this.s3Client = s3Client;
        this.r2Config = r2Config;
    }

    public String uploadFile(String key, MultipartFile file) {
        try {
            PutObjectRequest request = PutObjectRequest.builder()
                    .bucket(r2Config.getBucket())
                    .key(key)
                    .contentType(file.getContentType())
                    .build();

            s3Client.putObject(request, RequestBody.fromBytes(file.getBytes()));

            return r2Config.getPublicUrl() + "/" + key;
        } catch (Exception e) {
            e.printStackTrace();
            throw new RuntimeException("upload.failed");
        }
    }


}
