package com.cakmak.mondatelier.Exception;

public class ProfileNameAlreadyExistsException extends RuntimeException {
    public ProfileNameAlreadyExistsException(String message) {
        super(message);
    }
    public ProfileNameAlreadyExistsException() {
        super("Profile name already exists");
    }

}
