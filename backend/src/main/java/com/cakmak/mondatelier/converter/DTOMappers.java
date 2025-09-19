package com.cakmak.mondatelier.converter;

import com.cakmak.mondatelier.Model.Freelance;
import com.cakmak.mondatelier.Model.Masterclass;
import com.cakmak.mondatelier.Model.Preferences;
import com.cakmak.mondatelier.Model.Profile;
import com.cakmak.mondatelier.Model.art.Artwork;
import com.cakmak.mondatelier.Model.art.ArtworkMedia;
import com.cakmak.mondatelier.Model.community.Community;
import com.cakmak.mondatelier.Model.community.Post;
import com.cakmak.mondatelier.Model.community.PostMedia;
import com.cakmak.mondatelier.Model.event.Event;
import com.cakmak.mondatelier.Repository.PostRepository;
import com.cakmak.mondatelier.dto.*;
import com.cakmak.mondatelier.dto.auth.LoginResponse;
import org.springframework.beans.factory.annotation.Autowired;

import javax.print.attribute.standard.Media;
import java.util.ArrayList;
import java.util.List;

public class DTOMappers {

    public static ArtworkDTO toArtworkDTO(Artwork artwork, String[] artTypes, String mediaType) {
        List<MediaDTO> mediaDTOList = new ArrayList<>();
        for (ArtworkMedia a : artwork.getMediaList()) {
            MediaDTO dto = new MediaDTO(a.getId(), a.getPath(), a.isThumbnail());
            mediaDTOList.add(dto);
        }
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
                mediaType,
                mediaDTOList
        );
    }

    public static EventDTO toEventDTO(Event event) {
        return new EventDTO(
                event.getId(),
                event.getTitle(),
                event.getType().getId(),
                event.getCity().getName(),
                event.getDescription(),
                event.getCreatedAt(),
                event.getDate(),
                event.getProfile().getId(),
                event.getThumbnailUrl()
        );
    }

    public static LoginResponse toLoginResponseDTO(
            String token,
            long expiresIn,
            String userId,
            String profileId,
            String profileType,
            String userType) {
        LoginResponse lr = new LoginResponse();
        lr.setExpiresIn(expiresIn);
        lr.setUserId(userId);
        lr.setProfileId(profileId);
        lr.setToken(token);
        lr.setProfileType(profileType);
        lr.setUserType(userType);
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
                profile.getCountry().getName(),
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
                masterclass.getArtCategory().getName(),
                masterclass.getCity().getName(),
                masterclass.getThumbnailUrl()
        );
    }

    public static PreferencesDto toPreferencesDTO(Preferences preferences) {
        String preferredCountry = preferences.getPreferredCountry() != null
                ? preferences.getPreferredCountry().getName()
                : null;

        String preferredCity = preferences.getPreferredCity() != null
                ? preferences.getPreferredCity().getName()
                : null;

        String language = preferences.getLanguage() != null
                ? preferences.getLanguage().getName().name()
                : null;

        return new PreferencesDto(
                preferences.getId(),
                preferences.getProfile().getId(),
                preferredCountry,
                preferredCity,
                preferences.getAnimations(),
                language,
                preferences.getNotifications()
        );
    }

    public static CommunityDto toCommunityDTO (Community community) {
        return new CommunityDto(
                community.getId(),
                community.getName(),
                community.getDescription(),
                community.getCreatedAt(),
                community.getLogoImgPath(),
                community.getProfile().getId(),
                community.getCommunityProfiles().size()
        );
    }

    public static PostDto toPostDTO (Post post) {

        List<String> mediaPaths = new ArrayList<>();

        for(PostMedia media : post.getPostMediaList()) {
            mediaPaths.add(media.getPath());
        }

        return new PostDto(
                post.getId(),
                toCommunityDTO(post.getCommunity()),
                post.getProfile().getId(),
                post.getParent() != null ? post.getParent().getId() : null,
                post.getTitle(),
                post.getContent(),
                post.getCreatedAt(),
                post.getEditedAt(),
                mediaPaths,
                post.getProfile().getProfilePicturePath(),
                post.getProfile().getProfileName(),
                post.getChildrenPostsAmount(),
                post.getLikesAmount()
                );
    }

}
