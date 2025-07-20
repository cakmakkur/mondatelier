package com.cakmak.mondatelier.Exception;


public class EmailNotFoundException extends RuntimeException {
    public EmailNotFoundException(String message) {
        super(message);
    }
    public EmailNotFoundException() {
    super("Email not found");
  }
}
