package com.cakmak.mondatelier.util;

import io.github.bucket4j.*;
import jakarta.servlet.http.HttpServletRequest;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Component;
import org.springframework.web.servlet.HandlerInterceptor;

import java.io.IOException;
import java.time.Duration;
import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;

@Component
public class RateLimitInterceptor implements HandlerInterceptor {

    private final Map<String, Bucket> cache = new ConcurrentHashMap<>();

    private Bucket createNewBucket() {
        // Example: 100 requests per minute
        Bandwidth limit = Bandwidth.classic(100, Refill.greedy(100, Duration.ofMinutes(1)));
        return Bucket.builder().addLimit(limit).build();
    }

    private Bucket resolveBucket(String ip) {
        return cache.computeIfAbsent(ip, k -> createNewBucket());
    }

    @Override
    public boolean preHandle(HttpServletRequest request,
                             jakarta.servlet.http.HttpServletResponse response,
                             Object handler) throws IOException {

        String ip = request.getRemoteAddr();
        Bucket bucket = resolveBucket(ip);

        // New API in 8.x
        ConsumptionProbe probe = bucket.tryConsumeAndReturnRemaining(1);

        if (probe.isConsumed()) {
            // request allowed
            response.addHeader("X-Rate-Limit-Remaining", String.valueOf(probe.getRemainingTokens()));
            return true;
        } else {
            // request rejected
            response.setStatus(HttpStatus.TOO_MANY_REQUESTS.value());
            response.getWriter().write("Too many requests - try again later.");
            response.addHeader("X-Rate-Limit-Retry-After-Millis",
                    String.valueOf(probe.getNanosToWaitForRefill() / 1_000_000));
            return false;
        }
    }
}

