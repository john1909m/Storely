package com.spring.boot.config.rateLimiting;

import com.spring.boot.helper.MessageResponse;
import com.spring.boot.service.impl.BundleMessageService;
import io.github.bucket4j.Bandwidth;
import io.github.bucket4j.Bucket;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.core.annotation.Order;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;
import java.time.Duration;
import java.util.List;
import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;

@Component
@Order(1)
public class RateLimitFilter extends OncePerRequestFilter {

    private final Map<String, Bucket> buckets = new ConcurrentHashMap<>();
    private final BundleMessageService bundleMessageService;

    public RateLimitFilter(BundleMessageService bundleMessageService) {
        this.bundleMessageService = bundleMessageService;
    }


    private static final List<String> RATE_LIMITED_PATHS = List.of(
            "/auth/login",
            "/auth/send-otp",
            "/auth/reset-password"
    );

    private Bucket createBucket() {
        return Bucket.builder()
                .addLimit(Bandwidth.builder()
                        .capacity(5)
                        .refillGreedy(5, Duration.ofMinutes(2))
                        .build())
                .build();
    }

    @Override
    protected void doFilterInternal(HttpServletRequest request,
                                    HttpServletResponse response,
                                    FilterChain filterChain) throws ServletException, IOException {

        String path = request.getRequestURI();

        // لو الـ path مش في القايمة — عدّي عادي
        boolean shouldLimit = RATE_LIMITED_PATHS.stream()
                .anyMatch(path::startsWith);

        if (!shouldLimit) {
            filterChain.doFilter(request, response);
            return;
        }

        // IP + Path عشان كل endpoint عنده bucket منفصل
        String key = request.getRemoteAddr() + ":" + path;
        Bucket bucket = buckets.computeIfAbsent(key, k -> createBucket());

        if (bucket.tryConsume(1)) {
            filterChain.doFilter(request, response);
        } else {
            MessageResponse messageResponse = bundleMessageService.getMessage("too.many.requests");
            response.setStatus(429);
            response.setContentType("application/json");
            response.getWriter().write("{\"message_en\": \"" + messageResponse.getMessage_en() + "\"}");
        }
    }
}