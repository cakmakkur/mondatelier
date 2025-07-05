package com.cakmak.mondatelier.Exception;

public class ArtworkNotFoundException extends RuntimeException {
    public ArtworkNotFoundException(String message) {super(message);}
    public ArtworkNotFoundException() {super ("Artwork not found");}
}
