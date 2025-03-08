"use client";
import { Mail, Phone, MapPin } from "lucide-react";
import { usePortfolio } from "@/context/PortfolioContext";

function ContactInfo() {
  const { portfolioData, loading } = usePortfolio();
  
  // Use contact data if available, otherwise use fallback
  const email = portfolioData?.contact?.email || "tony@example.com";
  const phone = portfolioData?.contact?.phone || "+1 (234) 567-890";
  const address = portfolioData?.contact?.address || "";
  
  if (loading) {
    return (
      <div className="space-y-4 animate-pulse">
        <h2 className="text-xl font-semibold">Let's Connect</h2>
        <div className="flex flex-col space-y-3">
          <div className="h-6 bg-gray-700 rounded w-3/4"></div>
          <div className="h-6 bg-gray-700 rounded w-2/3"></div>
          {address && <div className="h-6 bg-gray-700 rounded w-full"></div>}
        </div>
      </div>
    );
  }
  
  return (
    <div className="space-y-4">
      <h2 className="text-xl font-semibold">Let's Connect</h2>
      <div className="flex flex-col space-y-3">
        <a href={`mailto:${email}`} className="flex items-center gap-3 text-gray-300 hover:text-blue-400 transition-colors">
          <Mail className="w-5 h-5" /> {email}
        </a>
        <a href={`tel:${phone}`} className="flex items-center gap-3 text-gray-300 hover:text-blue-400 transition-colors">
          <Phone className="w-5 h-5" /> {phone}
        </a>
        {address && (
          <div className="flex items-center gap-3 text-gray-300">
            <MapPin className="w-5 h-5" /> {address}
          </div>
        )}
      </div>
    </div>
  );
}

export default ContactInfo;