package com.cakmak.mondatelier.dto.auth;

import com.cakmak.mondatelier.enums.ProfileTypes;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

import java.util.Date;

public record SignupDTO(
        @Email
        @NotBlank
        @Size(min = 6, max = 25)
        String email,
        @NotBlank
        @Size(min = 6, max = 25)
        String password,
        @Max(3)
        Integer userType,
        @Size(max = 25)
        String firstname,
        @Size(max = 25)
        String lastname,
        @Size(max = 25)
        String profileName,
        Date dob,
        @Size(max = 25)
        String country,
        Boolean showRealName,
        ProfileTypes profileType
) {}
