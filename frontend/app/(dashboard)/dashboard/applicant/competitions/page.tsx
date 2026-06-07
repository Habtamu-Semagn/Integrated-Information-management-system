'use client';

import { useState, useEffect } from 'react';
import { api } from '@/lib/api';
import type { Competition } from '@/lib/api';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { AlertCircle, Loader2, Trophy } from 'lucide-react';
import { toast } from 'sonner';

export default function CompetitionsPage() {
  const [competitions, setCompetitions] = useState<Competition[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadCompetitionsData();
  }, []);

  const loadCompetitionsData = async () => {
    try {
      setLoading(true);
      setError(null);
      // Fetch competitions directly - getAllCompetitions already populates participants
      const allData = await api.competitions.getAll();
      setCompetitions(allData);
    } catch (err) {
      setError('Failed to load competitions');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const isUserRegistered = (competition: Competition): boolean => {
    const userId = localStorage.getItem('userId');
    if (!userId) return false;
    
    if (!competition.participants || competition.participants.length === 0) {
      return false;
    }

    return competition.participants.some((p: any) => {
      // Check if participant is a string ID
      if (typeof p === 'string') {
        return p === userId;
      }
      // Check if participant is an object with _id property
      if (typeof p === 'object' && p !== null) {
        return p._id === userId;
      }
      return false;
    });
  };

  const handleRegister = async (competitionId: string) => {
    try {
      await api.competitions.register(competitionId);
      toast.success('Successfully registered for competition');
      await loadCompetitionsData();
    } catch (err: any) {
      const message = err?.response?.data?.message || 'Failed to register for competition';
      toast.error(message);
    }
  };

  const handleUnregister = async (competitionId: string) => {
    try {
      await api.competitions.unregister(competitionId);
      toast.success('Successfully unregistered from competition');
      await loadCompetitionsData();
    } catch (err: any) {
      const message = err?.response?.data?.message || 'Failed to unregister from competition';
      toast.error(message);
    }
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
        <h1 className="text-3xl font-bold">Competitions & Contests</h1>
        <p className="text-gray-600">Browse and register for competitions</p>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 flex items-center gap-2">
          <AlertCircle className="h-5 w-5 text-red-600" />
          <p className="text-red-700">{error}</p>
        </div>
      )}

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Trophy className="h-5 w-5" />
            Available Competitions
          </CardTitle>
        </CardHeader>
        <CardContent>
          {competitions.length === 0 ? (
            <p className="text-center text-gray-600 py-8">No competitions available</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="bg-gray-50 border-b">
                  <tr>
                    <th className="px-4 py-3 text-left font-semibold text-gray-700">Title</th>
                    <th className="px-4 py-3 text-left font-semibold text-gray-700">Type</th>
                    <th className="px-4 py-3 text-left font-semibold text-gray-700">Registration Deadline</th>
                    <th className="px-4 py-3 text-left font-semibold text-gray-700">Competition Date</th>
                    <th className="px-4 py-3 text-left font-semibold text-gray-700">Prize Pool</th>
                    <th className="px-4 py-3 text-left font-semibold text-gray-700">Participants</th>
                    <th className="px-4 py-3 text-left font-semibold text-gray-700">Status</th>
                    <th className="px-4 py-3 text-left font-semibold text-gray-700">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y">
                  {competitions.map((competition) => {
                    const registered = isUserRegistered(competition);
                    const registrationClosed = new Date() > new Date(competition.registrationDeadline);
                    const firstPlacePrize = competition.prizes?.firstPlace ? `$${competition.prizes.firstPlace.toLocaleString()}` : '-';

                    return (
                      <tr key={competition.id} className="hover:bg-gray-50">
                        <td className="px-4 py-3 font-medium text-gray-900">{competition.title}</td>
                        <td className="px-4 py-3">
                          <span className="text-xs uppercase text-gray-600">
                            {competition.competitionType.replace(/-/g, ' ')}
                          </span>
                        </td>
                        <td className="px-4 py-3 text-gray-700">
                          {new Date(competition.registrationDeadline).toLocaleDateString()}
                        </td>
                        <td className="px-4 py-3 text-gray-700">
                          {new Date(competition.competitionDate).toLocaleDateString()}
                        </td>
                        <td className="px-4 py-3 text-gray-700">{firstPlacePrize}</td>
                        <td className="px-4 py-3 text-gray-700">
                          {competition.participants?.length || 0}
                          {competition.maxParticipants && ` / ${competition.maxParticipants}`}
                        </td>
                        <td className="px-4 py-3">
                          <Badge
                            variant={
                              competition.status === 'completed'
                                ? 'secondary'
                                : competition.status === 'cancelled'
                                ? 'destructive'
                                : 'default'
                            }
                          >
                            {competition.status}
                          </Badge>
                        </td>
                        <td className="px-4 py-3">
                          {competition.status === 'upcoming' || competition.status === 'ongoing' ? (
                            registered ? (
                              <div className="flex items-center gap-2">
                                <Badge className="bg-green-100 text-green-700 border border-green-300">
                                  ✓ Registered
                                </Badge>
                                <Button
                                  size="sm"
                                  variant="outline"
                                  className="text-xs"
                                  onClick={() => handleUnregister(competition.id)}
                                  disabled={registrationClosed}
                                >
                                  Remove
                                </Button>
                              </div>
                            ) : (
                              <Button
                                size="sm"
                                className="text-xs"
                                onClick={() => handleRegister(competition.id)}
                                disabled={registrationClosed}
                              >
                                Register
                              </Button>
                            )
                          ) : (
                            <span className="text-sm text-gray-500">
                              {competition.status === 'completed' ? 'Ended' : 'Cancelled'}
                            </span>
                          )}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
