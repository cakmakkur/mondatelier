package com.cakmak.mondatelier.Service.auth;

import com.cakmak.mondatelier.Exception.*;
import com.cakmak.mondatelier.Model.Profile;
import com.cakmak.mondatelier.Model.User;
import com.cakmak.mondatelier.Repository.CountryRepository;
import com.cakmak.mondatelier.Repository.ProfileRepository;
import com.cakmak.mondatelier.Repository.UserRepository;
import com.cakmak.mondatelier.converter.DTOMappers;
import com.cakmak.mondatelier.converter.UserTypesConverter;
import com.cakmak.mondatelier.dto.SignupDTO;
import com.cakmak.mondatelier.dto.auth.LoginDTO;
import com.cakmak.mondatelier.dto.auth.LoginResponse;
import com.cakmak.mondatelier.util.SanitizeInput;
import jakarta.transaction.Transactional;
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
        user.setEmail(SanitizeInput.sanitize(signupDTO.email()));
        user.setPassword(passwordEncoder.encode(signupDTO.password()));
        user.setUserType(new UserTypesConverter().convertToEntityAttribute(signupDTO.userType()));
        user.setIsActive(false);
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
        user.setIsActive(false);
        profileRepository.save(profile);

        // send verification email.
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
                authenticatedUser.getProfile().getId()
        );
    }

    @Transactional
    public LoginResponse verify (LoginDTO input) {
        // check token for validity
        User user;
        if (userRepository.findByEmail(SanitizeInput.sanitize(input.email())).isPresent()) {
            user = userRepository.findByEmail(SanitizeInput.sanitize(input.email())).get();
            user.setIsActive(true);
            user.getProfile().setActive(true);
            userRepository.save(user);
            return authenticate(input);
        } else {
            // log error here
            throw new RuntimeException("Error verifying the account");
        }
    }
}