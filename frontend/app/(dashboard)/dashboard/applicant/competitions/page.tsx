'use client';

import { useState, useEffect } from 'react';
import { api } from '@/lib/api';
import type { Competition } from '@/lib/api';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { AlertCircle, Loader2, Trophy, Calendar, Users } from 'lucide-react';

export default function CompetitionsPage() {
  const [competitions, setCompetitions] = useState<Competition[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [registeredIds, setRegisteredIds] = useState<Set<string>>(new Set());

  useEffect(() => {
    loadCompetitions();
  }, []);

  const loadCompetitions = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await api.competitions.getAll({ upcomingOnly: true });
      setCompetitions(data);
    } catch (err) {
      setError('Failed to load competitions');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleRegister = async (competitionId: string) => {
    try {
      await api.competitions.register(competitionId);
      setRegisteredIds(new Set([...registeredIds, competitionId]));
      await loadCompetitions();
    } catch (err) {
      setError('Failed to register for competition');
      console.error(err);
    }
  };

  const handleUnregister = async (competitionId: string) => {
    try {
      await api.competitions.unregister(competitionId);
      const newIds = new Set(registeredIds);
      newIds.delete(competitionId);
      setRegisteredIds(newIds);
      await loadCompetitions();
    } catch (err) {
      setError('Failed to unregister from competition');
      console.error(err);
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
        <p className="text-gray-600">Showcase your startup and compete for prizes</p>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 flex items-center gap-2">
          <AlertCircle className="h-5 w-5 text-red-600" />
          <p className="text-red-700">{error}</p>
        </div>
      )}

      {/* Competitions Grid */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-1">
        {competitions.map((competition) => {
          const isRegistered = registeredIds.has(competition.id) || competition.participants?.length === 0;
          const daysUntilDeadline = Math.ceil(
            (new Date(competition.registrationDeadline).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24)
          );

          return (
            <Card key={competition.id} className="overflow-hidden">
              <CardHeader className="bg-gradient-to-r from-blue-50 to-purple-50">
                <div className="flex items-start justify-between gap-2">
                  <div className="flex-1">
                    <CardTitle className="text-xl">{competition.title}</CardTitle>
                    <CardDescription>{competition.competitionType.replace(/-/g, ' ').toUpperCase()}</CardDescription>
                  </div>
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
                </div>
              </CardHeader>
              <CardContent className="pt-6 space-y-4">
                <p className="text-sm text-gray-600">{competition.description}</p>

                {/* Prizes */}
                {competition.prizes && (
                  <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3">
                    <p className="text-sm font-medium text-yellow-900 mb-2">💰 Prize Pool</p>
                    <div className="grid grid-cols-3 gap-2 text-sm">
                      <div>
                        <p className="text-yellow-700">🥇 1st Place</p>
                        <p className="font-bold">
                          ${competition.prizes.firstPlace?.toLocaleString() || 0} {competition.prizes.currency}
                        </p>
                      </div>
                      <div>
                        <p className="text-yellow-700">🥈 2nd Place</p>
                        <p className="font-bold">
                          ${competition.prizes.secondPlace?.toLocaleString() || 0} {competition.prizes.currency}
                        </p>
                      </div>
                      <div>
                        <p className="text-yellow-700">🥉 3rd Place</p>
                        <p className="font-bold">
                          ${competition.prizes.thirdPlace?.toLocaleString() || 0} {competition.prizes.currency}
                        </p>
                      </div>
                    </div>
                  </div>
                )}

                {/* Details Grid */}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-xs text-gray-500 mb-1 flex items-center gap-1">
                      <Calendar className="h-4 w-4" /> Registration Deadline
                    </p>
                    <p className="font-semibold text-sm">{new Date(competition.registrationDeadline).toLocaleDateString()}</p>
                    {daysUntilDeadline > 0 && (
                      <p className="text-xs text-orange-600">{daysUntilDeadline} days left</p>
                    )}
                  </div>
                  <div>
                    <p className="text-xs text-gray-500 mb-1 flex items-center gap-1">
                      <Trophy className="h-4 w-4" /> Competition Date
                    </p>
                    <p className="font-semibold text-sm">{new Date(competition.competitionDate).toLocaleDateString()}</p>
                  </div>
                </div>

                {/* Participants */}
                {competition.maxParticipants && (
                  <div>
                    <p className="text-xs text-gray-500 mb-1 flex items-center gap-1">
                      <Users className="h-4 w-4" /> Participants
                    </p>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div
                        className="bg-blue-600 h-2 rounded-full"
                        style={{
                          width: `${((competition.participants?.length || 0) / competition.maxParticipants) * 100}%`,
                        }}
                      />
                    </div>
                    <p className="text-sm text-gray-600 mt-1">
                      {competition.participants?.length || 0} / {competition.maxParticipants} registered
                    </p>
                  </div>
                )}

                {/* Judges */}
                {competition.judges && competition.judges.length > 0 && (
                  <div>
                    <p className="text-sm font-medium mb-2">Judges:</p>
                    <div className="space-y-1">
                      {competition.judges.map((judge, idx) => (
                        <p key={idx} className="text-sm">
                          👤 <span className="font-medium">{judge.name}</span> - {judge.expertise}
                        </p>
                      ))}
                    </div>
                  </div>
                )}

                {/* Registration Button */}
                <div className="pt-4 border-t flex gap-2">
                  {competition.status === 'upcoming' || competition.status === 'ongoing' ? (
                    isRegistered ? (
                      <Button
                        onClick={() => handleUnregister(competition.id)}
                        className="flex-1"
                        variant="outline"
                        disabled={new Date() > new Date(competition.registrationDeadline)}
                      >
                        Unregister
                      </Button>
                    ) : (
                      <Button
                        onClick={() => handleRegister(competition.id)}
                        className="flex-1"
                        disabled={new Date() > new Date(competition.registrationDeadline)}
                      >
                        <Trophy className="h-4 w-4 mr-2" />
                        Register Now
                      </Button>
                    )
                  ) : (
                    <Button disabled className="flex-1">
                      {competition.status === 'completed' ? 'Competition Ended' : 'Cancelled'}
                    </Button>
                  )}
                </div>

                {new Date() > new Date(competition.registrationDeadline) && (
                  <p className="text-sm text-gray-500 text-center">Registration deadline has passed</p>
                )}
              </CardContent>
            </Card>
          );
        })}
      </div>

      {competitions.length === 0 && (
        <Card>
          <CardContent className="pt-6 text-center">
            <Trophy className="h-12 w-12 text-gray-400 mx-auto mb-2" />
            <p className="text-gray-600">No competitions available</p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
