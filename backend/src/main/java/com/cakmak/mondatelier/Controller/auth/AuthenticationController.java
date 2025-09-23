package com.cakmak.mondatelier.Controller.auth;

import com.cakmak.mondatelier.Repository.UserRepository;
import com.cakmak.mondatelier.Service.auth.AuthenticationService;
import com.cakmak.mondatelier.Service.auth.JWTService;
import com.cakmak.mondatelier.dto.auth.SignupDTO;
import com.cakmak.mondatelier.dto.auth.LoginResponse;
import com.cakmak.mondatelier.dto.auth.LoginDTO;
import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RequestMapping("/auth")
@RestController
public class AuthenticationController {

    @Value("${security.jwt.refresh-expiration-time}")
    private int refreshExpirationTime;

    private final AuthenticationService authenticationService;
    private final JWTService jwtService;
    private final UserRepository userRepository;

    public AuthenticationController(AuthenticationService authenticationService, UserRepository userRepository, JWTService jwtService) {
        this.authenticationService = authenticationService;
        this.jwtService = jwtService;
        this.userRepository = userRepository;
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

        Cookie refreshCookie = new Cookie("refreshToken", refreshToken);
        refreshCookie.setHttpOnly(true);
        refreshCookie.setSecure(true); // only in production HTTPS
        refreshCookie.setPath("/auth/refresh"); // makes refresh cookie only work on that endpoint
        refreshCookie.setMaxAge(refreshExpirationTime);
        response.addCookie(refreshCookie);

        return ResponseEntity.ok(loginResponse);
    }

    @PostMapping("/logout")
    public ResponseEntity<?> logout(HttpServletResponse response) {
        Cookie refreshCookie = new Cookie("refreshToken", null);
        refreshCookie.setHttpOnly(true);
        refreshCookie.setSecure(false); // only in production HTTPS
        refreshCookie.setPath("/auth/refresh");
        refreshCookie.setMaxAge(0);
        response.addCookie(refreshCookie);

        return ResponseEntity.noContent().build();
    }

    @PostMapping("/refresh")
    public ResponseEntity<LoginResponse> refreshToken(
            HttpServletRequest request) {
        return authenticationService.refresh(request);
    }

}