package org.example.Controller;

import org.example.Model.User;
import org.example.Model.UserRole;
import org.example.Service.UserService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/employees")  // lasa ce aveai inainte daca e alt path
@CrossOrigin(origins = "http://localhost:3000")
public class EmployeeController {

    private final UserService userService;

    public EmployeeController(UserService userService) {
        this.userService = userService;
    }

    // ADD EMPLOYEE (folosit de AddEmployee.js)
    @PostMapping
    public ResponseEntity<User> addEmployee(@RequestBody User employee) {
        employee.setRole(UserRole.EMPLOYEE);   // fortam rolul
        try {
            User saved = userService.register(employee);
            saved.setPassword(null);           // nu trimitem parola la frontend
            return ResponseEntity.ok(saved);
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().build();
        }
    }

    // LIST EMPLOYEES (daca ai o pagina de lista)
    @GetMapping
    public List<User> getEmployees() {
        return userService.getEmployees();
    }
}
