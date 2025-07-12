package com.cakmak.mondatelier.converter;

import com.cakmak.mondatelier.Model.art.Artwork;
import com.cakmak.mondatelier.Model.event.Event;
import com.cakmak.mondatelier.dto.ArtworkDTO;
import com.cakmak.mondatelier.dto.EventDTO;

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

    public static EventDTO toEventDTO(Event event) {
        return new EventDTO(
                event.getId(),
                event.getTitle(),
                event.getType().getId(),
                event.getCity().getCity(),
                event.getDescription(),
                event.getCreatedAt(),
                event.getDate(),
                event.getProfile().getId()
        );
    }
}
