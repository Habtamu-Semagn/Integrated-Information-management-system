'use client';

import { useState, useEffect, use } from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Trophy, Users, Award, Calendar, MapPin, Loader2 } from 'lucide-react';
import Link from 'next/link';
import { api, Competition, Participant } from '@/lib/api';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';

export default function CompetitionDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const router = useRouter();
  const [competition, setCompetition] = useState<Competition | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchCompetition = async () => {
      try {
        setIsLoading(true);
        const data = await api.competitions.getById(id);
        setCompetition(data);
      } catch (err) {
        console.error('Failed to fetch competition:', err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchCompetition();
  }, [id]);

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px]">
        <Loader2 className="h-8 w-8 animate-spin text-primary mb-2" />
        <p className="text-sm text-muted-foreground">Loading competition...</p>
      </div>
    );
  }

  if (!competition) {
    return (
      <div className="text-center py-12">
        <h2 className="text-2xl font-bold">Competition not found</h2>
        <Link href="/dashboard/staff/competitions/applications" className="text-primary hover:underline mt-4 block">
          Back to competitions
        </Link>
      </div>
    );
  }

  const participants = competition.participants || [];
  const participantList = participants.map((p: any) => {
    if (typeof p === 'string') {
      return { _id: p, name: 'Unknown', email: 'N/A' };
    }
    return p;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link href="/dashboard/staff/competitions/applications">
            <Button variant="ghost" size="sm">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back
            </Button>
          </Link>
          <div>
            <h1 className="text-3xl font-bold">{competition.title}</h1>
            <p className="text-muted-foreground">Competition Details</p>
          </div>
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

      <div className="grid gap-6 md:grid-cols-2">
        {/* Competition Details */}
        <Card className="md:col-span-2">
          <CardHeader>
            <CardTitle>Competition Overview</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <h3 className="font-semibold mb-2">Description</h3>
              <p className="text-muted-foreground">{competition.description}</p>
            </div>
          </CardContent>
        </Card>

        {/* Key Information */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calendar className="h-5 w-5" />
              Dates
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <div>
              <p className="text-sm font-medium text-gray-600">Registration Deadline</p>
              <p className="font-semibold">{new Date(competition.registrationDeadline).toLocaleDateString()}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-600">Competition Date</p>
              <p className="font-semibold">{new Date(competition.competitionDate).toLocaleDateString()}</p>
            </div>
          </CardContent>
        </Card>

        {/* Prize Information */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Award className="h-5 w-5" />
              Prize Pool
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            {competition.prizes ? (
              <>
                <div>
                  <p className="text-sm font-medium text-gray-600">🥇 First Place</p>
                  <p className="font-semibold">${competition.prizes.firstPlace?.toLocaleString()}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-600">🥈 Second Place</p>
                  <p className="font-semibold">${competition.prizes.secondPlace?.toLocaleString()}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-600">🥉 Third Place</p>
                  <p className="font-semibold">${competition.prizes.thirdPlace?.toLocaleString()}</p>
                </div>
              </>
            ) : (
              <p className="text-muted-foreground">No prize information available</p>
            )}
          </CardContent>
        </Card>

        {/* Competition Type & Location */}
        <Card>
          <CardHeader>
            <CardTitle>Format & Details</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div>
              <p className="text-sm font-medium text-gray-600">Type</p>
              <p className="font-semibold">{competition.competitionType.replace(/-/g, ' ')}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-600">Format</p>
              <p className="font-semibold">{competition.isVirtual ? '🌐 Virtual' : '📍 In-Person'}</p>
            </div>
            {competition.location && (
              <div>
                <p className="text-sm font-medium text-gray-600">Location</p>
                <p className="font-semibold">{competition.location}</p>
              </div>
            )}
            {competition.maxParticipants && (
              <div>
                <p className="text-sm font-medium text-gray-600">Max Capacity</p>
                <p className="font-semibold">{competition.maxParticipants} participants</p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Participants Overview */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users className="h-5 w-5" />
              Participants Summary
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Registered</p>
              <p className="text-3xl font-bold">{participants.length}</p>
            </div>
            {competition.maxParticipants && (
              <div>
                <p className="text-sm font-medium text-gray-600">Capacity Used</p>
                <p className="font-semibold">
                  {participants.length} / {competition.maxParticipants}
                </p>
                <div className="w-full bg-gray-200 rounded-full h-2 mt-2">
                  <div
                    className="bg-blue-600 h-2 rounded-full"
                    style={{
                      width: `${(participants.length / competition.maxParticipants) * 100}%`,
                    }}
                  />
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Participants Table */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Users className="h-5 w-5" />
            Registered Participants
          </CardTitle>
          <CardDescription>
            {participantList.length} participant(s) registered for this competition
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Registration Date</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {participantList.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={3} className="text-center text-gray-600 py-10">
                      No participants registered yet
                    </TableCell>
                  </TableRow>
                ) : (
                  participantList.map((participant: Participant) => (
                    <TableRow key={participant._id}>
                      <TableCell className="font-medium">{participant.name}</TableCell>
                      <TableCell>{participant.email}</TableCell>
                      <TableCell className="text-sm text-gray-600">
                        {competition.createdAt
                          ? new Date(competition.createdAt).toLocaleDateString()
                          : 'N/A'}
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
