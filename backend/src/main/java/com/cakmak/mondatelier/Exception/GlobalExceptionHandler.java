package com.cakmak.mondatelier.Exception;

import com.cakmak.mondatelier.enums.LogTypes;
import com.cakmak.mondatelier.util.Logger;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

@RestControllerAdvice
public class GlobalExceptionHandler {
    private final Logger logger;

    public GlobalExceptionHandler(Logger logger) {
        this.logger = logger;
    }

    @ExceptionHandler(MondatelierException.class)
    public ResponseEntity<ErrorResponse> handleMondatelierException(MondatelierException e) {
        ErrorResponse response = new ErrorResponse(
                e.getStatus().value(),
                e.getStatus().getReasonPhrase(),
                e.getMessage(),
                e.getDetails()
        );
        return ResponseEntity.status(e.getStatus()).body(response);
    }

    @ExceptionHandler(RuntimeException.class)
    public ResponseEntity<ErrorResponse> handleRuntimeException(RuntimeException e) {
        logger.log(LogTypes.ERROR, "Runtime Error: " + e.getMessage());
        ErrorResponse response = new ErrorResponse(
                HttpStatus.INTERNAL_SERVER_ERROR.value(),
                HttpStatus.INTERNAL_SERVER_ERROR.getReasonPhrase(),
                "Runtime Error",
                e.getMessage()
        );
        return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(response);
    }
}
