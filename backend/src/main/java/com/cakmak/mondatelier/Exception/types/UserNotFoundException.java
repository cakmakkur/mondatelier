package com.cakmak.mondatelier.Exception.types;

import com.cakmak.mondatelier.Exception.MondatelierException;
import org.springframework.http.HttpStatus;

/**
 * Thrown when a user is not found.
 * Maps to HTTP 404 Not Found.
 */
public class UserNotFoundException extends MondatelierException {

    public UserNotFoundException(String message) {
        super(message, HttpStatus.NOT_FOUND);
    }

    public UserNotFoundException(String message, Object details) {
        super(message, HttpStatus.NOT_FOUND, details);
    }

    public UserNotFoundException() {
        super("User not found", HttpStatus.NOT_FOUND);
    }
}
