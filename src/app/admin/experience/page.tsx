"use client";

import { useState, useEffect, FormEvent } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Loader2, AlertCircle, CheckCircle, Pencil, Trash2, Plus, Calendar } from "lucide-react";
import { useRouter } from "next/navigation";
import { usePortfolio } from "@/context/PortfolioContext";

interface ExperienceFormData {
  id?: string;
  company: string;
  position: string;
  start: string;
  end: string;
}

export default function ExperienceAdmin() {
  const router = useRouter();
  const { portfolioData, loading: contextLoading, refreshData } = usePortfolio();
  
  const [experiences, setExperiences] = useState<any[]>([]);
  const [formData, setFormData] = useState<ExperienceFormData>({
    company: "",
    position: "",
    start: "",
    end: "",
  });
  
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  
  // Fetch experiences when component mounts or portfolioData changes
  useEffect(() => {
    if (portfolioData?.experiences) {
      setExperiences(portfolioData.experiences);
    }
  }, [portfolioData]);
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };
  
  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    
    // Validate required fields
    if (!formData.company || !formData.position || !formData.start || !formData.end) {
      setError("All fields are required");
      return;
    }
    
    try {
      setSubmitting(true);
      setError(null);
      setSuccess(null);
      
      const method = isEditing ? "PUT" : "POST";
      const body = isEditing 
        ? { ...formData, id: formData.id } 
        : formData;
      
      const response = await fetch("/api/v1/admin/experience", {
        method,
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(body),
      });
      
      const data = await response.json();
      
      if (data.success) {
        setSuccess(`Experience ${isEditing ? 'updated' : 'created'} successfully!`);
        // Reset form
        setFormData({
          company: "",
          position: "",
          start: "",
          end: "",
        });
        setIsEditing(false);
        // Refresh the data in the context
        refreshData();
      } else {
        setError(data.error || `Failed to ${isEditing ? 'update' : 'create'} experience`);
      }
    } catch (err) {
      console.error(`Error ${isEditing ? 'updating' : 'creating'} experience:`, err);
      setError(`An error occurred while ${isEditing ? 'updating' : 'creating'} the experience`);
    } finally {
      setSubmitting(false);
    }
  };
  
  const handleEdit = (experience: any) => {
    setFormData({
      id: experience._id,
      company: experience.company || "",
      position: experience.position || "",
      start: experience.start || "",
      end: experience.end || "",
    });
    setIsEditing(true);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };
  
  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this experience?")) {
      return;
    }
    
    try {
      setLoading(true);
      setError(null);
      setSuccess(null);
      
      const response = await fetch(`/api/v1/admin/experience?id=${id}`, {
        method: "DELETE",
      });
      
      const data = await response.json();
      
      if (data.success) {
        setSuccess("Experience deleted successfully!");
        // Refresh the data in the context
        refreshData();
      } else {
        setError(data.error || "Failed to delete experience");
      }
    } catch (err) {
      console.error("Error deleting experience:", err);
      setError("An error occurred while deleting the experience");
    } finally {
      setLoading(false);
    }
  };
  
  const handleCancel = () => {
    setFormData({
      company: "",
      position: "",
      start: "",
      end: "",
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
      <h1 className="text-2xl font-bold mb-6">{isEditing ? 'Edit' : 'Add'} Experience</h1>
      
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
            <label htmlFor="company" className="block text-sm font-medium text-gray-700 mb-1">
              Company *
            </label>
            <Input
              id="company"
              name="company"
              value={formData.company}
              onChange={handleChange}
              placeholder="e.g. Google, Microsoft, etc."
              required
              className="w-full"
            />
          </div>
          
          <div>
            <label htmlFor="position" className="block text-sm font-medium text-gray-700 mb-1">
              Position *
            </label>
            <Input
              id="position"
              name="position"
              value={formData.position}
              onChange={handleChange}
              placeholder="e.g. Software Engineer, Product Manager, etc."
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
                placeholder="e.g. Jan 2020"
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
                placeholder="e.g. Present, Dec 2022"
                required
                className="w-full"
              />
            </div>
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
                  {isEditing ? 'Update Experience' : 'Add Experience'}
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
      
      <h2 className="text-xl font-bold mb-4">Work Experience</h2>
      
      {experiences.length === 0 ? (
        <div className="bg-white p-6 rounded-lg shadow-md text-center">
          <p className="text-gray-500">No experience entries found. Add your first experience above.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {experiences.map((experience) => (
            <div key={experience._id} className="bg-white rounded-lg shadow-md p-6">
              <div className="flex flex-col md:flex-row md:justify-between md:items-start gap-4">
                <div>
                  <h3 className="text-lg font-semibold">{experience.position}</h3>
                  <p className="text-gray-600">{experience.company}</p>
                  <div className="flex items-center text-gray-500 mt-1">
                    <Calendar className="w-4 h-4 mr-1" />
                    <span className="text-sm">{experience.start} - {experience.end}</span>
                  </div>
                </div>
                <div className="flex gap-2 mt-2 md:mt-0">
                  <Button 
                    variant="outline" 
                    size="sm" 
                    onClick={() => handleEdit(experience)}
                    className="flex items-center gap-1"
                  >
                    <Pencil className="w-3 h-3" />
                    Edit
                  </Button>
                  <Button 
                    variant="outline" 
                    size="sm" 
                    onClick={() => handleDelete(experience._id)}
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