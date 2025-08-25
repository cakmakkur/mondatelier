package com.cakmak.mondatelier.Controller;

import com.cakmak.mondatelier.Model.User;
import com.cakmak.mondatelier.Service.ArtworkService;
import com.cakmak.mondatelier.dto.ArtworkDTO;
import com.cakmak.mondatelier.util.AuthUtil;
import org.springframework.data.domain.Page;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

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

    @PostMapping("/like/{id}")
    public ResponseEntity<Void> likeArtwork(@PathVariable String id) {
        User currentUser = AuthUtil.getCurrentUser();
        artworkService.likeArtwork(id,currentUser);
        return ResponseEntity.ok().build();
    }

    @DeleteMapping("/unlike/{id}")
    public ResponseEntity<Void> unlikeArtwork(@PathVariable String id) {
        User currentUser = AuthUtil.getCurrentUser();
        artworkService.unlikeArtwork(id,currentUser);
        return ResponseEntity.ok().build();
    }
}

/*Pageable response structure example:*/
/*{
        "content": [
        { "id": 1, "name": "Event A", ... },
        { "id": 2, "name": "Event B", ... }
        ],
        "pageable": { *//* metadata object *//* },
        "totalPages": 10,
        "totalElements": 95,
        "last": false,
        "size": 10,
        "number": 0,
        "sort": { *//* sort details *//* },
        "first": true,
        "numberOfElements": 10,
        "empty": false
}*/
