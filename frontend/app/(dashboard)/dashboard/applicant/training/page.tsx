'use client';

import { useState, useEffect } from 'react';
import { api } from '@/lib/api';
import type { Training } from '@/lib/api';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { AlertCircle, Loader2, CheckCircle2, BookOpen, CheckCircle, X } from 'lucide-react';

export default function TrainingPage() {
  const [trainings, setTrainings] = useState<Training[]>([]);
  const [loading, setLoading] = useState(true);
  const [categoryFilter, setCategoryFilter] = useState<string>('');
  const [levelFilter, setLevelFilter] = useState<string>('');
  const [notification, setNotification] = useState<{ type: "success" | "error"; message: string } | null>(null);

  // Auto-hide notification after 3 seconds
  useEffect(() => {
    if (notification) {
      const timer = setTimeout(() => setNotification(null), 3000);
      return () => clearTimeout(timer);
    }
  }, [notification]);

  useEffect(() => {
    loadTrainings();
  }, [categoryFilter, levelFilter]);

  const loadTrainings = async () => {
    try {
      setLoading(true);
      const data = await api.training.getAll({ category: categoryFilter || undefined, level: levelFilter || undefined });
      setTrainings(data);
    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : 'Failed to load training courses';
      setNotification({
        type: "error",
        message: errorMsg
      });
    } finally {
      setLoading(false);
    }
  };

  const handleEnroll = async (trainingId: string) => {
    try {
      await api.training.enroll(trainingId);
      setNotification({
        type: "success",
        message: "Enrolled in training successfully"
      });
      await loadTrainings();
    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : 'Failed to enroll in training';
      setNotification({
        type: "error",
        message: errorMsg
      });
    }
  };

  const handleComplete = async (trainingId: string) => {
    try {
      await api.training.complete(trainingId);
      setNotification({
        type: "success",
        message: "Training marked as complete"
      });
      await loadTrainings();
    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : 'Failed to mark training as complete';
      setNotification({
        type: "error",
        message: errorMsg
      });
    }
  };

  const categoryOptions = ['business-fundamentals', 'marketing', 'finance', 'technology', 'legal', 'sales', 'operations'];
  const levelOptions = ['beginner', 'intermediate', 'advanced'];

  if (loading && trainings.length === 0) {
    return (
      <div className="flex justify-center items-center min-h-[400px]">
        <Loader2 className="h-8 w-8 animate-spin text-blue-500" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Notification Toast */}
      {notification && (
        <div className={`rounded-lg p-4 flex items-center gap-3 ${
          notification.type === 'success' 
            ? 'bg-green-50 border border-green-200' 
            : 'bg-red-50 border border-red-200'
        }`}>
          {notification.type === 'success' ? (
            <CheckCircle className="h-5 w-5 text-green-600" />
          ) : (
            <AlertCircle className="h-5 w-5 text-red-600" />
          )}
          <p className={notification.type === 'success' ? 'text-green-700' : 'text-red-700'}>
            {notification.message}
          </p>
        </div>
      )}

      <div>
        <h1 className="text-3xl font-bold">Training & Courses</h1>
        <p className="text-gray-600">Develop your startup skills with our comprehensive training programs</p>
      </div>

      {/* Filters */}
      <Card>
        <CardHeader>
          <CardTitle>Filters</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <label className="text-sm font-medium">Category</label>
            <select
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              className="w-full mt-1 px-3 py-2 border border-gray-300 rounded-md"
            >
              <option value="">All Categories</option>
              {categoryOptions.map((cat) => (
                <option key={cat} value={cat}>
                  {cat.replace(/-/g, ' ').toUpperCase()}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="text-sm font-medium">Level</label>
            <select
              value={levelFilter}
              onChange={(e) => setLevelFilter(e.target.value)}
              className="w-full mt-1 px-3 py-2 border border-gray-300 rounded-md"
            >
              <option value="">All Levels</option>
              {levelOptions.map((level) => (
                <option key={level} value={level}>
                  {level.charAt(0).toUpperCase() + level.slice(1)}
                </option>
              ))}
            </select>
          </div>
        </CardContent>
      </Card>

      {/* Training Courses Grid */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {trainings.map((training) => (
          <Card key={training.id} className="flex flex-col">
            <CardHeader>
              <div className="flex items-start justify-between gap-2">
                <div className="flex-1">
                  <CardTitle className="text-lg">{training.title}</CardTitle>
                  <CardDescription>{training.instructor}</CardDescription>
                </div>
                <Badge variant="outline">{training.level}</Badge>
              </div>
            </CardHeader>
            <CardContent className="flex-1 space-y-4">
              <div>
                <p className="text-sm text-gray-600">{training.description}</p>
              </div>

              <div className="flex gap-2 flex-wrap">
                <Badge variant="secondary">{training.category}</Badge>
                <Badge variant="secondary">{training.duration} min</Badge>
              </div>

              {training.materials && training.materials.length > 0 && (
                <div className="bg-blue-50 dark:bg-blue-950 rounded-lg p-3 space-y-2 border border-blue-200 dark:border-blue-800">
                  <p className="text-sm font-semibold text-blue-900 dark:text-blue-100">📍 Training Location</p>
                  {training.materials.map((material, idx) => (
                    <div key={idx} className="space-y-1">
                      <p className="text-sm font-medium text-blue-800 dark:text-blue-200">{material.title}</p>
                      <div className="flex items-start gap-2">
                        <span className="inline-block px-2 py-1 bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300 text-xs font-medium rounded">
                          {material.type?.toUpperCase()}
                        </span>
                        <p className="text-sm text-blue-700 dark:text-blue-300 flex-1">{material.location}</p>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              <div className="pt-4 border-t space-y-2">
                {training.enrolledUsers?.length ? (
                  <Button
                    onClick={() => handleComplete(training.id)}
                    className="w-full"
                    variant="default"
                  >
                    <CheckCircle2 className="h-4 w-4 mr-2" />
                    Mark Complete
                  </Button>
                ) : (
                  <Button
                    onClick={() => handleEnroll(training.id)}
                    className="w-full"
                    variant="outline"
                  >
                    <BookOpen className="h-4 w-4 mr-2" />
                    Enroll Now
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {trainings.length === 0 && !loading && (
        <Card>
          <CardContent className="pt-6 text-center">
            <p className="text-gray-600">No training courses available</p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
