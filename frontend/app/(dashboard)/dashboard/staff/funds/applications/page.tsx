'use client';

import { useState, useEffect } from 'react';
import { api } from '@/lib/api';
import type { Fund, FundApplication } from '@/lib/api';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { AlertCircle, Loader2, FileText } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { toast } from 'sonner';

interface FundWithApplications extends Fund {
  applications?: FundApplication[];
}

export default function StaffFundApplicationsPage() {
  const [funds, setFunds] = useState<FundWithApplications[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedApplication, setSelectedApplication] = useState<FundApplication | null>(null);
  const [statusFilter, setStatusFilter] = useState('all');
  const [selectedFundFilter, setSelectedFundFilter] = useState('all');
  const [reviewComments, setReviewComments] = useState('');
  const [showReviewDialog, setShowReviewDialog] = useState(false);
  const [newStatus, setNewStatus] = useState('under-review');

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      setError(null);
      const fundsData = await api.funds.getAll();
      
      // Load applications for each fund
      const fundsWithApps = await Promise.all(
        fundsData.map(async (fund) => {
          try {
            const apps = await api.funds.getApplications(fund.id);
            return { ...fund, applications: apps };
          } catch {
            return { ...fund, applications: [] };
          }
        })
      );
      
      setFunds(fundsWithApps);
    } catch (err) {
      setError('Failed to load fund applications');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleStatusUpdate = async (applicationId: string, status: string, comments: string) => {
    try {
      await api.funds.updateApplicationStatus(applicationId, status, comments || undefined);
      toast.success('Application status updated successfully');
      setShowReviewDialog(false);
      setReviewComments('');
      await loadData();
    } catch (err) {
      setError('Failed to update application status');
      console.error(err);
      toast.error('Failed to update application status');
    }
  };

  const allApplications = funds
    .flatMap(fund => (fund.applications || []).map(app => ({ ...app, fundTitle: fund.title })))
    .filter(app => {
      const statusMatch = statusFilter === 'all' || app.status === statusFilter;
      const fundMatch = selectedFundFilter === 'all' || app.fundTitle === selectedFundFilter;
      return statusMatch && fundMatch;
    });

  const getStatusBadge = (status: string) => {
    const variants: Record<string, any> = {
      submitted: { variant: 'outline', label: 'Submitted' },
      'under-review': { variant: 'secondary', label: 'Under Review' },
      approved: { variant: 'default', label: 'Approved' },
      rejected: { variant: 'destructive', label: 'Rejected' },
      withdrawn: { variant: 'outline', label: 'Withdrawn' }
    };
    
    const config = variants[status] || variants.submitted;
    return <Badge variant={config.variant}>{config.label}</Badge>;
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[400px]">
        <Loader2 className="h-8 w-8 animate-spin text-blue-500" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Fund Applications</h1>
        <p className="text-gray-600">Review and manage fund applications from startups</p>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 flex items-center gap-2">
          <AlertCircle className="h-5 w-5 text-red-600" />
          <p className="text-red-700">{error}</p>
        </div>
      )}

      {/* Filters */}
      <Card>
        <CardHeader>
          <CardTitle>Filters</CardTitle>
        </CardHeader>
        <CardContent className="flex gap-4">
          <div className="flex-1">
            <label className="block text-sm font-medium mb-2">Status</label>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
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
          <div className="flex-1">
            <label className="block text-sm font-medium mb-2">Fund</label>
            <Select value={selectedFundFilter} onValueChange={setSelectedFundFilter}>
              <SelectTrigger>
                <SelectValue placeholder="Filter by fund" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Funds</SelectItem>
                {funds.map(fund => (
                  <SelectItem key={fund.id} value={fund.title}>{fund.title}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Applications Table */}
      <Card>
        <CardHeader>
          <CardTitle>Applications</CardTitle>
          <CardDescription>{allApplications.length} application(s) found</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b">
                  <th className="text-left py-3 px-4 font-semibold">Startup</th>
                  <th className="text-left py-3 px-4 font-semibold">Fund</th>
                  <th className="text-left py-3 px-4 font-semibold">Team Size</th>
                  <th className="text-left py-3 px-4 font-semibold">Funding Requested</th>
                  <th className="text-left py-3 px-4 font-semibold">Status</th>
                  <th className="text-right py-3 px-4 font-semibold">Actions</th>
                </tr>
              </thead>
              <tbody>
                {allApplications.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="text-center py-6 text-gray-500">
                      No applications found
                    </td>
                  </tr>
                ) : (
                  allApplications.map((app) => (
                    <tr key={app.id} className="border-b hover:bg-gray-50">
                      <td className="py-3 px-4 font-medium">
                        {typeof app.startupId === 'string' ? app.startupId : (app.startupId as any)?.name || 'N/A'}
                      </td>
                      <td className="py-3 px-4">{app.fundTitle}</td>
                      <td className="py-3 px-4">{app.applicationData?.teamSize || 'N/A'}</td>
                      <td className="py-3 px-4">${(app.applicationData?.fundingRequired || 0).toLocaleString()}</td>
                      <td className="py-3 px-4">{getStatusBadge(app.status)}</td>
                      <td className="py-3 px-4 text-right">
                        <Dialog open={showReviewDialog && selectedApplication?.id === app.id} onOpenChange={setShowReviewDialog}>
                          <DialogTrigger asChild>
                            <Button
                              onClick={() => setSelectedApplication(app)}
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
    </div>
  );
}
