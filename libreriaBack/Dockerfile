# Usa una imagen base con Java 21
FROM eclipse-temurin:21-jdk-alpine

# Crea un directorio para la app
WORKDIR /app

# Copia el JAR generado al contenedor
COPY target/demo-0.0.1-SNAPSHOT.jar app.jar

# Expone el puerto (opcional, pero útil)
EXPOSE 8080

# Comando para ejecutar la app
ENTRYPOINT ["java", "-jar", "app.jar"]
    