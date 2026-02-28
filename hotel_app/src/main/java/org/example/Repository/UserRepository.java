package org.example.Repository;

import org.example.Model.User;
import org.example.Model.UserRole;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface UserRepository extends JpaRepository<User, Integer> {

    Optional<User> findByEmail(String email);

    List<User> findByRole(UserRole role); // ex: toti guestii, toti employee
}
