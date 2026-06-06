"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Search, Plus, Edit, Trash2, Loader2, Users } from "lucide-react";
import { api, Training } from "@/lib/api";
import { toast } from "sonner";

const CATEGORIES = [
  "Business Fundamentals",
  "Marketing",
  "Finance",
  "Technology",
  "Legal",
  "Sales",
  "Operations"
];

const LEVELS = ["Beginner", "Intermediate", "Advanced"];

const getLevelBadge = (level: string) => {
  const variants: Record<string, { variant: "default" | "secondary" | "outline", label: string }> = {
    beginner: { variant: "outline", label: "Beginner" },
    intermediate: { variant: "secondary", label: "Intermediate" },
    advanced: { variant: "default", label: "Advanced" },
  };
  
  const config = variants[level.toLowerCase()] || variants.beginner;
  return <Badge variant={config.variant}>{config.label}</Badge>;
};

export default function AdminTrainingPage() {
  const [trainings, setTrainings] = useState<Training[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [activeTab, setActiveTab] = useState<"manage" | "enrollments">("manage");
  
  const [createData, setCreateData] = useState({
    title: "",
    description: "",
    category: "",
    level: "",
    instructor: "",
    duration: "",
    content: "",
    materialTitle: "",
    location: "",
    locationType: "online"
  });

  useEffect(() => {
    fetchTrainings();
  }, []);

  const fetchTrainings = async () => {
    try {
      setIsLoading(true);
      const data = await api.training.getAll();
      setTrainings(data);
    } catch (err) {
      console.error("Failed to fetch trainings:", err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCreateTraining = async () => {
    if (!createData.title || !createData.category || !createData.level || !createData.description || !createData.content) {
      toast.error("Please fill in all required fields (Title, Category, Level, Description, and Content)");
      return;
    }

    if (createData.title.length < 5) {
      toast.error("Title must be at least 5 characters long");
      return;
    }

    if (createData.description.length < 10) {
      toast.error("Description must be at least 10 characters long");
      return;
    }

    if (createData.content.length < 20) {
      toast.error("Content must be at least 20 characters long");
      return;
    }

    if (!createData.duration || parseInt(createData.duration) < 1) {
      toast.error("Duration must be a positive number");
      return;
    }

    try {
      setIsSubmitting(true);
      await api.training.create({
        title: createData.title,
        description: createData.description,
        category: createData.category as any,
        level: createData.level as any,
        instructor: createData.instructor,
        duration: parseInt(createData.duration) || 0,
        content: createData.content,
        materials: createData.location ? [{
          title: createData.materialTitle || "Training Location",
          location: createData.location,
          type: createData.locationType as "online" | "in-person" | "hybrid"
        }] : []
      });
      
      toast.success("Training course created successfully");
      setIsCreateDialogOpen(false);
      setCreateData({
        title: "",
        description: "",
        category: "",
        level: "",
        instructor: "",
        duration: "",
        content: "",
        materialTitle: "",
        location: "",
        locationType: "online"
      });
      fetchTrainings();
    } catch (err) {
      console.error("Failed to create training:", err);
      const message = err instanceof Error ? err.message : "Failed to create training";
      toast.error(message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this training?")) return;
    
    try {
      await api.training.delete(id);
      toast.success("Training deleted successfully");
      fetchTrainings();
    } catch (err) {
      console.error("Failed to delete training:", err);
      const message = err instanceof Error ? err.message : "Failed to delete training";
      toast.error(message);
    }
  };

  const filteredTrainings = trainings.filter(training => {
    const matchesSearch = training.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         training.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = categoryFilter === "all" || training.category.toLowerCase() === categoryFilter.toLowerCase();
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-start">
        <div>
          <h1 className="text-3xl font-bold">Training Management</h1>
          <p className="text-muted-foreground">Create and manage training courses</p>
        </div>
        <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              Create Training
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-md max-h-[80vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Create New Training</DialogTitle>
              <DialogDescription>Add a new training course to the platform</DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <input
                type="text"
                placeholder="Training Title *"
                value={createData.title}
                onChange={(e) => setCreateData({...createData, title: e.target.value})}
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
                value={createData.category}
                onChange={(e) => setCreateData({...createData, category: e.target.value})}
                className="w-full px-3 py-2 border rounded-md"
              >
                <option value="">Select Category *</option>
                <option value="business-fundamentals">Business Fundamentals</option>
                <option value="marketing">Marketing</option>
                <option value="finance">Finance</option>
                <option value="technology">Technology</option>
                <option value="legal">Legal</option>
                <option value="sales">Sales</option>
                <option value="operations">Operations</option>
              </select>
              <select
                value={createData.level}
                onChange={(e) => setCreateData({...createData, level: e.target.value})}
                className="w-full px-3 py-2 border rounded-md"
              >
                <option value="">Select Level *</option>
                {LEVELS.map(level => (
                  <option key={level} value={level.toLowerCase()}>{level}</option>
                ))}
              </select>
              <input
                type="text"
                placeholder="Instructor Name"
                value={createData.instructor}
                onChange={(e) => setCreateData({...createData, instructor: e.target.value})}
                className="w-full px-3 py-2 border rounded-md"
              />
              <input
                type="number"
                placeholder="Duration (hours)"
                value={createData.duration}
                onChange={(e) => setCreateData({...createData, duration: e.target.value})}
                className="w-full px-3 py-2 border rounded-md"
              />
              <textarea
                placeholder="Course Content (at least 20 characters) *"
                value={createData.content}
                onChange={(e) => setCreateData({...createData, content: e.target.value})}
                className="w-full px-3 py-2 border rounded-md"
                rows={3}
              />
              <input
                type="text"
                placeholder="Material Title (e.g., Main Workshop)"
                value={createData.materialTitle}
                onChange={(e) => setCreateData({...createData, materialTitle: e.target.value})}
                className="w-full px-3 py-2 border rounded-md"
              />
              <select
                value={createData.locationType}
                onChange={(e) => setCreateData({...createData, locationType: e.target.value})}
                className="w-full px-3 py-2 border rounded-md"
              >
                <option value="online">Online</option>
                <option value="in-person">In-Person</option>
                <option value="hybrid">Hybrid</option>
              </select>
              <textarea
                placeholder="Location/Address (e.g., Building A, Room 101 or Zoom Link)"
                value={createData.location}
                onChange={(e) => setCreateData({...createData, location: e.target.value})}
                className="w-full px-3 py-2 border rounded-md"
                rows={2}
              />
              <Button onClick={handleCreateTraining} className="w-full" disabled={isSubmitting}>
                {isSubmitting ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Creating...
                  </>
                ) : (
                  "Create Training"
                )}
              </Button>
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
          Manage Trainings
        </button>
        <button
          onClick={() => setActiveTab("enrollments")}
          className={`pb-2 px-4 font-medium border-b-2 transition-colors ${
            activeTab === "enrollments" ? "border-blue-500 text-blue-600" : "border-transparent text-gray-600 hover:text-gray-900"
          }`}
        >
          <Users className="inline mr-2 h-4 w-4" />
          Enrollments
        </button>
      </div>

      {activeTab === "manage" && (
        <>
          <Card>
            <CardHeader>
              <CardTitle>Filter Trainings</CardTitle>
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
                <Select value={categoryFilter} onValueChange={setCategoryFilter}>
                  <SelectTrigger className="w-[200px]">
                    <SelectValue placeholder="Filter by category" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Categories</SelectItem>
                    {CATEGORIES.map(cat => (
                      <SelectItem key={cat} value={cat.toLowerCase().replace(/\s+/g, '-')}>{cat}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>All Trainings</CardTitle>
              <CardDescription>
                {filteredTrainings.length} training course(s) found
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Title</TableHead>
                    <TableHead>Category</TableHead>
                    <TableHead>Level</TableHead>
                    <TableHead>Instructor</TableHead>
                    <TableHead>Duration</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {isLoading ? (
                    <TableRow>
                      <TableCell colSpan={6} className="text-center py-10">
                        <Loader2 className="h-8 w-8 animate-spin mx-auto text-primary mb-2" />
                        <p className="text-sm text-muted-foreground">Loading trainings...</p>
                      </TableCell>
                    </TableRow>
                  ) : filteredTrainings.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={6} className="text-center text-muted-foreground">
                        No trainings found
                      </TableCell>
                    </TableRow>
                  ) : (
                    filteredTrainings.map((training) => (
                      <TableRow key={training.id}>
                        <TableCell className="font-medium">{training.title}</TableCell>
                        <TableCell className="capitalize">{training.category}</TableCell>
                        <TableCell>{getLevelBadge(training.level)}</TableCell>
                        <TableCell>{training.instructor}</TableCell>
                        <TableCell>{training.duration} hrs</TableCell>
                        <TableCell className="text-right space-x-2">
                          <Button variant="ghost" size="sm" disabled>
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button 
                            variant="ghost" 
                            size="sm"
                            onClick={() => handleDelete(training.id || '')}
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

      {activeTab === "enrollments" && (
        <Card>
          <CardHeader>
            <CardTitle>Training Enrollments</CardTitle>
            <CardDescription>
              View all enrolled and completed participants
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b">
                    <th className="text-left py-3 px-4 font-semibold">Training Title</th>
                    <th className="text-left py-3 px-4 font-semibold">Participant Name</th>
                    <th className="text-left py-3 px-4 font-semibold">Email</th>
                    <th className="text-left py-3 px-4 font-semibold">Status</th>
                    <th className="text-left py-3 px-4 font-semibold">Completed Date</th>
                  </tr>
                </thead>
                <tbody>
                  {isLoading ? (
                    <tr>
                      <td colSpan={5} className="text-center py-6">
                        <Loader2 className="h-6 w-6 animate-spin mx-auto text-primary" />
                      </td>
                    </tr>
                  ) : trainings.length === 0 ? (
                    <tr>
                      <td colSpan={5} className="text-center py-6 text-gray-500">
                        No training enrollments found
                      </td>
                    </tr>
                  ) : (
                    trainings
                      .flatMap(training => {
                        const enrollmentRows: any[] = [];
                        
                        // Add enrolled users
                        if (training.enrolledUsers && training.enrolledUsers.length > 0) {
                          training.enrolledUsers.forEach((user: any) => {
                            // Check if user completed this training
                            const completed = training.completedUsers?.find(
                              (c: any) => c.userId?.id === user.id || c.userId === user.id
                            );
                            
                            enrollmentRows.push({
                              trainingId: training.id,
                              trainingTitle: training.title,
                              userName: user.name,
                              userEmail: user.email,
                              status: completed ? 'Completed' : 'Enrolled',
                              completedDate: completed?.completedAt ? new Date(completed.completedAt).toLocaleDateString() : '-'
                            });
                          });
                        }
                        
                        return enrollmentRows;
                      })
                      .map((row, idx) => (
                        <tr key={`${row.trainingId}-${idx}`} className="border-b hover:bg-gray-50">
                          <td className="py-3 px-4 font-medium">{row.trainingTitle}</td>
                          <td className="py-3 px-4">{row.userName}</td>
                          <td className="py-3 px-4 text-sm">{row.userEmail}</td>
                          <td className="py-3 px-4">
                            <Badge variant={row.status === 'Completed' ? 'default' : 'outline'}>
                              {row.status}
                            </Badge>
                          </td>
                          <td className="py-3 px-4 text-sm">{row.completedDate}</td>
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
