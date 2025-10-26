package com.cakmak.mondatelier.Exception.types;

import com.cakmak.mondatelier.Exception.MondatelierException;
import org.springframework.http.HttpStatus;

/**
 * Thrown when a like on an artwork cannot be found.
 * Maps to HTTP 404 Not Found.
 */
public class ArtworkLikeNotFoundException extends MondatelierException {

    public ArtworkLikeNotFoundException(String message) {
        super(message, HttpStatus.NOT_FOUND);
    }

    public ArtworkLikeNotFoundException(String message, Object details) {
        super(message, HttpStatus.NOT_FOUND, details);
    }

    public ArtworkLikeNotFoundException() {
        super("Like of artwork not found", HttpStatus.NOT_FOUND);
    }
}
