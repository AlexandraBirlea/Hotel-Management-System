package org.example.Service;

import org.example.Model.Room;
import org.example.Repository.RoomRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class RoomService {

    private final RoomRepository roomRepository;

    public RoomService(RoomRepository roomRepository) {
        this.roomRepository = roomRepository;
    }

    public Room create(Room room) {
        return roomRepository.save(room);
    }

    public List<Room> findAll() {
        return roomRepository.findAll();
    }

    public Room updateRoom(Integer id, Room updated) {
        Room existing = roomRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Room not found"));

        existing.setNumber(updated.getNumber());
        existing.setType(updated.getType());
        existing.setCapacity(updated.getCapacity());
        existing.setPrice(updated.getPrice());
        existing.setTotalUnits(updated.getTotalUnits());
        existing.setImageUrl(updated.getImageUrl());

        return roomRepository.save(existing);
    }

    public void deleteRoom(Integer id) {
        if (!roomRepository.existsById(id)) {
            throw new RuntimeException("Room not found");
        }
        roomRepository.deleteById(id);
    }

    // ---------- custom query 1: price filter ----------
    public List<Room> searchByPrice(Double min, Double max) {
        if (min == null && max == null) {
            return roomRepository.findAll();
        }
        if (min == null) {
            return roomRepository.findByPriceLessThanEqual(max);
        }
        if (max == null) {
            return roomRepository.findByPriceGreaterThanEqual(min);
        }
        return roomRepository.findByPriceBetween(min, max);
    }

    // ---------- custom query 2: type + minCapacity ----------
    public List<Room> searchAdvanced(String type, Integer minCapacity) {
        boolean noType = (type == null || type.isBlank());
        if (noType && minCapacity == null) {
            return roomRepository.findAll();
        }
        return roomRepository.searchAdvanced(
                noType ? null : type.trim(),
                minCapacity
        );
    }
}
