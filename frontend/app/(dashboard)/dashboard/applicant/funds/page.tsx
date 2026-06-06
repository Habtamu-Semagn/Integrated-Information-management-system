'use client';

import { useState, useEffect } from 'react';
import { api } from '@/lib/api';
import type { Fund, FundApplication } from '@/lib/api';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { AlertCircle, Loader2, DollarSign, Send } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { toast } from 'sonner';

interface FundWithApplication extends Fund {
  application?: FundApplication;
}

export default function FundsPage() {
  const [funds, setFunds] = useState<FundWithApplication[]>([]);
  const [applications, setApplications] = useState<FundApplication[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedFund, setSelectedFund] = useState<Fund | null>(null);
  const [showApplyDialog, setShowApplyDialog] = useState(false);
  const [formData, setFormData] = useState({
    teamSize: '',
    fundingRequired: '',
    useOfFunds: '',
    businessPlan: '',
    financialProjections: '',
  });

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      setError(null);
      const [fundsData, applicationsData] = await Promise.all([
        api.funds.getAll({ onlyOpen: true }),
        api.funds.getMyApplications(),
      ]);
      setFunds(fundsData);
      setApplications(applicationsData);
    } catch (err) {
      setError('Failed to load funding opportunities');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleApply = async () => {
    if (!selectedFund || !formData.teamSize || !formData.fundingRequired || !formData.useOfFunds) {
      setError('Please fill in all required fields');
      return;
    }

    try {
      const response = await api.funds.apply(selectedFund.id, {
        teamSize: parseInt(formData.teamSize),
        fundingRequired: parseFloat(formData.fundingRequired),
        useOfFunds: formData.useOfFunds,
        businessPlan: formData.businessPlan,
        financialProjections: formData.financialProjections,
      });
      
      if (response) {
        toast.success('Application submitted successfully');
        setShowApplyDialog(false);
        setFormData({ teamSize: '', fundingRequired: '', useOfFunds: '', businessPlan: '', financialProjections: '' });
        await loadData();
      }
    } catch (err: any) {
      console.error('Application error:', err);
      const errorMessage = err?.response?.data?.message || err?.message || 'Failed to submit application';
      setError(errorMessage);
      toast.error(errorMessage);
    }
  };

  const hasApplied = (fundId: string) => {
    return applications.some((app) => app.fundId === fundId);
  };

  const getApplicationStatus = (fundId: string) => {
    return applications.find((app) => app.fundId === fundId)?.status;
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
        <h1 className="text-3xl font-bold">Funding Opportunities</h1>
        <p className="text-gray-600">Discover and apply for funding to grow your startup</p>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 flex items-center gap-2">
          <AlertCircle className="h-5 w-5 text-red-600" />
          <p className="text-red-700">{error}</p>
        </div>
      )}

      {/* Funds Table */}
      <Card>
        <CardHeader>
          <CardTitle>Available Funds</CardTitle>
          <CardDescription>{funds.length} opportunity(ies) available</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b">
                  <th className="text-left py-3 px-4 font-semibold">Fund Name</th>
                  <th className="text-left py-3 px-4 font-semibold">Type</th>
                  <th className="text-left py-3 px-4 font-semibold">Amount</th>
                  <th className="text-left py-3 px-4 font-semibold">Deadline</th>
                  <th className="text-left py-3 px-4 font-semibold">Status</th>
                  <th className="text-right py-3 px-4 font-semibold">Action</th>
                </tr>
              </thead>
              <tbody>
                {funds.map((fund) => {
                  const applied = hasApplied(fund.id);
                  const status = getApplicationStatus(fund.id);

                  return (
                    <tr key={fund.id} className="border-b hover:bg-gray-50">
                      <td className="py-3 px-4 font-medium">{fund.title}</td>
                      <td className="py-3 px-4 capitalize">{fund.fundType?.replace('-', ' ')}</td>
                      <td className="py-3 px-4">${fund.maximumAmount?.toLocaleString()}</td>
                      <td className="py-3 px-4">{new Date(fund.deadline).toLocaleDateString()}</td>
                      <td className="py-3 px-4">
                        {applied ? (
                          <Badge
                            variant={
                              status === 'approved'
                                ? 'default'
                                : status === 'rejected'
                                ? 'destructive'
                                : 'secondary'
                            }
                          >
                            {status?.replace('-', ' ').toUpperCase()}
                          </Badge>
                        ) : (
                          <Badge variant="outline">Not Applied</Badge>
                        )}
                      </td>
                      <td className="py-3 px-4 text-right">
                        {!applied && (
                          <Dialog open={showApplyDialog && selectedFund?.id === fund.id} onOpenChange={setShowApplyDialog}>
                            <DialogTrigger asChild>
                              <Button
                                onClick={() => setSelectedFund(fund)}
                                size="sm"
                                variant="default"
                              >
                                <Send className="h-4 w-4 mr-1" />
                                Apply
                              </Button>
                            </DialogTrigger>
                            {selectedFund?.id === fund.id && (
                              <DialogContent>
                                <DialogHeader>
                                  <DialogTitle>Apply for {fund.title}</DialogTitle>
                                </DialogHeader>
                                <div className="space-y-4">
                                  <div>
                                    <label className="block text-sm font-medium mb-2">Team Size *</label>
                                    <input
                                      type="number"
                                      min="1"
                                      value={formData.teamSize}
                                      onChange={(e) =>
                                        setFormData({ ...formData, teamSize: e.target.value })
                                      }
                                      placeholder="Number of team members"
                                      className="w-full px-3 py-2 border border-gray-300 rounded-md"
                                    />
                                  </div>

                                  <div>
                                    <label className="block text-sm font-medium mb-2">Funding Required *</label>
                                    <input
                                      type="number"
                                      min={fund.minimumAmount}
                                      max={fund.maximumAmount}
                                      value={formData.fundingRequired}
                                      onChange={(e) =>
                                        setFormData({
                                          ...formData,
                                          fundingRequired: e.target.value,
                                        })
                                      }
                                      placeholder={`Between ${fund.minimumAmount} and ${fund.maximumAmount}`}
                                      className="w-full px-3 py-2 border border-gray-300 rounded-md"
                                    />
                                  </div>

                                  <div>
                                    <label className="block text-sm font-medium mb-2">Use of Funds *</label>
                                    <textarea
                                      value={formData.useOfFunds}
                                      onChange={(e) =>
                                        setFormData({
                                          ...formData,
                                          useOfFunds: e.target.value,
                                        })
                                      }
                                      placeholder="Describe how you plan to use the funding"
                                      rows={3}
                                      className="w-full px-3 py-2 border border-gray-300 rounded-md"
                                    />
                                  </div>

                                  <div>
                                    <label className="block text-sm font-medium mb-2">Business Plan</label>
                                    <textarea
                                      value={formData.businessPlan}
                                      onChange={(e) =>
                                        setFormData({
                                          ...formData,
                                          businessPlan: e.target.value,
                                        })
                                      }
                                      placeholder="Optional: Share your business plan"
                                      rows={2}
                                      className="w-full px-3 py-2 border border-gray-300 rounded-md"
                                    />
                                  </div>

                                  <div className="flex gap-2">
                                    <Button onClick={handleApply} className="flex-1">
                                      Submit Application
                                    </Button>
                                    <Button
                                      onClick={() => setShowApplyDialog(false)}
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
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      {funds.length === 0 && (
        <Card>
          <CardContent className="pt-6 text-center text-gray-600">
            <DollarSign className="h-12 w-12 text-gray-400 mx-auto mb-2" />
            <p>No funding opportunities available</p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
