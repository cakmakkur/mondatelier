package com.cakmak.mondatelier.dto;

public record PublicProfileDTO(
    String id,
    Integer profileType,
    String profileName,
    String firstname,
    String lastname,
    String bio,
    String personalWebsite,
    String country,
    String bannerPath,
    String profilePicturePath,
    Boolean showRealName
) {}
