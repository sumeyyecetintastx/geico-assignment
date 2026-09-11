Feature: Checkout
  As a logged-in user with items in my cart
  I want to complete the checkout process
  So that I can purchase my selected products

  Background:
    Given I am logged in as the "standard" user
    And I have added the product "Sauce Labs Backpack" to the cart

  Scenario: Complete a purchase successfully
    When I go to the cart
    And I proceed to checkout
    And I fill in the checkout information with first name "John", last name "Doe", and postal code "12345"
    And I continue to the overview page
    And I finish the checkout
    Then I should see the order confirmation message "Thank you for your order!"

  Scenario: Checkout fails when required information is missing
    When I go to the cart
    And I proceed to checkout
    And I continue to the overview page without filling in the information
    Then I should see a checkout error containing "First Name is required"
