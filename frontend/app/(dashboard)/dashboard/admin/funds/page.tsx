"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Eye, Search, Plus, Trash2, Loader2, Users, FileText } from "lucide-react";
import { api, Fund, FundApplication } from "@/lib/api";
import { toast } from "sonner";

const FUND_TYPES = [
  "Seed Funding",
  "Series A",
  "Series B",
  "Grant",
  "Accelerator",
  "Venture Capital"
];

const getStatusBadge = (status: string) => {
  const variants: Record<string, { variant: "default" | "secondary" | "destructive" | "outline", label: string }> = {
    open: { variant: "default", label: "Open" },
    closed: { variant: "destructive", label: "Closed" },
    paused: { variant: "secondary", label: "Paused" },
  };
  
  const config = variants[status.toLowerCase()] || variants.open;
  return <Badge variant={config.variant}>{config.label}</Badge>;
};

export default function AdminFundsPage() {
  const [funds, setFunds] = useState<Fund[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<"manage" | "applicants">("manage");
  const [applicationsLoading, setApplicationsLoading] = useState(false);
  const [applications, setApplications] = useState<Array<FundApplication & { fundTitle: string }>>([]);
  const [applicationStatusFilter, setApplicationStatusFilter] = useState("all");
  const [applicationSearchTerm, setApplicationSearchTerm] = useState("");
  const [selectedApplication, setSelectedApplication] = useState<(FundApplication & { fundTitle: string }) | null>(null);
  const [showReviewDialog, setShowReviewDialog] = useState(false);
  const [reviewComments, setReviewComments] = useState("");
  const [newStatus, setNewStatus] = useState("under-review");
  const [createData, setCreateData] = useState({
    name: "",
    description: "",
    fundType: "",
    amount: "",
    deadline: "",
    status: "open"
  });

  useEffect(() => {
    fetchFunds();
  }, []);

  const loadApplications = async () => {
    try {
      setApplicationsLoading(true);
      const allApps: Array<FundApplication & { fundTitle: string }> = [];
      for (const fund of funds) {
        const apps = await api.funds.getApplications(fund.id);
        allApps.push(...apps.map(app => ({ ...app, fundTitle: fund.title })));
      }
      setApplications(allApps);
    } catch (err) {
      console.error("Failed to load applications:", err);
      toast.error("Failed to load fund applications");
    } finally {
      setApplicationsLoading(false);
    }
  };

  useEffect(() => {
    if (activeTab === "applicants") {
      loadApplications();
    }
  }, [activeTab, funds]);

  const fetchFunds = async () => {
    try {
      setIsLoading(true);
      const data = await api.funds.getAll();
      setFunds(data);
    } catch (err) {
      console.error("Failed to fetch funds:", err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCreateFund = async () => {
    if (!createData.name || !createData.description || !createData.fundType || !createData.amount || !createData.deadline) {
      toast.error("Please fill in all required fields");
      return;
    }

    if (createData.description.length < 20) {
      toast.error("Description must be at least 20 characters");
      return;
    }

    try {
      const fundTypeMap: Record<string, "seed-funding" | "series-a" | "series-b" | "grant" | "accelerator" | "venture-capital"> = {
        "Seed Funding": "seed-funding",
        "Series A": "series-a",
        "Series B": "series-b",
        "Grant": "grant",
        "Accelerator": "accelerator",
        "Venture Capital": "venture-capital"
      };

      await api.funds.create({
        title: createData.name,
        description: createData.description,
        fundType: fundTypeMap[createData.fundType] || "seed-funding",
        minimumAmount: 0,
        maximumAmount: parseInt(createData.amount),
        deadline: new Date(createData.deadline).toISOString(),
        fundingOrganization: "Organization",
        status: createData.status as "open" | "closed" | "paused"
      });
      toast.success("Fund created successfully");
      setIsCreateDialogOpen(false);
      setCreateData({
        name: "",
        description: "",
        fundType: "",
        amount: "",
        deadline: "",
        status: "open"
      });
      fetchFunds();
    } catch (err) {
      console.error("Failed to create fund:", err);
      toast.error("Failed to create fund");
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this fund?")) return;
    
    try {
      await api.funds.delete(id);
      toast.success("Fund deleted successfully");
      fetchFunds();
    } catch (err) {
      console.error("Failed to delete fund:", err);
      toast.error("Failed to delete fund");
    }
  };

  const handleStatusUpdate = async (applicationId: string, status: string, comments: string) => {
    try {
      await api.funds.updateApplicationStatus(applicationId, status, comments || undefined);
      toast.success("Application status updated successfully");
      setShowReviewDialog(false);
      setReviewComments("");
      await loadApplications();
    } catch (err) {
      console.error("Failed to update application status:", err);
      toast.error("Failed to update application status");
    }
  };

  const filteredFunds = funds.filter(fund => {
    const matchesSearch = fund.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         fund.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === "all" || fund.status.toLowerCase() === statusFilter.toLowerCase();
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-start">
        <div>
          <h1 className="text-3xl font-bold">Funds Management</h1>
          <p className="text-muted-foreground">Create and manage funding opportunities</p>
        </div>
        <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              Create Fund
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-md max-h-[80vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Create New Fund</DialogTitle>
              <DialogDescription>Add a new funding opportunity to the platform</DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <input
                type="text"
                placeholder="Fund Name *"
                value={createData.name}
                onChange={(e) => setCreateData({...createData, name: e.target.value})}
                className="w-full px-3 py-2 border rounded-md"
              />
              <textarea
                placeholder="Description (min 20 characters) *"
                value={createData.description}
                onChange={(e) => setCreateData({...createData, description: e.target.value})}
                className="w-full px-3 py-2 border rounded-md"
                rows={3}
              />
              <select
                value={createData.fundType}
                onChange={(e) => setCreateData({...createData, fundType: e.target.value})}
                className="w-full px-3 py-2 border rounded-md"
              >
                <option value="">Select Fund Type *</option>
                {FUND_TYPES.map(type => (
                  <option key={type} value={type}>{type}</option>
                ))}
              </select>
              <input
                type="number"
                placeholder="Amount *"
                value={createData.amount}
                onChange={(e) => setCreateData({...createData, amount: e.target.value})}
                className="w-full px-3 py-2 border rounded-md"
              />
              <input
                type="date"
                value={createData.deadline}
                onChange={(e) => setCreateData({...createData, deadline: e.target.value})}
                className="w-full px-3 py-2 border rounded-md"
                required
              />
              <select
                value={createData.status}
                onChange={(e) => setCreateData({...createData, status: e.target.value})}
                className="w-full px-3 py-2 border rounded-md"
              >
                <option value="open">Open</option>
                <option value="closed">Closed</option>
                <option value="paused">Paused</option>
              </select>
              <Button onClick={handleCreateFund} className="w-full">Create Fund</Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Tabs */}
      <div className="flex gap-4 border-b">
        <button
          onClick={() => setActiveTab("manage")}
          className={`pb-2 px-4 font-medium border-b-2 transition-colors ${
            activeTab === "manage" ? "border-blue-500 text-blue-600" : "border-transparent text-gray-600 hover:text-gray-900"
          }`}
        >
          Manage Funds
        </button>
        <button
          onClick={() => setActiveTab("applicants")}
          className={`pb-2 px-4 font-medium border-b-2 transition-colors ${
            activeTab === "applicants" ? "border-blue-500 text-blue-600" : "border-transparent text-gray-600 hover:text-gray-900"
          }`}
        >
          <Users className="inline mr-2 h-4 w-4" />
          Applicants
        </button>
      </div>

      {activeTab === "manage" && (
      <>
      {/* Filters */}
      <Card>
        <CardHeader>
          <CardTitle>Filter Funds</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search by name or description..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-8"
                />
              </div>
            </div>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Filter by status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="open">Open</SelectItem>
                <SelectItem value="closed">Closed</SelectItem>
                <SelectItem value="paused">Paused</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Funds Table */}
      <Card>
        <CardHeader>
          <CardTitle>All Funds</CardTitle>
          <CardDescription>
            {filteredFunds.length} fund(s) found
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Fund Name</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Amount</TableHead>
                <TableHead>Deadline</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading ? (
                <TableRow>
                  <TableCell colSpan={6} className="text-center py-10">
                    <Loader2 className="h-8 w-8 animate-spin mx-auto text-primary mb-2" />
                    <p className="text-sm text-muted-foreground">Loading funds...</p>
                  </TableCell>
                </TableRow>
              ) : filteredFunds.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} className="text-center text-muted-foreground">
                    No funds found
                  </TableCell>
                </TableRow>
              ) : (
                filteredFunds.map((fund) => (
                  <TableRow key={fund.id}>
                    <TableCell className="font-medium">{fund.title}</TableCell>
                    <TableCell className="capitalize">{fund.fundType?.replace('-', ' ')}</TableCell>
                    <TableCell>${fund.maximumAmount?.toLocaleString()}</TableCell>
                    <TableCell>{new Date(fund.deadline).toLocaleDateString()}</TableCell>
                    <TableCell>{getStatusBadge(fund.status)}</TableCell>
                    <TableCell className="text-right space-x-2">
                      <Button variant="ghost" size="sm" disabled>
                        <Eye className="h-4 w-4" />
                      </Button>
                      <Button 
                        variant="ghost" 
                        size="sm"
                        onClick={() => handleDelete(fund.id || '')}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
      </>
      )}

      {activeTab === "applicants" && (
        <>
          {/* Filters */}
          <Card>
            <CardHeader>
              <CardTitle>Filter Applications</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex gap-4">
                <div className="flex-1">
                  <label className="block text-sm font-medium mb-2">Search</label>
                  <div className="relative">
                    <Search className="absolute left-2 top-2.5 h-4 w-4 text-gray-400" />
                    <Input
                      placeholder="Search by startup or fund name..."
                      value={applicationSearchTerm}
                      onChange={(e) => setApplicationSearchTerm(e.target.value)}
                      className="pl-8"
                    />
                  </div>
                </div>
              </div>
              <div className="flex gap-4">
                <div className="flex-1">
                  <label className="block text-sm font-medium mb-2">Status</label>
                  <Select value={applicationStatusFilter} onValueChange={setApplicationStatusFilter}>
                    <SelectTrigger>
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
              </div>
            </CardContent>
          </Card>

          {/* Applications Table */}
          <Card>
            <CardHeader>
              <CardTitle>Applications</CardTitle>
              <CardDescription>
                {applications.filter(app => {
                  const statusMatch = applicationStatusFilter === 'all' || app.status === applicationStatusFilter;
                  const startupName = typeof app.startupId === 'string' ? app.startupId : (app.startupId as any)?.name || '';
                  const searchMatch = applicationSearchTerm === '' || 
                    startupName.toLowerCase().includes(applicationSearchTerm.toLowerCase()) ||
                    app.fundTitle.toLowerCase().includes(applicationSearchTerm.toLowerCase());
                  return statusMatch && searchMatch;
                }).length} application(s) found
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b">
                      <th className="text-left py-3 px-4 font-semibold">Startup</th>
                      <th className="text-left py-3 px-4 font-semibold">Email</th>
                      <th className="text-left py-3 px-4 font-semibold">Fund</th>
                      <th className="text-left py-3 px-4 font-semibold">Team Size</th>
                      <th className="text-left py-3 px-4 font-semibold">Funding Requested</th>
                      <th className="text-left py-3 px-4 font-semibold">Status</th>
                      <th className="text-left py-3 px-4 font-semibold">Submitted</th>
                      <th className="text-right py-3 px-4 font-semibold">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {applicationsLoading ? (
                      <tr>
                        <td colSpan={8} className="text-center py-6">
                          <Loader2 className="h-6 w-6 animate-spin mx-auto text-primary" />
                        </td>
                      </tr>
                    ) : applications.filter(app => {
                      const statusMatch = applicationStatusFilter === 'all' || app.status === applicationStatusFilter;
                      const startupName = typeof app.startupId === 'string' ? app.startupId : (app.startupId as any)?.name || '';
                      const searchMatch = applicationSearchTerm === '' || 
                        startupName.toLowerCase().includes(applicationSearchTerm.toLowerCase()) ||
                        app.fundTitle.toLowerCase().includes(applicationSearchTerm.toLowerCase());
                      return statusMatch && searchMatch;
                    }).length === 0 ? (
                      <tr>
                        <td colSpan={8} className="text-center py-6 text-gray-500">
                          No applications found
                        </td>
                      </tr>
                    ) : (
                      applications
                        .filter(app => {
                          const statusMatch = applicationStatusFilter === 'all' || app.status === applicationStatusFilter;
                          const startupName = typeof app.startupId === 'string' ? app.startupId : (app.startupId as any)?.name || '';
                          const searchMatch = applicationSearchTerm === '' || 
                            startupName.toLowerCase().includes(applicationSearchTerm.toLowerCase()) ||
                            app.fundTitle.toLowerCase().includes(applicationSearchTerm.toLowerCase());
                          return statusMatch && searchMatch;
                        })
                        .map(app => (
                          <tr key={app.id} className="border-b hover:bg-gray-50">
                            <td className="py-3 px-4 font-medium">
                              {typeof app.startupId === 'string' ? app.startupId : (app.startupId as any)?.name || 'N/A'}
                            </td>
                            <td className="py-3 px-4 text-sm">
                              {typeof app.startupId === 'string' ? 'N/A' : (app.startupId as any)?.email || 'N/A'}
                            </td>
                            <td className="py-3 px-4">{app.fundTitle}</td>
                            <td className="py-3 px-4">{app.applicationData?.teamSize || 'N/A'}</td>
                            <td className="py-3 px-4">${(app.applicationData?.fundingRequired || 0).toLocaleString()}</td>
                            <td className="py-3 px-4">
                              <Badge variant={app.status === 'approved' ? 'default' : app.status === 'rejected' ? 'destructive' : 'outline'}>
                                {app.status}
                              </Badge>
                            </td>
                            <td className="py-3 px-4 text-sm text-gray-600">
                              {new Date(app.createdAt).toLocaleDateString()}
                            </td>
                            <td className="py-3 px-4 text-right">
                              <Dialog open={showReviewDialog && selectedApplication?.id === app.id} onOpenChange={setShowReviewDialog}>
                                <DialogTrigger asChild>
                                  <Button
                                    onClick={() => {
                                      setSelectedApplication(app);
                                      setNewStatus(app.status);
                                    }}
                                    size="sm"
                                    variant="default"
                                  >
                                    <FileText className="h-4 w-4 mr-1" />
                                    Review
                                  </Button>
                                </DialogTrigger>
                                {selectedApplication?.id === app.id && (
                                  <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
                                    <DialogHeader>
                                      <DialogTitle>Review Application</DialogTitle>
                                    </DialogHeader>
                                    <div className="space-y-4">
                                      <div className="grid grid-cols-2 gap-4">
                                        <div>
                                          <p className="text-sm text-gray-600">Startup</p>
                                          <p className="font-semibold">
                                            {typeof selectedApplication?.startupId === 'string' 
                                              ? selectedApplication.startupId 
                                              : (selectedApplication?.startupId as any)?.name}
                                          </p>
                                        </div>
                                        <div>
                                          <p className="text-sm text-gray-600">Fund</p>
                                          <p className="font-semibold">{app.fundTitle}</p>
                                        </div>
                                        <div>
                                          <p className="text-sm text-gray-600">Team Size</p>
                                          <p className="font-semibold">{app.applicationData?.teamSize}</p>
                                        </div>
                                        <div>
                                          <p className="text-sm text-gray-600">Funding Requested</p>
                                          <p className="font-semibold">${(app.applicationData?.fundingRequired || 0).toLocaleString()}</p>
                                        </div>
                                      </div>

                                      <div>
                                        <p className="text-sm font-medium mb-2">Use of Funds</p>
                                        <p className="text-sm bg-gray-50 p-3 rounded">{app.applicationData?.useOfFunds}</p>
                                      </div>

                                      {app.applicationData?.businessPlan && (
                                        <div>
                                          <p className="text-sm font-medium mb-2">Business Plan</p>
                                          <p className="text-sm bg-gray-50 p-3 rounded">{app.applicationData.businessPlan}</p>
                                        </div>
                                      )}

                                      {app.applicationData?.financialProjections && (
                                        <div>
                                          <p className="text-sm font-medium mb-2">Financial Projections</p>
                                          <p className="text-sm bg-gray-50 p-3 rounded">{app.applicationData.financialProjections}</p>
                                        </div>
                                      )}

                                      <div>
                                        <label className="block text-sm font-medium mb-2">Decision</label>
                                        <Select value={newStatus} onValueChange={setNewStatus}>
                                          <SelectTrigger>
                                            <SelectValue />
                                          </SelectTrigger>
                                          <SelectContent>
                                            <SelectItem value="under-review">Under Review</SelectItem>
                                            <SelectItem value="approved">Approve</SelectItem>
                                            <SelectItem value="rejected">Reject</SelectItem>
                                          </SelectContent>
                                        </Select>
                                      </div>

                                      <div>
                                        <label className="block text-sm font-medium mb-2">Comments (Optional)</label>
                                        <textarea
                                          value={reviewComments}
                                          onChange={(e) => setReviewComments(e.target.value)}
                                          placeholder="Add review comments..."
                                          rows={3}
                                          className="w-full px-3 py-2 border border-gray-300 rounded-md"
                                        />
                                      </div>

                                      <div className="flex gap-2">
                                        <Button 
                                          onClick={() => handleStatusUpdate(app.id, newStatus, reviewComments)}
                                          className="flex-1"
                                        >
                                          Submit Review
                                        </Button>
                                        <Button
                                          onClick={() => setShowReviewDialog(false)}
                                          variant="outline"
                                          className="flex-1"
                                        >
                                          Cancel
                                        </Button>
                                      </div>
                                    </div>
                                  </DialogContent>
                                )}
                              </Dialog>
                            </td>
                          </tr>
                        ))
                    )}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </>
      )}
    </div>
  );
}
