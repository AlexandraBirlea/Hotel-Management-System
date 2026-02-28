package org.example.Controller;

import org.example.Dto.ChatRequest;
import org.example.Service.SupportChatService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/support-chat")
@CrossOrigin(origins = "http://localhost:3000")
public class SupportChatController {

    private final SupportChatService chatService;

    public SupportChatController(SupportChatService chatService) {
        this.chatService = chatService;
    }

    @PostMapping
    public ResponseEntity<String> chat(@RequestBody ChatRequest req) throws Exception {
        Integer userId = req.getUserId();        // poate fi null
        String answer = chatService.askModel(userId, req.getMessage());
        return ResponseEntity.ok(answer);
    }
}
