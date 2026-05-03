# Backend Structure

src/
  docs/
    swagger.js
  modules/
    auth/
    users/
    applications/
    funding/        (future)
    mentorship/     (future)
    training/       (future)

  common/
    middleware/
    utils/
    config/
    database/

  app.js
  server.js

## Module Structure

Each module contains:

- *.controller.js
- *.service.js
- *.routes.js
- *.model.js
- *.validation.js (optional)

## Example

modules/applications/
  application.model.js
  application.service.js
  application.controller.js
  application.routes.js