import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Authentication - Startup Support System",
  description: "Login or register to access the Startup Support System",
};

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      {children}
    </div>
  );
}
