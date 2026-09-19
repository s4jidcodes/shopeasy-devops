package com.ecommerce.controller;

import com.sun.net.httpserver.HttpExchange;
import com.sun.net.httpserver.HttpServer;

import java.io.IOException;
import java.io.InputStream;
import java.io.OutputStream;
import java.net.InetSocketAddress;
import java.net.URLConnection;

public class ECommerceApp {

  public static void main(String[] args) throws IOException {

    HttpServer server = HttpServer.create(
        new InetSocketAddress(8080), 0);

    server.createContext("/", ECommerceApp::serveStaticFile);

    server.start();

    System.out.println("=================================");
    System.out.println("   ShopEasy E-Commerce Website");
    System.out.println("=================================");
    System.out.println("Server started successfully!");
    System.out.println("Open: http://localhost:8080");
  }

  private static void serveStaticFile(HttpExchange exchange)
      throws IOException {

    String path = exchange.getRequestURI().getPath();

    if (path.equals("/") || path.isEmpty()) {
      path = "/index.html";
    }

    // Prevent path traversal
    if (path.contains("..")) {
      send404(exchange);
      return;
    }

    String resourcePath = "/static" + path;

    try (InputStream inputStream = ECommerceApp.class.getResourceAsStream(resourcePath)) {

      if (inputStream == null) {
        send404(exchange);
        return;
      }

      byte[] response = inputStream.readAllBytes();

      String contentType = getContentType(path);

      exchange.getResponseHeaders()
          .set("Content-Type", contentType);

      exchange.sendResponseHeaders(200, response.length);

      try (OutputStream output = exchange.getResponseBody()) {
        output.write(response);
      }
    }
  }

  private static String getContentType(String path) {

    String type = URLConnection.guessContentTypeFromName(path);

    if (type != null) {
      return type;
    }

    if (path.endsWith(".js")) {
      return "application/javascript; charset=UTF-8";
    }

    if (path.endsWith(".css")) {
      return "text/css; charset=UTF-8";
    }

    if (path.endsWith(".html")) {
      return "text/html; charset=UTF-8";
    }

    return "application/octet-stream";
  }

  private static void send404(HttpExchange exchange)
      throws IOException {

    String message = "404 - Resource Not Found";

    byte[] response = message.getBytes(java.nio.charset.StandardCharsets.UTF_8);

    exchange.getResponseHeaders()
        .set("Content-Type", "text/plain; charset=UTF-8");

    exchange.sendResponseHeaders(404, response.length);

    try (OutputStream output = exchange.getResponseBody()) {
      output.write(response);
    }
  }
}