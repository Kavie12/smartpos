package com.robustedge.smartpos_backend.config;

public class ApiRequestException extends RuntimeException {

    public ApiRequestException(String message) {
        super(message);
    }

}
