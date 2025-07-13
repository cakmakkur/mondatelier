package com.cakmak.mondatelier.Controller;

import com.cakmak.mondatelier.Service.ProfileService;
import com.cakmak.mondatelier.dto.PublicProfileDTO;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

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
}
