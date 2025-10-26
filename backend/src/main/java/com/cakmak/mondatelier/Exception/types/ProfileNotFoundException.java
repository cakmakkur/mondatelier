package com.cakmak.mondatelier.Exception.types;

import com.cakmak.mondatelier.Exception.MondatelierException;
import org.springframework.http.HttpStatus;

/**
 * Thrown when a user profile is not found.
 * Maps to HTTP 404 Not Found.
 */
public class ProfileNotFoundException extends MondatelierException {

  public ProfileNotFoundException(String message) {
    super(message, HttpStatus.NOT_FOUND);
  }

  public ProfileNotFoundException(String message, Object details) {
    super(message, HttpStatus.NOT_FOUND, details);
  }

  public ProfileNotFoundException() {
    super("Profile not found", HttpStatus.NOT_FOUND);
  }
}
