'use client';

import { useState, useEffect, use } from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Calendar, Users, MapPin, Clock, Speaker, Loader2 } from 'lucide-react';
import Link from 'next/link';
import { api, Event, Participant } from '@/lib/api';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';

export default function EventDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const router = useRouter();
  const [event, setEvent] = useState<Event | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchEvent = async () => {
      try {
        setIsLoading(true);
        const data = await api.events.getById(id);
        setEvent(data);
      } catch (err) {
        console.error('Failed to fetch event:', err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchEvent();
  }, [id]);

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px]">
        <Loader2 className="h-8 w-8 animate-spin text-primary mb-2" />
        <p className="text-sm text-muted-foreground">Loading event...</p>
      </div>
    );
  }

  if (!event) {
    return (
      <div className="text-center py-12">
        <h2 className="text-2xl font-bold">Event not found</h2>
        <Link href="/dashboard/staff/events/applications" className="text-primary hover:underline mt-4 block">
          Back to events
        </Link>
      </div>
    );
  }

  const attendees = event.registeredAttendees || [];
  const attendeeList = attendees.map((a: any) => {
    if (typeof a === 'string') {
      return { _id: a, name: 'Unknown', email: 'N/A' };
    }
    return a;
  });

  const startDate = new Date(event.startDateTime);
  const endDate = new Date(event.endDateTime);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link href="/dashboard/staff/events/applications">
            <Button variant="ghost" size="sm">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back
            </Button>
          </Link>
          <div>
            <h1 className="text-3xl font-bold">{event.title}</h1>
            <p className="text-muted-foreground">Event Details</p>
          </div>
        </div>
        <Badge
          variant={
            event.status === 'completed'
              ? 'secondary'
              : event.status === 'cancelled'
              ? 'destructive'
              : 'default'
          }
        >
          {event.status}
        </Badge>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        {/* Event Details */}
        <Card className="md:col-span-2">
          <CardHeader>
            <CardTitle>Event Overview</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <h3 className="font-semibold mb-2">Description</h3>
              <p className="text-muted-foreground">{event.description}</p>
            </div>
          </CardContent>
        </Card>

        {/* Date & Time */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calendar className="h-5 w-5" />
              Schedule
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div>
              <p className="text-sm font-medium text-gray-600">Start Date & Time</p>
              <p className="font-semibold">{startDate.toLocaleDateString()} - {startDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-600">End Date & Time</p>
              <p className="font-semibold">{endDate.toLocaleDateString()} - {endDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-600">Event Type</p>
              <p className="font-semibold">{event.eventType.replace(/-/g, ' ')}</p>
            </div>
          </CardContent>
        </Card>

        {/* Location Information */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <MapPin className="h-5 w-5" />
              Location & Format
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div>
              <p className="text-sm font-medium text-gray-600">Format</p>
              <p className="font-semibold">
                {event.isVirtual && event.isHybrid
                  ? '🌐 Hybrid'
                  : event.isVirtual
                  ? '🌐 Virtual'
                  : '📍 In-Person'}
              </p>
            </div>
            {event.location?.venue && (
              <div>
                <p className="text-sm font-medium text-gray-600">Venue</p>
                <p className="font-semibold">{event.location.venue}</p>
              </div>
            )}
            {event.location?.city && (
              <div>
                <p className="text-sm font-medium text-gray-600">Location</p>
                <p className="font-semibold">{event.location.city}, {event.location.country}</p>
              </div>
            )}
            {event.location?.onlineLink && (
              <div>
                <p className="text-sm font-medium text-gray-600">Online Link</p>
                <a href={event.location.onlineLink} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">
                  Join Event
                </a>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Attendees Overview */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users className="h-5 w-5" />
              Attendance Summary
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <div>
              <p className="text-sm font-medium text-gray-600">Registered Attendees</p>
              <p className="text-3xl font-bold">{attendees.length}</p>
            </div>
            {event.capacity && (
              <div>
                <p className="text-sm font-medium text-gray-600">Capacity</p>
                <p className="font-semibold">
                  {attendees.length} / {event.capacity}
                </p>
                <div className="w-full bg-gray-200 rounded-full h-2 mt-2">
                  <div
                    className="bg-blue-600 h-2 rounded-full"
                    style={{
                      width: `${(attendees.length / event.capacity) * 100}%`,
                    }}
                  />
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Speakers */}
        {event.speakers && event.speakers.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Speaker className="h-5 w-5" />
                Speakers
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {event.speakers.map((speaker, idx) => (
                <div key={idx} className="border-b last:border-0 pb-3 last:pb-0">
                  <p className="font-semibold">{speaker.name}</p>
                  <p className="text-sm text-gray-600">{speaker.title}</p>
                  {speaker.bio && <p className="text-sm mt-1">{speaker.bio}</p>}
                </div>
              ))}
            </CardContent>
          </Card>
        )}
      </div>

      {/* Attendees Table */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Users className="h-5 w-5" />
            Registered Attendees
          </CardTitle>
          <CardDescription>
            {attendeeList.length} attendee(s) registered for this event
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
                {attendeeList.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={3} className="text-center text-gray-600 py-10">
                      No attendees registered yet
                    </TableCell>
                  </TableRow>
                ) : (
                  attendeeList.map((attendee: Participant) => (
                    <TableRow key={attendee._id}>
                      <TableCell className="font-medium">{attendee.name}</TableCell>
                      <TableCell>{attendee.email}</TableCell>
                      <TableCell className="text-sm text-gray-600">
                        {event.createdAt
                          ? new Date(event.createdAt).toLocaleDateString()
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
