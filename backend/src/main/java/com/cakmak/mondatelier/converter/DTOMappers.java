package com.cakmak.mondatelier.converter;

import com.cakmak.mondatelier.Model.art.Artwork;
import com.cakmak.mondatelier.dto.ArtworkDTO;

public class DTOMappers {
    public static ArtworkDTO toArtworkDTO(Artwork artwork, String[] artTypes, String mediaType) {
        return new ArtworkDTO(
                artwork.getId(),
                artwork.getTitle(),
                artwork.getProfile().getId(),
                artwork.getArtCategory().getName(),
                artwork.getSalable(),
                artwork.getPrice(),
                artwork.getReleaseYear(),
                artwork.getDimensions(),
                artwork.getDuration(),
                artTypes,
                mediaType
        );
    }
}
