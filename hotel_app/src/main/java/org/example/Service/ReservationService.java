package org.example.Service;

import org.example.Model.Reservation;
import org.example.Model.ReservationStatus;
import org.example.Model.Room;
import org.example.Model.User;
import org.example.Model.UserRole;
import org.example.Repository.ReservationRepository;
import org.example.Repository.RoomRepository;
import org.example.Repository.UserRepository;
import org.springframework.stereotype.Service;

import javax.transaction.Transactional;
import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;

@Service
public class ReservationService {

    private final ReservationRepository reservationRepository;
    private final UserRepository userRepository;
    private final RoomRepository roomRepository;

    public ReservationService(ReservationRepository reservationRepository,
                              UserRepository userRepository,
                              RoomRepository roomRepository) {
        this.reservationRepository = reservationRepository;
        this.userRepository = userRepository;
        this.roomRepository = roomRepository;
    }
    @Transactional
    public void deleteRoom(Integer roomId) {
        long reservations = reservationRepository.countByRoomId(roomId);
        if (reservations > 0) {
            throw new IllegalStateException(
                    "You cannot delete this room because there are "
                            + reservations + " existing reservations for it."
            );
        }

        roomRepository.deleteById(roomId);
    }
    /**
     * Creează o rezervare pentru un guest, cu verificare de disponibilitate:
     * nu permite mai multe rezervări suprapuse decât totalUnits pentru camera respectivă.
     */
    public Reservation createReservation(Integer guestId,
                                         Integer roomId,
                                         LocalDate checkIn,
                                         LocalDate checkOut) {

        // 1) Verificăm guest-ul
        User guest = userRepository.findById(guestId)
                .orElseThrow(() -> new RuntimeException("Guest not found"));

        if (guest.getRole() != UserRole.GUEST) {
            throw new RuntimeException("User is not a guest");
        }

        // 2) Verificăm camera
        Room room = roomRepository.findById(roomId)
                .orElseThrow(() -> new RuntimeException("Room not found"));

        if (room.getTotalUnits() == null || room.getTotalUnits() <= 0) {
            throw new RuntimeException("Room inventory not configured");
        }

        // 3) Verificăm suprapunerea cu alte rezervări
        int overlapping = reservationRepository
                .countByRoomAndCheckInLessThanAndCheckOutGreaterThan(
                        room,
                        checkOut,  // checkIn < newCheckOut
                        checkIn    // checkOut > newCheckIn
                );

        if (overlapping >= room.getTotalUnits()) {
            throw new RuntimeException(
                    "No rooms of this type available for selected dates"
            );
        }

        // 4) Creăm rezervarea
        Reservation reservation = new Reservation();
        reservation.setGuest(guest);
        reservation.setRoom(room);
        reservation.setCheckIn(checkIn);
        reservation.setCheckOut(checkOut);
        reservation.setStatus(ReservationStatus.BOOKED);

        return reservationRepository.save(reservation);
    }

    public List<Reservation> getAll() {
        return reservationRepository.findAll();
    }

    public List<Reservation> getByGuest(Integer guestId) {
        User guest = userRepository.findById(guestId)
                .orElseThrow(() -> new RuntimeException("Guest not found"));
        return reservationRepository.findByGuest(guest);
    }

    /**
     * Returnează lista de zile (LocalDate) în care camera respectivă
     * este complet ocupată (nu mai există unități libere).
     *
     * Intervalul este [from, to] inclusiv.
     */
    public List<LocalDate> getFullyBookedDates(Integer roomId,
                                               LocalDate from,
                                               LocalDate to) {
        Room room = roomRepository.findById(roomId)
                .orElseThrow(() -> new RuntimeException("Room not found"));

        Integer totalUnits = room.getTotalUnits();
        if (totalUnits == null || totalUnits <= 0) {
            return List.of();
        }

        // Luăm toate rezervările care se suprapun cu intervalul [from, to]
        List<Reservation> reservations = reservationRepository
                .findByRoomAndCheckOutGreaterThanAndCheckInLessThan(room, from, to);

        List<LocalDate> fullyBookedDays = new ArrayList<>();

        // Pentru fiecare zi din interval verificăm câte rezervări o acoperă
        for (LocalDate d = from; !d.isAfter(to); d = d.plusDays(1)) {
            int count = 0;
            for (Reservation r : reservations) {
                // ziua d este acoperită de rezervare dacă d ∈ [checkIn, checkOut)
                if (!d.isBefore(r.getCheckIn()) && d.isBefore(r.getCheckOut())) {
                    count++;
                }
            }
            if (count >= totalUnits) {
                fullyBookedDays.add(d);
            }
        }

        return fullyBookedDays;
    }
}
