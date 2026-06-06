"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Eye, Search, Plus, Trash2, Loader2, Users } from "lucide-react";
import { api, Competition } from "@/lib/api";
import { toast } from "sonner";

const COMPETITION_TYPES = [
  "Pitch Competition",
  "Hackathon",
  "Idea Challenge",
  "Business Plan",
  "Innovation Award"
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

export default function AdminCompetitionsPage() {
  const [competitions, setCompetitions] = useState<Competition[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<"manage" | "participants">("manage");
  const [createData, setCreateData] = useState({
    name: "",
    description: "",
    competitionType: "",
    prizePool: "",
    registrationDeadline: "",
    startDate: "",
    status: "upcoming"
  });

  useEffect(() => {
    fetchCompetitions();
  }, []);

  const fetchCompetitions = async () => {
    try {
      setIsLoading(true);
      const data = await api.competitions.getAll();
      setCompetitions(data);
    } catch (err) {
      console.error("Failed to fetch competitions:", err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCreateCompetition = async () => {
    if (!createData.name || !createData.competitionType || !createData.prizePool) {
      toast.error("Please fill in all required fields");
      return;
    }

    try {
      const typeMap: Record<string, "pitch-competition" | "hackathon" | "idea-challenge" | "business-plan" | "innovation-award"> = {
        "Pitch Competition": "pitch-competition",
        "Hackathon": "hackathon",
        "Idea Challenge": "idea-challenge",
        "Business Plan": "business-plan",
        "Innovation Award": "innovation-award"
      };

      await api.competitions.create({
        title: createData.name,
        description: createData.description,
        competitionType: typeMap[createData.competitionType] || "pitch-competition",
        registrationDeadline: new Date(createData.registrationDeadline).toISOString(),
        competitionDate: new Date(createData.startDate).toISOString(),
        isVirtual: false,
        maxParticipants: 100,
        prizes: {
          firstPlace: parseInt(createData.prizePool) * 0.5,
          secondPlace: parseInt(createData.prizePool) * 0.3,
          thirdPlace: parseInt(createData.prizePool) * 0.2,
          currency: "USD"
        }
      });
      toast.success("Competition created successfully");
      setIsCreateDialogOpen(false);
      setCreateData({
        name: "",
        description: "",
        competitionType: "",
        prizePool: "",
        registrationDeadline: "",
        startDate: "",
        status: "upcoming"
      });
      fetchCompetitions();
    } catch (err) {
      console.error("Failed to create competition:", err);
      toast.error("Failed to create competition");
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this competition?")) return;
    
    try {
      await api.competitions.delete(id);
      toast.success("Competition deleted successfully");
      fetchCompetitions();
    } catch (err) {
      console.error("Failed to delete competition:", err);
      toast.error("Failed to delete competition");
    }
  };

  const filteredCompetitions = competitions.filter(comp => {
    const matchesSearch = comp.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         comp.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === "all" || comp.status.toLowerCase() === statusFilter.toLowerCase();
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-start">
        <div>
          <h1 className="text-3xl font-bold">Competitions Management</h1>
          <p className="text-muted-foreground">Create and manage competitions</p>
        </div>
        <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              Create Competition
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-md max-h-[80vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Create New Competition</DialogTitle>
              <DialogDescription>Add a new competition to the platform</DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <input
                type="text"
                placeholder="Competition Name *"
                value={createData.name}
                onChange={(e) => setCreateData({...createData, name: e.target.value})}
                className="w-full px-3 py-2 border rounded-md"
              />
              <textarea
                placeholder="Description"
                value={createData.description}
                onChange={(e) => setCreateData({...createData, description: e.target.value})}
                className="w-full px-3 py-2 border rounded-md"
                rows={3}
              />
              <select
                value={createData.competitionType}
                onChange={(e) => setCreateData({...createData, competitionType: e.target.value})}
                className="w-full px-3 py-2 border rounded-md"
              >
                <option value="">Select Competition Type *</option>
                {COMPETITION_TYPES.map(type => (
                  <option key={type} value={type}>{type}</option>
                ))}
              </select>
              <input
                type="number"
                placeholder="Prize Pool *"
                value={createData.prizePool}
                onChange={(e) => setCreateData({...createData, prizePool: e.target.value})}
                className="w-full px-3 py-2 border rounded-md"
              />
              <input
                type="date"
                placeholder="Registration Deadline"
                value={createData.registrationDeadline}
                onChange={(e) => setCreateData({...createData, registrationDeadline: e.target.value})}
                className="w-full px-3 py-2 border rounded-md"
              />
              <input
                type="date"
                placeholder="Start Date"
                value={createData.startDate}
                onChange={(e) => setCreateData({...createData, startDate: e.target.value})}
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
              <Button onClick={handleCreateCompetition} className="w-full">Create Competition</Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Tabs */}
      <div className="flex gap-4 border-b">
        <button
          onClick={() => setActiveTab("manage")}
          className={`pb-2 px-4 font-medium border-b-2 transition-colors ${
            activeTab === "manage" ? "border-blue-500 text-blue-600" : "border-transparent text-gray-600 hover:text-gray-900"
          }`}
        >
          Manage Competitions
        </button>
        <button
          onClick={() => setActiveTab("participants")}
          className={`pb-2 px-4 font-medium border-b-2 transition-colors ${
            activeTab === "participants" ? "border-blue-500 text-blue-600" : "border-transparent text-gray-600 hover:text-gray-900"
          }`}
        >
          <Users className="inline mr-2 h-4 w-4" />
          Participants
        </button>
      </div>

      {activeTab === "manage" && (
      <>
      {/* Filters */}
      <Card>
        <CardHeader>
          <CardTitle>Filter Competitions</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search by name or description..."
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

      {/* Competitions Table */}
      <Card>
        <CardHeader>
          <CardTitle>All Competitions</CardTitle>
          <CardDescription>
            {filteredCompetitions.length} competition(s) found
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Competition Name</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Prize Pool</TableHead>
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
                    <p className="text-sm text-muted-foreground">Loading competitions...</p>
                  </TableCell>
                </TableRow>
              ) : filteredCompetitions.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} className="text-center text-muted-foreground">
                    No competitions found
                  </TableCell>
                </TableRow>
              ) : (
                filteredCompetitions.map((comp) => (
                  <TableRow key={comp.id}>
                    <TableCell className="font-medium">{comp.title}</TableCell>
                    <TableCell className="capitalize">{comp.competitionType?.replace('-', ' ')}</TableCell>
                    <TableCell>${comp.prizes?.firstPlace ? (comp.prizes.firstPlace + comp.prizes.secondPlace + comp.prizes.thirdPlace).toLocaleString() : 'N/A'}</TableCell>
                    <TableCell>{new Date(comp.competitionDate).toLocaleDateString()}</TableCell>
                    <TableCell>{getStatusBadge(comp.status)}</TableCell>
                    <TableCell className="text-right space-x-2">
                      <Button variant="ghost" size="sm" disabled>
                        <Eye className="h-4 w-4" />
                      </Button>
                      <Button 
                        variant="ghost" 
                        size="sm"
                        onClick={() => handleDelete(comp.id || '')}
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
      </>
      )}

      {activeTab === "participants" && (
        <Card>
          <CardHeader>
            <CardTitle>Competition Participants</CardTitle>
            <CardDescription>
              View all registered participants for competitions
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b">
                    <th className="text-left py-3 px-4 font-semibold">Competition Title</th>
                    <th className="text-left py-3 px-4 font-semibold">Participant Name</th>
                    <th className="text-left py-3 px-4 font-semibold">Email</th>
                    <th className="text-left py-3 px-4 font-semibold">Competition Date</th>
                    <th className="text-left py-3 px-4 font-semibold">Competition Status</th>
                  </tr>
                </thead>
                <tbody>
                  {isLoading ? (
                    <tr>
                      <td colSpan={5} className="text-center py-6">
                        <Loader2 className="h-6 w-6 animate-spin mx-auto text-primary" />
                      </td>
                    </tr>
                  ) : competitions.length === 0 ? (
                    <tr>
                      <td colSpan={5} className="text-center py-6 text-gray-500">
                        No competition participants found
                      </td>
                    </tr>
                  ) : (
                    competitions
                      .flatMap(comp => {
                        const participantRows: any[] = [];
                        
                        if (comp.participants && comp.participants.length > 0) {
                          comp.participants.forEach((participant: any) => {
                            participantRows.push({
                              competitionId: comp.id,
                              competitionTitle: comp.title,
                              participantName: participant.name,
                              participantEmail: participant.email,
                              competitionDate: new Date(comp.competitionDate).toLocaleDateString(),
                              competitionStatus: comp.status
                            });
                          });
                        }
                        
                        return participantRows;
                      })
                      .map((row, idx) => (
                        <tr key={`${row.competitionId}-${idx}`} className="border-b hover:bg-gray-50">
                          <td className="py-3 px-4 font-medium">{row.competitionTitle}</td>
                          <td className="py-3 px-4">{row.participantName}</td>
                          <td className="py-3 px-4 text-sm">{row.participantEmail}</td>
                          <td className="py-3 px-4 text-sm">{row.competitionDate}</td>
                          <td className="py-3 px-4">{getStatusBadge(row.competitionStatus)}</td>
                        </tr>
                      ))
                  )}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
