package com.ecommerce.test;

import org.junit.jupiter.api.Test;
import org.openqa.selenium.By;
import org.openqa.selenium.WebDriver;
import org.openqa.selenium.WebElement;
import org.openqa.selenium.chrome.ChromeDriver;

import static org.junit.jupiter.api.Assertions.assertTrue;

public class ShopEasySeleniumTest {

  @Test
  public void testShopEasyWebsite() {

    WebDriver driver = new ChromeDriver();

    try {
      // Open ShopEasy website
      driver.get("http://localhost:8080");

      // Verify page title
      assertTrue(
          driver.getTitle().toLowerCase().contains("shop"),
          "ShopEasy page title was not found");

      // Verify main page content
      WebElement body = driver.findElement(By.tagName("body"));

      assertTrue(
          body.getText().contains("ShopEasy"),
          "ShopEasy text was not found on the page");

      System.out.println("=================================");
      System.out.println("Selenium Test: PASSED");
      System.out.println("ShopEasy website verified successfully!");
      System.out.println("=================================");

    } finally {
      driver.quit();
    }
  }
}