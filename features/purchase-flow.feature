@e2e
Feature: End-to-end purchase flow
  As a customer of Sauce Demo
  I want to log in, find a product, and complete a purchase
  So that I can be confident the whole buying journey works, not just each page in isolation

  Scenario: Complete a full purchase journey from login to order confirmation
    # 1. Log into the application using a valid test account.
    Given I am on the Sauce Demo login page
    When I log in as the "standard" user

    # 2. Verify that login was successful.
    Then I should be redirected to the products page

    # 3. Locate a specific product.
    Then I should see the product "Sauce Labs Backpack" listed on the products page

    # 4. Add the product to the shopping cart.
    When I add the product "Sauce Labs Backpack" to the cart

    # 5. Verify that the correct product was added to the cart.
    Then the cart badge should show "1"
    When I go to the cart
    Then the cart should contain the product "Sauce Labs Backpack"

    # 6. Proceed through the checkout process.
    When I proceed to checkout

    # 7. Enter the required customer information.
    And I fill in the checkout information with first name "John", last name "Doe", and postal code "12345"
    And I continue to the overview page

    # 8. Verify that the correct product and expected price are displayed before completing the order.
    Then the checkout overview should show the product "Sauce Labs Backpack" with a price of "$29.99"

    # 9. Complete the order.
    When I finish the checkout

    # 10. Verify that the application confirms the order was successfully completed.
    Then I should see the order confirmation message "Thank you for your order!"
