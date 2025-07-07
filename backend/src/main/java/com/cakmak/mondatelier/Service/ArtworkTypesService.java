package com.cakmak.mondatelier.Service;

import com.cakmak.mondatelier.Model.art.ArtworkType;
import com.cakmak.mondatelier.Repository.ArtworkTypesRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class ArtworkTypesService {
    private final ArtworkTypesRepository artworkTypesRepository;

    public ArtworkTypesService(ArtworkTypesRepository artworkTypesRepository) {
        this.artworkTypesRepository = artworkTypesRepository;
    }

    public String[] getTypesByArtworkId(String artworkId) {
        List<ArtworkType> artTypes = artworkTypesRepository.findByArtwork_Id(artworkId);

        return artTypes.stream()
                .map(artType -> artType.getArtType().getName())
                .toArray(String[]::new);
    }
}
