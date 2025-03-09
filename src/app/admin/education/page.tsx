"use client";

import { useState, useEffect, FormEvent } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Loader2, AlertCircle, CheckCircle, Pencil, Trash2, Plus, Calendar, GraduationCap } from "lucide-react";
import { useRouter } from "next/navigation";
import { usePortfolio } from "@/context/PortfolioContext";

interface EducationFormData {
  id?: string;
  course: string;
  start: string;
  end: string;
  percentage: number | string;
}

export default function EducationAdmin() {
  const router = useRouter();
  const { portfolioData, loading: contextLoading, refreshData } = usePortfolio();
  
  const [educations, setEducations] = useState<any[]>([]);
  const [formData, setFormData] = useState<EducationFormData>({
    course: "",
    start: "",
    end: "",
    percentage: "",
  });
  
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  
  // Fetch educations when component mounts or portfolioData changes
  useEffect(() => {
    if (portfolioData?.educations) {
      setEducations(portfolioData.educations);
    }
  }, [portfolioData]);
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };
  
  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    
    // Validate required fields
    if (!formData.course || !formData.start || !formData.end || formData.percentage === "") {
      setError("All fields are required");
      return;
    }
    
    // Validate percentage is a number
    if (isNaN(Number(formData.percentage))) {
      setError("Percentage must be a number");
      return;
    }
    
    try {
      setSubmitting(true);
      setError(null);
      setSuccess(null);
      
      const method = isEditing ? "PUT" : "POST";
      const body = isEditing 
        ? { ...formData, id: formData.id, percentage: Number(formData.percentage) } 
        : { ...formData, percentage: Number(formData.percentage) };
      
      const response = await fetch("/api/v1/admin/education", {
        method,
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(body),
      });
      
      const data = await response.json();
      
      if (data.success) {
        setSuccess(`Education ${isEditing ? 'updated' : 'created'} successfully!`);
        // Reset form
        setFormData({
          course: "",
          start: "",
          end: "",
          percentage: "",
        });
        setIsEditing(false);
        // Refresh the data in the context
        refreshData();
      } else {
        setError(data.error || `Failed to ${isEditing ? 'update' : 'create'} education`);
      }
    } catch (err) {
      console.error(`Error ${isEditing ? 'updating' : 'creating'} education:`, err);
      setError(`An error occurred while ${isEditing ? 'updating' : 'creating'} the education`);
    } finally {
      setSubmitting(false);
    }
  };
  
  const handleEdit = (education: any) => {
    setFormData({
      id: education._id,
      course: education.course || "",
      start: education.start || "",
      end: education.end || "",
      percentage: education.percentage || "",
    });
    setIsEditing(true);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };
  
  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this education entry?")) {
      return;
    }
    
    try {
      setLoading(true);
      setError(null);
      setSuccess(null);
      
      const response = await fetch(`/api/v1/admin/education?id=${id}`, {
        method: "DELETE",
      });
      
      const data = await response.json();
      
      if (data.success) {
        setSuccess("Education entry deleted successfully!");
        // Refresh the data in the context
        refreshData();
      } else {
        setError(data.error || "Failed to delete education entry");
      }
    } catch (err) {
      console.error("Error deleting education:", err);
      setError("An error occurred while deleting the education entry");
    } finally {
      setLoading(false);
    }
  };
  
  const handleCancel = () => {
    setFormData({
      course: "",
      start: "",
      end: "",
      percentage: "",
    });
    setIsEditing(false);
    setError(null);
    setSuccess(null);
  };
  
  if (contextLoading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <Loader2 className="w-8 h-8 animate-spin text-blue-500" />
      </div>
    );
  }
  
  return (
    <div className="container mx-auto py-6">
      <h1 className="text-2xl font-bold mb-6">{isEditing ? 'Edit' : 'Add'} Education</h1>
      
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4 flex items-center">
          <AlertCircle className="w-5 h-5 mr-2" />
          {error}
        </div>
      )}
      
      {success && (
        <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mb-4 flex items-center">
          <CheckCircle className="w-5 h-5 mr-2" />
          {success}
        </div>
      )}
      
      <div className="bg-white p-6 rounded-lg shadow-md mb-8">
        <form onSubmit={handleSubmit} className="space-y-6 max-w-2xl">
          <div>
            <label htmlFor="course" className="block text-sm font-medium text-gray-700 mb-1">
              Course/Degree *
            </label>
            <Input
              id="course"
              name="course"
              value={formData.course}
              onChange={handleChange}
              placeholder="e.g. Bachelor of Computer Science, High School Diploma"
              required
              className="w-full"
            />
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label htmlFor="start" className="block text-sm font-medium text-gray-700 mb-1">
                Start Date *
              </label>
              <Input
                id="start"
                name="start"
                value={formData.start}
                onChange={handleChange}
                placeholder="e.g. 2016"
                required
                className="w-full"
              />
            </div>
            
            <div>
              <label htmlFor="end" className="block text-sm font-medium text-gray-700 mb-1">
                End Date *
              </label>
              <Input
                id="end"
                name="end"
                value={formData.end}
                onChange={handleChange}
                placeholder="e.g. 2020, Present"
                required
                className="w-full"
              />
            </div>
          </div>
          
          <div>
            <label htmlFor="percentage" className="block text-sm font-medium text-gray-700 mb-1">
              Percentage/GPA *
            </label>
            <Input
              id="percentage"
              name="percentage"
              type="number"
              min="0"
              max="100"
              step="0.01"
              value={formData.percentage}
              onChange={handleChange}
              placeholder="e.g. 85.5"
              required
              className="w-full"
            />
          </div>
          
          <div className="flex gap-4">
            <Button type="submit" disabled={submitting} className="flex items-center gap-2">
              {submitting ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  {isEditing ? 'Updating...' : 'Creating...'}
                </>
              ) : (
                <>
                  {isEditing ? <Pencil className="h-4 w-4" /> : <Plus className="h-4 w-4" />}
                  {isEditing ? 'Update Education' : 'Add Education'}
                </>
              )}
            </Button>
            
            {isEditing && (
              <Button 
                type="button" 
                variant="outline" 
                onClick={handleCancel}
                className="flex items-center gap-2"
              >
                Cancel
              </Button>
            )}
          </div>
        </form>
      </div>
      
      <h2 className="text-xl font-bold mb-4">Education History</h2>
      
      {educations.length === 0 ? (
        <div className="bg-white p-6 rounded-lg shadow-md text-center">
          <p className="text-gray-500">No education entries found. Add your first education above.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {educations.map((education) => (
            <div key={education._id} className="bg-white rounded-lg shadow-md p-6">
              <div className="flex flex-col md:flex-row md:justify-between md:items-start gap-4">
                <div>
                  <div className="flex items-center">
                    <GraduationCap className="w-5 h-5 mr-2 text-blue-500" />
                    <h3 className="text-lg font-semibold">{education.course}</h3>
                  </div>
                  <div className="flex items-center text-gray-500 mt-1">
                    <Calendar className="w-4 h-4 mr-1" />
                    <span className="text-sm">{education.start} - {education.end}</span>
                  </div>
                  <p className="text-gray-600 mt-1">
                    Percentage/GPA: {education.percentage}%
                  </p>
                </div>
                <div className="flex gap-2 mt-2 md:mt-0">
                  <Button 
                    variant="outline" 
                    size="sm" 
                    onClick={() => handleEdit(education)}
                    className="flex items-center gap-1"
                  >
                    <Pencil className="w-3 h-3" />
                    Edit
                  </Button>
                  <Button 
                    variant="outline" 
                    size="sm" 
                    onClick={() => handleDelete(education._id)}
                    className="flex items-center gap-1 text-red-500 hover:text-red-700 hover:bg-red-50 border-red-200"
                  >
                    <Trash2 className="w-3 h-3" />
                    Delete
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
} 