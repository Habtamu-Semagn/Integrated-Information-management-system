# Database Design (MongoDB)

## User

- _id
- name
- email (unique)
- password (hashed)
- role ("applicant", "staff", "admin")
- createdAt

## StartupApplication

- _id
- userId (ref User)
- startupName
- description
- problemStatement
- solution
- targetMarket
- status ("pending", "approved", "rejected")
- reviewedBy (ref User)
- createdAt
- updatedAt

## Rules

- Use Mongoose schemas
- Enable timestamps
- Validate required fields