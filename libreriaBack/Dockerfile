FROM eclipse-temurin:21-jdk-alpine AS build
WORKDIR /workspace/app

# Copia los archivos necesarios para construir
COPY mvnw .
COPY .mvn .mvn
COPY pom.xml .
COPY src src

# Construye la aplicación
RUN ./mvnw package -DskipTests

# Fase de ejecución
FROM eclipse-temurin:21-jdk-alpine
WORKDIR /app
COPY --from=build /workspace/app/target/demo-0.0.1-SNAPSHOT.jar app.jar
ENTRYPOINT ["java","-jar","app.jar"]