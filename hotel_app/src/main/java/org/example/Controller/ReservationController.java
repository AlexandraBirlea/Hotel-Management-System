package org.example.Controller;

import org.example.Dto.ReservationRequest;
import org.example.Model.Reservation;
import org.example.Service.ReservationService;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.List;

@RestController
@RequestMapping("/api/reservations")
@CrossOrigin(origins = "http://localhost:3000")   // IMPORTANT pt React
public class ReservationController {

    private final ReservationService reservationService;

    public ReservationController(ReservationService reservationService) {
        this.reservationService = reservationService;
    }

    @PostMapping
    public Reservation create(@RequestBody ReservationRequest request) {
        return reservationService.createReservation(
                request.getGuestId(),
                request.getRoomId(),
                request.getCheckIn(),
                request.getCheckOut()
        );
    }

    @GetMapping
    public List<Reservation> getAll() {
        return reservationService.getAll();
    }

    @GetMapping("/guest/{guestId}")
    public List<Reservation> getByGuest(@PathVariable Integer guestId) {
        return reservationService.getByGuest(guestId);
    }

    /**
     * Zile în care camera este complet ocupată (nu mai sunt unități libere).
     * GET /api/reservations/fully-booked?roomId=1&from=2025-01-01&to=2025-01-31
     */
    @GetMapping("/fully-booked")
    public List<LocalDate> getFullyBookedDates(
            @RequestParam Integer roomId,
            @RequestParam String from,
            @RequestParam String to
    ) {
        LocalDate fromDate = LocalDate.parse(from);
        LocalDate toDate = LocalDate.parse(to);
        return reservationService.getFullyBookedDates(roomId, fromDate, toDate);
    }

}
