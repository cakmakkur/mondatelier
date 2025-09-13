package com.cakmak.mondatelier.util;

import com.cakmak.mondatelier.Exception.UserNotFoundException;
import com.cakmak.mondatelier.Model.User;
import com.cakmak.mondatelier.Repository.UserRepository;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Component;

@Component
public class AuthUtil {

    private static UserRepository userRepository;

    public AuthUtil(UserRepository repo) {
        userRepository = repo;
    }

    public static User getCurrentUser() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        if (authentication == null) {
            return null;
        }

        Object principal = authentication.getPrincipal();
        String email;

        if (principal instanceof UserDetails userDetails) {
            email = userDetails.getUsername();
        } else {
            email = principal.toString();
        }

        return userRepository.findByEmail(email)
                .orElseThrow(UserNotFoundException::new);
    }
}
