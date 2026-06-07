'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Loader2, Calendar, Eye } from 'lucide-react';
import { api, Event } from '@/lib/api';

export default function EventsApplicationsPage() {
  const router = useRouter();
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const data = await api.events.getAll();
        setEvents(data);
      } catch (err) {
        console.error('Failed to fetch events:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleViewEvent = (eventId: string) => {
    router.push(`/dashboard/staff/events/applications/${eventId}`);
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Event Registrations</h1>
        <p className="text-gray-600">View attendees registered for events</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calendar className="h-5 w-5" />
            All Events
          </CardTitle>
          <CardDescription>
            {events.length} event(s) with registrations
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Event Title</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead>Attendees</TableHead>
                  <TableHead>Capacity</TableHead>
                  <TableHead>Format</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Action</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {loading ? (
                  <TableRow>
                    <TableCell colSpan={8} className="text-center py-10">
                      <Loader2 className="h-8 w-8 animate-spin mx-auto text-blue-500 mb-2" />
                      <p className="text-sm text-gray-600">Loading events...</p>
                    </TableCell>
                  </TableRow>
                ) : events.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={8} className="text-center text-gray-600 py-10">
                      No events available
                    </TableCell>
                  </TableRow>
                ) : (
                  events.map((event) => (
                    <TableRow key={event.id} className="hover:bg-gray-50">
                      <TableCell className="font-medium">{event.title}</TableCell>
                      <TableCell className="text-xs uppercase text-gray-600">
                        {event.eventType.replace(/-/g, ' ')}
                      </TableCell>
                      <TableCell>{new Date(event.startDateTime).toLocaleDateString()}</TableCell>
                      <TableCell className="font-semibold">{event.registeredAttendees?.length || 0}</TableCell>
                      <TableCell>{event.capacity || '-'}</TableCell>
                      <TableCell>
                        <span className="text-sm">
                          {event.isVirtual ? (event.isHybrid ? 'Hybrid' : 'Virtual') : 'In-Person'}
                        </span>
                      </TableCell>
                      <TableCell>
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
                      </TableCell>
                      <TableCell>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleViewEvent(event.id)}
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
