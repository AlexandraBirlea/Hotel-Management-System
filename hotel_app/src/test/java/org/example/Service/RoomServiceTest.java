package org.example.Service;

import org.example.Model.Room;
import org.example.Repository.RoomRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.params.ParameterizedTest;
import org.junit.jupiter.params.provider.MethodSource;

import java.util.List;
import java.util.Optional;
import java.util.stream.Stream;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

import org.junit.jupiter.params.provider.Arguments;

class RoomServiceTest {

    private RoomRepository roomRepository;
    private RoomService roomService;

    @BeforeEach
    void setup() {
        roomRepository = mock(RoomRepository.class);
        roomService = new RoomService(roomRepository);
    }

    @Test
    @DisplayName("TC5 - Create room should save new room")
    void shouldCreateRoomSuccessfully() {

        Room room = new Room();
        room.setNumber(101);

        when(roomRepository.save(room)).thenReturn(room);

        Room result = roomService.create(room);

        assertEquals(101, result.getNumber());
        verify(roomRepository).save(room);
    }

    @Test
    @DisplayName("TC6 - Find all rooms should return list")
    void shouldReturnAllRooms() {

        when(roomRepository.findAll()).thenReturn(List.of(new Room(), new Room()));

        List<Room> rooms = roomService.findAll();

        assertEquals(2, rooms.size());
    }

    @Test
    @DisplayName("TC7 - Update room should modify room data")
    void shouldUpdateRoomInformation() {

        Room existing = new Room();
        existing.setNumber(100);

        when(roomRepository.findById(1)).thenReturn(Optional.of(existing));
        when(roomRepository.save(existing)).thenReturn(existing);

        Room updated = new Room();
        updated.setNumber(200);

        Room result = roomService.updateRoom(1, updated);

        assertEquals(200, result.getNumber());
    }

    @Test
    @DisplayName("TC8 - Delete room should remove room")
    void shouldDeleteRoom() {

        when(roomRepository.existsById(1)).thenReturn(true);

        roomService.deleteRoom(1);

        verify(roomRepository).deleteById(1);
    }

    @ParameterizedTest
    @MethodSource("priceRangeProvider")
    @DisplayName("TC9 - Search rooms by price range should return rooms within interval")
    void shouldReturnRoomsWithinPriceRange(double minPrice, double maxPrice, double roomPrice) {

        Room room = new Room();
        room.setPrice(roomPrice);

        when(roomRepository.findByPriceBetween(minPrice, maxPrice))
                .thenReturn(List.of(room));

        List<Room> result = roomService.searchByPrice(minPrice, maxPrice);

        assertFalse(result.isEmpty());

        assertTrue(result.stream()
                .allMatch(r -> r.getPrice() >= minPrice && r.getPrice() <= maxPrice));
    }

    static Stream<Arguments> priceRangeProvider() {
        return Stream.of(
                Arguments.of(50,150,100),
                Arguments.of(100,300,200),
                Arguments.of(10,50,30)
        );
    }

    @Test
    @DisplayName("TC10 - Search rooms should return empty list when no rooms match price range")
    void shouldReturnEmptyListWhenNoRoomsMatchPriceRange() {

        when(roomRepository.findByPriceBetween(10.0,20.0))
                .thenReturn(List.of());

        List<Room> result = roomService.searchByPrice(10.0,20.0);

        assertTrue(result.isEmpty());
    }
    @Test
    @DisplayName("TC11 - Advanced search should filter by type and capacity")
    void shouldFilterRoomsByTypeAndCapacity() {

        Room room = new Room();
        room.setType("single");
        room.setCapacity(2);

        when(roomRepository.searchAdvanced("single",2)).thenReturn(List.of(room));

        List<Room> result = roomService.searchAdvanced("single",2);

        assertEquals(1, result.size());
        assertEquals("single", result.get(0).getType());
    }
}