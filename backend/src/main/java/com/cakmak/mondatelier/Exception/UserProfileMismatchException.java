package com.cakmak.mondatelier.Exception;

import java.util.InputMismatchException;

public class UserProfileMismatchException extends InputMismatchException {
    public UserProfileMismatchException(String message) {
        super(message);
    }
    public UserProfileMismatchException() {super ("User and profile don't match");}
}
