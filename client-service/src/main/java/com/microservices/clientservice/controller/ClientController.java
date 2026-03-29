package com.microservices.clientservice.controller;

import com.microservices.clientservice.client.TodoDTO;
import com.microservices.clientservice.client.TodoFeignClient;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

/**
 * CLIENT-SERVICE exposes REST endpoints to the frontend.
 * All calls are forwarded to TODO-SERVICE via OpenFeign.
 * Spring Cloud LoadBalancer distributes requests in round-robin
 * across the two running TODO-SERVICE instances.
 */
@RestController
@RequestMapping("/client/todos")
@RequiredArgsConstructor
@Slf4j
public class ClientController {

    private final TodoFeignClient todoFeignClient;

    @GetMapping
    public ResponseEntity<Map<String, Object>> getAllTodos() {
        log.info("CLIENT-SERVICE → fetching all todos via Feign");
        ResponseEntity<Map<String, Object>> response = todoFeignClient.getAllTodos();
        logInstanceInfo(response.getBody());
        return response;
    }

    @GetMapping("/{id}")
    public ResponseEntity<Map<String, Object>> getTodoById(@PathVariable Long id) {
        log.info("CLIENT-SERVICE → fetching todo id={} via Feign", id);
        ResponseEntity<Map<String, Object>> response = todoFeignClient.getTodoById(id);
        logInstanceInfo(response.getBody());
        return response;
    }

    @PostMapping
    public ResponseEntity<Map<String, Object>> createTodo(@RequestBody TodoDTO todo) {
        log.info("CLIENT-SERVICE → creating todo '{}' via Feign", todo.getTask());
        ResponseEntity<Map<String, Object>> response = todoFeignClient.createTodo(todo);
        logInstanceInfo(response.getBody());
        return response;
    }

    @PutMapping("/{id}")
    public ResponseEntity<Map<String, Object>> updateTodo(
            @PathVariable Long id,
            @RequestBody TodoDTO todo) {
        log.info("CLIENT-SERVICE → updating todo id={} via Feign", id);
        ResponseEntity<Map<String, Object>> response = todoFeignClient.updateTodo(id, todo);
        logInstanceInfo(response.getBody());
        return response;
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Map<String, Object>> deleteTodo(@PathVariable Long id) {
        log.info("CLIENT-SERVICE → deleting todo id={} via Feign", id);
        ResponseEntity<Map<String, Object>> response = todoFeignClient.deleteTodo(id);
        logInstanceInfo(response.getBody());
        return response;
    }

    private void logInstanceInfo(Map<String, Object> body) {
        if (body != null && body.containsKey("servedByPort")) {
            log.info("  ↳ Request served by TODO-SERVICE instance on port: {}", body.get("servedByPort"));
        }
    }

    @GetMapping("/health")
    public ResponseEntity<Map<String, Object>> getHealth() {
        return ResponseEntity.ok(todoFeignClient.getHealth());
    }
}
