package org.example.Controller;

import org.example.Model.Room;
import org.example.Service.RoomService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/rooms")
@CrossOrigin(
        origins = "http://localhost:3000",
        methods = {
                RequestMethod.GET,
                RequestMethod.POST,
                RequestMethod.DELETE,
                RequestMethod.PUT,
                RequestMethod.OPTIONS
        }
)
public class RoomController {

    private final RoomService roomService;

    public RoomController(RoomService roomService) {
        this.roomService = roomService;
    }

    // CREATE room
    @PostMapping
    public Room addRoom(@RequestBody Room room) {
        return roomService.create(room);
    }

    // READ all rooms
    @GetMapping
    public List<Room> getRooms() {
        return roomService.findAll();
    }

    // UPDATE room
    @PutMapping("/{id}")
    public Room updateRoom(@PathVariable Integer id, @RequestBody Room room) {
        return roomService.updateRoom(id, room);
    }

    // DELETE room by id
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteRoom(@PathVariable Integer id) {
        roomService.deleteRoom(id);
        return ResponseEntity.noContent().build();
    }

    // ---------- CUSTOM QUERY 1: price filter ----------
    // GET /api/rooms/search/price?min=50&max=100
    @GetMapping("/search/price")
    public List<Room> searchByPrice(
            @RequestParam(required = false) Double min,
            @RequestParam(required = false) Double max
    ) {
        return roomService.searchByPrice(min, max);
    }

    // ---------- CUSTOM QUERY 2: type + minCapacity ----------
    // GET /api/rooms/search/advanced?type=double&minCapacity=2
    @GetMapping("/search/advanced")
    public List<Room> searchAdvanced(
            @RequestParam(required = false) String type,
            @RequestParam(required = false) Integer minCapacity
    ) {
        return roomService.searchAdvanced(type, minCapacity);
    }
}
