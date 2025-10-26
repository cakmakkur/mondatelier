package com.cakmak.mondatelier.Exception.types;

import com.cakmak.mondatelier.Exception.MondatelierException;
import org.springframework.http.HttpStatus;

/**
 * Thrown when an event is not found in the system.
 * Maps to HTTP 404 Not Found.
 */
public class EventNotFoundException extends MondatelierException {

    public EventNotFoundException(String message) {
        super(message, HttpStatus.NOT_FOUND);
    }

    public EventNotFoundException(String message, Object details) {
        super(message, HttpStatus.NOT_FOUND, details);
    }

    public EventNotFoundException() {
        super("Event not found", HttpStatus.NOT_FOUND);
    }
}
