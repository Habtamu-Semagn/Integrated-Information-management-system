/**
 * User Service
 * 
 * This file re-exports the users API from the centralized API file.
 * Use this for backward compatibility or import directly from @/lib/api
 */

import { usersApi } from "@/lib/api";
import type { User, UpdateProfileRequest } from "../types/user.types";

export const userService = usersApi;
