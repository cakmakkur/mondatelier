package com.cakmak.mondatelier.dto;

public record ArtworkDTO (
    String id,
    String title,
    String profileId,
    String artCategory,
    Boolean salable,
    Integer price,
    Integer releaseYear,
    String dimensions,
    Integer duration,
    String[] artTypes,
    String mediaType
) {}
