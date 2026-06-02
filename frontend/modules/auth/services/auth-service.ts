/**
 * Auth Service
 * 
 * This file re-exports the auth API from the centralized API file.
 * Use this for backward compatibility or import directly from @/lib/api
 */

import { authApi } from "@/lib/api";
import type { LoginRequest, RegisterRequest, AuthResponse, User } from "../types/auth.types";

export const authService = authApi;
