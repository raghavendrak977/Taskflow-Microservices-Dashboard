# eureka-server/Dockerfile  (same pattern for todo-service and client-service)

# Step 1: Use Java 17 as the base
FROM eclipse-temurin:17-jdk-alpine

# Step 2: Set working directory inside the container
WORKDIR /app

# Step 3: Copy the built jar file in
COPY target/*.jar app.jar

# Step 4: Run it
ENTRYPOINT ["java", "-jar", "app.jar"]