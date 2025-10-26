package com.cakmak.mondatelier.Exception.types;

import com.cakmak.mondatelier.Exception.MondatelierException;
import org.springframework.http.HttpStatus;

/**
 * Thrown when an email is not found in the system.
 * Maps to HTTP 404 Not Found.
 */
public class EmailNotFoundException extends MondatelierException {

    public EmailNotFoundException(String message) {
        super(message, HttpStatus.NOT_FOUND);
    }

    public EmailNotFoundException(String message, Object details) {
        super(message, HttpStatus.NOT_FOUND, details);
    }

    public EmailNotFoundException() {
        super("Email not found", HttpStatus.NOT_FOUND);
    }
}
