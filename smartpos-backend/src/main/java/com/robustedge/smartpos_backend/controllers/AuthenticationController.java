package com.robustedge.smartpos_backend.controllers;

import com.robustedge.smartpos_backend.models.User;
import com.robustedge.smartpos_backend.services.AuthenticationService;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/v1/auth")
public class AuthenticationController {

    @Autowired
    private AuthenticationService service;

    @PostMapping("/register")
    public void register(@RequestBody User user) {
        service.register(user);
    }

    @PostMapping("/authenticate")
    public String authenticate(@RequestBody User user) {
        return service.authenticate(user);
    }

}
