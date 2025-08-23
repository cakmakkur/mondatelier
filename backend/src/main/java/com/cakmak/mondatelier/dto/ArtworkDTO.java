package com.cakmak.mondatelier.dto;

import com.cakmak.mondatelier.Model.art.ArtworkMedia;

import java.util.List;

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
    String mediaType,
    List<MediaDTO> medias
) {}
