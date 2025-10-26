package com.cakmak.mondatelier.Exception.types;

import com.cakmak.mondatelier.Exception.MondatelierException;
import org.springframework.http.HttpStatus;

/**
 * Thrown when an inactive account attempts an operation requiring activation.
 * Maps to HTTP 403 Forbidden.
 */
public class AccountInactiveException extends MondatelierException {

    public AccountInactiveException(String message) {
        super(message, HttpStatus.FORBIDDEN);
    }

    public AccountInactiveException(String message, Object details) {
        super(message, HttpStatus.FORBIDDEN, details);
    }

    public AccountInactiveException() {
        super("This account is inactive. Contact support for more information.", HttpStatus.FORBIDDEN);
    }
}
