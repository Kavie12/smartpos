package com.robustedge.smartpos_backend.models;

import org.springframework.http.HttpStatus;

public record ApiException(String message, HttpStatus httpStatus) {

}
