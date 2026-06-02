/**
 * Comprehensive API Service
 * 
 * This file contains all API calls for the frontend application.
 * Organized by module: Auth, Applications, Users
 */

import { apiClient } from "./api-client";

// ============================================================================
// TYPE DEFINITIONS
// ============================================================================

// Auth Types
export interface User {
  id: string;
  name: string;
  email: string;
  role: "applicant" | "staff" | "admin";
  createdAt: string;
  updatedAt: string;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  name: string;
  email: string;
  password: string;
  role?: "applicant" | "staff" | "admin";
}

export interface AuthResponse {
  success: boolean;
  data: {
    user: User;
    token?: string;
  };
  message: string;
}

// Application Types
export interface Application {
  id: string;
  userId: string;
  startupName: string;
  description: string;
  problemStatement: string;
  solution: string;
  targetMarket: string;
  status: "pending" | "approved" | "rejected";
  reviewedBy?: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateApplicationRequest {
  startupName: string;
  description: string;
  problemStatement: string;
  solution: string;
  targetMarket: string;
}

export interface UpdateApplicationRequest {
  startupName?: string;
  description?: string;
  problemStatement?: string;
  solution?: string;
  targetMarket?: string;
}

export interface ApplicationsResponse {
  success: boolean;
  data: {
    applications: Application[];
    pagination?: {
      page: number;
      limit: number;
      total: number;
      pages: number;
    };
  };
  message: string;
}

export interface ApplicationResponse {
  success: boolean;
  data: Application;
  message: string;
}

// User Profile Types
export interface UpdateProfileRequest {
  name?: string;
  email?: string;
}

export interface UserResponse {
  success: boolean;
  data: User;
  message: string;
}

// Generic Response Type
export interface ApiResponse<T = any> {
  success: boolean;
  data: T;
  message: string;
}

// ============================================================================
// AUTH API
// ============================================================================

export const authApi = {
  /**
   * Register a new user account
   * POST /api/auth/register
   */
  register: async (userData: RegisterRequest): Promise<AuthResponse> => {
    const response = await apiClient.post<AuthResponse>("/auth/register", userData);
    return response.data;
  },

  /**
   * Login with email and password
   * POST /api/auth/login
   * Sets HTTP-only cookie with JWT token
   */
  login: async (credentials: LoginRequest): Promise<AuthResponse> => {
    const response = await apiClient.post<AuthResponse>("/auth/login", credentials);
    if (response.data.data.token) {
      localStorage.setItem("token", response.data.data.token);
    }
    return response.data;
  },

  /**
   * Logout current user
   * POST /api/auth/logout
   * Clears authentication cookie
   */
  logout: async (): Promise<ApiResponse> => {
    const response = await apiClient.post<ApiResponse>("/auth/logout");
    return response.data;
  },

  /**
   * Get currently authenticated user
   * GET /api/auth/me
   * Requires authentication
   */
  getCurrentUser: async (): Promise<User> => {
    const response = await apiClient.get<UserResponse>("/auth/me");
    return response.data.data;
  },
};

// ============================================================================
// APPLICATIONS API
// ============================================================================

export const applicationsApi = {
  /**
   * Create a new application (applicants only)
   * POST /api/applications
   * Requires authentication and applicant role
   */
  create: async (data: CreateApplicationRequest): Promise<Application> => {
    const response = await apiClient.post<ApplicationResponse>("/applications", data);
    return response.data.data;
  },

  /**
   * Get authenticated applicant's applications
   * GET /api/applications/my
   * Requires authentication and applicant role
   */
  getMyApplications: async (): Promise<Application[]> => {
    const response = await apiClient.get<ApplicationsResponse>("/applications/my");
    return response.data.data.applications || response.data.data;
  },

  /**
   * Get all applications with optional filters (staff and admin only)
   * GET /api/applications
   * Requires authentication and staff/admin role
   * 
   * @param params - Optional query parameters
   * @param params.status - Filter by status (pending, approved, rejected)
   * @param params.page - Page number for pagination
   * @param params.limit - Number of items per page
   * @param params.search - Search term for filtering
   */
  getAll: async (params?: {
    status?: "pending" | "approved" | "rejected";
    page?: number;
    limit?: number;
    search?: string;
  }): Promise<ApplicationsResponse> => {
    const response = await apiClient.get<ApplicationsResponse>("/applications", { params });
    return response.data;
  },

  /**
   * Get application by ID (staff and admin only)
   * GET /api/applications/:id
   * Requires authentication and staff/admin role
   */
  getById: async (id: string): Promise<Application> => {
    const response = await apiClient.get<ApplicationResponse>(`/applications/${id}`);
    return response.data.data;
  },

  /**
   * Update application status (staff and admin only)
   * PATCH /api/applications/:id/status
   * Requires authentication and staff/admin role
   */
  updateStatus: async (
    id: string,
    status: "pending" | "approved" | "rejected"
  ): Promise<Application> => {
    const response = await apiClient.patch<ApplicationResponse>(
      `/applications/${id}/status`,
      { status }
    );
    return response.data.data;
  },

  /**
   * Update application details (applicants only)
   * PATCH /api/applications/:id
   * Requires authentication and applicant role
   * Note: This endpoint may not be implemented in backend yet
   */
  update: async (id: string, data: UpdateApplicationRequest): Promise<Application> => {
    const response = await apiClient.patch<ApplicationResponse>(`/applications/${id}`, data);
    return response.data.data;
  },

  /**
   * Delete application (applicants only)
   * DELETE /api/applications/:id
   * Requires authentication and applicant role
   * Note: This endpoint may not be implemented in backend yet
   */
  delete: async (id: string): Promise<void> => {
    await apiClient.delete(`/applications/${id}`);
  },
};

// ============================================================================
// USERS API
// ============================================================================

export const usersApi = {
  /**
   * Get authenticated user's profile
   * GET /api/users/profile
   * Requires authentication
   */
  getProfile: async (): Promise<User> => {
    const response = await apiClient.get<UserResponse>("/users/profile");
    return response.data.data;
  },

  /**
   * Update authenticated user's profile
   * PATCH /api/users/profile
   * Requires authentication
   */
  updateProfile: async (data: UpdateProfileRequest): Promise<User> => {
    const response = await apiClient.patch<UserResponse>("/users/profile", data);
    return response.data.data;
  },

  /**
   * Get all users (admin only)
   * GET /api/users
   * Requires authentication and admin role
   * Note: This endpoint may not be implemented in backend yet
   */
  getAllUsers: async (params?: {
    role?: "applicant" | "staff" | "admin";
    page?: number;
    limit?: number;
    search?: string;
  }): Promise<{
    users: User[];
    pagination?: {
      page: number;
      limit: number;
      total: number;
      pages: number;
    };
  }> => {
    const response = await apiClient.get<ApiResponse<{
      users: User[];
      pagination?: any;
    }>>("/users", { params });
    return response.data.data;
  },

  /**
   * Get user by ID (admin only)
   * GET /api/users/:id
   * Requires authentication and admin role
   * Note: This endpoint may not be implemented in backend yet
   */
  getUserById: async (id: string): Promise<User> => {
    const response = await apiClient.get<UserResponse>(`/users/${id}`);
    return response.data.data;
  },

  /**
   * Update user role (admin only)
   * PATCH /api/users/:id/role
   * Requires authentication and admin role
   * Note: This endpoint may not be implemented in backend yet
   */
  updateUserRole: async (
    id: string,
    role: "applicant" | "staff" | "admin"
  ): Promise<User> => {
    const response = await apiClient.patch<UserResponse>(`/users/${id}/role`, { role });
    return response.data.data;
  },

  /**
   * Delete user (admin only)
   * DELETE /api/users/:id
   * Requires authentication and admin role
   * Note: This endpoint may not be implemented in backend yet
   */
  deleteUser: async (id: string): Promise<void> => {
    await apiClient.delete(`/users/${id}`);
  },
};

// ============================================================================
// COMBINED API EXPORT
// ============================================================================

/**
 * Main API object containing all API modules
 * Usage: import { api } from '@/lib/api'
 * Then: api.auth.login(), api.applications.getAll(), etc.
 */
export const api = {
  auth: authApi,
  applications: applicationsApi,
  users: usersApi,
};

// Default export
export default api;
