'use client';

import { useState, useEffect, use } from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ArrowLeft, DollarSign, Users, Calendar, Building2, FileText, Loader2 } from 'lucide-react';
import Link from 'next/link';
import { api, Fund, FundApplication } from '@/lib/api';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';

export default function FundDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const router = useRouter();
  const [fund, setFund] = useState<Fund | null>(null);
  const [applications, setApplications] = useState<FundApplication[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchFundData = async () => {
      try {
        setIsLoading(true);
        const [fundData, appsData] = await Promise.all([
          api.funds.getById(id),
          api.funds.getApplications(id),
        ]);
        setFund(fundData);
        setApplications(appsData);
      } catch (err) {
        console.error('Failed to fetch fund data:', err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchFundData();
  }, [id]);

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px]">
        <Loader2 className="h-8 w-8 animate-spin text-primary mb-2" />
        <p className="text-sm text-muted-foreground">Loading fund...</p>
      </div>
    );
  }

  if (!fund) {
    return (
      <div className="text-center py-12">
        <h2 className="text-2xl font-bold">Fund not found</h2>
        <Link href="/dashboard/staff/funds/applications" className="text-primary hover:underline mt-4 block">
          Back to funds
        </Link>
      </div>
    );
  }

  const getStatusVariant = (status: string) => {
    const variants: Record<string, 'default' | 'secondary' | 'destructive' | 'outline'> = {
      submitted: 'outline',
      'under-review': 'default',
      approved: 'default',
      rejected: 'destructive',
      withdrawn: 'secondary',
    };
    return variants[status] || 'outline';
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link href="/dashboard/staff/funds/applications">
            <Button variant="ghost" size="sm">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back
            </Button>
          </Link>
          <div>
            <h1 className="text-3xl font-bold">{fund.title}</h1>
            <p className="text-muted-foreground">Fund Details & Applications</p>
          </div>
        </div>
        <Badge
          variant={
            fund.status === 'closed'
              ? 'secondary'
              : fund.status === 'paused'
              ? 'destructive'
              : 'default'
          }
        >
          {fund.status}
        </Badge>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        {/* Fund Details */}
        <Card className="md:col-span-2">
          <CardHeader>
            <CardTitle>Fund Overview</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <h3 className="font-semibold mb-2">Description</h3>
              <p className="text-muted-foreground">{fund.description}</p>
            </div>
          </CardContent>
        </Card>

        {/* Fund Amount */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <DollarSign className="h-5 w-5" />
              Funding Range
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <div>
              <p className="text-sm font-medium text-gray-600">Minimum Amount</p>
              <p className="text-2xl font-bold">
                {fund.currency} {fund.minimumAmount?.toLocaleString()}
              </p>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-600">Maximum Amount</p>
              <p className="text-2xl font-bold">
                {fund.currency} {fund.maximumAmount?.toLocaleString()}
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Fund Details */}
        <Card>
          <CardHeader>
            <CardTitle>Fund Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div>
              <p className="text-sm font-medium text-gray-600">Type</p>
              <p className="font-semibold">{fund.fundType.replace(/-/g, ' ')}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-600">Organization</p>
              <p className="font-semibold">{fund.fundingOrganization}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-600">Deadline</p>
              <p className="font-semibold">{new Date(fund.deadline).toLocaleDateString()}</p>
            </div>
          </CardContent>
        </Card>

        {/* Requirements */}
        {fund.requirements && (
          <Card>
            <CardHeader>
              <CardTitle>Requirements</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {fund.requirements.minTeamSize && (
                <div>
                  <p className="text-sm font-medium text-gray-600">Minimum Team Size</p>
                  <p className="font-semibold">{fund.requirements.minTeamSize} members</p>
                </div>
              )}
              {fund.requirements.targetIndustries && fund.requirements.targetIndustries.length > 0 && (
                <div>
                  <p className="text-sm font-medium text-gray-600">Target Industries</p>
                  <div className="flex gap-2 flex-wrap mt-1">
                    {fund.requirements.targetIndustries.map((industry, idx) => (
                      <Badge key={idx} variant="outline">
                        {industry}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}
              {fund.requirements.eligibleCountries && fund.requirements.eligibleCountries.length > 0 && (
                <div>
                  <p className="text-sm font-medium text-gray-600">Eligible Countries</p>
                  <p className="font-semibold text-sm">{fund.requirements.eligibleCountries.join(', ')}</p>
                </div>
              )}
            </CardContent>
          </Card>
        )}

        {/* Applications Overview */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileText className="h-5 w-5" />
              Applications Summary
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Applications</p>
              <p className="text-3xl font-bold">{applications.length}</p>
            </div>
            <div className="grid grid-cols-2 gap-2 mt-4">
              <div className="bg-blue-50 p-2 rounded">
                <p className="text-xs text-gray-600">Submitted</p>
                <p className="font-bold">
                  {applications.filter((a) => a.status === 'submitted').length}
                </p>
              </div>
              <div className="bg-yellow-50 p-2 rounded">
                <p className="text-xs text-gray-600">Under Review</p>
                <p className="font-bold">
                  {applications.filter((a) => a.status === 'under-review').length}
                </p>
              </div>
              <div className="bg-green-50 p-2 rounded">
                <p className="text-xs text-gray-600">Approved</p>
                <p className="font-bold">
                  {applications.filter((a) => a.status === 'approved').length}
                </p>
              </div>
              <div className="bg-red-50 p-2 rounded">
                <p className="text-xs text-gray-600">Rejected</p>
                <p className="font-bold">
                  {applications.filter((a) => a.status === 'rejected').length}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Applications Table */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Users className="h-5 w-5" />
            Fund Applications
          </CardTitle>
          <CardDescription>
            {applications.length} application(s) for this fund
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Startup Name</TableHead>
                  <TableHead>Team Size</TableHead>
                  <TableHead>Funding Requested</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Applied Date</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {applications.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={5} className="text-center text-gray-600 py-10">
                      No applications submitted yet
                    </TableCell>
                  </TableRow>
                ) : (
                  applications.map((app: any) => (
                    <TableRow key={app.id}>
                      <TableCell className="font-medium">
                        {typeof app.startupId === 'string'
                          ? app.startupId
                          : app.startupId?.name || 'Unknown'}
                      </TableCell>
                      <TableCell>{app.applicationData?.teamSize || '-'}</TableCell>
                      <TableCell>
                        {fund.currency}{' '}
                        {app.applicationData?.fundingRequired?.toLocaleString() || '-'}
                      </TableCell>
                      <TableCell>
                        <Badge variant={getStatusVariant(app.status)}>
                          {app.status.replace(/-/g, ' ')}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-sm text-gray-600">
                        {new Date(app.createdAt).toLocaleDateString()}
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
