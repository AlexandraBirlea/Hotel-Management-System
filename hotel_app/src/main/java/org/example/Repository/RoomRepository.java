package org.example.Repository;

import org.example.Model.Room;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface RoomRepository extends JpaRepository<Room, Integer> {

    // custom query 1 – price filter
    List<Room> findByPriceBetween(Double min, Double max);
    List<Room> findByPriceGreaterThanEqual(Double min);
    List<Room> findByPriceLessThanEqual(Double max);

    // custom query 2 – type + minCapacity
    @Query(
            "SELECT r " +
                    "FROM Room r " +
                    "WHERE (:type IS NULL OR LOWER(r.type) = LOWER(:type)) " +
                    "AND (:minCapacity IS NULL OR r.capacity >= :minCapacity)"
    )
    List<Room> searchAdvanced(
            @Param("type") String type,
            @Param("minCapacity") Integer minCapacity
    );
}
