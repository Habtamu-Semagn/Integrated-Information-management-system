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
    pagination: {
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
