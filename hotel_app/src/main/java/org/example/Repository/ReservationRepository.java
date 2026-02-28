package org.example.Repository;

import org.example.Model.Reservation;
import org.example.Model.Room;
import org.example.Model.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.time.LocalDate;
import java.util.List;

public interface ReservationRepository extends JpaRepository<Reservation, Integer> {

    List<Reservation> findByGuest(User guest);
    List<Reservation> findByGuestId(Integer guestId);

    // Rezervări care se suprapun cu un interval [checkIn, checkOut)
    int countByRoomAndCheckInLessThanAndCheckOutGreaterThan(
            Room room,
            LocalDate checkOut,
            LocalDate checkIn
    );

    List<Reservation> findByRoomAndCheckOutGreaterThanAndCheckInLessThan(
            Room room,
            LocalDate from,
            LocalDate to
    );
    long countByRoomId(Integer roomId);

}
