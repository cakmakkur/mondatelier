package com.cakmak.mondatelier.Service;

import com.cakmak.mondatelier.Exception.ArtworkNotFoundException;
import com.cakmak.mondatelier.Model.art.Artwork;
import com.cakmak.mondatelier.Repository.ArtworkRepository;
import com.cakmak.mondatelier.dto.ArtworkDTO;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class ArtworkService {
    private final ArtworkRepository artworkRepository;

    public ArtworkService(ArtworkRepository artworkRepository) {
        this.artworkRepository = artworkRepository;
    }

    public ArtworkDTO getArtworkById(String id) {
        Artwork artwork = artworkRepository.findById(id).orElseThrow(() -> new ArtworkNotFoundException("ArtworkId: " + id));

    }

    public List<ArtworkDTO> getArtworksByArtist(String profileId, int page, int size, String sortBy) {

    }
}
