package com.cakmak.mondatelier.Service;

import com.cakmak.mondatelier.Exception.ArtworkNotFoundException;
import com.cakmak.mondatelier.Model.art.Artwork;
import com.cakmak.mondatelier.Repository.ArtworkRepository;
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

    public ArtworkService(ArtworkRepository artworkRepository) {
        this.artworkRepository = artworkRepository;
    }

    public ArtworkDTO getArtworkById(String id) {
        Artwork artwork = artworkRepository.findById(id).orElseThrow(() -> new ArtworkNotFoundException("ArtworkId: " + id));
        return DTOMappers.toArtworkDTO(artwork);
    }

    public Page<ArtworkDTO> getArtworksByArtist(String profileId, int page, int size, String sortBy) {
        Pageable pageable = PageRequest.of(page, size, Sort.by(sortBy).descending());
        Page<Artwork> artworksPage = artworkRepository.findByProfileId(profileId, pageable);
        return artworksPage.map(DTOMappers::toArtworkDTO);
    }

}
