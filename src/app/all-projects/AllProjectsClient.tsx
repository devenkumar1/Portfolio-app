"use client";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { ExternalLink, Github } from "lucide-react";
import { useState } from "react";

interface Project {
  _id: string;
  title: string;
  category: string;
  descrition: string;
  image: string;
  timestamp: string;
  github: string | null;
  live: string | null;
}

interface AllProjectsClientProps {
  projects: Project[];
}

export default function AllProjectsClient({ projects }: AllProjectsClientProps) {
  const [filter, setFilter] = useState<string>("all");
  
  // Get unique categories
  const categories = ["all", ...new Set(projects.map(p => p.category))];
  
  // Filter projects
  const filteredProjects = filter === "all" 
    ? projects 
    : projects.filter(p => p.category === filter);

  return (
    <>
      {/* Filter buttons */}
      <div className="flex flex-wrap gap-4 mb-8">
        {categories.map((category) => (
          <Button
            key={category}
            variant={filter === category ? "default" : "outline"}
            onClick={() => setFilter(category)}
            className={filter === category ? "bg-gradient-to-r from-blue-500 to-purple-600" : "bg-black text-white"}
          >
            {category.charAt(0).toUpperCase() + category.slice(1)}
          </Button>
        ))}
      </div>

      {/* Projects count */}
      <p className="text-gray-400 mb-6">
        Showing {filteredProjects.length} {filteredProjects.length === 1 ? 'project' : 'projects'}
      </p>

      {/* Projects grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredProjects.map((project) => (
          <div
            key={project._id}
            className="group relative aspect-[4/5] rounded-xl overflow-hidden cursor-pointer bg-gray-800"
          >
            <Image
              src={project.image || "/placeholder.svg"}
              alt={project.title}
              fill
              className="object-cover transition-transform duration-500 group-hover:scale-110"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-6">
              <p className="text-blue-400 text-sm font-medium">{project.category}</p>
              <h3 className="text-xl font-bold mt-1">{project.title}</h3>
              <p className="text-gray-300 text-sm mt-2 line-clamp-3">
                {project.descrition || "No description available"}
              </p>
              <div className="flex gap-3 mt-4">
                {project.github && (
                  <a
                    href={project.github}
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <Button variant="ghost" size="sm" className="p-2 h-8 w-8 rounded-full">
                      <Github className="w-4 h-4" />
                    </Button>
                  </a>
                )}
                {project.live && (
                  <a
                    href={project.live}
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={(e) => e.stopPropagation()}
                  >
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

      {filteredProjects.length === 0 && (
        <div className="text-center py-20">
          <p className="text-gray-400 text-lg">No projects found in this category.</p>
        </div>
      )}
    </>
  );
}
