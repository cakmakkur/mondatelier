package com.cakmak.mondatelier.Service.auth;

import com.cakmak.mondatelier.Exception.types.AccountInactiveException;
import com.cakmak.mondatelier.Exception.types.EmailAlreadyExistsException;
import com.cakmak.mondatelier.Exception.types.EmailNotFoundException;
import com.cakmak.mondatelier.Exception.types.ProfileNameAlreadyExistsException;
import com.cakmak.mondatelier.Model.Profile;
import com.cakmak.mondatelier.Model.User;
import com.cakmak.mondatelier.Repository.CountryRepository;
import com.cakmak.mondatelier.Repository.ProfileRepository;
import com.cakmak.mondatelier.Repository.UserRepository;
import com.cakmak.mondatelier.converter.DTOMappers;
import com.cakmak.mondatelier.dto.auth.SignupDTO;
import com.cakmak.mondatelier.dto.auth.LoginDTO;
import com.cakmak.mondatelier.dto.auth.LoginResponse;
import com.cakmak.mondatelier.util.SanitizeInput;
import io.jsonwebtoken.JwtException;
import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.transaction.Transactional;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.AuthenticationException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.Optional;


@Service
public class AuthenticationService {
    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final AuthenticationManager authenticationManager;
    private final CountryRepository countryRepository;
    private final ProfileRepository profileRepository;
    private final JWTService jwtService;

    public AuthenticationService(
            UserRepository userRepository,
            AuthenticationManager authenticationManager,
            PasswordEncoder passwordEncoder,
            CountryRepository countryRepository,
            ProfileRepository profileRepository,
            JWTService jwtService) {
        this.authenticationManager = authenticationManager;
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
        this.countryRepository = countryRepository;
        this.profileRepository = profileRepository;
        this.jwtService = jwtService;
    }

    @Transactional
    public void signup(SignupDTO signupDTO) {
        // create user
        User user = new User();
        Optional<User> existingUser = userRepository.findByEmail(SanitizeInput.sanitize(signupDTO.email()));
        if (existingUser.isPresent()) {
            if (existingUser.get().getIsActive()) {
                throw new EmailAlreadyExistsException();
            } else {
                // see why inactive...
            }
        }
        user.setEmail(signupDTO.email());
        user.setPassword(passwordEncoder.encode(signupDTO.password()));
        user.setUserType(signupDTO.userType());
        user.setIsActive(true);
        userRepository.save(user);

        // create profile
        Profile profile = new Profile();
        if (profileRepository.findByProfileName(SanitizeInput.sanitize(signupDTO.profileName())).isPresent()) {
            throw new ProfileNameAlreadyExistsException();
        };
        profile.setProfileName(SanitizeInput.sanitize(signupDTO.profileName()));
        profile.setFirstname(SanitizeInput.sanitize(signupDTO.firstname()));
        profile.setLastname(SanitizeInput.sanitize(signupDTO.lastname()));
        profile.setDob(signupDTO.dob());
        profile.setShowRealName(signupDTO.showRealName());
        profile.setCountry(countryRepository.findByName(SanitizeInput.sanitize(signupDTO.country())));
        profile.setUser(user);
        profile.setType(signupDTO.profileType());
        profileRepository.save(profile);
        user.setProfile(profile);

        // implement logic + send verification email to verify the account in x days
    }

    public LoginResponse authenticate(LoginDTO input) throws AuthenticationException {
        authenticationManager.authenticate(
            new UsernamePasswordAuthenticationToken(
                    input.email(),
                    input.password()
            )
        );
        User authenticatedUser = userRepository.findByEmail(input.email()).orElseThrow(EmailNotFoundException::new);
        if (!authenticatedUser.getIsActive()) {
            throw new AccountInactiveException();
        }
        String jwtToken = jwtService.generateToken(authenticatedUser);
        return DTOMappers.toLoginResponseDTO(
                jwtToken,
                jwtService.getExpirationTime(),
                authenticatedUser.getId(),
                authenticatedUser.getProfile().getId(),
                authenticatedUser.getProfile().getType().toString(),
                authenticatedUser.getUserType().toString()
        );
    }

    public ResponseEntity<LoginResponse> refresh(HttpServletRequest request) {
        Cookie[] cookies = request.getCookies();
        if (cookies == null) {
            return ResponseEntity.status(401).build();
        }

        String refreshToken = null;
        for (Cookie cookie : cookies) {
            if ("refreshToken".equals(cookie.getName())) {
                refreshToken = cookie.getValue();
            }
        }

        if (refreshToken == null) {
            return ResponseEntity.status(401).build();
        }

        final User user;
        try {
            String email = jwtService.extractRefreshUsername(refreshToken);
            user = userRepository.findByEmail(email).orElse(null);
            if (user == null || !jwtService.isRefreshTokenValid(refreshToken, user)) {
                return ResponseEntity.status(401).build();
            }
        } catch (JwtException | IllegalArgumentException exception) {
            return ResponseEntity.status(401).build();
        }

        String newAccessToken = jwtService.generateToken(user);

        LoginResponse loginResponse = DTOMappers.toLoginResponseDTO(
                newAccessToken,
                jwtService.getExpirationTime(),
                user.getId(),
                user.getProfile().getId(),
                user.getProfile().getType().toString(),
                user.getUserType().toString()
        );

        return ResponseEntity.ok(loginResponse);
    }

}
