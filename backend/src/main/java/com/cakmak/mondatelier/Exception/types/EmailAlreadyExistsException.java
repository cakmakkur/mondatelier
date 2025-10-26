package com.cakmak.mondatelier.Exception.types;

import com.cakmak.mondatelier.Exception.MondatelierException;
import org.springframework.http.HttpStatus;

/**
 * Thrown when an email is already registered in the system.
 * Maps to HTTP 409 Conflict.
 */
public class EmailAlreadyExistsException extends MondatelierException {

    public EmailAlreadyExistsException(String message) {
        super(message, HttpStatus.CONFLICT);
    }

    public EmailAlreadyExistsException(String message, Object details) {
        super(message, HttpStatus.CONFLICT, details);
    }

    public EmailAlreadyExistsException() {
        super("Email already exists", HttpStatus.CONFLICT);
    }
}
