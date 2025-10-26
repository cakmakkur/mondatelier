package com.cakmak.mondatelier.Exception;

import lombok.Getter;
import org.springframework.http.HttpStatus;

/**
 * Base class for all custom exceptions in the Mondatelier application.
 * Provides consistent HTTP status and optional details for error responses.
 */
@Getter
public abstract class MondatelierException extends RuntimeException {
    private final HttpStatus status;
    private final Object details;

    protected MondatelierException(String message, HttpStatus status) {
        super(message);
        this.status = status;
        this.details = null;
    }

    protected MondatelierException(String message, HttpStatus status, Object details) {
        super(message);
        this.status = status;
        this.details = details;
    }

    public HttpStatus getStatus() {
        return status;
    }

    public Object getDetails() {
        return details;
    }
}
