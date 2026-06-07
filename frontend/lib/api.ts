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

// Training Types
export interface Training {
  id: string;
  title: string;
  description: string;
  category: "business-fundamentals" | "marketing" | "finance" | "technology" | "legal" | "sales" | "operations";
  level: "beginner" | "intermediate" | "advanced";
  instructor: string;
  duration: number;
  content: string;
  materials?: Array<{ title: string; location: string; type: "online" | "in-person" | "hybrid" }>;
  enrolledUsers?: string[];
  completedUsers?: Array<{ userId: string; completedAt: string }>;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface CreateTrainingRequest {
  title: string;
  description: string;
  category: string;
  level?: string;
  instructor: string;
  duration: number;
  content: string;
  materials?: Array<{ title: string; location: string; type: "online" | "in-person" | "hybrid" }>;
}

export interface TrainingsResponse {
  success: boolean;
  data: Training[];
  message: string;
}

// Fund Types
export interface Fund {
  id: string;
  title: string;
  description: string;
  fundType: "seed-funding" | "series-a" | "series-b" | "grant" | "accelerator" | "venture-capital";
  minimumAmount: number;
  maximumAmount: number;
  currency: string;
  deadline: string;
  fundingOrganization: string;
  requirements?: { minTeamSize?: number; targetIndustries?: string[]; eligibleCountries?: string[] };
  status: "open" | "closed" | "paused";
  tags?: string[];
  createdAt: string;
  updatedAt: string;
}

export interface FundApplication {
  id: string;
  fundId: string;
  startupId: string;
  applicationData: {
    teamSize: number;
    fundingRequired: number;
    useOfFunds: string;
    businessPlan?: string;
    financialProjections?: string;
  };
  status: "submitted" | "under-review" | "approved" | "rejected" | "withdrawn";
  reviewedBy?: string;
  reviewComments?: string;
  reviewDate?: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateFundApplicationRequest {
  teamSize: number;
  fundingRequired: number;
  useOfFunds: string;
  businessPlan?: string;
  financialProjections?: string;
}

// Participant Type (when populated from backend)
export interface Participant {
  _id: string;
  name: string;
  email: string;
}

// Competition Types
export interface Competition {
  id: string;
  title: string;
  description: string;
  competitionType: "pitch-competition" | "hackathon" | "idea-challenge" | "business-plan" | "innovation-award";
  prizes: { firstPlace: number; secondPlace: number; thirdPlace: number; currency: string };
  registrationDeadline: string;
  competitionDate: string;
  location?: string;
  isVirtual: boolean;
  maxParticipants?: number;
  judges?: Array<{ name: string; expertise: string; imageUrl?: string }>;
  status: "upcoming" | "ongoing" | "completed" | "cancelled";
  participants?: (string | Participant)[];
  results?: { firstPlaceWinner?: string; secondPlaceWinner?: string; thirdPlaceWinner?: string };
  tags?: string[];
  createdAt: string;
  updatedAt: string;
}

export interface CreateCompetitionRequest {
  title: string;
  description: string;
  competitionType: string;
  registrationDeadline: string;
  competitionDate: string;
  location?: string;
  isVirtual?: boolean;
  maxParticipants?: number;
  prizes?: { firstPlace: number; secondPlace: number; thirdPlace: number; currency: string };
  judges?: Array<{ name: string; expertise: string; imageUrl?: string }>;
}

// Event Types
export interface Event {
  id: string;
  title: string;
  description: string;
  eventType: "webinar" | "workshop" | "networking" | "conference" | "meetup" | "masterclass";
  startDateTime: string;
  endDateTime: string;
  location?: { venue?: string; city?: string; country?: string; onlineLink?: string };
  isVirtual: boolean;
  isHybrid: boolean;
  speakers?: Array<{ name: string; title: string; bio?: string; imageUrl?: string }>;
  capacity?: number;
  registeredAttendees?: string[];
  status: "upcoming" | "ongoing" | "completed" | "cancelled";
  agenda?: Array<{ time: string; activity: string; speaker?: string; duration: number }>;
  materials?: Array<{ title: string; url: string; type: string }>;
  tags?: string[];
  category: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateEventRequest {
  title: string;
  description: string;
  eventType: string;
  startDateTime: string;
  endDateTime: string;
  location?: { venue?: string; city?: string; country?: string; onlineLink?: string };
  isVirtual?: boolean;
  isHybrid?: boolean;
  speakers?: Array<{ name: string; title: string; bio?: string; imageUrl?: string }>;
  capacity?: number;
  category?: string;
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
 * Training API
 */
export const trainingApi = {
  /**
   * Get all training courses
   * GET /api/training
   */
  getAll: async (params?: { category?: string; level?: string }): Promise<Training[]> => {
    const response = await apiClient.get<TrainingsResponse>("/training", { params });
    return response.data.data;
  },

  /**
   * Get training by ID
   * GET /api/training/:id
   */
  getById: async (id: string): Promise<Training> => {
    const response = await apiClient.get<ApiResponse<Training>>(`/training/${id}`);
    return response.data.data;
  },

  /**
   * Create training (admin only)
   * POST /api/training
   */
  create: async (data: CreateTrainingRequest): Promise<Training> => {
    const response = await apiClient.post<ApiResponse<Training>>("/training", data);
    return response.data.data;
  },

  /**
   * Update training (admin only)
   * PATCH /api/training/:id
   */
  update: async (id: string, data: Partial<CreateTrainingRequest>): Promise<Training> => {
    const response = await apiClient.patch<ApiResponse<Training>>(`/training/${id}`, data);
    return response.data.data;
  },

  /**
   * Delete training (admin only)
   * DELETE /api/training/:id
   */
  delete: async (id: string): Promise<void> => {
    await apiClient.delete(`/training/${id}`);
  },

  /**
   * Enroll in training
   * POST /api/training/:id/enroll
   */
  enroll: async (id: string): Promise<Training> => {
    const response = await apiClient.post<ApiResponse<Training>>(`/training/${id}/enroll`);
    return response.data.data;
  },

  /**
   * Mark training as completed
   * POST /api/training/:id/complete
   */
  complete: async (id: string): Promise<Training> => {
    const response = await apiClient.post<ApiResponse<Training>>(`/training/${id}/complete`);
    return response.data.data;
  },

  /**
   * Get user's enrolled trainings
   * GET /api/training/me/enrolled
   */
  getMyTrainings: async (): Promise<Training[]> => {
    const response = await apiClient.get<TrainingsResponse>("/training/me/enrolled");
    return response.data.data;
  },
};

/**
 * Fund API
 */
export const fundApi = {
  /**
   * Get all funds
   * GET /api/funds
   */
  getAll: async (params?: { status?: string; fundType?: string; onlyOpen?: boolean }): Promise<Fund[]> => {
    const response = await apiClient.get<ApiResponse<Fund[]>>("/funds", { params });
    return response.data.data;
  },

  /**
   * Get fund by ID
   * GET /api/funds/:id
   */
  getById: async (id: string): Promise<Fund> => {
    const response = await apiClient.get<ApiResponse<Fund>>(`/funds/${id}`);
    return response.data.data;
  },

  /**
   * Create fund (admin only)
   * POST /api/funds
   */
  create: async (data: Partial<Fund>): Promise<Fund> => {
    const response = await apiClient.post<ApiResponse<Fund>>("/funds", data);
    return response.data.data;
  },

  /**
   * Update fund (admin only)
   * PATCH /api/funds/:id
   */
  update: async (id: string, data: Partial<Fund>): Promise<Fund> => {
    const response = await apiClient.patch<ApiResponse<Fund>>(`/funds/${id}`, data);
    return response.data.data;
  },

  /**
   * Delete fund (admin only)
   * DELETE /api/funds/:id
   */
  delete: async (id: string): Promise<void> => {
    await apiClient.delete(`/funds/${id}`);
  },

  /**
   * Apply for funding
   * POST /api/funds/:fundId/apply
   */
  apply: async (fundId: string, data: CreateFundApplicationRequest): Promise<FundApplication> => {
    const response = await apiClient.post<ApiResponse<FundApplication>>(`/funds/${fundId}/apply`, data);
    return response.data.data;
  },

  /**
   * Get user's fund applications
   * GET /api/funds/me/applications
   */
  getMyApplications: async (): Promise<FundApplication[]> => {
    const response = await apiClient.get<ApiResponse<FundApplication[]>>("/funds/me/applications");
    return response.data.data;
  },

  /**
   * Get applications for a fund (admin/staff only)
   * GET /api/funds/:fundId/applications
   */
  getApplications: async (fundId: string, params?: { status?: string }): Promise<FundApplication[]> => {
    const response = await apiClient.get<ApiResponse<FundApplication[]>>(`/funds/${fundId}/applications`, { params });
    return response.data.data;
  },

  /**
   * Update application status (admin/staff only)
   * PATCH /api/funds/applications/:applicationId/status
   */
  updateApplicationStatus: async (
    applicationId: string,
    status: string,
    comments?: string
  ): Promise<FundApplication> => {
    const response = await apiClient.patch<ApiResponse<FundApplication>>(
      `/funds/applications/${applicationId}/status`,
      { status, comments }
    );
    return response.data.data;
  },

  /**
   * Withdraw fund application
   * POST /api/funds/applications/:applicationId/withdraw
   */
  withdrawApplication: async (applicationId: string): Promise<FundApplication> => {
    const response = await apiClient.post<ApiResponse<FundApplication>>(
      `/funds/applications/${applicationId}/withdraw`
    );
    return response.data.data;
  },
};

/**
 * Competition API
 */
export const competitionApi = {
  /**
   * Get all competitions
   * GET /api/competitions
   */
  getAll: async (params?: { status?: string; competitionType?: string; upcomingOnly?: boolean }): Promise<Competition[]> => {
    const response = await apiClient.get<ApiResponse<Competition[]>>("/competitions", { params });
    return response.data.data;
  },

  /**
   * Get competition by ID
   * GET /api/competitions/:id
   */
  getById: async (id: string): Promise<Competition> => {
    const response = await apiClient.get<ApiResponse<Competition>>(`/competitions/${id}`);
    return response.data.data;
  },

  /**
   * Create competition (admin only)
   * POST /api/competitions
   */
  create: async (data: CreateCompetitionRequest): Promise<Competition> => {
    const response = await apiClient.post<ApiResponse<Competition>>("/competitions", data);
    return response.data.data;
  },

  /**
   * Update competition (admin only)
   * PATCH /api/competitions/:id
   */
  update: async (id: string, data: Partial<CreateCompetitionRequest>): Promise<Competition> => {
    const response = await apiClient.patch<ApiResponse<Competition>>(`/competitions/${id}`, data);
    return response.data.data;
  },

  /**
   * Delete competition (admin only)
   * DELETE /api/competitions/:id
   */
  delete: async (id: string): Promise<void> => {
    await apiClient.delete(`/competitions/${id}`);
  },

  /**
   * Register for competition
   * POST /api/competitions/:id/register
   */
  register: async (id: string): Promise<Competition> => {
    const response = await apiClient.post<ApiResponse<Competition>>(`/competitions/${id}/register`);
    return response.data.data;
  },

  /**
   * Unregister from competition
   * POST /api/competitions/:id/unregister
   */
  unregister: async (id: string): Promise<Competition> => {
    const response = await apiClient.post<ApiResponse<Competition>>(`/competitions/${id}/unregister`);
    return response.data.data;
  },

  /**
   * Publish competition results (admin only)
   * POST /api/competitions/:id/results
   */
  publishResults: async (id: string, results: any): Promise<Competition> => {
    const response = await apiClient.post<ApiResponse<Competition>>(`/competitions/${id}/results`, { results });
    return response.data.data;
  },
};

/**
 * Event API
 */
export const eventApi = {
  /**
   * Get all events
   * GET /api/events
   */
  getAll: async (params?: { status?: string; eventType?: string; category?: string; upcomingOnly?: boolean }): Promise<Event[]> => {
    const response = await apiClient.get<ApiResponse<Event[]>>("/events", { params });
    return response.data.data;
  },

  /**
   * Get event by ID
   * GET /api/events/:id
   */
  getById: async (id: string): Promise<Event> => {
    const response = await apiClient.get<ApiResponse<Event>>(`/events/${id}`);
    return response.data.data;
  },

  /**
   * Create event (admin only)
   * POST /api/events
   */
  create: async (data: CreateEventRequest): Promise<Event> => {
    const response = await apiClient.post<ApiResponse<Event>>("/events", data);
    return response.data.data;
  },

  /**
   * Update event (admin only)
   * PATCH /api/events/:id
   */
  update: async (id: string, data: Partial<CreateEventRequest>): Promise<Event> => {
    const response = await apiClient.patch<ApiResponse<Event>>(`/events/${id}`, data);
    return response.data.data;
  },

  /**
   * Delete event (admin only)
   * DELETE /api/events/:id
   */
  delete: async (id: string): Promise<void> => {
    await apiClient.delete(`/events/${id}`);
  },

  /**
   * Register for event
   * POST /api/events/:id/register
   */
  register: async (id: string): Promise<Event> => {
    const response = await apiClient.post<ApiResponse<Event>>(`/events/${id}/register`);
    return response.data.data;
  },

  /**
   * Unregister from event
   * POST /api/events/:id/unregister
   */
  unregister: async (id: string): Promise<Event> => {
    const response = await apiClient.post<ApiResponse<Event>>(`/events/${id}/unregister`);
    return response.data.data;
  },

  /**
   * Get user's registered events
   * GET /api/events/me/registered
   */
  getMyEvents: async (): Promise<Event[]> => {
    const response = await apiClient.get<ApiResponse<Event[]>>("/events/me/registered");
    return response.data.data;
  },

  /**
   * Add materials to event (admin only)
   * POST /api/events/:id/materials
   */
  addMaterials: async (id: string, materials: Array<{ title: string; url: string; type: string }>): Promise<Event> => {
    const response = await apiClient.post<ApiResponse<Event>>(`/events/${id}/materials`, { materials });
    return response.data.data;
  },
};

/**
 * Main API object containing all API modules
 * Usage: import { api } from '@/lib/api'
 * Then: api.auth.login(), api.applications.getAll(), etc.
 */
export const api = {
  auth: authApi,
  applications: applicationsApi,
  users: usersApi,
  training: trainingApi,
  funds: fundApi,
  competitions: competitionApi,
  events: eventApi,
};

// Default export
export default api;
