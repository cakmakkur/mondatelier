package com.cakmak.mondatelier.Controller;

import com.cakmak.mondatelier.Service.ProfileService;
import com.cakmak.mondatelier.dto.PublicProfileDTO;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

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

    @PostMapping("/create")
    public ResponseEntity<Void> createPublicProfile(@RequestBody PublicProfileDTO publicProfileDTO) {
        return ResponseEntity.ok().build();
    }

    @PutMapping
    public ResponseEntity<Void> updatePublicProfile(@RequestBody PublicProfileDTO publicProfileDTO) {
        return ResponseEntity.ok().build();
    }
}
