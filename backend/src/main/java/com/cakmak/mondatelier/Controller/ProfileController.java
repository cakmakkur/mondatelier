package com.cakmak.mondatelier.Controller;

import com.cakmak.mondatelier.Model.User;
import com.cakmak.mondatelier.Service.ProfileService;
import com.cakmak.mondatelier.dto.PublicProfileDTO;
import com.cakmak.mondatelier.util.AuthUtil;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

@RestController
@RequestMapping("/api/profile")
public class ProfileController {

    private final ProfileService profileService;

    public ProfileController(ProfileService profileService) {
        this.profileService = profileService;
    }

    @GetMapping("{id}")
    public ResponseEntity<PublicProfileDTO> getPublicProfile(@PathVariable String id) {
        PublicProfileDTO publicProfileDTO = this.profileService.getProfileById(id);
        return ResponseEntity.ok(publicProfileDTO);
    }

    // profile is created automatically during sign up
/*    @PostMapping("/create")
    public ResponseEntity<Void> createPublicProfile(@RequestBody PublicProfileDTO publicProfileDTO) {
        profileService.createProfile(publicProfileDTO);
        return ResponseEntity.ok().build();
    }*/

    // update full profile
    @PutMapping(
            consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<Void> updateProfile(
            @RequestPart("profile") PublicProfileDTO publicProfileDTO,
            @RequestPart(value = "image", required = false) MultipartFile imageFile
    ) {
        User currentUser = AuthUtil.getCurrentUser();
        if (!currentUser.getProfile().getId().equals(publicProfileDTO.id())) {
            throw new RuntimeException("User's profile and target profile don't match");
        }
        profileService.updatePublicProfile(publicProfileDTO, imageFile);
        return ResponseEntity.ok().build();
    }

    @PutMapping(
            path = "/profilePicture/{profileId}",
            consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<PublicProfileDTO> updateProfilePicture(
            @PathVariable String profileId,
            @RequestPart(value = "image") MultipartFile imageFile) {
        User currentUser = AuthUtil.getCurrentUser();
        if (!currentUser.getProfile().getId().equals(profileId)) {
            throw new RuntimeException("User's profile and target profile don't match");
        }
        profileService.updateProfilePicture(profileId, imageFile);
        PublicProfileDTO updatedProfileDTO = this.profileService.getProfileById(profileId);
        return ResponseEntity.ok(updatedProfileDTO);
    }

    @PutMapping(
            path = "/bannerImage/{profileId}",
            consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<PublicProfileDTO> updateBannerImage(
            @PathVariable String profileId,
            @RequestPart(value = "image", required = false) MultipartFile imageFile) {
        User currentUser = AuthUtil.getCurrentUser();
        if (!currentUser.getProfile().getId().equals(profileId)) {
            throw new RuntimeException("User's profile and target profile don't match");
        }
        profileService.updateProfileBanner(profileId, imageFile);
        PublicProfileDTO updatedProfileDTO = this.profileService.getProfileById(profileId);
        return ResponseEntity.ok(updatedProfileDTO);    }
}
