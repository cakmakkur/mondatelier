package com.cakmak.mondatelier.dto.auth;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

public record LoginDTO(
        @NotBlank
        @Email
        @Size(max = 25)
        String email,
        @NotBlank
        @Size(min = 5, max = 25)
        String password
) {
}
