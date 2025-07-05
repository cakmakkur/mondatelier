package com.cakmak.mondatelier.Controller;

import com.cakmak.mondatelier.Service.ArtworkService;
import com.cakmak.mondatelier.dto.ArtworkDTO;
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
    public ResponseEntity<List<ArtworkDTO>> getArtworksByArtist(
            @RequestParam String profileId,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            @RequestParam(defaultValue = "createdAt") String sortBy
    ) {
        List<ArtworkDTO> list = artworkService.getArtworksByArtist(profileId, page, size, sortBy);
        return ResponseEntity.ok(list);
    }
}
