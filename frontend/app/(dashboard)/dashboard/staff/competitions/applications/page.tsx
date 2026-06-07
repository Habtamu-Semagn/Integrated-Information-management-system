'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Loader2, Trophy, Eye } from 'lucide-react';
import { api, Competition } from '@/lib/api';

export default function CompetitionsApplicationsPage() {
  const router = useRouter();
  const [competitions, setCompetitions] = useState<Competition[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const data = await api.competitions.getAll();
        setCompetitions(data);
      } catch (err) {
        console.error('Failed to fetch competitions:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleViewCompetition = (competitionId: string) => {
    router.push(`/dashboard/staff/competitions/applications/${competitionId}`);
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Competition Registrations</h1>
        <p className="text-gray-600">View participants registered for competitions</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Trophy className="h-5 w-5" />
            All Competitions
          </CardTitle>
          <CardDescription>
            {competitions.length} competition(s) with registrations
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Competition Title</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead>Participants</TableHead>
                  <TableHead>Max Capacity</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Action</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {loading ? (
                  <TableRow>
                    <TableCell colSpan={7} className="text-center py-10">
                      <Loader2 className="h-8 w-8 animate-spin mx-auto text-blue-500 mb-2" />
                      <p className="text-sm text-gray-600">Loading competitions...</p>
                    </TableCell>
                  </TableRow>
                ) : competitions.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={7} className="text-center text-gray-600 py-10">
                      No competitions available
                    </TableCell>
                  </TableRow>
                ) : (
                  competitions.map((comp) => (
                    <TableRow key={comp.id} className="hover:bg-gray-50">
                      <TableCell className="font-medium">{comp.title}</TableCell>
                      <TableCell className="text-xs uppercase text-gray-600">
                        {comp.competitionType.replace(/-/g, ' ')}
                      </TableCell>
                      <TableCell>{new Date(comp.competitionDate).toLocaleDateString()}</TableCell>
                      <TableCell className="font-semibold">{comp.participants?.length || 0}</TableCell>
                      <TableCell>{comp.maxParticipants || '-'}</TableCell>
                      <TableCell>
                        <Badge
                          variant={
                            comp.status === 'completed'
                              ? 'secondary'
                              : comp.status === 'cancelled'
                              ? 'destructive'
                              : 'default'
                          }
                        >
                          {comp.status}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleViewCompetition(comp.id)}
                          className="flex items-center gap-1"
                        >
                          <Eye className="h-4 w-4" />
                          View
                        </Button>
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
