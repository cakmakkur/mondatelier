package com.cakmak.mondatelier.Exception.types;

import com.cakmak.mondatelier.Exception.MondatelierException;
import org.springframework.http.HttpStatus;

/**
 * Thrown when a user and profile do not match.
 * Maps to HTTP 404 Not Found.
 */
public class UserProfileMismatchException extends MondatelierException {

    public UserProfileMismatchException(String message) {
        super(message, HttpStatus.NOT_FOUND);
    }

    public UserProfileMismatchException(String message, Object details) {
        super(message, HttpStatus.NOT_FOUND, details);
    }

    public UserProfileMismatchException() {
        super("User and profile don't match", HttpStatus.NOT_FOUND);
    }
}
