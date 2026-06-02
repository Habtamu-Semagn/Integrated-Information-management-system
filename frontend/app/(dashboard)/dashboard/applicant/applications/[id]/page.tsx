"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, Calendar, User, CheckCircle, XCircle, Clock, FileText } from "lucide-react";
import Link from "next/link";
import { Separator } from "@/components/ui/separator";
import { api, Application } from "@/lib/api";
import { useEffect, useState, use } from "react";

export default function ApplicationDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const [application, setApplication] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
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

    fetchApplication();
  }, [id]);

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "pending":
        return (
          <Badge variant="outline" className="bg-yellow-50 text-yellow-700 border-yellow-200 dark:bg-yellow-950 dark:text-yellow-400 dark:border-yellow-800">
            <Clock className="h-3 w-3 mr-1" />
            Pending Review
          </Badge>
        );
      case "approved":
        return (
          <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200 dark:bg-green-950 dark:text-green-400 dark:border-green-800">
            <CheckCircle className="h-3 w-3 mr-1" />
            Approved
          </Badge>
        );
      case "rejected":
        return (
          <Badge variant="outline" className="bg-red-50 text-red-700 border-red-200 dark:bg-red-950 dark:text-red-400 dark:border-red-800">
            <XCircle className="h-3 w-3 mr-1" />
            Rejected
          </Badge>
        );
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  const getStatusMessage = (status: string) => {
    switch (status) {
      case "pending":
        return {
          title: "Application Under Review",
          description: "Your application is currently being reviewed by our team. You will be notified once a decision has been made.",
          color: "bg-yellow-50 dark:bg-yellow-950/20 border-yellow-200 dark:border-yellow-800",
        };
      case "approved":
        return {
          title: "Congratulations! Application Approved",
          description: "Your startup application has been approved. Our team will contact you shortly with next steps.",
          color: "bg-green-50 dark:bg-green-950/20 border-green-200 dark:border-green-800",
        };
      case "rejected":
        return {
          title: "Application Not Approved",
          description: "Unfortunately, your application was not approved at this time. You may submit a new application with updated information.",
          color: "bg-red-50 dark:bg-red-950/20 border-red-200 dark:border-red-800",
        };
      default:
        return {
          title: "Application Status",
          description: "Check back later for updates on your application.",
          color: "bg-muted",
        };
    }
  };

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px]">
        <Clock className="h-8 w-8 animate-spin text-primary mb-2" />
        <p className="text-sm text-muted-foreground">Loading application...</p>
      </div>
    );
  }

  if (!application) {
    return (
      <div className="text-center py-12">
        <h2 className="text-2xl font-bold">Application not found</h2>
        <Link href="/dashboard/applicant/applications" className="text-primary hover:underline mt-4 block">
          Back to applications
        </Link>
      </div>
    );
  }

  const statusMessage = getStatusMessage(application.status);

  return (
    <div className="space-y-6 max-w-5xl">
      {/* Header */}
      <div>
        <Button asChild variant="ghost" size="sm" className="mb-4">
          <Link href="/dashboard/applicant/applications">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Applications
          </Link>
        </Button>
        <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
          <div className="flex-1">
            <h1 className="text-3xl font-bold tracking-tight">{application.startupName}</h1>
            <p className="text-muted-foreground mt-1">Application Details</p>
          </div>
          <div className="shrink-0">
            {getStatusBadge(application.status)}
          </div>
        </div>
      </div>

      {/* Status Message */}
      <Card className={statusMessage.color}>
        <CardContent className="pt-6">
          <div className="flex items-start gap-4">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-background/50">
              {application.status === "pending" && <Clock className="h-5 w-5 text-yellow-600 dark:text-yellow-400" />}
              {application.status === "approved" && <CheckCircle className="h-5 w-5 text-green-600 dark:text-green-400" />}
              {application.status === "rejected" && <XCircle className="h-5 w-5 text-red-600 dark:text-red-400" />}
            </div>
            <div className="flex-1">
              <h3 className="font-semibold mb-1">{statusMessage.title}</h3>
              <p className="text-sm text-muted-foreground">{statusMessage.description}</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Application Information */}
      <Card>
        <CardHeader>
          <CardTitle>Application Information</CardTitle>
          <CardDescription>Details about your startup submission</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Business Description */}
          <div className="space-y-2">
            <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide">
              Business Description
            </h3>
            <p className="text-base leading-relaxed">{application.description}</p>
          </div>

          <Separator />

          {/* Problem Statement */}
          <div className="space-y-2">
            <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide">
              Problem Statement
            </h3>
            <p className="text-base leading-relaxed">{application.problemStatement}</p>
          </div>

          <Separator />

          {/* Solution */}
          <div className="space-y-2">
            <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide">
              Solution
            </h3>
            <p className="text-base leading-relaxed">{application.solution}</p>
          </div>

          <Separator />

          {/* Target Market */}
          <div className="space-y-2">
            <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide">
              Target Market
            </h3>
            <p className="text-base leading-relaxed">{application.targetMarket}</p>
          </div>
        </CardContent>
      </Card>

      {/* Timeline & Review Information */}
      <div className="grid gap-6 md:grid-cols-2">
        {/* Timeline */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calendar className="h-5 w-5" />
              Timeline
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
             <div className="flex items-start gap-3">
              <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary/10">
                <FileText className="h-4 w-4 text-primary" />
              </div>
              <div className="flex-1">
                <p className="text-sm font-medium">Application Submitted</p>
                <p className="text-sm text-muted-foreground">
                  {new Date(application.createdAt).toLocaleString()}
                </p>
              </div>
            </div>

            {application.status !== 'pending' && (
              <div className="flex items-start gap-3">
                <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary/10">
                  {application.status === "approved" ? (
                    <CheckCircle className="h-4 w-4 text-green-600" />
                  ) : (
                    <XCircle className="h-4 w-4 text-red-600" />
                  )}
                </div>
                <div className="flex-1">
                  <p className="text-sm font-medium">Application Reviewed</p>
                  <p className="text-sm text-muted-foreground">
                    {new Date(application.updatedAt).toLocaleString()}
                  </p>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Review Information */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <User className="h-5 w-5" />
              Review Information
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {application.reviewedBy ? (
              <>
                <div>
                  <p className="text-sm font-medium text-muted-foreground mb-1">Reviewed By</p>
                  <p className="text-base font-medium">
                    {typeof application.reviewedBy === 'object' ? application.reviewedBy.name : 'System Reviewer'}
                  </p>
                  {typeof application.reviewedBy === 'object' && application.reviewedBy.email && (
                    <p className="text-sm text-muted-foreground">{application.reviewedBy.email}</p>
                  )}
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground mb-1">Status</p>
                  <div className="mt-1">{getStatusBadge(application.status)}</div>
                </div>
              </>
            ) : (
              <div className="flex flex-col items-center justify-center py-6 text-center">
                <Clock className="h-8 w-8 text-muted-foreground/50 mb-2" />
                <p className="text-sm text-muted-foreground">
                  Your application is awaiting review
                </p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Actions */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex flex-col gap-3 sm:flex-row sm:justify-between sm:items-center">
            <p className="text-sm text-muted-foreground">
              Need to make changes or have questions about your application?
            </p>
            <div className="flex flex-col gap-2 sm:flex-row">
              {application.status === "rejected" && (
                <Button asChild>
                  <Link href="/dashboard/applicant/applications/new">
                    Submit New Application
                  </Link>
                </Button>
              )}
              <Button asChild variant="outline">
                <Link href="/dashboard/applicant/applications">
                  View All Applications
                </Link>
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
