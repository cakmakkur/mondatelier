package com.cakmak.mondatelier.Exception;

public class CommunityNotFoundException extends RuntimeException {
    public CommunityNotFoundException(String message) {
        super(message);
    }
    public CommunityNotFoundException() {
        super("Community not found");
    }
}
