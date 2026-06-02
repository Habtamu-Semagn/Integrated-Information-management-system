'use client';

import { useState, useEffect } from 'react';
import { api } from '@/lib/api';
import type { Event } from '@/lib/api';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { AlertCircle, Loader2, Calendar, MapPin, Users, Clock, BookOpen } from 'lucide-react';

export default function EventsPage() {
  const [events, setEvents] = useState<Event[]>([]);
  const [myEvents, setMyEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filter, setFilter] = useState<'all' | 'my'>('all');

  useEffect(() => {
    loadEvents();
  }, []);

  const loadEvents = async () => {
    try {
      setLoading(true);
      setError(null);
      const [allEvents, registeredEvents] = await Promise.all([
        api.events.getAll({ upcomingOnly: true }),
        api.events.getMyEvents(),
      ]);
      setEvents(allEvents);
      setMyEvents(registeredEvents);
    } catch (err) {
      setError('Failed to load events');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleRegister = async (eventId: string) => {
    try {
      await api.events.register(eventId);
      await loadEvents();
    } catch (err) {
      setError('Failed to register for event');
      console.error(err);
    }
  };

  const handleUnregister = async (eventId: string) => {
    try {
      await api.events.unregister(eventId);
      await loadEvents();
    } catch (err) {
      setError('Failed to unregister from event');
      console.error(err);
    }
  };

  const isRegistered = (eventId: string) => {
    return myEvents.some((e) => e.id === eventId);
  };

  const displayEvents = filter === 'my' ? myEvents : events;

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
        <h1 className="text-3xl font-bold">Events & Webinars</h1>
        <p className="text-gray-600">Connect with the startup community and expand your knowledge</p>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 flex items-center gap-2">
          <AlertCircle className="h-5 w-5 text-red-600" />
          <p className="text-red-700">{error}</p>
        </div>
      )}

      {/* Filter Tabs */}
      <div className="flex gap-2">
        <Button
          onClick={() => setFilter('all')}
          variant={filter === 'all' ? 'default' : 'outline'}
          className="flex-1"
        >
          All Events
        </Button>
        <Button
          onClick={() => setFilter('my')}
          variant={filter === 'my' ? 'default' : 'outline'}
          className="flex-1"
        >
          My Events ({myEvents.length})
        </Button>
      </div>

      {/* Events Grid */}
      <div className="grid gap-4 md:grid-cols-2">
        {displayEvents.map((event) => {
          const registered = isRegistered(event.id);
          const startDate = new Date(event.startDateTime);
          const endDate = new Date(event.endDateTime);
          const now = new Date();
          const isPast = endDate < now;

          return (
            <Card key={event.id} className="flex flex-col overflow-hidden">
              <CardHeader className="bg-gradient-to-r from-blue-50 to-cyan-50">
                <div className="flex items-start justify-between gap-2">
                  <div className="flex-1">
                    <CardTitle className="text-lg">{event.title}</CardTitle>
                    <CardDescription>{event.eventType.replace(/-/g, ' ').toUpperCase()}</CardDescription>
                  </div>
                  <Badge
                    variant={
                      isPast
                        ? 'secondary'
                        : event.status === 'ongoing'
                        ? 'default'
                        : event.status === 'cancelled'
                        ? 'destructive'
                        : 'outline'
                    }
                  >
                    {event.status}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className="flex-1 pt-6 space-y-4">
                <p className="text-sm text-gray-600">{event.description}</p>

                {/* Date & Time */}
                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-sm">
                    <Calendar className="h-4 w-4 text-gray-500" />
                    <span>{startDate.toLocaleDateString()}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <Clock className="h-4 w-4 text-gray-500" />
                    <span>
                      {startDate.toLocaleTimeString([], {
                        hour: '2-digit',
                        minute: '2-digit',
                      })}{' '}
                      -{' '}
                      {endDate.toLocaleTimeString([], {
                        hour: '2-digit',
                        minute: '2-digit',
                      })}
                    </span>
                  </div>
                </div>

                {/* Location */}
                {event.location && (
                  <div className="flex items-start gap-2 text-sm">
                    <MapPin className="h-4 w-4 text-gray-500 mt-0.5" />
                    <div>
                      {event.isVirtual && <span className="text-blue-600 font-medium">🌐 Virtual</span>}
                      {event.isHybrid && (
                        <span className="text-blue-600 font-medium">
                          🌐 Hybrid
                          {event.location?.venue && ` - ${event.location.venue}`}
                        </span>
                      )}
                      {!event.isVirtual && !event.isHybrid && event.location?.venue && (
                        <span>{event.location.venue}</span>
                      )}
                    </div>
                  </div>
                )}

                {/* Speakers */}
                {event.speakers && event.speakers.length > 0 && (
                  <div>
                    <p className="text-sm font-medium mb-2">Speakers:</p>
                    <div className="space-y-1">
                      {event.speakers.map((speaker, idx) => (
                        <div key={idx} className="text-sm">
                          <p className="font-medium">{speaker.name}</p>
                          <p className="text-gray-600 text-xs">{speaker.title}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Capacity */}
                {event.capacity && (
                  <div>
                    <div className="flex items-center justify-between mb-1">
                      <p className="text-xs text-gray-500 flex items-center gap-1">
                        <Users className="h-4 w-4" /> Capacity
                      </p>
                      <span className="text-sm font-medium">
                        {event.registeredAttendees?.length || 0} / {event.capacity}
                      </span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div
                        className="bg-cyan-600 h-2 rounded-full"
                        style={{
                          width: `${
                            ((event.registeredAttendees?.length || 0) / event.capacity) * 100
                          }%`,
                        }}
                      />
                    </div>
                  </div>
                )}

                {/* Materials */}
                {event.materials && event.materials.length > 0 && registered && (
                  <div className="bg-green-50 border border-green-200 rounded p-3">
                    <p className="text-sm font-medium text-green-900 mb-2">
                      <BookOpen className="h-4 w-4 inline mr-1" />
                      Materials Available
                    </p>
                    <ul className="space-y-1">
                      {event.materials.map((material, idx) => (
                        <li key={idx} className="text-sm">
                          <a
                            href={material.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-green-700 hover:underline"
                          >
                            📎 {material.title} ({material.type})
                          </a>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {/* Registration Button */}
                <div className="pt-4 border-t">
                  {isPast ? (
                    <Button disabled className="w-full">
                      Event Ended
                    </Button>
                  ) : registered ? (
                    <Button
                      onClick={() => handleUnregister(event.id)}
                      variant="outline"
                      className="w-full"
                    >
                      Unregister
                    </Button>
                  ) : (
                    <Button onClick={() => handleRegister(event.id)} className="w-full">
                      <Users className="h-4 w-4 mr-2" />
                      Register Now
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {displayEvents.length === 0 && (
        <Card>
          <CardContent className="pt-6 text-center">
            <Calendar className="h-12 w-12 text-gray-400 mx-auto mb-2" />
            <p className="text-gray-600">
              {filter === 'my' ? 'You are not registered for any events' : 'No events available'}
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
