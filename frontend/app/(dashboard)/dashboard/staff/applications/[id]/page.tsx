"use client";

import { useState, useEffect, use } from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ArrowLeft, CheckCircle, XCircle, Clock, Loader2 } from "lucide-react";
import Link from "next/link";
import { api, Application } from "@/lib/api";
import { toast } from "sonner";

// Roles and statuses are handled via API types

const getStatusBadge = (status: string) => {
  const config: Record<string, { icon: any, variant: "default" | "secondary" | "destructive" | "outline", label: string }> = {
    pending: { icon: Clock, variant: "outline", label: "Pending Review" },
    approved: { icon: CheckCircle, variant: "default", label: "Approved" },
    rejected: { icon: XCircle, variant: "destructive", label: "Rejected" },
  };
  
  const { icon: Icon, variant, label } = config[status] || config.pending;
  return (
    <Badge variant={variant} className="flex items-center gap-1 w-fit">
      <Icon className="h-3 w-3" />
      {label}
    </Badge>
  );
};

export default function ApplicationDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const router = useRouter();
  const [application, setApplication] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [newStatus, setNewStatus] = useState<string>("");
  const [isUpdating, setIsUpdating] = useState(false);

  const fetchApplication = async () => {
    try {
      setIsLoading(true);
      const data = await api.applications.getById(id);
      setApplication(data);
    } catch (err) {
      console.error("Failed to fetch application:", err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchApplication();
  }, [id]);

  const handleStatusUpdate = async () => {
    if (!newStatus) return;
    
    setIsUpdating(true);
    try {
      await api.applications.updateStatus(id, newStatus as any);
      toast.success(`Application status updated to ${newStatus}`);
      await fetchApplication();
      setNewStatus("");
    } catch (err) {
      console.error("Failed to update status:", err);
      toast.error("Failed to update status. Please try again.");
    } finally {
      setIsUpdating(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px]">
        <Loader2 className="h-8 w-8 animate-spin text-primary mb-2" />
        <p className="text-sm text-muted-foreground">Loading application...</p>
      </div>
    );
  }

  if (!application) {
    return (
      <div className="text-center py-12">
        <h2 className="text-2xl font-bold">Application not found</h2>
        <Link href="/dashboard/staff/applications" className="text-primary hover:underline mt-4 block">
          Back to applications
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link href="/dashboard/staff/applications">
            <Button variant="ghost" size="sm">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back
            </Button>
          </Link>
          <div>
            <h1 className="text-3xl font-bold">{application.startupName}</h1>
            <p className="text-muted-foreground">Application Details</p>
          </div>
        </div>
        {getStatusBadge(application.status)}
      </div>

      {/* Status Update Card (Staff/Admin only) */}
      {application.status === "pending" && (
        <Alert>
          <AlertDescription>
            <div className="flex items-center gap-4">
              <span className="text-sm font-medium">Update Status:</span>
              <Select value={newStatus} onValueChange={setNewStatus}>
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Select status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="approved">Approve</SelectItem>
                  <SelectItem value="rejected">Reject</SelectItem>
                </SelectContent>
              </Select>
              <Button 
                onClick={handleStatusUpdate} 
                disabled={!newStatus || isUpdating}
                size="sm"
              >
                {isUpdating ? "Updating..." : "Update Status"}
              </Button>
            </div>
          </AlertDescription>
        </Alert>
      )}

      <div className="grid gap-6 md:grid-cols-2">
        {/* Application Details */}
        <Card className="md:col-span-2">
          <CardHeader>
            <CardTitle>Business Overview</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <h3 className="font-semibold mb-2">Description</h3>
              <p className="text-muted-foreground">{application.description}</p>
            </div>
            <div>
              <h3 className="font-semibold mb-2">Problem Statement</h3>
              <p className="text-muted-foreground">{application.problemStatement}</p>
            </div>
            <div>
              <h3 className="font-semibold mb-2">Solution</h3>
              <p className="text-muted-foreground">{application.solution}</p>
            </div>
            <div>
              <h3 className="font-semibold mb-2">Target Market</h3>
              <p className="text-muted-foreground">{application.targetMarket}</p>
            </div>
          </CardContent>
        </Card>

        {/* Applicant Information */}
        <Card>
          <CardHeader>
            <CardTitle>Applicant Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <div>
              <p className="text-sm font-medium">Name</p>
              <p className="text-muted-foreground">{application.userId.name}</p>
            </div>
            <div>
              <p className="text-sm font-medium">Email</p>
              <p className="text-muted-foreground">{application.userId.email}</p>
            </div>
            <div>
              <p className="text-sm font-medium">Role</p>
              <Badge variant="secondary">{application.userId?.role}</Badge>
            </div>
          </CardContent>
        </Card>

        {/* Timeline */}
        <Card>
          <CardHeader>
            <CardTitle>Timeline</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <div>
              <p className="text-sm font-medium">Submitted</p>
              <p className="text-muted-foreground">
                {new Date(application.createdAt).toLocaleString()}
              </p>
            </div>
            <div>
              <p className="text-sm font-medium">Last Updated</p>
              <p className="text-muted-foreground">
                {new Date(application.updatedAt).toLocaleString()}
              </p>
            </div>
            {application.reviewedBy && (
              <div>
                <p className="text-sm font-medium">Reviewed By</p>
                <p className="text-muted-foreground">
                  {typeof application.reviewedBy === 'object' ? application.reviewedBy.name : application.reviewedBy}
                </p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
