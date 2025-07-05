package com.cakmak.mondatelier.Exception;

public class ProfileNotFoundException extends RuntimeException {
  public ProfileNotFoundException(String message) {
    super(message);
  }
  public ProfileNotFoundException() {super ("Profile not found");}
}
