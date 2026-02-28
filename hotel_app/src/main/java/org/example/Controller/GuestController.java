package org.example.Controller;

import org.example.Model.User;
import org.example.Model.UserRole;
import org.example.Service.UserService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/guests")   // lasa ce aveai inainte daca e alt path
@CrossOrigin(origins = "http://localhost:3000")
public class GuestController {

    private final UserService userService;

    public GuestController(UserService userService) {
        this.userService = userService;
    }

    // ADD GUEST (folosit de AddGuest.js)
    @PostMapping
    public ResponseEntity<User> addGuest(@RequestBody User guest) {
        guest.setRole(UserRole.GUEST);         // fortam rolul
        try {
            User saved = userService.register(guest);
            saved.setPassword(null);
            return ResponseEntity.ok(saved);
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().build();
        }
    }

    // LIST GUESTS (folosit de ListGuests.js)
    @GetMapping
    public List<User> getGuests() {
        return userService.getGuests();
    }
}
