package com.cakmak.mondatelier.Exception;

public class MediaNotFoundException extends RuntimeException {
    public MediaNotFoundException(String message) {
        super(message);
    }
    public MediaNotFoundException() {
        super("Media not found");
    }
}
