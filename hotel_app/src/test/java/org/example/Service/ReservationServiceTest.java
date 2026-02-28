package org.example.Service;

import org.example.Model.*;
import org.example.Repository.ReservationRepository;
import org.example.Repository.RoomRepository;
import org.example.Repository.UserRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.params.ParameterizedTest;
import org.junit.jupiter.params.provider.MethodSource;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;
import java.util.stream.Stream;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

import org.junit.jupiter.params.provider.Arguments;

class ReservationServiceTest {

    private ReservationRepository reservationRepository;
    private UserRepository userRepository;
    private RoomRepository roomRepository;
    private ReservationService reservationService;

    @BeforeEach
    void setup() {
        reservationRepository = mock(ReservationRepository.class);
        userRepository = mock(UserRepository.class);
        roomRepository = mock(RoomRepository.class);
        reservationService = new ReservationService(reservationRepository, userRepository, roomRepository);
    }

    @Test
    @DisplayName("TC1 - Create reservation successfully when room is available")
    void shouldCreateReservationWhenRoomAvailable() {

        User guest = new User();
        guest.setId(1);
        guest.setRole(UserRole.GUEST);

        Room room = new Room();
        room.setId(1);
        room.setTotalUnits(1);

        when(userRepository.findById(1)).thenReturn(Optional.of(guest));
        when(roomRepository.findById(1)).thenReturn(Optional.of(room));
        when(reservationRepository.countByRoomAndCheckInLessThanAndCheckOutGreaterThan(any(), any(), any()))
                .thenReturn(0);

        Reservation reservation = new Reservation();
        when(reservationRepository.save(any())).thenReturn(reservation);

        Reservation result = reservationService.createReservation(
                1,1,
                LocalDate.of(2026,1,26),
                LocalDate.of(2026,1,28));
        assertNotNull(result);
        verify(userRepository).findById(1);//Verifica dacă o metodă a fost apelată.
        verify(roomRepository).findById(1);
        verify(reservationRepository).save(any());
    }

    @Test
    @DisplayName("TC2 - Reservation should fail when user is not guest")
    void shouldThrowExceptionWhenUserIsNotGuest() {

        User employee = new User();
        employee.setId(1);
        employee.setRole(UserRole.EMPLOYEE);

        when(userRepository.findById(1)).thenReturn(Optional.of(employee));

        Exception ex = assertThrows(RuntimeException.class, //Verifica daca metoda arunca o excepție.

                () -> reservationService.createReservation(
                        1,1,
                        LocalDate.now(),
                        LocalDate.now().plusDays(1)));

        assertEquals("User is not a guest", ex.getMessage());//Verifica daca doua valori sunt egale.
    }

    @Test
    @DisplayName("TC3 - Delete room should fail when reservations exist")
    void shouldNotDeleteRoomWhenReservationsExist() {

        when(reservationRepository.countByRoomId(1)).thenReturn(2L);

        Exception ex = assertThrows(IllegalStateException.class,
                () -> reservationService.deleteRoom(1));

        assertTrue(ex.getMessage().contains("You cannot delete this room"));
    }

    @ParameterizedTest //Testeaza aceeași funcționalitate cu mai multe valori.
    @MethodSource("reservationIntervalsProvider")
    @DisplayName("TC4 - Fully booked dates should be calculated correctly")
    void shouldReturnFullyBookedDates(LocalDate startDate, LocalDate endDate) {

        Room room = new Room();
        room.setId(1);
        room.setTotalUnits(1);

        when(roomRepository.findById(1)).thenReturn(Optional.of(room));

        Reservation reservation = new Reservation();
        reservation.setCheckIn(startDate);
        reservation.setCheckOut(endDate);

        when(reservationRepository.findByRoomAndCheckOutGreaterThanAndCheckInLessThan(any(), any(), any()))
                .thenReturn(List.of(reservation));

        List<LocalDate> result =
                reservationService.getFullyBookedDates(1, startDate, endDate);

        assertFalse(result.isEmpty());
    }

    static Stream<Arguments> reservationIntervalsProvider() {
        return Stream.of(
                Arguments.of(LocalDate.of(2026,1,26), LocalDate.of(2026,1,27)),
                Arguments.of(LocalDate.of(2026,2,1), LocalDate.of(2026,2,3)),
                Arguments.of(LocalDate.of(2026,3,10), LocalDate.of(2026,3,12))
        );
    }
}