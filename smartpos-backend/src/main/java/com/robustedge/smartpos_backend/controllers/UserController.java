package com.robustedge.smartpos_backend.controllers;

import com.robustedge.smartpos_backend.models.User;
import com.robustedge.smartpos_backend.services.UserService;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@CrossOrigin(origins = "http://localhost:5173/", allowCredentials = "true")
@RequestMapping(path = "/users")
public class UserController {

    private UserService service;

    @Autowired
    public UserController(UserService service) {
        this.service = service;
    }

    @GetMapping
    public List<User> getUsers() {
        return service.getUsers();
    }

    @PostMapping
    public void addUser(@RequestBody User user) {
        service.addUser(user);
    }

    @PostMapping(path = "/login")
    public String login(@RequestBody User user, HttpServletResponse response) {
        return service.verify(user, response);
    }


}
