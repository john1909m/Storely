package com.spring.boot.config;

import lombok.RequiredArgsConstructor;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import software.amazon.awssdk.auth.credentials.AwsBasicCredentials;
import software.amazon.awssdk.auth.credentials.StaticCredentialsProvider;
import software.amazon.awssdk.http.apache.ApacheHttpClient;
import software.amazon.awssdk.regions.Region;
import software.amazon.awssdk.services.s3.S3Client;
import software.amazon.awssdk.services.s3.S3Configuration;
import software.amazon.awssdk.http.SdkHttpClient;
import software.amazon.awssdk.http.SdkHttpConfigurationOption;
import software.amazon.awssdk.utils.AttributeMap;

import java.net.URI;
import java.time.Duration;

@Configuration
@RequiredArgsConstructor
public class R2ConfigBeans {

    private final R2Config r2Config;

    @Bean
    public S3Client s3Client() {
        AwsBasicCredentials credentials = AwsBasicCredentials.create(
                r2Config.getAccessKey(),
                r2Config.getSecretKey()
        );

        SdkHttpClient httpClient = ApacheHttpClient.builder()
                .connectionTimeout(Duration.ofSeconds(30))
                .socketTimeout(Duration.ofSeconds(120))
                .connectionAcquisitionTimeout(Duration.ofSeconds(60))
                .maxConnections(50)// Explicit TLS versions
                .build();

        return S3Client.builder()
                .endpointOverride(URI.create("https://" + r2Config.getAccountId() + ".r2.cloudflarestorage.com"))
                .region(Region.of("auto"))
                .credentialsProvider(StaticCredentialsProvider.create(credentials))
                .httpClient(httpClient)
                .serviceConfiguration(S3Configuration.builder()
                        .pathStyleAccessEnabled(true)
                        .chunkedEncodingEnabled(false)  // Required for R2
                        .build())
                .build();
    }
}
