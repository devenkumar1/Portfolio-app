"use client";

import { GraduationCap, Calendar } from "lucide-react";
import { useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";

interface EducationTimelineProps {
  data: Array<{
    _id: string;
    course: string;
    start: string;
    end: string;
    percentage: number;
  }>;
}

export default function EducationTimeline({ data }: EducationTimelineProps) {
  const timelineRef = useRef<HTMLDivElement>(null);
  
  const educations = [...(data || [])].sort((a, b) => {
    const startA = parseInt(a.start);
    const startB = parseInt(b.start);
    return startB - startA;
  });

  useGSAP(() => {
    if (!timelineRef.current || educations.length === 0) return;
    gsap.registerPlugin(ScrollTrigger);
    const items = timelineRef.current.querySelectorAll(".education-item");
    if (items.length === 0) return;
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
  }, [educations]);

  return (
    <div ref={timelineRef} className="space-y-8" id="education">
      <h2 className="text-3xl font-bold">Education</h2>
      
      {educations.length === 0 ? (
        <p className="text-gray-400">No education entries found.</p>
      ) : (
        <div className="relative space-y-8">
          {/* Vertical line */}
          <div className="absolute left-6 top-0 bottom-0 w-0.5 bg-gradient-to-b from-blue-500 to-purple-600"></div>
          
          {educations.map((education) => (
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
