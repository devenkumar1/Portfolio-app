"use client";
import { useState } from "react";
import { usePortfolio } from "@/context/PortfolioContext";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Download } from "lucide-react";
import Link from "next/link";

export default function ResumePage() {
  const { portfolioData, loading } = usePortfolio();
  
  const resumeUrl = portfolioData?.bio?.resume || "";
  
  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-950 via-gray-900 to-gray-950 text-blue-500 flex items-center justify-center">
        <div className="animate-pulse bg-gray-800 rounded-lg w-3/4 h-[80vh]"></div>
      </div>
    );
  }
  
  if (!resumeUrl) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-950 via-gray-900 to-gray-950 text-blue-500 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Resume Not Available</h1>
          <p className="text-gray-400 mb-6">No resume has been uploaded yet.</p>
          <Link href="/">
            <Button variant="outline" className="flex items-center gap-2">
              <ArrowLeft className="w-4 h-4" />
              Back to Home
            </Button>
          </Link>
        </div>
      </div>
    );
  }
  
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-950 via-gray-900 to-gray-950 text-blue-500 w-full  flex justify-center items-center ">
      <div className="container mx-auto px-6 py-8">
        <div className="flex items-center justify-between mb-6">
          <Link href="/">
            <Button variant="outline" className="flex items-center gap-2">
              <ArrowLeft className="w-4 h-4" />
              Back to Home
            </Button>
          </Link>
        </div>
        
        <div className="bg-white rounded-lg shadow-lg overflow-hidden w-full h-[80vh]">
          <iframe 
            src={`${resumeUrl}#view=FitH&navpanes=0&scrollbar=0`} 
            className="w-full h-full" 
            title="Resume"
             sandbox="allow-same-origin allow-scripts"
          />
        </div>
      </div>
    </div>
  );
}
