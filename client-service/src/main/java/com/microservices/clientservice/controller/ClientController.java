package com.microservices.clientservice.controller;

import com.microservices.clientservice.client.TodoDTO;
import com.microservices.clientservice.client.TodoFeignClient;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/client/todos")
@RequiredArgsConstructor
@Slf4j
public class ClientController {

    private final TodoFeignClient todoFeignClient;

    @GetMapping
    public ResponseEntity<Map<String, Object>> getAllTodos() {
        Map<String, Object> response = todoFeignClient.getAllTodos();
        log.info("  ↳ Served by port: {}", response.get("servedByPort"));
        return ResponseEntity.ok(response);
    }

    @GetMapping("/{id}")
    public ResponseEntity<Map<String, Object>> getTodoById(@PathVariable Long id) {
        Map<String, Object> response = todoFeignClient.getTodoById(id);
        return ResponseEntity.ok(response);
    }

    @PostMapping
    public ResponseEntity<Map<String, Object>> createTodo(@RequestBody TodoDTO todo) {
        Map<String, Object> response = todoFeignClient.createTodo(todo);
        log.info("  ↳ Served by port: {}", response.get("servedByPort"));
        return ResponseEntity.status(201).body(response);
    }

    @PutMapping("/{id}")
    public ResponseEntity<Map<String, Object>> updateTodo(
            @PathVariable Long id, @RequestBody TodoDTO todo) {
        Map<String, Object> response = todoFeignClient.updateTodo(id, todo);
        return ResponseEntity.ok(response);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Map<String, Object>> deleteTodo(@PathVariable Long id) {
        Map<String, Object> response = todoFeignClient.deleteTodo(id);
        return ResponseEntity.ok(response);
    }
//    @GetMapping("/health")
//    public ResponseEntity<Map<String, Object>> health() {
//        Map<String, Object> response = todoFeignClient.health();
//        return ResponseEntity.ok(response);
//    }
@GetMapping("/health")
public ResponseEntity<Map<String, Object>> health() {
    Map<String, Object> response = todoFeignClient.health();
    return ResponseEntity.ok(response);
}
}
