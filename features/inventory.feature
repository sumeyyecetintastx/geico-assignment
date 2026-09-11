Feature: Product inventory and cart
  As a logged-in user
  I want to browse products and manage my cart
  So that I can prepare an order for checkout

  Background:
    Given I am logged in as the "standard" user

  Scenario: Add a single product to the cart
    When I add the product "Sauce Labs Backpack" to the cart
    Then the cart badge should show "1"

  Scenario: Add multiple products to the cart
    When I add the following products to the cart:
      | Sauce Labs Backpack   |
      | Sauce Labs Bike Light |
    Then the cart badge should show "2"

  Scenario: Remove a product from the cart
    Given I have added the product "Sauce Labs Backpack" to the cart
    When I remove the product "Sauce Labs Backpack" from the cart
    Then the cart badge should not be visible

  Scenario: Sort products by price low to high
    When I sort products by "Price (low to high)"
    Then the products should be listed in ascending order of price
