package com.robustedge.smartpos_backend.controllers;

import com.robustedge.smartpos_backend.models.User;
import com.robustedge.smartpos_backend.services.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@CrossOrigin(origins = "http://localhost:5173/", allowCredentials = "true")
public class UserController {

    @Autowired
    private UserService service;

    @PostMapping("/users/add")
    public void addUser(@RequestBody User user) {
        service.addUser(user);
    }

    @GetMapping("/users/get")
    public List<User> getUsers() {
        return service.getUsers();
    }

    @PostMapping("/login")
    public String login(@RequestBody User user) {
        return service.login(user);
    }
}
