FROM eclipse-temurin:17-jdk
WORKDIR /app
COPY target/classes /app/classes
EXPOSE 8080
CMD ["java","-cp","/app/classes","com.ecommerce.controller.ECommerceApp"]
