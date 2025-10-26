package com.cakmak.mondatelier.Exception.types;

import com.cakmak.mondatelier.Exception.MondatelierException;
import org.springframework.http.HttpStatus;

/**
 * Thrown when a media item is not found in the system.
 * Maps to HTTP 404 Not Found.
 */
public class MediaNotFoundException extends MondatelierException {

    public MediaNotFoundException(String message) {
        super(message, HttpStatus.NOT_FOUND);
    }

    public MediaNotFoundException(String message, Object details) {
        super(message, HttpStatus.NOT_FOUND, details);
    }

    public MediaNotFoundException() {
        super("Media not found", HttpStatus.NOT_FOUND);
    }
}
