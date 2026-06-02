"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Eye, Search, Loader2 } from "lucide-react";
import Link from "next/link";
import { api, FundApplication } from "@/lib/api";
import { toast } from "sonner";

const getStatusBadge = (status: string) => {
  const variants: Record<string, { variant: "default" | "secondary" | "destructive" | "outline", label: string }> = {
    submitted: { variant: "outline", label: "Submitted" },
    "under-review": { variant: "default", label: "Under Review" },
    approved: { variant: "default", label: "Approved" },
    rejected: { variant: "destructive", label: "Rejected" },
    withdrawn: { variant: "secondary", label: "Withdrawn" },
  };
  
  const config = variants[status.toLowerCase()] || variants.submitted;
  return <Badge variant={config.variant}>{config.label}</Badge>;
};

export default function StaffFundsPage() {
  const [applications, setApplications] = useState<FundApplication[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [selectedApp, setSelectedApp] = useState<FundApplication | null>(null);
  const [isDetailsDialogOpen, setIsDetailsDialogOpen] = useState(false);
  const [updateStatus, setUpdateStatus] = useState("");
  const [updateComments, setUpdateComments] = useState("");

  useEffect(() => {
    fetchApplications();
  }, []);

  const fetchApplications = async () => {
    try {
      setIsLoading(true);
      const data = await api.funds.getMyApplications();
      setApplications(data);
    } catch (err) {
      console.error("Failed to fetch applications:", err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleUpdateStatus = async () => {
    if (!selectedApp || !updateStatus) {
      toast.error("Please select a status");
      return;
    }

    try {
      await api.funds.updateApplicationStatus(selectedApp.id || '', updateStatus, updateComments);
      toast.success("Application updated successfully");
      setIsDetailsDialogOpen(false);
      setUpdateStatus("");
      setUpdateComments("");
      setSelectedApp(null);
      fetchApplications();
    } catch (err) {
      console.error("Failed to update application:", err);
      toast.error("Failed to update application");
    }
  };

  const filteredApplications = applications.filter(app => {
    const matchesSearch = (app.fundId?.toString().toLowerCase().includes(searchTerm.toLowerCase()) || false) ||
                         (app.applicationData?.useOfFunds?.toLowerCase().includes(searchTerm.toLowerCase()) || false);
    const matchesStatus = statusFilter === "all" || app.status.replace('-', '_').toLowerCase() === statusFilter.toLowerCase();
    return matchesSearch && matchesStatus;
  });

  const openDetails = (app: FundApplication) => {
    setSelectedApp(app);
    setUpdateStatus(app.status);
    setUpdateComments(app.reviewComments || "");
    setIsDetailsDialogOpen(true);
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Fund Applications</h1>
        <p className="text-muted-foreground">Review and manage fund applications</p>
      </div>

      {/* Filters */}
      <Card>
        <CardHeader>
          <CardTitle>Filter Applications</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search by fund or notes..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-8"
                />
              </div>
            </div>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-[200px]">
                <SelectValue placeholder="Filter by status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="submitted">Submitted</SelectItem>
                <SelectItem value="under-review">Under Review</SelectItem>
                <SelectItem value="approved">Approved</SelectItem>
                <SelectItem value="rejected">Rejected</SelectItem>
                <SelectItem value="withdrawn">Withdrawn</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Applications Table */}
      <Card>
        <CardHeader>
          <CardTitle>All Applications</CardTitle>
          <CardDescription>
            {filteredApplications.length} application(s) found
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Fund</TableHead>
                <TableHead>Funding Required</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Submitted</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading ? (
                <TableRow>
                  <TableCell colSpan={5} className="text-center py-10">
                    <Loader2 className="h-8 w-8 animate-spin mx-auto text-primary mb-2" />
                    <p className="text-sm text-muted-foreground">Loading applications...</p>
                  </TableCell>
                </TableRow>
              ) : filteredApplications.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={5} className="text-center text-muted-foreground">
                    No applications found
                  </TableCell>
                </TableRow>
              ) : (
                filteredApplications.map((app) => (
                  <TableRow key={app.id}>
                    <TableCell className="font-medium">{app.fundId?.toString()}</TableCell>
                    <TableCell>${app.applicationData?.fundingRequired?.toLocaleString() || 'N/A'}</TableCell>
                    <TableCell>{getStatusBadge(app.status)}</TableCell>
                    <TableCell>{new Date(app.createdAt || '').toLocaleDateString()}</TableCell>
                    <TableCell className="text-right">
                      <Button 
                        variant="ghost" 
                        size="sm"
                        onClick={() => openDetails(app)}
                      >
                        <Eye className="h-4 w-4 mr-2" />
                        Review
                      </Button>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Details Dialog */}
      <Dialog open={isDetailsDialogOpen} onOpenChange={setIsDetailsDialogOpen}>
        <DialogContent className="max-w-md max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Review Application</DialogTitle>
            <DialogDescription>Update the application status and add reviewer comments</DialogDescription>
          </DialogHeader>
          {selectedApp && (
            <div className="space-y-4">
              <div>
                <p className="text-sm font-medium">Fund</p>
                <p className="text-sm text-muted-foreground">{selectedApp.fundId?.toString()}</p>
              </div>
              <div>
                <p className="text-sm font-medium">Use of Funds</p>
                <p className="text-sm text-muted-foreground">{selectedApp.applicationData?.useOfFunds || 'N/A'}</p>
              </div>
              <div>
                <p className="text-sm font-medium">Funding Required</p>
                <p className="text-sm text-muted-foreground">${selectedApp.applicationData?.fundingRequired?.toLocaleString() || 'N/A'}</p>
              </div>
              <div>
                <label className="text-sm font-medium">Status *</label>
                <select
                  value={updateStatus}
                  onChange={(e) => setUpdateStatus(e.target.value)}
                  className="w-full px-3 py-2 border rounded-md mt-1"
                >
                  <option value="submitted">Submitted</option>
                  <option value="under-review">Under Review</option>
                  <option value="approved">Approved</option>
                  <option value="rejected">Rejected</option>
                  <option value="withdrawn">Withdrawn</option>
                </select>
              </div>
              <div>
                <label className="text-sm font-medium">Reviewer Comments</label>
                <textarea
                  value={updateComments}
                  onChange={(e) => setUpdateComments(e.target.value)}
                  placeholder="Add reviewer feedback..."
                  className="w-full px-3 py-2 border rounded-md mt-1"
                  rows={4}
                />
              </div>
              <Button onClick={handleUpdateStatus} className="w-full">Update Application</Button>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
