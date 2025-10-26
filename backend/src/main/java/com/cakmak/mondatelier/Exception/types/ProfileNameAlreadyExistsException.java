package com.cakmak.mondatelier.Exception.types;

import com.cakmak.mondatelier.Exception.MondatelierException;
import org.springframework.http.HttpStatus;

/**
 * Thrown when a profile name already exists in the system.
 * Maps to HTTP 409 Conflict.
 */
public class ProfileNameAlreadyExistsException extends MondatelierException {

    public ProfileNameAlreadyExistsException(String message) {
        super(message, HttpStatus.CONFLICT);
    }

    public ProfileNameAlreadyExistsException(String message, Object details) {
        super(message, HttpStatus.CONFLICT, details);
    }

    public ProfileNameAlreadyExistsException() {
        super("Profile name already exists", HttpStatus.CONFLICT);
    }
}
