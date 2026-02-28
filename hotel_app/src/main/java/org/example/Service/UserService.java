package org.example.Service;

import org.example.Model.User;
import org.example.Model.UserRole;
import org.example.Repository.UserRepository;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class UserService {

    private final UserRepository userRepository;

    public UserService(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    public User register(User user) {
        // verificam daca exista deja email
        if (userRepository.findByEmail(user.getEmail()).isPresent()) {
            throw new RuntimeException("Email already used");
        }
        if (user.getRole() == null) {
            user.setRole(UserRole.GUEST); // default guest
        }
        return userRepository.save(user);
    }

    public User login(String email, String password) {
        Optional<User> opt = userRepository.findByEmail(email);
        if (opt.isEmpty()) {
            throw new RuntimeException("Invalid email or password");
        }
        User user = opt.get();
        if (!user.getPassword().equals(password)) {
            throw new RuntimeException("Invalid email or password");
        }
        return user;
    }

    public List<User> getGuests() {
        return userRepository.findByRole(UserRole.GUEST);
    }

    public List<User> getEmployees() {
        return userRepository.findByRole(UserRole.EMPLOYEE);
    }
}
