Feature: Login
  As a user of Sauce Demo
  I want to log in with different account types
  So that I can access the application according to my role

  Background:
    Given I am on the Sauce Demo login page

  Scenario Outline: Successful login for valid user roles
    When I log in as the "<userType>" user
    Then I should be redirected to the products page

    Examples:
      | userType           |
      | standard            |
      | problem             |
      | performanceGlitch   |
      | error               |
      | visual              |

  Scenario: Locked out user cannot log in
    When I log in as the "lockedOut" user
    Then I should see an error message containing "Sorry, this user has been locked out."

  Scenario: Login fails with invalid credentials
    When I log in with username "invalid_user" and password "wrong_password"
    Then I should see an error message containing "Username and password do not match any user in this service"
