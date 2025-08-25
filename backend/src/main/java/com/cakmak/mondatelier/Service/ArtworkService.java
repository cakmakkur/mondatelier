package com.cakmak.mondatelier.Service;

import com.cakmak.mondatelier.Exception.ArtworkNotFoundException;
import com.cakmak.mondatelier.Model.User;
import com.cakmak.mondatelier.Model.art.Artwork;
import com.cakmak.mondatelier.Model.art.ArtworkLike;
import com.cakmak.mondatelier.Repository.ArtworkLikeRepository;
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
    private final ArtworkLikeRepository artworkLikeRepository;

    public ArtworkService(ArtworkRepository artworkRepository,
                          ArtworkTypesService artworkTypesService,
                          ArtworkLikeRepository artworkLikeRepository) {
        this.artworkRepository = artworkRepository;
        this.artworkTypesService = artworkTypesService;
        this.artworkLikeRepository = artworkLikeRepository;
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

    public void likeArtwork(String id, User currentUser) {
        boolean likeExists = artworkLikeRepository.findByArtwork_IdAndProfile_Id(id, currentUser.getProfile().getId()).isPresent();
        if (likeExists) {throw new RuntimeException("Artwork already liked");}
        boolean artworkExists = artworkRepository.findById(id).isPresent();
        if (!artworkExists) {throw new RuntimeException("Artwork does not exist");}
        ArtworkLike artworkLike = new ArtworkLike();
        artworkLike.setArtwork(artworkRepository.findById(id).get());
        artworkLike.setProfile(currentUser.getProfile());
        artworkLikeRepository.save(artworkLike);
    }


    public void unlikeArtwork(String id, User currentUser) {
        boolean likeExists = artworkLikeRepository.findByArtwork_IdAndProfile_Id(id, currentUser.getProfile().getId()).isPresent();
        if (!likeExists) {throw new RuntimeException("Artwork not liked");}
        artworkLikeRepository.delete(artworkLikeRepository.findByArtwork_IdAndProfile_Id(id, currentUser.getProfile().getId()).get());
    }

}
