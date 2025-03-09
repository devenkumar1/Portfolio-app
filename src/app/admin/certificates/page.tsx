"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Loader2, AlertCircle, CheckCircle, Pencil, Trash2, Plus } from "lucide-react";
import { useRouter } from "next/navigation";
import { usePortfolio } from "@/context/PortfolioContext";

interface CertificateFormData {
  id?: string;
  title: string;
  platform: string;
  timestamp: string;
}

export default function CertificatesAdmin() {
  const router = useRouter();
  const { portfolioData, loading: contextLoading, refreshData } = usePortfolio();
  
  const [certificates, setCertificates] = useState<any[]>([]);
  const [formData, setFormData] = useState<CertificateFormData>({
    title: "",
    platform: "",
    timestamp: new Date().toISOString().split('T')[0],
  });
  
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  
  // Fetch certificates when component mounts or portfolioData changes
  useEffect(() => {
    if (portfolioData?.certificates) {
      setCertificates(portfolioData.certificates);
    }
  }, [portfolioData]);
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate required fields
    if (!formData.title || !formData.platform || !formData.timestamp) {
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
      
      const response = await fetch("/api/v1/admin/certificate", {
        method,
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(body),
      });
      
      const data = await response.json();
      
      if (data.success) {
        setSuccess(`Certificate ${isEditing ? 'updated' : 'created'} successfully!`);
        // Reset form
        setFormData({
          title: "",
          platform: "",
          timestamp: new Date().toISOString().split('T')[0],
        });
        setIsEditing(false);
        // Refresh the data in the context
        refreshData();
      } else {
        setError(data.error || `Failed to ${isEditing ? 'update' : 'create'} certificate`);
      }
    } catch (err) {
      console.error(`Error ${isEditing ? 'updating' : 'creating'} certificate:`, err);
      setError(`An error occurred while ${isEditing ? 'updating' : 'creating'} the certificate`);
    } finally {
      setSubmitting(false);
    }
  };
  
  const handleEdit = (certificate: any) => {
    setFormData({
      id: certificate._id,
      title: certificate.title || "",
      platform: certificate.platform || "",
      timestamp: certificate.timestamp?.split('T')[0] || new Date().toISOString().split('T')[0],
    });
    setIsEditing(true);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };
  
  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this certificate?")) {
      return;
    }
    
    try {
      setLoading(true);
      setError(null);
      setSuccess(null);
      
      const response = await fetch(`/api/v1/admin/certificate?id=${id}`, {
        method: "DELETE",
      });
      
      const data = await response.json();
      
      if (data.success) {
        setSuccess("Certificate deleted successfully!");
        // Refresh the data in the context
        refreshData();
      } else {
        setError(data.error || "Failed to delete certificate");
      }
    } catch (err) {
      console.error("Error deleting certificate:", err);
      setError("An error occurred while deleting the certificate");
    } finally {
      setLoading(false);
    }
  };
  
  const handleCancel = () => {
    setFormData({
      title: "",
      platform: "",
      timestamp: new Date().toISOString().split('T')[0],
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
      <h1 className="text-2xl font-bold mb-6">{isEditing ? 'Edit' : 'Add'} Certificate</h1>
      
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
              Certificate Title *
            </label>
            <Input
              id="title"
              name="title"
              value={formData.title}
              onChange={handleChange}
              placeholder="e.g. Advanced Web Development"
              required
              className="w-full"
            />
          </div>
          
          <div>
            <label htmlFor="platform" className="block text-sm font-medium text-gray-700 mb-1">
              Platform *
            </label>
            <Input
              id="platform"
              name="platform"
              value={formData.platform}
              onChange={handleChange}
              placeholder="e.g. Coursera, Udemy"
              required
              className="w-full"
            />
          </div>
          
          <div>
            <label htmlFor="timestamp" className="block text-sm font-medium text-gray-700 mb-1">
              Date *
            </label>
            <Input
              type="date"
              id="timestamp"
              name="timestamp"
              value={formData.timestamp}
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
                  {isEditing ? 'Update Certificate' : 'Add Certificate'}
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
      
      <h2 className="text-xl font-bold mb-4">Existing Certificates</h2>
      
      {certificates.length === 0 ? (
        <div className="bg-white p-6 rounded-lg shadow-md text-center">
          <p className="text-gray-500">No certificates found. Add your first certificate above.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {certificates.map((certificate) => (
            <div key={certificate._id} className="bg-white rounded-lg shadow-md p-4">
              <h3 className="text-lg font-medium mb-2">{certificate.title}</h3>
              <p className="text-gray-600 text-sm mb-2">{certificate.platform}</p>
              <p className="text-gray-500 text-sm mb-4">
                {new Date(certificate.timestamp).toLocaleDateString()}
              </p>
              <div className="flex gap-2">
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={() => handleEdit(certificate)}
                  className="flex items-center gap-1"
                >
                  <Pencil className="w-3 h-3" />
                  Edit
                </Button>
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={() => handleDelete(certificate._id)}
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