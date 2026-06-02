/**
 * Application Service
 * 
 * This file re-exports the applications API from the centralized API file.
 * Use this for backward compatibility or import directly from @/lib/api
 */

import { applicationsApi } from "@/lib/api";
import type {
  Application,
  CreateApplicationRequest,
  UpdateApplicationRequest,
  ApplicationsResponse,
  ApplicationResponse,
} from "../types/application.types";

export const applicationService = applicationsApi;
