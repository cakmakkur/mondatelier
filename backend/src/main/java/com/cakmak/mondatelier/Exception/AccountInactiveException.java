package com.cakmak.mondatelier.Exception;

public class AccountInactiveException extends RuntimeException {
    public AccountInactiveException(String message) {
        super(message);
    }
    public AccountInactiveException() {
        super("This account has been inactive. Contact us for more information.");
    }

}
