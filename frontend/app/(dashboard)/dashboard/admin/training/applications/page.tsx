'use client';

import { useState, useEffect } from 'react';
import { api } from '@/lib/api';
import type { Training } from '@/lib/api';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { AlertCircle, Loader2, Search } from 'lucide-react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';

interface TrainingWithEnrollments extends Training {
  enrolledCount?: number;
  completedCount?: number;
}

export default function AdminTrainingApplicationsPage() {
  const [trainings, setTrainings] = useState<TrainingWithEnrollments[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');

  const CATEGORIES = [
    "Business Fundamentals",
    "Marketing",
    "Finance",
    "Technology",
    "Legal",
    "Sales",
    "Operations"
  ];

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      setError(null);
      const trainingsData = await api.training.getAll();
      
      const trainingsWithCounts = trainingsData.map(training => ({
        ...training,
        enrolledCount: training.enrolledUsers?.length || 0,
        completedCount: training.completedUsers?.length || 0
      }));
      
      setTrainings(trainingsWithCounts);
    } catch (err) {
      setError('Failed to load training enrollments');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const filteredTrainings = trainings.filter(training => {
    const matchesSearch = training.title.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = categoryFilter === 'all' || training.category.toLowerCase() === categoryFilter.toLowerCase();
    const hasEnrollments = (training.enrolledCount || 0) > 0;
    return matchesSearch && matchesCategory && hasEnrollments;
  });

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
        <h1 className="text-3xl font-bold">Training Enrollments</h1>
        <p className="text-gray-600">View users enrolled in training courses</p>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 flex items-center gap-2">
          <AlertCircle className="h-5 w-5 text-red-600" />
          <p className="text-red-700">{error}</p>
        </div>
      )}

      {/* Filters */}
      <Card>
        <CardHeader>
          <CardTitle>Filters</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex gap-4">
            <div className="flex-1">
              <label className="block text-sm font-medium mb-2">Search</label>
              <div className="relative">
                <Search className="absolute left-2 top-2.5 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Search by training name..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-8"
                />
              </div>
            </div>
            <div className="flex-1">
              <label className="block text-sm font-medium mb-2">Category</label>
              <Select value={categoryFilter} onValueChange={setCategoryFilter}>
                <SelectTrigger>
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
          </div>
        </CardContent>
      </Card>

      {/* Trainings Table */}
      <Card>
        <CardHeader>
          <CardTitle>Training Courses</CardTitle>
          <CardDescription>{filteredTrainings.length} training(s) with enrollments found</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b">
                  <th className="text-left py-3 px-4 font-semibold">Title</th>
                  <th className="text-left py-3 px-4 font-semibold">Category</th>
                  <th className="text-left py-3 px-4 font-semibold">Level</th>
                  <th className="text-left py-3 px-4 font-semibold">Instructor</th>
                  <th className="text-left py-3 px-4 font-semibold">Enrolled</th>
                  <th className="text-left py-3 px-4 font-semibold">Completed</th>
                </tr>
              </thead>
              <tbody>
                {filteredTrainings.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="text-center py-6 text-gray-500">
                      No trainings with enrollments found
                    </td>
                  </tr>
                ) : (
                  filteredTrainings.map((training) => (
                    <tr key={training.id} className="border-b hover:bg-gray-50">
                      <td className="py-3 px-4 font-medium">{training.title}</td>
                      <td className="py-3 px-4 capitalize text-sm">{training.category}</td>
                      <td className="py-3 px-4 text-sm">
                        <Badge variant="outline">{training.level}</Badge>
                      </td>
                      <td className="py-3 px-4 text-sm">{training.instructor}</td>
                      <td className="py-3 px-4 text-sm font-semibold">{training.enrolledCount}</td>
                      <td className="py-3 px-4 text-sm font-semibold">{training.completedCount}</td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
