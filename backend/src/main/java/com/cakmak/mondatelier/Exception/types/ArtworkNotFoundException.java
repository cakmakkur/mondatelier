package com.cakmak.mondatelier.Exception.types;

import com.cakmak.mondatelier.Exception.MondatelierException;
import org.springframework.http.HttpStatus;

/**
 * Thrown when an artwork cannot be found in the system.
 * Maps to HTTP 404 Not Found.
 */
public class ArtworkNotFoundException extends MondatelierException {

    public ArtworkNotFoundException(String message) {
        super(message, HttpStatus.NOT_FOUND);
    }

    public ArtworkNotFoundException(String message, Object details) {
        super(message, HttpStatus.NOT_FOUND, details);
    }

    public ArtworkNotFoundException() {
        super("Artwork not found", HttpStatus.NOT_FOUND);
    }
}
