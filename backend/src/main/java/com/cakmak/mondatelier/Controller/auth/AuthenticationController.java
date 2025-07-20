package com.cakmak.mondatelier.Controller.auth;

import com.cakmak.mondatelier.Service.auth.AuthenticationService;
import com.cakmak.mondatelier.dto.SignupDTO;
import com.cakmak.mondatelier.dto.auth.LoginResponse;
import com.cakmak.mondatelier.dto.auth.LoginDTO;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RequestMapping("/auth")
@RestController
public class AuthenticationController {

    private final AuthenticationService authenticationService;

    public AuthenticationController(AuthenticationService authenticationService) {
        this.authenticationService = authenticationService;
    }

    @PostMapping("/signup")
    public ResponseEntity<String> register(@Valid @RequestBody SignupDTO signupDTO) {
        authenticationService.signup(signupDTO);
        return ResponseEntity.ok("Successfully signed up. Please check your email to verify your account.");
    }

    @PostMapping("/login")
    public ResponseEntity<LoginResponse> authenticate(@Valid @RequestBody LoginDTO userAuthDto) {
        LoginResponse loginResponse = authenticationService.authenticate(userAuthDto);
        return ResponseEntity.ok(loginResponse);
    }

    @PostMapping("/verify")
    public ResponseEntity<LoginResponse> verify(@Valid @RequestBody LoginDTO loginDto) {
        LoginResponse loginResponse = authenticationService.verify(loginDto);
        return ResponseEntity.ok(loginResponse);
    }
}