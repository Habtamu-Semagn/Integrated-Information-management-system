'use client';

import { useState, useEffect } from 'react';
import { api } from '@/lib/api';
import type { Competition } from '@/lib/api';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { AlertCircle, Loader2, Search } from 'lucide-react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';

interface CompetitionWithParticipants extends Competition {
  participantCount?: number;
}

export default function AdminCompetitionApplicationsPage() {
  const [competitions, setCompetitions] = useState<CompetitionWithParticipants[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [statusFilter, setStatusFilter] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      setError(null);
      const competitionsData = await api.competitions.getAll();
      
      const competitionsWithCounts = competitionsData.map(comp => ({
        ...comp,
        participantCount: comp.participants?.length || 0
      }));
      
      setCompetitions(competitionsWithCounts);
    } catch (err) {
      setError('Failed to load competition participants');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const filteredCompetitions = competitions.filter(comp => {
    const matchesSearch = comp.title.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || comp.status === statusFilter;
    const hasParticipants = (comp.participantCount || 0) > 0;
    return matchesSearch && matchesStatus && hasParticipants;
  });

  const getStatusBadge = (status: string) => {
    const variants: Record<string, any> = {
      upcoming: { variant: 'outline', label: 'Upcoming' },
      ongoing: { variant: 'secondary', label: 'Ongoing' },
      completed: { variant: 'default', label: 'Completed' },
      cancelled: { variant: 'destructive', label: 'Cancelled' }
    };
    
    const config = variants[status] || variants.upcoming;
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
        <h1 className="text-3xl font-bold">Competition Participants</h1>
        <p className="text-gray-600">View participants registered for competitions</p>
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
        <CardContent className="space-y-4">
          <div className="flex gap-4">
            <div className="flex-1">
              <label className="block text-sm font-medium mb-2">Search</label>
              <div className="relative">
                <Search className="absolute left-2 top-2.5 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Search by competition name..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-8"
                />
              </div>
            </div>
            <div className="flex-1">
              <label className="block text-sm font-medium mb-2">Status</label>
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger>
                  <SelectValue placeholder="Filter by status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="upcoming">Upcoming</SelectItem>
                  <SelectItem value="ongoing">Ongoing</SelectItem>
                  <SelectItem value="completed">Completed</SelectItem>
                  <SelectItem value="cancelled">Cancelled</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Competitions Table */}
      <Card>
        <CardHeader>
          <CardTitle>Competitions</CardTitle>
          <CardDescription>{filteredCompetitions.length} competition(s) with participants found</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b">
                  <th className="text-left py-3 px-4 font-semibold">Competition Title</th>
                  <th className="text-left py-3 px-4 font-semibold">Type</th>
                  <th className="text-left py-3 px-4 font-semibold">Date</th>
                  <th className="text-left py-3 px-4 font-semibold">Status</th>
                  <th className="text-left py-3 px-4 font-semibold">Participants</th>
                  <th className="text-left py-3 px-4 font-semibold">Max Participants</th>
                </tr>
              </thead>
              <tbody>
                {filteredCompetitions.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="text-center py-6 text-gray-500">
                      No competitions with participants found
                    </td>
                  </tr>
                ) : (
                  filteredCompetitions.map((comp) => (
                    <tr key={comp.id} className="border-b hover:bg-gray-50">
                      <td className="py-3 px-4 font-medium">{comp.title}</td>
                      <td className="py-3 px-4 text-sm capitalize">{comp.competitionType.replace('-', ' ')}</td>
                      <td className="py-3 px-4 text-sm">
                        {new Date(comp.competitionDate).toLocaleDateString()}
                      </td>
                      <td className="py-3 px-4">{getStatusBadge(comp.status)}</td>
                      <td className="py-3 px-4 text-sm font-semibold">{comp.participantCount}</td>
                      <td className="py-3 px-4 text-sm">{comp.maxParticipants || 'Unlimited'}</td>
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
