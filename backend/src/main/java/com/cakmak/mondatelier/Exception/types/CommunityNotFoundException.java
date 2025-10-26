package com.cakmak.mondatelier.Exception.types;

import com.cakmak.mondatelier.Exception.MondatelierException;
import org.springframework.http.HttpStatus;

/**
 * Thrown when a community cannot be found in the system.
 * Maps to HTTP 404 Not Found.
 */
public class CommunityNotFoundException extends MondatelierException {

    public CommunityNotFoundException(String message) {
        super(message, HttpStatus.NOT_FOUND);
    }

    public CommunityNotFoundException(String message, Object details) {
        super(message, HttpStatus.NOT_FOUND, details);
    }

    public CommunityNotFoundException() {
        super("Community not found", HttpStatus.NOT_FOUND);
    }
}
