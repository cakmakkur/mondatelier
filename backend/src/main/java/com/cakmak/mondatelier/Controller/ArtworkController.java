package com.cakmak.mondatelier.Controller;

import com.cakmak.mondatelier.Service.ArtworkService;
import com.cakmak.mondatelier.dto.ArtworkDTO;
import org.springframework.data.domain.Page;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/art")
public class ArtworkController {

    private final ArtworkService artworkService;

    public ArtworkController(ArtworkService artworkService) {
        this.artworkService = artworkService;
    }

    @GetMapping("/{id}")
    public ResponseEntity<ArtworkDTO> getArtworkById(@PathVariable String id) {
        ArtworkDTO artworkDTO = artworkService.getArtworkById(id);
        return ResponseEntity.ok(artworkDTO);
    }

    @GetMapping()
    public ResponseEntity<Page<ArtworkDTO>> getArtworksByArtist(
            @RequestParam String profileId,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            @RequestParam(defaultValue = "createdAt") String sortBy
    ) {
        Page<ArtworkDTO> artworkPage = artworkService.getArtworksByArtist(profileId, page, size, sortBy);
        return ResponseEntity.ok(artworkPage);
    }
}
