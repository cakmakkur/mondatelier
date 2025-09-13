package com.cakmak.mondatelier.Exception;

public class ArtworkLikeNotFoundException extends RuntimeException {
    public ArtworkLikeNotFoundException(String message) {
        super(message);
    }
    public ArtworkLikeNotFoundException() {super ("Like of artwork not found");}
}
