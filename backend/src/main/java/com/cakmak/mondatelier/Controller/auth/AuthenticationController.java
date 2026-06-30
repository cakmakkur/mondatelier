package com.cakmak.mondatelier.Controller.auth;

import com.cakmak.mondatelier.Service.auth.AuthenticationService;
import com.cakmak.mondatelier.Service.auth.JWTService;
import com.cakmak.mondatelier.dto.auth.SignupDTO;
import com.cakmak.mondatelier.dto.auth.LoginResponse;
import com.cakmak.mondatelier.dto.auth.LoginDTO;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.ResponseEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.ResponseCookie;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.time.Duration;

@RequestMapping("/auth")
@RestController
public class AuthenticationController {

    @Value("${security.jwt.refresh-expiration-time}")
    private long refreshExpirationTime;

    @Value("${security.jwt.cookie-secure}")
    private boolean secureCookie;

    private final AuthenticationService authenticationService;
    private final JWTService jwtService;

    public AuthenticationController(AuthenticationService authenticationService, JWTService jwtService) {
        this.authenticationService = authenticationService;
        this.jwtService = jwtService;
    }

    @PostMapping("/signup")
    public ResponseEntity<String> register(@Valid @RequestBody SignupDTO signupDTO) {
        authenticationService.signup(signupDTO);
        return ResponseEntity.ok("Successfully signed up. Please check your email to verify your account.");
    }

    @PostMapping("/login")
    public ResponseEntity<LoginResponse> authenticate(@Valid @RequestBody LoginDTO userAuthDto, HttpServletResponse response) {
        LoginResponse loginResponse = authenticationService.authenticate(userAuthDto);

        String refreshToken = jwtService.generateRefreshToken(userAuthDto.email());

        ResponseCookie refreshCookie = ResponseCookie.from("refreshToken", refreshToken)
                .httpOnly(true)
                .secure(secureCookie)
                .sameSite("Lax")
                .path("/auth")
                .maxAge(Duration.ofMillis(refreshExpirationTime))
                .build();
        response.addHeader(HttpHeaders.SET_COOKIE, refreshCookie.toString());

        return ResponseEntity.ok(loginResponse);
    }

    @PostMapping("/logout")
    public ResponseEntity<?> logout(HttpServletResponse response) {
        ResponseCookie refreshCookie = ResponseCookie.from("refreshToken", "")
                .httpOnly(true)
                .secure(secureCookie)
                .sameSite("Lax")
                .path("/auth")
                .maxAge(Duration.ZERO)
                .build();
        response.addHeader(HttpHeaders.SET_COOKIE, refreshCookie.toString());

        return ResponseEntity.noContent().build();
    }

    @PostMapping("/refresh")
    public ResponseEntity<LoginResponse> refreshToken(
            HttpServletRequest request) {
        return authenticationService.refresh(request);
    }

}
