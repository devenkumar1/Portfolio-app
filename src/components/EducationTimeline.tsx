"use client";

import { usePortfolio } from "@/context/PortfolioContext";
import { GraduationCap, Calendar } from "lucide-react";
import { useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";

export default function EducationTimeline() {
  const { portfolioData, loading } = usePortfolio();
  const timelineRef = useRef<HTMLDivElement>(null);
  
  const educations = [...(portfolioData?.educations || [])].sort((a, b) => {
    const startA = parseInt(a.start);
    const startB = parseInt(b.start);
    return startB - startA;
  });

  useGSAP(() => {
    if (loading || !timelineRef.current || educations.length === 0) return;
    gsap.registerPlugin(ScrollTrigger);
    const items = timelineRef.current.querySelectorAll(".education-item");
    if (items.length === 0) return; // Fixed: Check if items exist before animating
    items.forEach((item) => {
      gsap.fromTo(
        item,
        { scale: 0.7, opacity: 0, y: 50 },
        {
          scale: 1,
          opacity: 1,
          y: 0,
          duration: 0.7,
          ease: "elastic.out(1, 0.6)",
          scrollTrigger: {
            trigger: item,
            start: "top 80%",
            toggleActions: "restart none none none",
          },
        }
      );
    });
    return () => {
      ScrollTrigger.getAll().forEach((st) => st.kill());
    };
  }, [educations, loading]);

  if (loading) {
    return (
      <div className="space-y-8 animate-pulse">
        <h2 className="text-3xl font-bold">Education</h2>
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

  return (
    <div ref={timelineRef} className="space-y-8" id="education">
      <h2 className="text-3xl font-bold">Education</h2>
      
      {educations.length === 0 ? (
        <p className="text-gray-400">No education entries found.</p>
      ) : (
        <div className="relative space-y-8">
          {/* Vertical line */}
          <div className="absolute left-6 top-0 bottom-0 w-0.5 bg-gradient-to-b from-blue-500 to-purple-600"></div>
          
          {educations.map((education: any, index: number) => (
            <div key={education._id} className="education-item relative flex gap-6">
              {/* Timeline dot */}
              <div className="absolute left-0 w-12 h-12 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center shadow-lg">
                <GraduationCap className="w-6 h-6 text-white" />
              </div>
              
              {/* Content */}
              <div className="ml-16 bg-gray-800/50 rounded-lg p-6 flex-1 backdrop-blur-sm border border-gray-700/50 hover:border-blue-500/50 transition-colors">
                <h3 className="text-xl font-semibold text-white">{education.course}</h3>
                <div className="flex items-center gap-2 text-gray-400 mt-2">
                  <Calendar className="w-4 h-4" />
                  <span>{education.start} - {education.end}</span>
                </div>
                <p className="text-blue-400 mt-2">
                  Percentage/GPA: {education.percentage}%
                </p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
} 
