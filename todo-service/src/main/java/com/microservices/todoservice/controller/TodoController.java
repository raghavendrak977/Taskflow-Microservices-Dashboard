package com.microservices.todoservice.controller;

import com.microservices.todoservice.entity.Todo;
import com.microservices.todoservice.service.TodoService;
import lombok.RequiredArgsConstructor;
import org.springframework.core.env.Environment;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/todos")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
public class TodoController {

    private final TodoService todoService;
    private final Environment environment;

    // Helper: attach instance port to every response
    private String getInstancePort() {
        return environment.getProperty("local.server.port", "unknown");
    }

    @GetMapping
    public ResponseEntity<Map<String, Object>> getAllTodos() {
        List<Todo> todos = todoService.getAllTodos();
        Map<String, Object> response = new HashMap<>();
        response.put("todos", todos);
        response.put("servedByPort", getInstancePort());
        response.put("instanceId", "todo-service:" + getInstancePort());
        return ResponseEntity.ok(response);
    }

    @GetMapping("/{id}")
    public ResponseEntity<Map<String, Object>> getTodoById(@PathVariable Long id) {
        return todoService.getTodoById(id)
                .map(todo -> {
                    Map<String, Object> response = new HashMap<>();
                    response.put("todo", todo);
                    response.put("servedByPort", getInstancePort());
                    response.put("instanceId", "todo-service:" + getInstancePort());
                    return ResponseEntity.ok(response);
                })
                .orElse(ResponseEntity.notFound().build());
    }

    @PostMapping
    public ResponseEntity<Map<String, Object>> createTodo(@RequestBody Todo todo) {
        Todo created = todoService.createTodo(todo);
        Map<String, Object> response = new HashMap<>();
        response.put("todo", created);
        response.put("servedByPort", getInstancePort());
        response.put("instanceId", "todo-service:" + getInstancePort());
        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }

    @PutMapping("/{id}")
    public ResponseEntity<Map<String, Object>> updateTodo(
            @PathVariable Long id,
            @RequestBody Todo todo) {
        return todoService.updateTodo(id, todo)
                .map(updated -> {
                    Map<String, Object> response = new HashMap<>();
                    response.put("todo", updated);
                    response.put("servedByPort", getInstancePort());
                    response.put("instanceId", "todo-service:" + getInstancePort());
                    return ResponseEntity.ok(response);
                })
                .orElse(ResponseEntity.notFound().build());
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Map<String, Object>> deleteTodo(@PathVariable Long id) {
        Map<String, Object> response = new HashMap<>();
        if (todoService.deleteTodo(id)) {
            response.put("message", "Todo deleted successfully");
            response.put("servedByPort", getInstancePort());
            response.put("instanceId", "todo-service:" + getInstancePort());
            return ResponseEntity.ok(response);
        }
        response.put("message", "Todo not found");
        return ResponseEntity.status(HttpStatus.NOT_FOUND).body(response);
    }

    @GetMapping("/health")
    public ResponseEntity<Map<String, Object>> health() {
        Map<String, Object> response = new HashMap<>();
        response.put("status", "UP");
        response.put("service", "todo-service");
        response.put("port", getInstancePort());
        return ResponseEntity.ok(response);
    }
}
