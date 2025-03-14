"use client";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { ArrowRight, ExternalLink, Github } from "lucide-react";
import { usePortfolio } from "@/context/PortfolioContext";
import Link from "next/link";

export default function ProjectsSection() {
    const { portfolioData, loading } = usePortfolio();
    
    // Fallback projects data
    const fallbackProjects = [
        {
          id: 1,
          title: "E-Commerce Redesign",
          category: "UX/UI Design",
          image: "https://images.unsplash.com/photo-1531403009284-440f080d1e12?q=80&w=2070&auto=format&fit=crop",
        },
        {
          id: 2,
          title: "Finance Dashboard",
          category: "Web Application",
          image: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?q=80&w=2070&auto=format&fit=crop",
        },
        {
          id: 3,
          title: "Travel App",
          category: "Mobile Design",
          image: "https://images.unsplash.com/photo-1551503766-ac63dfa6401c?q=80&w=2070&auto=format&fit=crop",
        },
    ];
    
    // Use projects data from API if available, otherwise use fallback
    const allProjects = portfolioData?.projects?.length ? portfolioData.projects : fallbackProjects;
    
    // Get only the latest 3 projects for the home page
    const featuredProjects = allProjects.slice(0, 3);
    
    // Check if there are more projects than what we're showing
    const hasMoreProjects = allProjects.length > 3;
    
    if (loading) {
        return (
            <section id="projects" className="space-y-8">
                <div className="flex justify-between items-center">
                    <h2 className="text-3xl font-mono font-bold">Featured Projects</h2>
                    <div className="w-24 h-10 bg-gray-700 rounded animate-pulse"></div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {[1, 2, 3].map((item) => (
                        <div key={item} className="aspect-[4/5] rounded-xl bg-gray-700 animate-pulse"></div>
                    ))}
                </div>
            </section>
        );
    }
    
    return (
        <section id="projects" className="space-y-8">
            <div className="flex justify-between items-center">
                <h2 className="text-3xl font-mono font-bold">Featured Projects</h2>
                {hasMoreProjects && (
                    <Link href="/all-projects">
                        <Button variant="ghost" className="group">
                            View All
                            <ArrowRight className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform" />
                        </Button>
                    </Link>
                )}
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {featuredProjects.map((project: any) => (
                    <div key={project._id || project.id} className="group relative aspect-[4/5] rounded-xl overflow-hidden cursor-pointer">
                        <Image
                            src={project.image || "/placeholder.svg"}
                            alt={project.title}
                            fill
                            className="object-cover transition-transform duration-500 group-hover:scale-110"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-6">
                            <p className="text-blue-400 text-sm font-medium">{project.category}</p>
                            <h3 className="text-xl font-bold mt-1">{project.title}</h3>
                            <p className="text-gray-300 text-sm mt-2 line-clamp-3">
                                {project.descrition || "No description available"}
                            </p>
                            <div className="flex gap-3 mt-4">
                                {project.github && (
                                    <a href={project.github} target="_blank" rel="noopener noreferrer">
                                        <Button variant="ghost" size="sm" className="p-2 h-8 w-8 rounded-full">
                                            <Github className="w-4 h-4" />
                                        </Button>
                                    </a>
                                )}
                                {project.live && (
                                    <a href={project.live} target="_blank" rel="noopener noreferrer">
                                        <Button variant="ghost" size="sm" className="p-2 h-8 w-8 rounded-full">
                                            <ExternalLink className="w-4 h-4" />
                                        </Button>
                                    </a>
                                )}
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </section>
    );
} 