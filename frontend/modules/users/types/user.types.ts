export interface User {
  id: string;
  name: string;
  email: string;
  role: "applicant" | "staff" | "admin";
  createdAt: string;
  updatedAt: string;
}

export interface UpdateProfileRequest {
  name?: string;
  email?: string;
}

export interface UserResponse {
  success: boolean;
  data: User;
  message: string;
}

export interface UsersResponse {
  success: boolean;
  data: {
    users: User[];
    pagination?: {
      page: number;
      limit: number;
      total: number;
      pages: number;
    };
  };
  message: string;
}
