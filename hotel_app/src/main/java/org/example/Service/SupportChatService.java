package org.example.Service;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.example.Model.Reservation;
import org.example.Model.Room;
import org.example.Repository.ReservationRepository;
import org.example.Repository.RoomRepository;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.*;
import org.springframework.stereotype.Service;
import org.springframework.web.client.HttpClientErrorException;
import org.springframework.web.client.RestTemplate;

import java.time.format.DateTimeFormatter;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Service
public class SupportChatService {

    private final RoomRepository roomRepository;
    private final ReservationRepository reservationRepository;
    private final RestTemplate restTemplate = new RestTemplate();
    private final String apiKey;
    private final String model;
    private final ObjectMapper mapper = new ObjectMapper();

    public SupportChatService(RoomRepository roomRepository,
                              ReservationRepository reservationRepository,
                              @Value("${openai.api.key}") String apiKey,
                              @Value("${openai.model:gpt-4o-mini}") String model) {
        this.roomRepository = roomRepository;
        this.reservationRepository = reservationRepository;
        this.apiKey = apiKey;
        this.model = model;
    }

    // userId poate fi null (guest nelogat)
    public String askModel(Integer userId, String question) {

        String hotelContext = buildHotelContext(userId);

        String systemPrompt =
                "You are a helpful virtual assistant for a small boutique hotel. " +
                        "You must answer ONLY based on the hotel data I give you. " +
                        "If you don't know something, say you are not sure and suggest contacting reception.\n\n" +
                        "HOTEL DATA:\n" + hotelContext;

        // ---- construim JSON pt /v1/chat/completions ----
        Map<String, Object> requestBody = new HashMap<>();
        requestBody.put("model", model);
        requestBody.put("messages", List.of(
                Map.of("role", "system", "content", systemPrompt),
                Map.of("role", "user", "content", question)
        ));

        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_JSON);
        headers.setBearerAuth(apiKey);

        HttpEntity<Map<String, Object>> entity = new HttpEntity<>(requestBody, headers);

        try {
            ResponseEntity<String> response = restTemplate.postForEntity(
                    "https://api.openai.com/v1/chat/completions",
                    entity,
                    String.class
            );

            String body = response.getBody();
            if (!response.getStatusCode().is2xxSuccessful() || body == null) {
                throw new RuntimeException("OpenAI error: " + response.getStatusCode());
            }

            JsonNode json = mapper.readTree(body);
            String answer = json
                    .path("choices").get(0)
                    .path("message")
                    .path("content")
                    .asText();

            return answer.trim();

        } catch (HttpClientErrorException e) {
            // aici vezi exact ce trimite OpenAI ca eroare
            System.err.println("OpenAI HTTP error: " + e.getStatusCode());
            System.err.println("Body: " + e.getResponseBodyAsString());
            throw new RuntimeException("Failed to contact OpenAI", e);
        } catch (Exception e) {
            throw new RuntimeException("Failed to contact OpenAI", e);
        }
    }

    private String buildHotelContext(Integer userId) {
        StringBuilder sb = new StringBuilder();

        // 1) Camere + info basic
        List<Room> rooms = roomRepository.findAll();
        Map<String, List<Room>> byType = rooms.stream()
                .collect(Collectors.groupingBy(r -> r.getType().toLowerCase()));

        sb.append("Rooms and prices:\n");
        byType.forEach((type, list) -> {
            double minPrice = list.stream()
                    .mapToDouble(r -> r.getPrice() != null ? r.getPrice() : 0.0)
                    .min().orElse(0.0);
            int maxCapacity = list.stream()
                    .mapToInt(r -> r.getCapacity() != null ? r.getCapacity() : 0)
                    .max().orElse(0);

            sb.append(String.format("- %s: from %.0f €/night, up to %d guests.\n",
                    type, minPrice, maxCapacity));
        });

        // 2) Rezervările guest-ului (dacă ai userId)
        if (userId != null) {
            List<Reservation> myRes = reservationRepository.findByGuestId(userId);
            DateTimeFormatter fmt = DateTimeFormatter.ISO_LOCAL_DATE;

            sb.append("\nCurrent guest reservations (if any):\n");
            if (myRes.isEmpty()) {
                sb.append("- This guest has no reservations in the system.\n");
            } else {
                myRes.forEach(res -> sb.append(String.format(
                        "- Reservation #%d, room %s (%s), %s → %s, status: %s\n",
                        res.getId(),
                        res.getRoom() != null ? res.getRoom().getNumber() : "?",
                        res.getRoom() != null ? res.getRoom().getType() : "?",
                        res.getCheckIn() != null ? res.getCheckIn().format(fmt) : "?",
                        res.getCheckOut() != null ? res.getCheckOut().format(fmt) : "?",
                        res.getStatus()
                )));
            }
        }

        // 3) Politici simple
        sb.append("\nPolicies:\n")
                .append("- Check-in from 15:00, check-out until 11:00.\n")
                .append("- Breakfast included for all room types.\n")
                .append("- Free cancellation up to 24 hours before check-in.\n");

        return sb.toString();
    }

}
