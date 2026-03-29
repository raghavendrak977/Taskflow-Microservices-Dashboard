# Todo Microservices — Spring Boot + React

A full-stack microservices demo featuring:

- **Eureka Server** — service registry & discovery
- **todo-service** — three instances on :8081, :8082 & :8083, shared MySQL DB
- **client-service** — OpenFeign + Spring Cloud LoadBalancer (round-robin)
- **React + Vite** frontend — Axios, Tailwind CSS, live load-balancing log

---

## Architecture

```
React (Vite :5173)
    │
    │  HTTP via Vite proxy
    ▼
CLIENT-SERVICE (:8080)          ← registers with Eureka
    │
    │  OpenFeign  (service name: "todo-service")
    │  Spring Cloud LoadBalancer → round-robin
    ▼
┌─────────────┐   ┌─────────────┐   ┌─────────────┐
│ todo-service│   │ todo-service│   │ todo-service│   ← all register with Eureka
│   :8081     │   │   :8082     │   │   :8083     │
└──────┬──────┘   └──────┬──────┘   └──────┬──────┘
       └────────┬──────────────┬─────────┘
                ▼
           MySQL :3306
           database: tododb
```

---

## Prerequisites

| Tool    | Version |
| ------- | ------- |
| Java    | 17+     |
| Maven   | 3.8+    |
| MySQL   | 8.0+    |
| Node.js | 18+     |

---

## 1. MySQL Setup

```sql
-- Run in MySQL CLI or Workbench
CREATE DATABASE IF NOT EXISTS tododb;
-- The tables are auto-created by Hibernate (ddl-auto=update)
```

Update credentials in `todo-service/src/main/resources/application.properties`:

```properties
spring.datasource.username=root
spring.datasource.password=root
```

---

## 2. Start Services (in order)

### Step 1 — Eureka Server (port 8761)

```bash
cd eureka-server
mvn spring-boot:run
```

Dashboard: http://localhost:8761

---

### Step 2 — todo-service Instance 1 (port 8081)

```bash
cd todo-service
mvn spring-boot:run
```

---

### Step 3 — todo-service Instance 2 (port 8082)

```bash
cd todo-service
mvn spring-boot:run -Dspring-boot.run.arguments=--server.port=8082
```

---

### Step 3b — todo-service Instance 3 (port 8083)

```bash
cd todo-service
mvn spring-boot:run -Dspring-boot.run.arguments=--server.port=8083
```

All instances will appear in the Eureka dashboard under the name **TODO-SERVICE**.

---

### Step 4 — client-service (port 8080)

```bash
cd client-service
mvn spring-boot:run
```

---

### Step 5 — React Frontend (port 5173)

```bash
cd frontend
npm install
npm run dev
```

Open: http://localhost:5173

---

## 3. API Reference

### CLIENT-SERVICE endpoints (used by frontend)

| Method | Endpoint             | Description    |
| ------ | -------------------- | -------------- |
| GET    | `/client/todos`      | Get all todos  |
| GET    | `/client/todos/{id}` | Get todo by id |
| POST   | `/client/todos`      | Create todo    |
| PUT    | `/client/todos/{id}` | Update todo    |
| DELETE | `/client/todos/{id}` | Delete todo    |

### TODO-SERVICE direct endpoints (for testing)

| Method | Endpoint            |
| ------ | ------------------- |
| GET    | `/api/todos`        |
| GET    | `/api/todos/{id}`   |
| POST   | `/api/todos`        |
| PUT    | `/api/todos/{id}`   |
| DELETE | `/api/todos/{id}`   |
| GET    | `/api/todos/health` |

### Sample Response (includes which instance served the request)

```json
{
  "todo": {
    "id": 1,
    "task": "Write microservices demo",
    "completed": false
  },
  "servedByPort": "8081",
  "instanceId": "todo-service:8081"
}
```

---

## 4. How Load Balancing Works

Spring Cloud LoadBalancer uses **round-robin** by default.

```
Request 1  →  todo-service:8081
Request 2  →  todo-service:8082
Request 3  →  todo-service:8081
Request 4  →  todo-service:8082
...
```

The frontend's **Load Balancer Log** panel shows each request and which port handled it, along with a live distribution chart.

The key is in the Feign client — note it uses the **service name**, not a URL:

```java
@FeignClient(name = "todo-service")   // ← service name, no port/URL
public interface TodoFeignClient {
    @GetMapping("/api/todos")
    ResponseEntity<Map<String, Object>> getAllTodos();
}
```

Eureka maintains the list of healthy instances, and Spring Cloud LoadBalancer picks one automatically.

---

## 5. Project Structure

```
microservices-todo/
├── eureka-server/
│   ├── pom.xml
│   └── src/main/
│       ├── java/.../EurekaServerApplication.java
│       └── resources/application.properties
│
├── todo-service/
│   ├── pom.xml
│   └── src/main/
│       ├── java/.../
│       │   ├── TodoServiceApplication.java
│       │   ├── entity/Todo.java
│       │   ├── repository/TodoRepository.java
│       │   ├── service/TodoService.java
│       │   └── controller/TodoController.java
│       └── resources/application.properties
│
├── client-service/
│   ├── pom.xml
│   └── src/main/
│       ├── java/.../
│       │   ├── ClientServiceApplication.java
│       │   ├── client/TodoFeignClient.java
│       │   ├── client/TodoDTO.java
│       │   ├── config/CorsConfig.java
│       │   └── controller/ClientController.java
│       └── resources/application.properties
│
└── frontend/
    ├── package.json
    ├── vite.config.js
    ├── tailwind.config.js
    ├── index.html
    └── src/
        ├── main.jsx
        ├── App.jsx
        ├── index.css
        ├── api/todoApi.js
        └── components/
            ├── TodoItem.jsx
            ├── InstanceBadge.jsx
            ├── RequestLog.jsx
            └── ServiceStatus.jsx
```

---

## 6. Troubleshooting

**Eureka shows only one todo-service instance**

- Ensure both JVM processes are running on different ports
- Check `eureka.instance.instance-id` — it's set to `${spring.application.name}:${server.port}` so they won't conflict

**Feign gets `Connection refused`**

- Wait ~30 seconds after starting both todo-service instances for Eureka to propagate
- Check http://localhost:8761 — both instances must be listed under TODO-SERVICE

**MySQL connection error**

- Verify credentials in `application.properties`
- Ensure MySQL is running: `mysql -u root -p`
- The `tododb` schema is created automatically via `createDatabaseIfNotExist=true`

**CORS errors in browser**

- The Vite proxy (`/client` → `http://localhost:8080`) handles this in dev
- For production, `CorsConfig.java` in client-service allows `localhost:5173`
