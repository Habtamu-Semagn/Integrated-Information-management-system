# Module Rules

## Each Module Must

- Own its logic
- Own its model
- Own its routes

## Strict Rules

- No direct DB access across modules
- Use service layer for communication
- No business logic in controllers

## Example

Bad:
applications.controller uses User model ❌

Good:
applications.service calls userService ✅