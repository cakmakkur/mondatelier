package com.cakmak.mondatelier.Exception;

import java.util.InputMismatchException;

public class UserNotFoundException extends InputMismatchException {
    public UserNotFoundException(String message) {
        super(message);
    }
    public UserNotFoundException() {super ("User not found");}
}
