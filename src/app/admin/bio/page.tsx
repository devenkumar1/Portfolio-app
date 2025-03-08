"use client";

import { useState, useEffect, FormEvent } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useRouter } from "next/navigation";
import { Loader2 } from "lucide-react";

export default function BioAdmin() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  
  const [formData, setFormData] = useState({
    name: "",
    title: "",
    description: "",
    image: "",
    resume: "",
  });
  
  // Fetch existing bio data
  useEffect(() => {
    const fetchBio = async () => {
      try {
        setLoading(true);
        const response = await fetch("/api/v1/admin/bio");
        
        if (response.ok) {
          const data = await response.json();
          if (data.success && data.bio) {
            setFormData({
              name: data.bio.name || "",
              title: data.bio.title || "",
              description: data.bio.description || "",
              image: data.bio.image || "",
              resume: data.bio.resume || "",
            });
          }
        }
      } catch (err) {
        console.error("Error fetching bio:", err);
        setError("Failed to load bio information");
      } finally {
        setLoading(false);
      }
    };
    
    fetchBio();
  }, []);
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };
  
  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    
    try {
      setSubmitting(true);
      setError(null);
      setSuccess(null);
      
      const response = await fetch("/api/v1/admin/bio", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });
      
      const data = await response.json();
      
      if (data.success) {
        setSuccess("Bio information saved successfully!");
        router.refresh();
      } else {
        setError(data.error || "Failed to save bio information");
      }
    } catch (err) {
      console.error("Error saving bio:", err);
      setError("An error occurred while saving");
    } finally {
      setSubmitting(false);
    }
  };
  
  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || e.target.files.length === 0) return;
    
    const file = e.target.files[0];
    const formData = new FormData();
    formData.append("file", file);
    
    try {
      setLoading(true);
      const response = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });
      
      const data = await response.json();
      
      if (data.url) {
        setFormData((prev) => ({ ...prev, image: data.url }));
      }
    } catch (err) {
      console.error("Error uploading image:", err);
      setError("Failed to upload image");
    } finally {
      setLoading(false);
    }
  };
  
  const handleResumeUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || e.target.files.length === 0) return;
    
    const file = e.target.files[0];
    const formData = new FormData();
    formData.append("file", file);
    
    try {
      setLoading(true);
      const response = await fetch("/api/upload/resume", {
        method: "POST",
        body: formData,
      });
      
      const data = await response.json();
      
      if (data.url) {
        setFormData((prev) => ({ ...prev, resume: data.url }));
      }
    } catch (err) {
      console.error("Error uploading resume:", err);
      setError("Failed to upload resume");
    } finally {
      setLoading(false);
    }
  };
  
  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="w-8 h-8 animate-spin" />
      </div>
    );
  }
  
  return (
    <div className="container mx-auto py-10 px-4">
      <h1 className="text-3xl font-bold mb-6">Manage Bio Information</h1>
      
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}
      
      {success && (
        <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mb-4">
          {success}
        </div>
      )}
      
      <form onSubmit={handleSubmit} className="space-y-6 max-w-2xl">
        <div>
          <label htmlFor="name" className="block text-sm font-medium mb-1">
            Name
          </label>
          <Input
            id="name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            required
          />
        </div>
        
        <div>
          <label htmlFor="title" className="block text-sm font-medium mb-1">
            Title
          </label>
          <Input
            id="title"
            name="title"
            value={formData.title}
            onChange={handleChange}
            required
          />
        </div>
        
        <div>
          <label htmlFor="description" className="block text-sm font-medium mb-1">
            Description
          </label>
          <Textarea
            id="description"
            name="description"
            value={formData.description}
            onChange={handleChange}
            rows={5}
            required
          />
        </div>
        
        <div>
          <label htmlFor="image" className="block text-sm font-medium mb-1">
            Profile Image URL
          </label>
          <div className="flex gap-4">
            <Input
              id="image"
              name="image"
              value={formData.image}
              onChange={handleChange}
              required
            />
            <Input
              type="file"
              accept="image/*"
              onChange={handleImageUpload}
              className="max-w-xs"
            />
          </div>
          {formData.image && (
            <div className="mt-2">
              <img
                src={formData.image}
                alt="Profile Preview"
                className="w-32 h-32 object-cover rounded-lg"
              />
            </div>
          )}
        </div>
        
        <div>
          <label htmlFor="resume" className="block text-sm font-medium mb-1">
            Resume URL
          </label>
          <div className="flex gap-4">
            <Input
              id="resume"
              name="resume"
              value={formData.resume}
              onChange={handleChange}
            />
            <Input
              type="file"
              accept=".pdf,.doc,.docx"
              onChange={handleResumeUpload}
              className="max-w-xs"
            />
          </div>
          {formData.resume && (
            <div className="mt-2">
              <a
                href={formData.resume}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-500 hover:underline"
              >
                View Resume
              </a>
            </div>
          )}
        </div>
        
        <Button type="submit" disabled={submitting}>
          {submitting ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Saving...
            </>
          ) : (
            "Save Bio Information"
          )}
        </Button>
      </form>
    </div>
  );
} 