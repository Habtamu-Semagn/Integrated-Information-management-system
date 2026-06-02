'use client';

import { useState, useEffect } from 'react';
import { api } from '@/lib/api';
import type { Fund, FundApplication } from '@/lib/api';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { AlertCircle, Loader2, DollarSign, Send } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';

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
      await api.funds.apply(selectedFund.id, {
        teamSize: parseInt(formData.teamSize),
        fundingRequired: parseFloat(formData.fundingRequired),
        useOfFunds: formData.useOfFunds,
        businessPlan: formData.businessPlan,
        financialProjections: formData.financialProjections,
      });
      setShowApplyDialog(false);
      setFormData({ teamSize: '', fundingRequired: '', useOfFunds: '', businessPlan: '', financialProjections: '' });
      await loadData();
    } catch (err) {
      setError('Failed to submit application');
      console.error(err);
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

      {/* My Applications Summary */}
      {applications.length > 0 && (
        <Card className="bg-blue-50 border-blue-200">
          <CardHeader>
            <CardTitle className="text-blue-900">Your Applications</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid gap-2 md:grid-cols-3">
              <div>
                <p className="text-sm text-blue-700">Total Applications</p>
                <p className="text-2xl font-bold text-blue-900">{applications.length}</p>
              </div>
              <div>
                <p className="text-sm text-blue-700">Approved</p>
                <p className="text-2xl font-bold text-blue-900">
                  {applications.filter((a) => a.status === 'approved').length}
                </p>
              </div>
              <div>
                <p className="text-sm text-blue-700">Under Review</p>
                <p className="text-2xl font-bold text-blue-900">
                  {applications.filter((a) => a.status === 'under-review').length}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Funds Grid */}
      <div className="grid gap-4 md:grid-cols-2">
        {funds.map((fund) => {
          const applied = hasApplied(fund.id);
          const status = getApplicationStatus(fund.id);

          return (
            <Card key={fund.id}>
              <CardHeader>
                <div className="flex items-start justify-between gap-2">
                  <div className="flex-1">
                    <CardTitle className="text-lg">{fund.title}</CardTitle>
                    <CardDescription>{fund.fundingOrganization}</CardDescription>
                  </div>
                  <Badge variant="outline">{fund.fundType}</Badge>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-sm text-gray-600">{fund.description}</p>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-xs text-gray-500 mb-1">Min Amount</p>
                    <p className="font-semibold">
                      ${fund.minimumAmount.toLocaleString()} {fund.currency}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500 mb-1">Max Amount</p>
                    <p className="font-semibold">
                      ${fund.maximumAmount.toLocaleString()} {fund.currency}
                    </p>
                  </div>
                </div>

                <div>
                  <p className="text-xs text-gray-500 mb-1">Deadline</p>
                  <p className="font-semibold">{new Date(fund.deadline).toLocaleDateString()}</p>
                </div>

                {fund.requirements && (
                  <div>
                    <p className="text-sm font-medium mb-2">Requirements:</p>
                    <ul className="text-sm space-y-1">
                      {fund.requirements.minTeamSize && (
                        <li>Min Team Size: {fund.requirements.minTeamSize}</li>
                      )}
                      {fund.requirements.targetIndustries && (
                        <li>Industries: {fund.requirements.targetIndustries.join(', ')}</li>
                      )}
                      {fund.requirements.eligibleCountries && (
                        <li>Countries: {fund.requirements.eligibleCountries.join(', ')}</li>
                      )}
                    </ul>
                  </div>
                )}

                <div className="pt-4 border-t">
                  {applied ? (
                    <div>
                      <p className="text-sm text-gray-600 mb-2">Application Status:</p>
                      <Badge
                        className="w-full text-center justify-center py-1"
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
                    </div>
                  ) : (
                    <Dialog open={showApplyDialog && selectedFund?.id === fund.id} onOpenChange={setShowApplyDialog}>
                      <DialogTrigger asChild>
                        <Button
                          onClick={() => setSelectedFund(fund)}
                          className="w-full"
                          variant="default"
                        >
                          <Send className="h-4 w-4 mr-2" />
                          Apply Now
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
                              <label className="block text-sm font-medium mb-2">Funding Required ({fund.currency}) *</label>
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
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {funds.length === 0 && (
        <Card>
          <CardContent className="pt-6 text-center">
            <DollarSign className="h-12 w-12 text-gray-400 mx-auto mb-2" />
            <p className="text-gray-600">No funding opportunities available</p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
