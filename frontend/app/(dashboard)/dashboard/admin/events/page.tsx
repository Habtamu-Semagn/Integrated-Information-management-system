"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Eye, Search, Plus, Trash2, Loader2 } from "lucide-react";
import Link from "next/link";
import { api, Event } from "@/lib/api";
import { toast } from "sonner";

const EVENT_TYPES = [
  "Webinar",
  "Workshop",
  "Networking",
  "Conference",
  "Meetup",
  "Masterclass"
];

const EVENT_FORMATS = [
  "Virtual",
  "In-Person",
  "Hybrid"
];

const getStatusBadge = (status: string) => {
  const variants: Record<string, { variant: "default" | "secondary" | "destructive" | "outline", label: string }> = {
    upcoming: { variant: "outline", label: "Upcoming" },
    ongoing: { variant: "default", label: "Ongoing" },
    completed: { variant: "secondary", label: "Completed" },
    cancelled: { variant: "destructive", label: "Cancelled" },
  };
  
  const config = variants[status.toLowerCase()] || variants.upcoming;
  return <Badge variant={config.variant}>{config.label}</Badge>;
};

export default function AdminEventsPage() {
  const [events, setEvents] = useState<Event[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [createData, setCreateData] = useState({
    title: "",
    description: "",
    eventType: "",
    format: "virtual",
    location: "",
    startDate: "",
    endDate: "",
    capacity: "",
    status: "upcoming"
  });

  useEffect(() => {
    fetchEvents();
  }, []);

  const fetchEvents = async () => {
    try {
      setIsLoading(true);
      const data = await api.events.getAll();
      setEvents(data);
    } catch (err) {
      console.error("Failed to fetch events:", err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCreateEvent = async () => {
    // Validate required fields
    if (!createData.title.trim()) {
      toast.error("Title is required");
      return;
    }
    if (createData.title.trim().length < 5) {
      toast.error("Title must be at least 5 characters");
      return;
    }
    if (!createData.description.trim()) {
      toast.error("Description is required");
      return;
    }
    if (createData.description.trim().length < 20) {
      toast.error("Description must be at least 20 characters");
      return;
    }
    if (!createData.eventType) {
      toast.error("Event type is required");
      return;
    }
    if (!createData.startDate) {
      toast.error("Start date and time is required");
      return;
    }
    if (!createData.endDate) {
      toast.error("End date and time is required");
      return;
    }
    if (new Date(createData.startDate) >= new Date(createData.endDate)) {
      toast.error("Start date must be before end date");
      return;
    }

    try {
      const typeMap: Record<string, "webinar" | "workshop" | "networking" | "conference" | "meetup" | "masterclass"> = {
        "Webinar": "webinar",
        "Workshop": "workshop",
        "Networking": "networking",
        "Conference": "conference",
        "Meetup": "meetup",
        "Masterclass": "masterclass"
      };

      await api.events.create({
        title: createData.title.trim(),
        description: createData.description.trim(),
        eventType: typeMap[createData.eventType] || "webinar",
        startDateTime: new Date(createData.startDate).toISOString(),
        endDateTime: new Date(createData.endDate).toISOString(),
        isVirtual: createData.format === "virtual",
        isHybrid: createData.format === "hybrid",
        capacity: parseInt(createData.capacity) || 100,
        location: createData.format === "in-person" ? { venue: createData.location, city: "", country: "" } : 
                 createData.format === "virtual" ? { onlineLink: createData.location } : 
                 { venue: createData.location, onlineLink: "", city: "", country: "" }
      });
      toast.success("Event created successfully");
      setIsCreateDialogOpen(false);
      setCreateData({
        title: "",
        description: "",
        eventType: "",
        format: "virtual",
        location: "",
        startDate: "",
        endDate: "",
        capacity: "",
        status: "upcoming"
      });
      fetchEvents();
    } catch (err) {
      console.error("Failed to create event:", err);
      toast.error("Failed to create event");
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this event?")) return;
    
    try {
      await api.events.delete(id);
      toast.success("Event deleted successfully");
      fetchEvents();
    } catch (err) {
      console.error("Failed to delete event:", err);
      toast.error("Failed to delete event");
    }
  };

  const filteredEvents = events.filter(event => {
    const matchesSearch = event.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         event.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === "all" || event.status.toLowerCase() === statusFilter.toLowerCase();
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-start">
        <div>
          <h1 className="text-3xl font-bold">Events Management</h1>
          <p className="text-muted-foreground">Create and manage events and webinars</p>
        </div>
        <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              Create Event
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-md max-h-[80vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Create New Event</DialogTitle>
              <DialogDescription>Add a new event to the platform</DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <input
                type="text"
                placeholder="Event Title * (min 5 chars)"
                value={createData.title}
                onChange={(e) => setCreateData({...createData, title: e.target.value})}
                className="w-full px-3 py-2 border rounded-md"
              />
              <textarea
                placeholder="Description * (min 20 chars)"
                value={createData.description}
                onChange={(e) => setCreateData({...createData, description: e.target.value})}
                className="w-full px-3 py-2 border rounded-md"
                rows={3}
              />
              <select
                value={createData.eventType}
                onChange={(e) => setCreateData({...createData, eventType: e.target.value})}
                className="w-full px-3 py-2 border rounded-md"
              >
                <option value="">Select Event Type *</option>
                {EVENT_TYPES.map(type => (
                  <option key={type} value={type}>{type}</option>
                ))}
              </select>
              <select
                value={createData.format}
                onChange={(e) => setCreateData({...createData, format: e.target.value})}
                className="w-full px-3 py-2 border rounded-md"
              >
                <option value="">Select Format *</option>
                {EVENT_FORMATS.map(format => (
                  <option key={format} value={format.toLowerCase()}>{format}</option>
                ))}
              </select>
              <input
                type="text"
                placeholder="Location (if applicable)"
                value={createData.location}
                onChange={(e) => setCreateData({...createData, location: e.target.value})}
                className="w-full px-3 py-2 border rounded-md"
              />
              <input
                type="datetime-local"
                placeholder="Start Date *"
                value={createData.startDate}
                onChange={(e) => setCreateData({...createData, startDate: e.target.value})}
                className="w-full px-3 py-2 border rounded-md"
              />
              <input
                type="datetime-local"
                placeholder="End Date *"
                value={createData.endDate}
                onChange={(e) => setCreateData({...createData, endDate: e.target.value})}
                className="w-full px-3 py-2 border rounded-md"
              />
              <input
                type="number"
                placeholder="Capacity"
                value={createData.capacity}
                onChange={(e) => setCreateData({...createData, capacity: e.target.value})}
                className="w-full px-3 py-2 border rounded-md"
              />
              <select
                value={createData.status}
                onChange={(e) => setCreateData({...createData, status: e.target.value})}
                className="w-full px-3 py-2 border rounded-md"
              >
                <option value="upcoming">Upcoming</option>
                <option value="ongoing">Ongoing</option>
                <option value="completed">Completed</option>
                <option value="cancelled">Cancelled</option>
              </select>
              <Button onClick={handleCreateEvent} className="w-full">Create Event</Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Filters */}
      <Card>
        <CardHeader>
          <CardTitle>Filter Events</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search by title or description..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-8"
                />
              </div>
            </div>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-[180px]">
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
        </CardContent>
      </Card>

      {/* Events Table */}
      <Card>
        <CardHeader>
          <CardTitle>All Events</CardTitle>
          <CardDescription>
            {filteredEvents.length} event(s) found
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Event Title</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Format</TableHead>
                <TableHead>Start Date</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading ? (
                <TableRow>
                  <TableCell colSpan={6} className="text-center py-10">
                    <Loader2 className="h-8 w-8 animate-spin mx-auto text-primary mb-2" />
                    <p className="text-sm text-muted-foreground">Loading events...</p>
                  </TableCell>
                </TableRow>
              ) : filteredEvents.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} className="text-center text-muted-foreground">
                    No events found
                  </TableCell>
                </TableRow>
              ) : (
                filteredEvents.map((event) => (
                  <TableRow key={event.id}>
                    <TableCell className="font-medium">{event.title}</TableCell>
                    <TableCell className="capitalize">{event.eventType?.replace('-', ' ')}</TableCell>
                    <TableCell className="capitalize">{event.isHybrid ? 'Hybrid' : event.isVirtual ? 'Virtual' : 'In-Person'}</TableCell>
                    <TableCell>{new Date(event.startDateTime).toLocaleDateString()}</TableCell>
                    <TableCell>{getStatusBadge(event.status)}</TableCell>
                    <TableCell className="text-right space-x-2">
                      <Link href={`/dashboard/admin/events/${event.id}`}>
                        <Button variant="ghost" size="sm">
                          <Eye className="h-4 w-4" />
                        </Button>
                      </Link>
                      <Button 
                        variant="ghost" 
                        size="sm"
                        onClick={() => handleDelete(event.id || '')}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
