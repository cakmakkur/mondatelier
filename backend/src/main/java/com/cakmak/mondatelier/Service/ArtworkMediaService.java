package com.cakmak.mondatelier.Service;

import com.cakmak.mondatelier.Exception.types.MediaNotFoundException;
import com.cakmak.mondatelier.Model.art.ArtworkMedia;
import com.cakmak.mondatelier.Repository.ArtworkMediaRepository;
import com.cakmak.mondatelier.dto.MediaResourceDTO;
import com.cakmak.mondatelier.enums.LogTypes;
import com.cakmak.mondatelier.util.Logger;
import org.springframework.core.io.FileSystemResource;
import org.springframework.stereotype.Service;

@Service
public class ArtworkMediaService {

    private final ArtworkMediaRepository artworkMediaRepository;
    private final Logger logger;

    public ArtworkMediaService(ArtworkMediaRepository artworkMediaRepository, Logger logger) {
        this.artworkMediaRepository = artworkMediaRepository;
        this.logger = logger;
    }

    public MediaResourceDTO getMediaByArtworkId(String artworkId) {

        ArtworkMedia artworkMedia = artworkMediaRepository.findByArtworkId(artworkId)
                .orElseThrow(MediaNotFoundException::new);


        try {
            // Load from classpath resources/uploads/
            FileSystemResource resource = new FileSystemResource("../uploads/" + artworkMedia.getPath());
            if (!resource.exists() || !resource.isReadable()) {
                throw new MediaNotFoundException("File not found or unreadable");
            }

            String contentType = determineContentType(resource.getFilename());

            return new MediaResourceDTO(resource, contentType, resource.getFilename());

        } catch (Exception e) {
            logger.log(LogTypes.ERROR, "Error reading file: " + e);
            throw new RuntimeException("Error reading file", e);
        }
    }

    private String determineContentType(String path) {
        if (path.endsWith(".png")) return "image/png";
        if (path.endsWith(".jpg") || path.endsWith(".jpeg")) return "image/jpeg";
        if (path.endsWith(".gif")) return "image/gif";
        if (path.endsWith(".mp4")) return "video/mp4";
        return "application/octet-stream";
    }
}
