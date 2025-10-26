package com.cakmak.mondatelier.Exception.types;

import com.cakmak.mondatelier.Exception.MondatelierException;
import org.springframework.http.HttpStatus;

/**
 * Thrown when a post is not found in the system.
 * Maps to HTTP 404 Not Found.
 */
public class PostNotFoundException extends MondatelierException {

  public PostNotFoundException(String message) {
    super(message, HttpStatus.NOT_FOUND);
  }

  public PostNotFoundException(String message, Object details) {
    super(message, HttpStatus.NOT_FOUND, details);
  }

  public PostNotFoundException() {
    super("Post not found", HttpStatus.NOT_FOUND);
  }
}
