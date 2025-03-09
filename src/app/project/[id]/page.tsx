"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { ArrowLeft, ExternalLink, Github, Calendar, Tag } from "lucide-react";
import { usePortfolio } from "@/context/PortfolioContext";
import Link from "next/link";
import { useParams } from "next/navigation";

export default function ProjectDetailPage() {
  const { id } = useParams();
  const { portfolioData, loading } = usePortfolio();
  const [project, setProject] = useState<any>(null);
  
  useEffect(() => {
    if (portfolioData?.projects) {
      const foundProject = portfolioData.projects.find((p: any) => p._id === id);
      setProject(foundProject || null);
    }
  }, [portfolioData, id]);
  
  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-950 via-gray-900 to-gray-950 text-white">
        <div className="container mx-auto px-6 pt-32 pb-20">
          <div className="flex items-center mb-8">
            <div className="w-10 h-10 bg-gray-700 rounded-full animate-pulse"></div>
            <div className="h-8 w-40 bg-gray-700 rounded ml-4 animate-pulse"></div>
          </div>
          
          <div className="w-full h-[400px] rounded-xl bg-gray-700 animate-pulse mb-8"></div>
          
          <div className="space-y-4">
            <div className="h-8 w-3/4 bg-gray-700 rounded animate-pulse"></div>
            <div className="h-4 w-1/4 bg-gray-700 rounded animate-pulse"></div>
            <div className="h-4 w-full bg-gray-700 rounded animate-pulse"></div>
            <div className="h-4 w-full bg-gray-700 rounded animate-pulse"></div>
            <div className="h-4 w-3/4 bg-gray-700 rounded animate-pulse"></div>
          </div>
        </div>
      </div>
    );
  }
  
  if (!project) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-950 via-gray-900 to-gray-950 text-white">
        <div className="container mx-auto px-6 pt-32 pb-20">
          <div className="flex items-center mb-8">
            <Link href="/all-projects">
              <Button variant="ghost" size="icon" className="mr-4">
                <ArrowLeft className="w-5 h-5" />
              </Button>
            </Link>
            <h1 className="text-3xl font-bold">Project Not Found</h1>
          </div>
          
          <div className="text-center py-12">
            <p className="text-gray-400">The project you're looking for doesn't exist or has been removed.</p>
            <Link href="/all-projects">
              <Button className="mt-4">
                Back to All Projects
              </Button>
            </Link>
          </div>
        </div>
      </div>
    );
  }
  
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-950 via-gray-900 to-gray-950 text-white">
      <div className="container mx-auto px-6 pt-32 pb-20">
        {/* Back button and title */}
        <div className="flex items-center mb-8">
          <Link href="/all-projects">
            <Button variant="ghost" size="icon" className="mr-4">
              <ArrowLeft className="w-5 h-5" />
            </Button>
          </Link>
          <h1 className="text-3xl font-bold">{project.title}</h1>
        </div>
        
        {/* Project image */}
        <div className="relative w-full h-[400px] md:h-[500px] rounded-xl overflow-hidden mb-8">
          <Image
            src={project.image || "/placeholder.svg"}
            alt={project.title}
            fill
            className="object-cover"
          />
        </div>
        
        {/* Project details */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="md:col-span-2">
            <h2 className="text-2xl font-bold mb-4">About this project</h2>
            <p className="text-gray-300 text-lg leading-relaxed mb-6">
              {project.descrition || "No description available"}
            </p>
            
            <div className="flex flex-wrap gap-4 mt-8">
              {project.github && (
                <a href={project.github} target="_blank" rel="noopener noreferrer">
                  <Button className="flex items-center gap-2">
                    <Github className="w-4 h-4" />
                    View Code
                  </Button>
                </a>
              )}
              
              {project.live && (
                <a href={project.live} target="_blank" rel="noopener noreferrer">
                  <Button variant="outline" className="flex items-center gap-2">
                    <ExternalLink className="w-4 h-4" />
                    Live Demo
                  </Button>
                </a>
              )}
            </div>
          </div>
          
          <div className="bg-gray-800/50 rounded-xl p-6 h-fit">
            <h3 className="text-xl font-bold mb-4">Project Details</h3>
            
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <Tag className="w-5 h-5 text-blue-400" />
                <div>
                  <p className="text-sm text-gray-400">Category</p>
                  <p className="font-medium">{project.category}</p>
                </div>
              </div>
              
              <div className="flex items-center gap-3">
                <Calendar className="w-5 h-5 text-blue-400" />
                <div>
                  <p className="text-sm text-gray-400">Date</p>
                  <p className="font-medium">
                    {project.timestamp 
                      ? new Date(project.timestamp).toLocaleDateString('en-US', {
                          year: 'numeric',
                          month: 'long',
                        })
                      : 'Not specified'}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 