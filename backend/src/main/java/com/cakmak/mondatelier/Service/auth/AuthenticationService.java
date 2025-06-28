package com.cakmak.mondatelier.Service.auth;

import com.cakmak.mondatelier.Model.User;
import com.cakmak.mondatelier.Repository.UserRepository;
import com.cakmak.mondatelier.dto.auth.UserAuthDTO;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
public class AuthenticationService {
    private final UserRepository userRepository;

    private final PasswordEncoder passwordEncoder;

    private final AuthenticationManager authenticationManager;

    public AuthenticationService(
            UserRepository userRepository,
            AuthenticationManager authenticationManager,
            PasswordEncoder passwordEncoder
    ) {
        this.authenticationManager = authenticationManager;
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
    }

    public User signup(UserAuthDTO input) {
        User user = new User();
        user.setEmail(input.email());
        user.setPassword(passwordEncoder.encode(input.password()));
        return userRepository.save(user);
    }

    public User authenticate(UserAuthDTO input) {
        authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(
                        input.email(),
                        input.password()
                )
        );

        return userRepository.findByEmail(input.email())
                .orElseThrow();
    }
}