"use client";

import { useState, useEffect, FormEvent } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Loader2, AlertCircle, CheckCircle, Upload } from "lucide-react";
import { useRouter } from "next/navigation";
import { usePortfolio } from "@/context/PortfolioContext";
import Image from "next/image";

export default function BioAdmin() {
  const router = useRouter();
  const { portfolioData, loading: contextLoading, refreshData } = usePortfolio();
  
  const [formData, setFormData] = useState({
    name: "",
    title: "",
    description: "",
    image: "",
    resume: "",
  });
  
  const [loading, setLoading] = useState(false);
  const [imageLoading, setImageLoading] = useState(false);
  const [resumeLoading, setResumeLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  
  // Fetch existing bio data when component mounts or portfolioData changes
  useEffect(() => {
    if (portfolioData?.bio) {
      setFormData({
        name: portfolioData.bio.name || "",
        title: portfolioData.bio.title || "",
        description: portfolioData.bio.description || "",
        image: portfolioData.bio.image || "",
        resume: portfolioData.bio.resume || "",
      });
    }
  }, [portfolioData]);
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };
  
  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    
    // Validate required fields
    if (!formData.name || !formData.title || !formData.description) {
      setError("Name, title, and description are required");
      return;
    }
    
    // Validate image is uploaded
    if (!formData.image) {
      setError("Please upload a profile image");
      return;
    }
    
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
        // Refresh the data in the context
        refreshData();
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
      setImageLoading(true);
      setError(null);
      
      const response = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });
      
      const data = await response.json();
      
      if (data.url) {
        setFormData((prev) => ({ ...prev, image: data.url }));
        setSuccess("Image uploaded successfully!");
      } else {
        setError("Failed to upload image");
      }
    } catch (err) {
      console.error("Error uploading image:", err);
      setError("An error occurred while uploading the image");
    } finally {
      setImageLoading(false);
    }
  };
  
  const handleResumeUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || e.target.files.length === 0) return;
    
    const file = e.target.files[0];
    const formData = new FormData();
    formData.append("file", file);
    
    try {
      setResumeLoading(true);
      setError(null);
      
      const response = await fetch("/api/upload/resume", {
        method: "POST",
        body: formData,
      });
      
      const data = await response.json();
      
      if (data.url) {
        setFormData((prev) => ({ ...prev, resume: data.url }));
        setSuccess("Resume uploaded successfully!");
      } else {
        setError("Failed to upload resume");
      }
    } catch (err) {
      console.error("Error uploading resume:", err);
      setError("An error occurred while uploading the resume");
    } finally {
      setResumeLoading(false);
    }
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
      <h1 className="text-2xl font-bold mb-6">Manage Bio Information</h1>
      
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
      
      <div className="bg-white p-6 rounded-lg shadow-md">
        <form onSubmit={handleSubmit} className="space-y-6 max-w-2xl">
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
              Name *
            </label>
            <Input
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
              className="w-full"
            />
          </div>
          
          <div>
            <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-1">
              Title *
            </label>
            <Input
              id="title"
              name="title"
              value={formData.title}
              onChange={handleChange}
              placeholder="e.g. Full Stack Developer"
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
              rows={5}
              required
              className="w-full"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Profile Image *
            </label>
            <div className="flex flex-col gap-4">
              <div className="relative">
                <Input
                  type="file"
                  accept="image/*"
                  onChange={handleImageUpload}
                  className="absolute inset-0 opacity-0 cursor-pointer z-10 w-full h-full"
                />
                <Button 
                  type="button" 
                  variant="outline" 
                  className="relative flex items-center gap-2 w-full"
                  disabled={imageLoading}
                >
                  {imageLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Upload className="w-4 h-4" />}
                  {formData.image ? "Change Image" : "Upload Image"}
                </Button>
              </div>
              
              {formData.image && (
                <div className="mt-2">
                  <p className="text-sm text-gray-500 mb-2">Preview:</p>
                  <div className="relative w-32 h-32 overflow-hidden rounded-lg border border-gray-200">
                    <Image
                      src={formData.image}
                      alt="Profile Preview"
                      fill
                      className="object-cover"
                    />
                  </div>
                </div>
              )}
            </div>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Resume (Optional)
            </label>
            <div className="flex flex-col gap-4">
              <div className="relative">
                <Input
                  type="file"
                  accept=".pdf,.doc,.docx"
                  onChange={handleResumeUpload}
                  className="absolute inset-0 opacity-0 cursor-pointer z-10 w-full h-full"
                />
                <Button 
                  type="button" 
                  variant="outline" 
                  className="relative flex items-center gap-2 w-full"
                  disabled={resumeLoading}
                >
                  {resumeLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Upload className="w-4 h-4" />}
                  {formData.resume ? "Change Resume" : "Upload Resume"}
                </Button>
              </div>
              
              {formData.resume && (
                <div className="mt-2">
                  <a
                    href={formData.resume}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-500 hover:underline text-sm flex items-center gap-1"
                  >
                    View Resume
                  </a>
                </div>
              )}
            </div>
          </div>
          
          <Button type="submit" disabled={submitting} className="w-full md:w-auto">
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
    </div>
  );
} 