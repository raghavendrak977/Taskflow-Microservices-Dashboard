package com.microservices.clientservice.client;

import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@FeignClient(name = "todo-service")
public interface TodoFeignClient {

    @GetMapping("/api/todos")
    Map<String, Object> getAllTodos();

    @GetMapping("/api/todos/{id}")
    Map<String, Object> getTodoById(@PathVariable("id") Long id);

    @PostMapping("/api/todos")
    Map<String, Object> createTodo(@RequestBody TodoDTO todo);

    @PutMapping("/api/todos/{id}")
    Map<String, Object> updateTodo(@PathVariable("id") Long id,
                                   @RequestBody TodoDTO todo);

    @DeleteMapping("/api/todos/{id}")
    Map<String, Object> deleteTodo(@PathVariable("id") Long id);

    @GetMapping("/api/todos/status")
    Map<String, Object> health();
}
