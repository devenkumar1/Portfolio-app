import Image from "next/image";
import { Button } from "@/components/ui/button";
import { ArrowLeft, ExternalLink, Github, Calendar, Tag } from "lucide-react";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getPortfolioData } from "@/lib/portfolio-data";
import type { Metadata } from "next";

interface ProjectPageProps {
  params: {
    id: string;
  };
}

export async function generateMetadata({ params }: ProjectPageProps): Promise<Metadata> {
  const portfolioData = await getPortfolioData();
  const project = portfolioData?.projects?.find((p: any) => p._id === params.id);
  
  if (!project) {
    return {
      title: "Project Not Found - Portfolio",
      description: "The requested project could not be found.",
    };
  }
  
  return {
    title: `${project.title} - Project Details | Deven Kumar Portfolio`,
    description: project.descrition || `View details about ${project.title} project by Deven Kumar`,
    openGraph: {
      title: project.title,
      description: project.descrition,
      images: project.image ? [{ url: project.image }] : [],
      type: "article",
    },
    twitter: {
      card: "summary_large_image",
      title: project.title,
      description: project.descrition,
      images: project.image ? [project.image] : [],
    },
  };
}

export default async function ProjectDetailPage({ params }: ProjectPageProps) {
  const portfolioData = await getPortfolioData();
  const project = portfolioData?.projects?.find((p: any) => p._id === params.id);
  
  if (!project) {
    notFound();
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