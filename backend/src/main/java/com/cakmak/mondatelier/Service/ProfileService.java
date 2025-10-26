package com.cakmak.mondatelier.Service;

import com.cakmak.mondatelier.Exception.types.ProfileNotFoundException;
import com.cakmak.mondatelier.Model.Country;
import com.cakmak.mondatelier.Model.Profile;
import com.cakmak.mondatelier.Repository.CountryRepository;
import com.cakmak.mondatelier.Repository.ProfileRepository;
import com.cakmak.mondatelier.converter.DTOMappers;
import com.cakmak.mondatelier.dto.PublicProfileDTO;
import com.cakmak.mondatelier.enums.ProfileTypes;
import com.cakmak.mondatelier.util.DeleteFile;
import com.cakmak.mondatelier.util.UploadImage;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;



@Service
public class ProfileService {
    private final ProfileRepository profileRepository;
    private final CountryRepository countryRepository;

    @Value("${app.upload.dir}")
    private String uploadDir;

    public ProfileService(ProfileRepository profileRepository, CountryRepository countryRepository) {
        this.profileRepository = profileRepository;
        this.countryRepository = countryRepository;
    }

    public PublicProfileDTO getProfileById(String id) {
        Profile profile = profileRepository.findById(id).orElseThrow(ProfileNotFoundException::new);
        return DTOMappers.toPublicProfileDTO(profile);
    }

    public void updatePublicProfile(PublicProfileDTO publicProfileDTO, MultipartFile imageFile) {
        Profile currentProfile = profileRepository.findById(publicProfileDTO.id())
                .orElseThrow(ProfileNotFoundException::new);

        // profileType
        if (publicProfileDTO.profileType() != null &&
                !ProfileTypes.fromValue(publicProfileDTO.profileType()).equals(currentProfile.getType())) {
            currentProfile.setType(ProfileTypes.fromValue(publicProfileDTO.profileType()));
        }

        // profileName
        if (publicProfileDTO.profileName() != null &&
                !publicProfileDTO.profileName().equals(currentProfile.getProfileName())) {
            currentProfile.setProfileName(publicProfileDTO.profileName());
        }

        // bio
        if (publicProfileDTO.bio() != null &&
                !publicProfileDTO.bio().equals(currentProfile.getBio())) {
            currentProfile.setBio(publicProfileDTO.bio());
        }

        // personalWebsite
        if (publicProfileDTO.personalWebsite() != null &&
                !publicProfileDTO.personalWebsite().equals(currentProfile.getPersonalWebsite())) {
            currentProfile.setPersonalWebsite(publicProfileDTO.personalWebsite());
        }

        // country
        if (publicProfileDTO.country() != null &&
                (currentProfile.getCountry() == null ||
                        !publicProfileDTO.country().equals(currentProfile.getCountry().getName()))) {
            Country country = countryRepository.findByName(publicProfileDTO.country());
            currentProfile.setCountry(country);
        }

        // showRealName
        if (publicProfileDTO.showRealName() != null &&
                !publicProfileDTO.showRealName().equals(currentProfile.getShowRealName())) {
            currentProfile.setShowRealName(publicProfileDTO.showRealName());
        }

    }

    @Transactional
    public void updateProfilePicture(String profileId, MultipartFile imageFile) {
        Profile currentProfile = profileRepository.findById(profileId)
                .orElseThrow(ProfileNotFoundException::new);

        String oldPPPath = uploadDir + currentProfile.getProfilePicturePath();

        if (imageFile != null && !imageFile.isEmpty()) {
            String fileName = UploadImage.upload(imageFile, uploadDir, "pp");
            currentProfile.setProfilePicturePath("/pp/" + fileName);
            DeleteFile.delete(oldPPPath);
        }
    }

    @Transactional
    public void updateProfileBanner(String profileId, MultipartFile imageFile) {
        Profile currentProfile = profileRepository.findById(profileId)
                .orElseThrow(ProfileNotFoundException::new);
        String oldBannerPath = uploadDir + currentProfile.getBannerPath();

        if (imageFile != null && !imageFile.isEmpty()) {
            String fileName = UploadImage.upload(imageFile, uploadDir, "banner");
            currentProfile.setBannerPath("/banner/" + fileName);
            DeleteFile.delete(oldBannerPath);
            // returns false if the file doesn't exist. so logging this it can be determined,
            // if this upload is the first upload
        }
    }

}
