package com.cakmak.mondatelier.Controller.auth;

import com.cakmak.mondatelier.Model.User;
import com.cakmak.mondatelier.Service.auth.AuthenticationService;
import com.cakmak.mondatelier.Service.auth.JWTService;
import com.cakmak.mondatelier.converter.DTOMappers;
import com.cakmak.mondatelier.dto.auth.LoginResponse;
import com.cakmak.mondatelier.dto.auth.UserAuthDTO;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.AuthenticationException;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RequestMapping("/auth")
@RestController
public class AuthenticationController {
    private final JWTService jwtService;

    private final AuthenticationService authenticationService;

    public AuthenticationController(JWTService jwtService, AuthenticationService authenticationService) {
        this.jwtService = jwtService;
        this.authenticationService = authenticationService;
    }

    @PostMapping("/signup")
    public ResponseEntity<User> register(@RequestBody UserAuthDTO registerUserDto) {
        User registeredUser = authenticationService.signup(registerUserDto);

        return ResponseEntity.ok(registeredUser);
    }

    @PostMapping("/login")
    public ResponseEntity<LoginResponse> authenticate(@RequestBody UserAuthDTO userAuthDto) {
        try {
            User authenticatedUser = authenticationService.authenticate(userAuthDto);
            String jwtToken = jwtService.generateToken(authenticatedUser);

            LoginResponse loginResponse = DTOMappers.toLoginResponseDTO(
                    jwtToken,
                    jwtService.getExpirationTime(),
                    authenticatedUser.getId(),
                    authenticatedUser.getProfile().getId()
            );
            return ResponseEntity.ok(loginResponse);
        }
        catch (AuthenticationException e) {
            return ResponseEntity.badRequest().build();
        }
    }
}