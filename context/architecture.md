# Architecture

## Architecture Type
Modular Monolith

## Why

- Easier than microservices
- Scalable structure
- Clear separation of concerns
- Future-ready for service extraction

## High-Level Flow

Frontend (React)
    ↓
Backend API (Express)
    ↓
Database (MongoDB)

## Key Principles

- Feature-based modules
- Loose coupling between modules
- Strong separation of concerns
- Service layer for business logic

## Layers

- Controller → handles HTTP
- Service → business logic
- Model → database schema