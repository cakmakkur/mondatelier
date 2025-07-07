package com.cakmak.mondatelier.Controller;

import com.cakmak.mondatelier.Model.art.ArtworkMedia;
import com.cakmak.mondatelier.Service.ArtworkMediaService;
import com.cakmak.mondatelier.dto.MediaResourceDTO;
import org.springframework.core.io.Resource;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/media")
public class ArtworkMediaController {

    private final ArtworkMediaService artworkMediaService;

    public ArtworkMediaController(ArtworkMediaService artworkMediaService) {
        this.artworkMediaService = artworkMediaService;
    }

    @GetMapping("/{id}")
    public ResponseEntity<Resource> getMedia(@PathVariable String id) {
        MediaResourceDTO mediaDTO = artworkMediaService.getMediaByArtworkId(id);

        return ResponseEntity.ok()
                .contentType(MediaType.parseMediaType(mediaDTO.contentType()))
                .header(HttpHeaders.CONTENT_DISPOSITION, "inline; filename=\"" + mediaDTO.filename() + "\"")
                .body(mediaDTO.resource());
    }

}
