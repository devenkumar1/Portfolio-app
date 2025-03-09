"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Loader2, AlertCircle, CheckCircle, Pencil, Trash2, Plus } from "lucide-react";
import { useRouter } from "next/navigation";
import { usePortfolio } from "@/context/PortfolioContext";

interface AchievementFormData {
  id?: string;
  title: string;
  description: string;
  year: string;
}

export default function AchievementsAdmin() {
  const router = useRouter();
  const { portfolioData, loading: contextLoading, refreshData } = usePortfolio();
  
  const [achievements, setAchievements] = useState<any[]>([]);
  const [formData, setFormData] = useState<AchievementFormData>({
    title: "",
    description: "",
    year: new Date().getFullYear().toString(),
  });
  
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  
  // Fetch achievements when component mounts or portfolioData changes
  useEffect(() => {
    if (portfolioData?.achievements) {
      setAchievements(portfolioData.achievements);
    }
  }, [portfolioData]);
  
  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate required fields
    if (!formData.title || !formData.description || !formData.year) {
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
      
      const response = await fetch("/api/v1/admin/achievement", {
        method,
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(body),
      });
      
      const data = await response.json();
      
      if (data.success) {
        setSuccess(`Achievement ${isEditing ? 'updated' : 'created'} successfully!`);
        // Reset form
        setFormData({
          title: "",
          description: "",
          year: new Date().getFullYear().toString(),
        });
        setIsEditing(false);
        // Refresh the data in the context
        refreshData();
      } else {
        setError(data.error || `Failed to ${isEditing ? 'update' : 'create'} achievement`);
      }
    } catch (err) {
      console.error(`Error ${isEditing ? 'updating' : 'creating'} achievement:`, err);
      setError(`An error occurred while ${isEditing ? 'updating' : 'creating'} the achievement`);
    } finally {
      setSubmitting(false);
    }
  };
  
  const handleEdit = (achievement: any) => {
    setFormData({
      id: achievement._id,
      title: achievement.title || "",
      description: achievement.description || "",
      year: achievement.year || new Date().getFullYear().toString(),
    });
    setIsEditing(true);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };
  
  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this achievement?")) {
      return;
    }
    
    try {
      setLoading(true);
      setError(null);
      setSuccess(null);
      
      const response = await fetch(`/api/v1/admin/achievement?id=${id}`, {
        method: "DELETE",
      });
      
      const data = await response.json();
      
      if (data.success) {
        setSuccess("Achievement deleted successfully!");
        // Refresh the data in the context
        refreshData();
      } else {
        setError(data.error || "Failed to delete achievement");
      }
    } catch (err) {
      console.error("Error deleting achievement:", err);
      setError("An error occurred while deleting the achievement");
    } finally {
      setLoading(false);
    }
  };
  
  const handleCancel = () => {
    setFormData({
      title: "",
      description: "",
      year: new Date().getFullYear().toString(),
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
      <h1 className="text-2xl font-bold mb-6">{isEditing ? 'Edit' : 'Add'} Achievement</h1>
      
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
            <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-1">
              Achievement Title *
            </label>
            <Input
              id="title"
              name="title"
              value={formData.title}
              onChange={handleChange}
              placeholder="e.g. First Place in Hackathon"
              required
              className="w-full"
            />
          </div>
          
          <div>
            <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
              Description *
            </label>
            <Textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleChange}
              placeholder="Describe your achievement..."
              required
              className="w-full"
              rows={4}
            />
          </div>
          
          <div>
            <label htmlFor="year" className="block text-sm font-medium text-gray-700 mb-1">
              Year *
            </label>
            <Input
              id="year"
              name="year"
              type="number"
              min="1900"
              max={new Date().getFullYear()}
              value={formData.year}
              onChange={handleChange}
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
                  {isEditing ? 'Update Achievement' : 'Add Achievement'}
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
      
      <h2 className="text-xl font-bold mb-4">Existing Achievements</h2>
      
      {achievements.length === 0 ? (
        <div className="bg-white p-6 rounded-lg shadow-md text-center">
          <p className="text-gray-500">No achievements found. Add your first achievement above.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {achievements.map((achievement) => (
            <div key={achievement._id} className="bg-white rounded-lg shadow-md p-4">
              <div className="flex justify-between items-start mb-2">
                <h3 className="text-lg font-medium">{achievement.title}</h3>
                <span className="text-sm font-medium bg-blue-100 text-blue-800 px-2 py-1 rounded">
                  {achievement.year}
                </span>
              </div>
              <p className="text-gray-600 text-sm mb-4">{achievement.description}</p>
              <div className="flex gap-2">
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={() => handleEdit(achievement)}
                  className="flex items-center gap-1"
                >
                  <Pencil className="w-3 h-3" />
                  Edit
                </Button>
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={() => handleDelete(achievement._id)}
                  className="flex items-center gap-1 text-red-500 hover:text-red-700 hover:bg-red-50 border-red-200"
                >
                  <Trash2 className="w-3 h-3" />
                  Delete
                </Button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
} 