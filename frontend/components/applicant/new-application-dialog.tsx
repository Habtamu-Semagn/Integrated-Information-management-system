"use client";

import { useState } from "react";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Send, AlertCircle, Loader2 } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { ScrollArea } from "@/components/ui/scroll-area";
import { api } from "@/lib/api";
import { toast } from "sonner";

interface NewApplicationDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess?: () => void;
}

export function NewApplicationDialog({ open, onOpenChange, onSuccess }: NewApplicationDialogProps) {
  const [formData, setFormData] = useState({
    startupName: "",
    description: "",
    problemStatement: "",
    solution: "",
    targetMarket: "",
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors[field];
        return newErrors;
      });
    }
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.startupName.trim()) {
      newErrors.startupName = "Startup name is required";
    } else if (formData.startupName.length < 3) {
      newErrors.startupName = "Startup name must be at least 3 characters";
    } else if (formData.startupName.length > 200) {
      newErrors.startupName = "Startup name must not exceed 200 characters";
    }

    if (!formData.description.trim()) {
      newErrors.description = "Description is required";
    } else if (formData.description.length < 10) {
      newErrors.description = "Description must be at least 10 characters";
    } else if (formData.description.length > 1000) {
      newErrors.description = "Description must not exceed 1000 characters";
    }

    if (!formData.problemStatement.trim()) {
      newErrors.problemStatement = "Problem statement is required";
    } else if (formData.problemStatement.length < 10) {
      newErrors.problemStatement = "Problem statement must be at least 10 characters";
    } else if (formData.problemStatement.length > 1000) {
      newErrors.problemStatement = "Problem statement must not exceed 1000 characters";
    }

    if (!formData.solution.trim()) {
      newErrors.solution = "Solution is required";
    } else if (formData.solution.length < 10) {
      newErrors.solution = "Solution must be at least 10 characters";
    } else if (formData.solution.length > 1000) {
      newErrors.solution = "Solution must not exceed 1000 characters";
    }

    if (!formData.targetMarket.trim()) {
      newErrors.targetMarket = "Target market is required";
    } else if (formData.targetMarket.length < 5) {
      newErrors.targetMarket = "Target market must be at least 5 characters";
    } else if (formData.targetMarket.length > 500) {
      newErrors.targetMarket = "Target market must not exceed 500 characters";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    try {
      setIsSubmitting(true);
      await api.applications.create(formData);
      
      // Reset form
      setFormData({
        startupName: "",
        description: "",
        problemStatement: "",
        solution: "",
        targetMarket: "",
      });
      setErrors({});
      
      // Close dialog
      onOpenChange(false);
      
      // Call success callback
      if (onSuccess) {
        onSuccess();
      }
      
      toast.success("Application submitted successfully!");
    } catch (error: any) {
      console.error("Failed to submit application:", error);
      const message = error.response?.data?.message || "Failed to submit application. Please try again.";
      toast.error(message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const getCharacterCount = (field: keyof typeof formData, max: number) => {
    const count = formData[field].length;
    const remaining = max - count;
    const percentage = (count / max) * 100;
    
    let colorClass = "text-muted-foreground";
    if (percentage > 90) colorClass = "text-red-500";
    else if (percentage > 75) colorClass = "text-yellow-600";

    return (
      <span className={`text-xs ${colorClass}`}>
        {count} / {max}
      </span>
    );
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-5xl max-h-[90vh]">
        <DialogHeader>
          <DialogTitle>Submit New Application</DialogTitle>
          <DialogDescription>
            Fill out the form below to submit your startup application for review
          </DialogDescription>
        </DialogHeader>

        <ScrollArea className="max-h-[calc(90vh-200px)] pr-4">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Info Alert */}
            <Alert>
              <AlertCircle className="h-4 w-4" />
              <AlertDescription className="text-sm">
                Please provide detailed and accurate information. All fields are required.
              </AlertDescription>
            </Alert>

            {/* Startup Name */}
            <div className="space-y-2">
              <Label htmlFor="startupName">
                Startup Name <span className="text-destructive">*</span>
              </Label>
              <Input
                id="startupName"
                placeholder="Enter your startup name"
                value={formData.startupName}
                onChange={(e) => handleChange("startupName", e.target.value)}
                className={errors.startupName ? "border-destructive" : ""}
                maxLength={200}
              />
              <div className="flex justify-between items-center">
                {errors.startupName && (
                  <p className="text-sm text-destructive">{errors.startupName}</p>
                )}
                <div className="ml-auto">
                  {getCharacterCount("startupName", 200)}
                </div>
              </div>
            </div>

            {/* Description */}
            <div className="space-y-2">
              <Label htmlFor="description">
                Business Description <span className="text-destructive">*</span>
              </Label>
              <Textarea
                id="description"
                placeholder="Provide a brief overview of your business"
                value={formData.description}
                onChange={(e) => handleChange("description", e.target.value)}
                className={`min-h-[80px] ${errors.description ? "border-destructive" : ""}`}
                maxLength={1000}
              />
              <div className="flex justify-between items-center">
                {errors.description && (
                  <p className="text-sm text-destructive">{errors.description}</p>
                )}
                <div className="ml-auto">
                  {getCharacterCount("description", 1000)}
                </div>
              </div>
            </div>

            {/* Problem Statement */}
            <div className="space-y-2">
              <Label htmlFor="problemStatement">
                Problem Statement <span className="text-destructive">*</span>
              </Label>
              <p className="text-sm text-muted-foreground">
                What problem does your startup solve?
              </p>
              <Textarea
                id="problemStatement"
                placeholder="Describe the problem your startup addresses"
                value={formData.problemStatement}
                onChange={(e) => handleChange("problemStatement", e.target.value)}
                className={`min-h-[100px] ${errors.problemStatement ? "border-destructive" : ""}`}
                maxLength={1000}
              />
              <div className="flex justify-between items-center">
                {errors.problemStatement && (
                  <p className="text-sm text-destructive">{errors.problemStatement}</p>
                )}
                <div className="ml-auto">
                  {getCharacterCount("problemStatement", 1000)}
                </div>
              </div>
            </div>

            {/* Solution */}
            <div className="space-y-2">
              <Label htmlFor="solution">
                Solution <span className="text-destructive">*</span>
              </Label>
              <p className="text-sm text-muted-foreground">
                How does your startup solve this problem?
              </p>
              <Textarea
                id="solution"
                placeholder="Describe your solution and approach"
                value={formData.solution}
                onChange={(e) => handleChange("solution", e.target.value)}
                className={`min-h-[100px] ${errors.solution ? "border-destructive" : ""}`}
                maxLength={1000}
              />
              <div className="flex justify-between items-center">
                {errors.solution && (
                  <p className="text-sm text-destructive">{errors.solution}</p>
                )}
                <div className="ml-auto">
                  {getCharacterCount("solution", 1000)}
                </div>
              </div>
            </div>

            {/* Target Market */}
            <div className="space-y-2">
              <Label htmlFor="targetMarket">
                Target Market <span className="text-destructive">*</span>
              </Label>
              <p className="text-sm text-muted-foreground">
                Who are your target customers?
              </p>
              <Textarea
                id="targetMarket"
                placeholder="Describe your target market and customer base"
                value={formData.targetMarket}
                onChange={(e) => handleChange("targetMarket", e.target.value)}
                className={`min-h-[80px] ${errors.targetMarket ? "border-destructive" : ""}`}
                maxLength={500}
              />
              <div className="flex justify-between items-center">
                {errors.targetMarket && (
                  <p className="text-sm text-destructive">{errors.targetMarket}</p>
                )}
                <div className="ml-auto">
                  {getCharacterCount("targetMarket", 500)}
                </div>
              </div>
            </div>
          </form>
        </ScrollArea>

        <DialogFooter className="gap-2">
          <Button
            type="button"
            variant="outline"
            onClick={() => onOpenChange(false)}
            disabled={isSubmitting}
          >
            Cancel
          </Button>
          <Button
            type="submit"
            onClick={handleSubmit}
            disabled={isSubmitting}
          >
            {isSubmitting ? (
              <>
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                Submitting...
              </>
            ) : (
              <>
                <Send className="h-4 w-4 mr-2" />
                Submit Application
              </>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
