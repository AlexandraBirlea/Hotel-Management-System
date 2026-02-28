package org.example.Service;

import org.example.Model.User;
import org.example.Model.UserRole;
import org.example.Repository.UserRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.params.ParameterizedTest;
import org.junit.jupiter.params.provider.ValueSource;

import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

class UserServiceTest {

    private UserRepository userRepository;
    private UserService userService;
    //executa metodele inainte de fiecare test
    @BeforeEach
    void setup() {
        userRepository = mock(UserRepository.class);//Creeaza un obiect simulare pentru o clasa
        userService = new UserService(userRepository);
    }

    @Test
    @DisplayName("TC12 - Register user when email is unique")
    void shouldRegisterUserSuccessfully() {

        User user = new User();
        user.setEmail("test@test.com");

        when(userRepository.findByEmail(user.getEmail())).thenReturn(Optional.empty());
        when(userRepository.save(user)).thenReturn(user);

        User result = userService.register(user);

        assertEquals("test@test.com", result.getEmail());
    }

    @Test
    @DisplayName("TC13 - Register should fail when email already exists")
    void shouldThrowExceptionWhenEmailAlreadyExists() {

        User user = new User();
        user.setEmail("test@test.com");

        when(userRepository.findByEmail(user.getEmail())).thenReturn(Optional.of(user));

        Exception ex = assertThrows(RuntimeException.class,
                () -> userService.register(user));

        assertEquals("Email already used", ex.getMessage());
    }

    @Test
    @DisplayName("TC14 - Login should succeed with correct credentials")
    void shouldLoginSuccessfully() {

        User user = new User();
        user.setEmail("alexandra@gmail.com");
        user.setPassword("123");

        when(userRepository.findByEmail("alexandra@gmail.com")).thenReturn(Optional.of(user));

        User result = userService.login("alexandra@gmail.com","123");

        assertNotNull(result);
    }

    @ParameterizedTest
    @ValueSource(strings = {"wrong","1234","abc","xyz"})
    @DisplayName("TC15 - Login should fail with incorrect passwords")
    void shouldFailLoginForInvalidPasswords(String wrongPassword) {

        User user = new User();
        user.setEmail("alexandra@gmail.com");
        user.setPassword("parolacorecta");

        when(userRepository.findByEmail("alexandra@gmail.com")).thenReturn(Optional.of(user));

        Exception ex = assertThrows(RuntimeException.class,
                () -> userService.login("alexandra@gmail.com", wrongPassword));

        assertEquals("Invalid email or password", ex.getMessage());
    }

    @Test
    @DisplayName("TC16 - Get guests should return only guest users")
    void shouldReturnOnlyGuests() {

        User g1 = new User(); g1.setRole(UserRole.GUEST);
        User g2 = new User(); g2.setRole(UserRole.GUEST);

        when(userRepository.findByRole(UserRole.GUEST)).thenReturn(List.of(g1,g2));

        List<User> result = userService.getGuests();

        assertEquals(2,result.size());
    }

    @Test
    @DisplayName("TC17 - Get employees should return only employee users")
    void shouldReturnOnlyEmployees() {

        User emp = new User();
        emp.setRole(UserRole.EMPLOYEE);

        when(userRepository.findByRole(UserRole.EMPLOYEE)).thenReturn(List.of(emp));

        List<User> result = userService.getEmployees();

        assertEquals(1,result.size());
    }
}