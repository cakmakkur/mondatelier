package com.cakmak.mondatelier.Exception;

public class PostNotFoundException extends RuntimeException {
  public PostNotFoundException(String message) {
    super(message);
  }
  public PostNotFoundException() {
    super("Post not found");
  }
}
