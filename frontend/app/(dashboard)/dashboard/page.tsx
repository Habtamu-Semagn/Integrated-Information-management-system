"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function DashboardPage() {
  const router = useRouter();

  useEffect(() => {
    // Get user from localStorage (standard for this project's auth)
    const userStr = localStorage.getItem("user");
    if (!userStr) {
      router.push("/login");
      return;
    }

    try {
      const user = JSON.parse(userStr);
      const role = user.role?.toLowerCase();

      // Validate role and redirect accordingly
      if (role === "admin") {
        router.push("/dashboard/admin");
      } else if (role === "staff") {
        router.push("/dashboard/staff");
      } else if (role === "applicant") {
        router.push("/dashboard/applicant");
      } else {
        // Unknown role, default to applicant
        router.push("/dashboard/applicant");
      }
    } catch (error) {
      console.error("Error parsing user data:", error);
      router.push("/login");
    }
  }, [router]);

  return (
    <div className="flex items-center justify-center h-full">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
        <p className="text-muted-foreground">Redirecting to your dashboard...</p>
      </div>
    </div>
  );
}
