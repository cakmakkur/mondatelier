package com.cakmak.mondatelier.Service;

import com.cakmak.mondatelier.Exception.ArtworkNotFoundException;
import com.cakmak.mondatelier.Model.art.Artwork;
import com.cakmak.mondatelier.Repository.ArtworkRepository;
import com.cakmak.mondatelier.Repository.ArtworkTypesRepository;
import com.cakmak.mondatelier.converter.DTOMappers;
import com.cakmak.mondatelier.dto.ArtworkDTO;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;

@Service
public class ArtworkService {
    private final ArtworkRepository artworkRepository;
    private final ArtworkTypesService artworkTypesService;

    public ArtworkService(ArtworkRepository artworkRepository,
                          ArtworkTypesService artworkTypesService) {
        this.artworkRepository = artworkRepository;
        this.artworkTypesService = artworkTypesService;
    }

    public ArtworkDTO getArtworkById(String id) {
        Artwork artwork = artworkRepository.findById(id).orElseThrow(() -> new ArtworkNotFoundException("ArtworkId: " + id));
        String[] types = artworkTypesService.getTypesByArtworkId(id);
        String mediaType = artwork.getArtCategory().getMediaType().getType();
        return DTOMappers.toArtworkDTO(artwork, types, mediaType);
    }

    public Page<ArtworkDTO> getArtworksByArtist(String profileId, int page, int size, String sortBy) {
        Pageable pageable = PageRequest.of(page, size, Sort.by(sortBy).descending());
        Page<Artwork> artworksPage = artworkRepository.findByProfileId(profileId, pageable);

        return artworksPage.map(artwork -> {
            String[] types = artworkTypesService.getTypesByArtworkId(artwork.getId());
            String mediaType = artwork.getArtCategory().getMediaType().getType();
            return DTOMappers.toArtworkDTO(artwork, types, mediaType);
        });
    }

}
