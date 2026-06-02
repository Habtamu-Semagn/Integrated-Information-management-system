# API Usage Guide

This document explains how to use the comprehensive API service (`api.ts`) in the frontend application.

## Overview

The `api.ts` file provides a centralized, type-safe interface for all backend API calls. It's organized into three main modules:

- **auth**: Authentication and user session management
- **applications**: Startup application CRUD operations
- **users**: User profile and management

## Import

```typescript
// Import the entire API object
import { api } from '@/lib/api';

// Or import specific modules
import { authApi, applicationsApi, usersApi } from '@/lib/api';

// Or import types
import type { User, Application, LoginRequest } from '@/lib/api';
```

## Authentication API

### Register a New User

```typescript
import { api } from '@/lib/api';

try {
  const response = await api.auth.register({
    name: "John Doe",
    email: "john@example.com",
    password: "securePassword123",
    role: "applicant" // optional, defaults to 'applicant'
  });
  
  console.log("User registered:", response.data.user);
} catch (error) {
  console.error("Registration failed:", error);
}
```

### Login

```typescript
try {
  const response = await api.auth.login({
    email: "john@example.com",
    password: "securePassword123"
  });
  
  console.log("Logged in:", response.data.user);
  // JWT token is automatically stored in HTTP-only cookie
} catch (error) {
  console.error("Login failed:", error);
}
```

### Logout

```typescript
try {
  await api.auth.logout();
  console.log("Logged out successfully");
} catch (error) {
  console.error("Logout failed:", error);
}
```

### Get Current User

```typescript
try {
  const user = await api.auth.getCurrentUser();
  console.log("Current user:", user);
} catch (error) {
  console.error("Failed to get current user:", error);
}
```

## Applications API

### Create Application (Applicant Only)

```typescript
try {
  const application = await api.applications.create({
    startupName: "TechStartup Inc",
    description: "A revolutionary tech solution",
    problemStatement: "Current solutions are inefficient",
    solution: "Our AI-powered platform solves this",
    targetMarket: "Small to medium businesses"
  });
  
  console.log("Application created:", application);
} catch (error) {
  console.error("Failed to create application:", error);
}
```

### Get My Applications (Applicant Only)

```typescript
try {
  const applications = await api.applications.getMyApplications();
  console.log("My applications:", applications);
} catch (error) {
  console.error("Failed to get applications:", error);
}
```

### Get All Applications (Staff/Admin Only)

```typescript
try {
  // Without filters
  const response = await api.applications.getAll();
  
  // With filters
  const filteredResponse = await api.applications.getAll({
    status: "pending",
    page: 1,
    limit: 10,
    search: "tech"
  });
  
  console.log("Applications:", filteredResponse.data.applications);
  console.log("Pagination:", filteredResponse.data.pagination);
} catch (error) {
  console.error("Failed to get applications:", error);
}
```

### Get Application by ID (Staff/Admin Only)

```typescript
try {
  const application = await api.applications.getById("app-id-123");
  console.log("Application:", application);
} catch (error) {
  console.error("Failed to get application:", error);
}
```

### Update Application Status (Staff/Admin Only)

```typescript
try {
  const updatedApplication = await api.applications.updateStatus(
    "app-id-123",
    "approved" // or "rejected", "pending"
  );
  
  console.log("Application updated:", updatedApplication);
} catch (error) {
  console.error("Failed to update status:", error);
}
```

## Users API

### Get User Profile

```typescript
try {
  const profile = await api.users.getProfile();
  console.log("User profile:", profile);
} catch (error) {
  console.error("Failed to get profile:", error);
}
```

### Update User Profile

```typescript
try {
  const updatedProfile = await api.users.updateProfile({
    name: "John Updated",
    email: "john.updated@example.com"
  });
  
  console.log("Profile updated:", updatedProfile);
} catch (error) {
  console.error("Failed to update profile:", error);
}
```

### Get All Users (Admin Only)

```typescript
try {
  const response = await api.users.getAllUsers({
    role: "applicant",
    page: 1,
    limit: 20,
    search: "john"
  });
  
  console.log("Users:", response.users);
  console.log("Pagination:", response.pagination);
} catch (error) {
  console.error("Failed to get users:", error);
}
```

## Usage in React Components

### Example: Login Component

```typescript
"use client";

import { useState } from "react";
import { api } from "@/lib/api";
import type { LoginRequest } from "@/lib/api";

export function LoginForm() {
  const [formData, setFormData] = useState<LoginRequest>({
    email: "",
    password: ""
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const response = await api.auth.login(formData);
      console.log("Login successful:", response.data.user);
      // Redirect to dashboard
      window.location.href = "/dashboard";
    } catch (err: any) {
      setError(err.response?.data?.message || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      {/* Form fields */}
    </form>
  );
}
```

### Example: Applications List Component

```typescript
"use client";

import { useEffect, useState } from "react";
import { api } from "@/lib/api";
import type { Application } from "@/lib/api";

export function ApplicationsList() {
  const [applications, setApplications] = useState<Application[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadApplications();
  }, []);

  const loadApplications = async () => {
    try {
      const data = await api.applications.getMyApplications();
      setApplications(data);
    } catch (error) {
      console.error("Failed to load applications:", error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div>Loading...</div>;

  return (
    <div>
      {applications.map((app) => (
        <div key={app.id}>{app.startupName}</div>
      ))}
    </div>
  );
}
```

## Error Handling

All API calls can throw errors. Always wrap them in try-catch blocks:

```typescript
try {
  const result = await api.applications.create(data);
  // Handle success
} catch (error: any) {
  // Error structure from backend
  const message = error.response?.data?.message || "An error occurred";
  const statusCode = error.response?.status;
  
  if (statusCode === 401) {
    // Unauthorized - redirect to login
    window.location.href = "/login";
  } else if (statusCode === 403) {
    // Forbidden - insufficient permissions
    console.error("Access denied");
  } else {
    // Other errors
    console.error(message);
  }
}
```

## Authentication Flow

The API client automatically handles authentication:

1. **Login**: JWT token is stored in HTTP-only cookie
2. **Subsequent requests**: Cookie is automatically sent with each request
3. **401 Response**: Automatically redirects to login page
4. **Logout**: Clears the authentication cookie

## TypeScript Support

All API functions are fully typed. Your IDE will provide:

- Autocomplete for function names and parameters
- Type checking for request/response data
- IntelliSense documentation

## Notes

- Some endpoints marked with "Note: This endpoint may not be implemented in backend yet" are placeholders for future features
- All authenticated endpoints require a valid JWT token (handled automatically via cookies)
- Role-based endpoints will return 403 Forbidden if the user doesn't have the required role
