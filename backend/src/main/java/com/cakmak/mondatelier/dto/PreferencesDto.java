package com.cakmak.mondatelier.dto;

import jakarta.validation.constraints.NotNull;

public record PreferencesDto(
        Long id,
        @NotNull
        String profileId,
        String preferredCountry,
        String preferredCity,
        Boolean animations,
        String language,
        Boolean notifications
) {
}
