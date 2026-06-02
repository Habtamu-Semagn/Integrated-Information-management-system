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
    token: string;
  };
  message: string;
}
