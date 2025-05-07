package com.robustedge.smartpos_backend.controllers;

import com.robustedge.smartpos_backend.dto.AuthObjectResponse;
import com.robustedge.smartpos_backend.dto.PasswordChangeRequest;
import com.robustedge.smartpos_backend.models.User;
import com.robustedge.smartpos_backend.services.AuthenticationService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/v1/auth")
public class AuthenticationController {

    @Autowired
    private AuthenticationService service;

    @PostMapping("/authenticate")
    public AuthObjectResponse authenticate(@RequestBody User user) {
        return service.authenticate(user);
    }

    @PostMapping("/change_password")
    public void changePassword(@RequestBody PasswordChangeRequest passwordChangeRequest) {
        service.changePassword(passwordChangeRequest);
    }

}