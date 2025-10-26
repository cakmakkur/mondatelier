package com.cakmak.mondatelier.Exception;

public class ErrorResponse {
    private final int status;
    private final String error;
    private final String message;
    private final Object details;

    public ErrorResponse(int status, String error, String message, Object details) {
        this.status = status;
        this.error = error;
        this.message = message;
        this.details = details;
    }

    public int getStatus() {
        return status;
    }

    public String getError() {
        return error;
    }

    public String getMessage() {
        return message;
    }

    public Object getDetails() {
        return details;
    }

}
