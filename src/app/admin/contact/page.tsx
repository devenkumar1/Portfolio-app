"use client";

import { useState, useEffect, FormEvent } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useRouter } from "next/navigation";
import { Loader2 } from "lucide-react";

export default function ContactAdmin() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  
  const [formData, setFormData] = useState({
    email: "",
    phone: "",
    address: "",
    github: "",
    linkedin: "",
    twitter: "",
    instagram: "",
  });
  
  // Fetch existing contact data
  useEffect(() => {
    const fetchContact = async () => {
      try {
        setLoading(true);
        const response = await fetch("/api/v1/admin/contact");
        
        if (response.ok) {
          const data = await response.json();
          if (data.success && data.contact) {
            setFormData({
              email: data.contact.email || "",
              phone: data.contact.phone || "",
              address: data.contact.address || "",
              github: data.contact.github || "",
              linkedin: data.contact.linkedin || "",
              twitter: data.contact.twitter || "",
              instagram: data.contact.instagram || "",
            });
          }
        }
      } catch (err) {
        console.error("Error fetching contact:", err);
        setError("Failed to load contact information");
      } finally {
        setLoading(false);
      }
    };
    
    fetchContact();
  }, []);
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };
  
  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    
    try {
      setSubmitting(true);
      setError(null);
      setSuccess(null);
      
      const response = await fetch("/api/v1/admin/contact", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });
      
      const data = await response.json();
      
      if (data.success) {
        setSuccess("Contact information saved successfully!");
        router.refresh();
      } else {
        setError(data.error || "Failed to save contact information");
      }
    } catch (err) {
      console.error("Error saving contact:", err);
      setError("An error occurred while saving");
    } finally {
      setSubmitting(false);
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
      <h1 className="text-3xl font-bold mb-6">Manage Contact Information</h1>
      
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
          <label htmlFor="email" className="block text-sm font-medium mb-1">
            Email *
          </label>
          <Input
            id="email"
            name="email"
            type="email"
            value={formData.email}
            onChange={handleChange}
            required
          />
        </div>
        
        <div>
          <label htmlFor="phone" className="block text-sm font-medium mb-1">
            Phone
          </label>
          <Input
            id="phone"
            name="phone"
            value={formData.phone}
            onChange={handleChange}
          />
        </div>
        
        <div>
          <label htmlFor="address" className="block text-sm font-medium mb-1">
            Address
          </label>
          <Input
            id="address"
            name="address"
            value={formData.address}
            onChange={handleChange}
          />
        </div>
        
        <div>
          <label htmlFor="github" className="block text-sm font-medium mb-1">
            GitHub URL
          </label>
          <Input
            id="github"
            name="github"
            value={formData.github}
            onChange={handleChange}
            placeholder="https://github.com/yourusername"
          />
        </div>
        
        <div>
          <label htmlFor="linkedin" className="block text-sm font-medium mb-1">
            LinkedIn URL
          </label>
          <Input
            id="linkedin"
            name="linkedin"
            value={formData.linkedin}
            onChange={handleChange}
            placeholder="https://linkedin.com/in/yourusername"
          />
        </div>
        
        <div>
          <label htmlFor="twitter" className="block text-sm font-medium mb-1">
            Twitter URL
          </label>
          <Input
            id="twitter"
            name="twitter"
            value={formData.twitter}
            onChange={handleChange}
            placeholder="https://twitter.com/yourusername"
          />
        </div>
        
        <div>
          <label htmlFor="instagram" className="block text-sm font-medium mb-1">
            Instagram URL
          </label>
          <Input
            id="instagram"
            name="instagram"
            value={formData.instagram}
            onChange={handleChange}
            placeholder="https://instagram.com/yourusername"
          />
        </div>
        
        <Button type="submit" disabled={submitting}>
          {submitting ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Saving...
            </>
          ) : (
            "Save Contact Information"
          )}
        </Button>
      </form>
    </div>
  );
} 