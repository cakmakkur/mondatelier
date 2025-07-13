package com.cakmak.mondatelier.Service;

import com.cakmak.mondatelier.Exception.ProfileNotFoundException;
import com.cakmak.mondatelier.Model.Profile;
import com.cakmak.mondatelier.Repository.ProfileRepository;
import com.cakmak.mondatelier.converter.DTOMappers;
import com.cakmak.mondatelier.dto.PublicProfileDTO;
import org.springframework.stereotype.Service;

@Service
public class ProfileService {
    private final ProfileRepository profileRepository;

    public ProfileService(ProfileRepository profileRepository) {
        this.profileRepository = profileRepository;
    }

    public PublicProfileDTO getProfileById(String id) {
        Profile profile = profileRepository.findById(id).orElseThrow(ProfileNotFoundException::new);
        return DTOMappers.toPublicProfileDTO(profile);
    }

}
