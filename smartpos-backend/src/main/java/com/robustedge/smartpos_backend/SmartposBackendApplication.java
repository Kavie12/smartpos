package com.robustedge.smartpos_backend;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

import java.security.NoSuchAlgorithmException;

@SpringBootApplication
public class SmartposBackendApplication {

	public static void main(String[] args) throws NoSuchAlgorithmException {
		SpringApplication.run(SmartposBackendApplication.class, args);
	}

}