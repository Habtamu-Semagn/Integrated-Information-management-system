/**
 * Library Index
 * 
 * Central export point for all library utilities
 */

// API Client
export { apiClient } from "./api-client";

// Comprehensive API
export { api, authApi, applicationsApi, usersApi } from "./api";

// API Types
export type {
  User,
  LoginRequest,
  RegisterRequest,
  AuthResponse,
  Application,
  CreateApplicationRequest,
  UpdateApplicationRequest,
  ApplicationsResponse,
  ApplicationResponse,
  UpdateProfileRequest,
  UserResponse,
  ApiResponse,
} from "./api";

// Utilities
export { cn } from "./utils";

// Constants
export * from "./constants";
