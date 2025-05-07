package com.robustedge.smartpos_backend.services;

import com.robustedge.smartpos_backend.config.ApiRequestException;
import com.robustedge.smartpos_backend.dto.AuthObjectResponse;
import com.robustedge.smartpos_backend.dto.PasswordChangeRequest;
import com.robustedge.smartpos_backend.models.User;
import com.robustedge.smartpos_backend.repositories.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;

@Service
public class AuthenticationService {

    @Autowired
    private UserRepository repository;

    @Autowired
    private AuthenticationManager authenticationManager;

    @Autowired
    private JwtService jwtService;

    private final BCryptPasswordEncoder encoder = new BCryptPasswordEncoder(12);

    public void register(User user) {
        user.setPassword(encoder.encode(user.getPassword()));
        repository.save(user);
    }

    public AuthObjectResponse authenticate(User user) {
        authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(
                        user.getUsername(),
                        user.getPassword()
                )
        );

        User completeUser = repository.findByUsername(user.getUsername()).orElseThrow();

        String token = jwtService.generateToken(user);

        return new AuthObjectResponse(
                completeUser.getEmployee(),
                completeUser.getUsername(),
                completeUser.getRole().name(),
                token
        );
    }

    public void changePassword(PasswordChangeRequest passwordChangeRequest) {
        // Validate input fields
        if (passwordChangeRequest.getOldPassword().isEmpty()) {
            throw new ApiRequestException("Please enter old password.");
        } else if (passwordChangeRequest.getNewPassword().isEmpty()) {
            throw new ApiRequestException("Please enter new password.");
        } else if (passwordChangeRequest.getNewPassword().length() < 8) {
            throw new ApiRequestException("Password length must be at least 8 characters.");
        }

        User user = repository.findByUsername(passwordChangeRequest.getUsername()).orElseThrow();

        // Check if old password is correct
        if (!encoder.matches(passwordChangeRequest.getOldPassword(), user.getPassword())) {
            throw new ApiRequestException("Old password is incorrect.");
        }

        // Save new password
        user.setPassword(encoder.encode(passwordChangeRequest.getNewPassword()));
        repository.save(user);
    }

}