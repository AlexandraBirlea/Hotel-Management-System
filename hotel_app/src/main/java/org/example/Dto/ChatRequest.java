package org.example.Dto;

public class ChatRequest {

    // opțional – poți trimite id-ul guest-ului logat
    private Integer userId;
    private String message;

    public ChatRequest() {
    }

    public ChatRequest(Integer userId, String message) {
        this.userId = userId;
        this.message = message;
    }

    public Integer getUserId() {
        return userId;
    }

    public void setUserId(Integer userId) {
        this.userId = userId;
    }

    public String getMessage() {
        return message;
    }

    public void setMessage(String message) {
        this.message = message;
    }
}
