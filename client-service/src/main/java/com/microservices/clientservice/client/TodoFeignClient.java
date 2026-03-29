package com.microservices.clientservice.client;

import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

/**
 * OpenFeign client that calls TODO-SERVICE by its registered Eureka service name.
 * Spring Cloud LoadBalancer automatically round-robins between the two instances.
 */
@FeignClient(name = "todo-service")
public interface TodoFeignClient {

    @GetMapping("/api/todos")
    ResponseEntity<Map<String, Object>> getAllTodos();

    @GetMapping("/api/todos/{id}")
    ResponseEntity<Map<String, Object>> getTodoById(@PathVariable("id") Long id);

    @PostMapping("/api/todos")
    ResponseEntity<Map<String, Object>> createTodo(@RequestBody TodoDTO todo);

    @PutMapping("/api/todos/{id}")
    ResponseEntity<Map<String, Object>> updateTodo(
            @PathVariable("id") Long id,
            @RequestBody TodoDTO todo);

    @DeleteMapping("/api/todos/{id}")
    ResponseEntity<Map<String, Object>> deleteTodo(@PathVariable("id") Long id);

    @GetMapping("/actuator/health")
    Map<String, Object> getHealth();
}
