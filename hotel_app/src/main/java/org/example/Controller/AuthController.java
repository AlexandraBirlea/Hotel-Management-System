package org.example.Controller;

import org.example.Dto.LoginRequest;
import org.example.Model.User;
import org.example.Service.UserService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
@CrossOrigin(origins = "http://localhost:3000")
public class AuthController {

    private final UserService userService;

    public AuthController(UserService userService) {
        this.userService = userService;
    }

    // REGISTER (guest sau employee)
    @PostMapping("/register")
    public ResponseEntity<User> register(@RequestBody User user) {
        try {
            User saved = userService.register(user);
            saved.setPassword(null); // nu trimitem parola inapoi
            return ResponseEntity.ok(saved);
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().build();
        }
    }

    // LOGIN
    @PostMapping("/login")
    public ResponseEntity<User> login(@RequestBody LoginRequest request) {
        try {
            User user = userService.login(request.getEmail(), request.getPassword());
            user.setPassword(null);
            return ResponseEntity.ok(user);
        } catch (RuntimeException e) {
            return ResponseEntity.status(401).build(); // UNAUTHORIZED
        }
    }
}
