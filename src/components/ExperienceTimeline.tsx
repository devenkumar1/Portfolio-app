"use client";

import { usePortfolio } from "@/context/PortfolioContext";
import { Briefcase, Calendar } from "lucide-react";

export default function ExperienceTimeline() {
  const { portfolioData, loading } = usePortfolio();

  if (loading) {
    return (
      <div className="space-y-8 animate-pulse">
        <h2 className="text-3xl font-bold">Work Experience</h2>
        <div className="space-y-8">
          {[1, 2, 3].map((i) => (
            <div key={i} className="flex gap-4">
              <div className="w-12 h-12 bg-gray-700 rounded-full"></div>
              <div className="flex-1 space-y-2">
                <div className="h-6 bg-gray-700 rounded w-3/4"></div>
                <div className="h-4 bg-gray-700 rounded w-1/2"></div>
                <div className="h-4 bg-gray-700 rounded w-1/4"></div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  // Sort experiences in descending order based on start year
  const experiences = [...(portfolioData?.experiences || [])].sort((a, b) => {
    const startA = parseInt(a.start);
    const startB = parseInt(b.start);
    return startB - startA;
  });

  return (
    <div className="space-y-8" id="experience">
      <h2 className="text-3xl font-bold">Work Experience</h2>
      
      {experiences.length === 0 ? (
        <p className="text-gray-400">No experience entries found.</p>
      ) : (
        <div className="relative space-y-8">
          {/* Vertical line */}
          <div className="absolute left-6 top-0 bottom-0 w-0.5 bg-gradient-to-b from-blue-500 to-purple-600"></div>
          
          {experiences.map((experience: any, index: number) => (
            <div key={experience._id} className="relative flex gap-6">
              {/* Timeline dot */}
              <div className="absolute left-0 w-12 h-12 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center shadow-lg">
                <Briefcase className="w-6 h-6 text-white" />
              </div>
              
              {/* Content */}
              <div className="ml-16 bg-gray-800/50 rounded-lg p-6 flex-1 backdrop-blur-sm border border-gray-700/50 hover:border-blue-500/50 transition-colors">
                <h3 className="text-xl font-semibold text-white">{experience.position}</h3>
                <p className="text-gray-300 mt-1">{experience.company}</p>
                <div className="flex items-center gap-2 text-gray-400 mt-2">
                  <Calendar className="w-4 h-4" />
                  <span>{experience.start} - {experience.end}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
} 