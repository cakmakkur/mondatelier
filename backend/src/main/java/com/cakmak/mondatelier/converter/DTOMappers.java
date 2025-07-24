package com.cakmak.mondatelier.converter;

import com.cakmak.mondatelier.Model.Freelance;
import com.cakmak.mondatelier.Model.Masterclass;
import com.cakmak.mondatelier.Model.Profile;
import com.cakmak.mondatelier.Model.art.Artwork;
import com.cakmak.mondatelier.Model.event.Event;
import com.cakmak.mondatelier.dto.*;
import com.cakmak.mondatelier.dto.auth.LoginResponse;

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

    public static LoginResponse toLoginResponseDTO(
            String token,
            long expiresIn,
            String userId,
            String profileId) {
        LoginResponse lr = new LoginResponse();
        lr.setExpiresIn(expiresIn);
        lr.setUserId(userId);
        lr.setProfileId(profileId);
        lr.setToken(token);
        return lr;
    }

    public static PublicProfileDTO toPublicProfileDTO (Profile profile) {
        return new PublicProfileDTO(
                profile.getId(),
                profile.getType().getValue(),
                profile.getProfileName(),
                profile.getFirstname(),
                profile.getLastname(),
                profile.getBio(),
                profile.getPersonalWebsite(),
                profile.getCountry().getCountry(),
                profile.getBannerPath(),
                profile.getProfilePicturePath(),
                profile.getShowRealName()
        );
    }

    public static FreelanceDTO toFreelanceDTO (Freelance freelance) {
        return new FreelanceDTO(
                freelance.getId(),
                freelance.getProfile().getId(),
                freelance.getArtCategory().getName(),
                freelance.getDescription()
        );
    }

    public static MasterclassDTO toMasterclassDTO (Masterclass masterclass) {
        return new MasterclassDTO(
                masterclass.getId(),
                masterclass.getProfile().getId(),
                masterclass.getTitle(),
                masterclass.getDescription(),
                masterclass.getSessions(),
                masterclass.getSessionDuration(),
                masterclass.getSessionPrice(),
                masterclass.getCreatedAt(),
                masterclass.getArtCategory().getName()
        );
    }
 }
