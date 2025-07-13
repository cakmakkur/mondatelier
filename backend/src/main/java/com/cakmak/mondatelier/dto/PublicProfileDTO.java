package com.cakmak.mondatelier.dto;

public record PublicProfileDTO(
    String id,
    int profileType,
    String profileName,
    String firstname,
    String lastname,
    String bio,
    String personalWebsite,
    String country,
    String bannerPath,
    String profilePicturePath
) {}
