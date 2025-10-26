import Image from "next/image";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { getPortfolioData } from "@/lib/portfolio-data";
import AllProjectsClient from "./AllProjectsClient";
import { Metadata } from 'next';

export async function generateMetadata(): Promise<Metadata> {
  const data = await getPortfolioData();
  const projectCount = data.projects?.length || 0;
  
  return {
    title: `All Projects (${projectCount}) - Deven Kumar Chaurasia Portfolio`,
    description: `Browse all ${projectCount} projects by Deven Kumar Chaurasia. Full Stack Developer specializing in React, Next.js, Node.js and modern web development.`,
    keywords: [
      'Deven Kumar projects',
      'Deven Kumar Chaurasia projects',
      'web development projects',
      'React projects',
      'Next.js projects',
      'portfolio projects',
      'developer portfolio',
    ],
  };
}

export default async function AllProjectsPage() {
  const portfolioData = await getPortfolioData();
  const allProjects = portfolioData?.projects || [];
  
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-950 via-gray-900 to-gray-950 text-white">
      <div className="container mx-auto px-6 pt-32 pb-20">
        {/* Back button and title */}
        <div className="flex items-center mb-8">
          <Link href="/">
            <Button variant="ghost" size="icon" className="mr-4">
              <ArrowLeft className="w-5 h-5" />
            </Button>
          </Link>
          <h1 className="text-3xl font-bold">All Projects</h1>
        </div>
        
        <AllProjectsClient projects={allProjects} />
      </div>
    </div>
  );
} 