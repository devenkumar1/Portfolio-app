"use client";

import { useState, useEffect, FormEvent } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Loader2, AlertCircle, CheckCircle, Pencil, Trash2, Plus, Upload } from "lucide-react";
import { useRouter } from "next/navigation";
import { usePortfolio } from "@/context/PortfolioContext";
import Image from "next/image";

interface SkillFormData {
  id?: string;
  name: string;
  icon: string;
}

export default function SkillsAdmin() {
  const router = useRouter();
  const { portfolioData, loading: contextLoading, refreshData } = usePortfolio();
  
  const [skills, setSkills] = useState<any[]>([]);
  const [formData, setFormData] = useState<SkillFormData>({
    name: "",
    icon: "",
  });
  
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [iconLoading, setIconLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  
  // Fetch skills when component mounts or portfolioData changes
  useEffect(() => {
    if (portfolioData?.skills) {
      setSkills(portfolioData.skills);
    }
  }, [portfolioData]);
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };
  
  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    
    // Validate required fields
    if (!formData.name) {
      setError("Skill name is required");
      return;
    }
    
    // Validate icon is uploaded
    if (!formData.icon) {
      setError("Please upload an icon");
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
      
      const response = await fetch("/api/v1/admin/skill", {
        method,
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(body),
      });
      
      const data = await response.json();
      
      if (data.success) {
        setSuccess(`Skill ${isEditing ? 'updated' : 'created'} successfully!`);
        // Reset form
        setFormData({
          name: "",
          icon: "",
        });
        setIsEditing(false);
        // Refresh the data in the context
        refreshData();
      } else {
        setError(data.error || `Failed to ${isEditing ? 'update' : 'create'} skill`);
      }
    } catch (err) {
      console.error(`Error ${isEditing ? 'updating' : 'creating'} skill:`, err);
      setError(`An error occurred while ${isEditing ? 'updating' : 'creating'} the skill`);
    } finally {
      setSubmitting(false);
    }
  };
  
  const handleEdit = (skill: any) => {
    setFormData({
      id: skill._id,
      name: skill.name || "",
      icon: skill.icon || "",
    });
    setIsEditing(true);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };
  
  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this skill?")) {
      return;
    }
    
    try {
      setLoading(true);
      setError(null);
      setSuccess(null);
      
      const response = await fetch(`/api/v1/admin/skill?id=${id}`, {
        method: "DELETE",
      });
      
      const data = await response.json();
      
      if (data.success) {
        setSuccess("Skill deleted successfully!");
        // Refresh the data in the context
        refreshData();
      } else {
        setError(data.error || "Failed to delete skill");
      }
    } catch (err) {
      console.error("Error deleting skill:", err);
      setError("An error occurred while deleting the skill");
    } finally {
      setLoading(false);
    }
  };
  
  const handleIconUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || e.target.files.length === 0) return;
    
    const file = e.target.files[0];
    const formData = new FormData();
    formData.append("file", file);
    
    try {
      setIconLoading(true);
      setError(null);
      
      const response = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });
      
      const data = await response.json();
      
      if (data.url) {
        setFormData((prev) => ({ ...prev, icon: data.url }));
        setSuccess("Icon uploaded successfully!");
      } else {
        setError("Failed to upload icon");
      }
    } catch (err) {
      console.error("Error uploading icon:", err);
      setError("An error occurred while uploading the icon");
    } finally {
      setIconLoading(false);
    }
  };
  
  const handleCancel = () => {
    setFormData({
      name: "",
      icon: "",
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
      <h1 className="text-2xl font-bold mb-6">{isEditing ? 'Edit' : 'Add'} Skill</h1>
      
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
            <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
              Skill Name *
            </label>
            <Input
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="e.g. React, Node.js, TypeScript"
              required
              className="w-full"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Skill Icon *
            </label>
            <div className="flex flex-col gap-4">
              <div className="relative">
                <Input
                  type="file"
                  accept="image/*"
                  onChange={handleIconUpload}
                  className="absolute inset-0 opacity-0 cursor-pointer z-10 w-full h-full"
                />
                <Button 
                  type="button" 
                  variant="outline" 
                  className="relative flex items-center gap-2 w-full"
                  disabled={iconLoading}
                >
                  {iconLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Upload className="w-4 h-4" />}
                  {formData.icon ? "Change Icon" : "Upload Icon"}
                </Button>
              </div>
              
              {formData.icon && (
                <div className="mt-2">
                  <p className="text-sm text-gray-500 mb-2">Preview:</p>
                  <div className="bg-white/10 rounded-xl flex items-center justify-center p-3 w-16 h-16 border border-gray-200">
                    <Image src={formData.icon} alt={formData.name} width={40} height={40} />
                  </div>
                </div>
              )}
            </div>
            <p className="text-xs text-gray-500 mt-2">
              You can also use icons from <a href="https://devicon.dev/" target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:underline">Devicon</a> or any other icon library.
            </p>
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
                  {isEditing ? 'Update Skill' : 'Add Skill'}
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
      
      <h2 className="text-xl font-bold mb-4">Existing Skills</h2>
      
      {skills.length === 0 ? (
        <div className="bg-white p-6 rounded-lg shadow-md text-center">
          <p className="text-gray-500">No skills found. Add your first skill above.</p>
        </div>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
          {skills.map((skill) => (
            <div key={skill._id} className="bg-white rounded-lg shadow-md p-4 flex flex-col items-center">
              <div className="bg-white/10 rounded-xl flex items-center justify-center p-3 mb-3 w-16 h-16">
                <Image src={skill.icon || "/placeholder.svg"} alt={skill.name} width={40} height={40} />
              </div>
              <h3 className="text-sm font-medium text-center mb-3">{skill.name}</h3>
              <div className="flex gap-2 mt-auto">
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={() => handleEdit(skill)}
                  className="flex items-center gap-1 px-2 py-1 h-8"
                >
                  <Pencil className="w-3 h-3" />
                  Edit
                </Button>
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={() => handleDelete(skill._id)}
                  className="flex items-center gap-1 px-2 py-1 h-8 text-red-500 hover:text-red-700 hover:bg-red-50 border-red-200"
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