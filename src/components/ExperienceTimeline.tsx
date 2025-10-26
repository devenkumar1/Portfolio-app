"use client";

import { Briefcase, Calendar } from "lucide-react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useRef } from "react";

interface ExperienceTimelineProps {
  data: Array<{
    _id: string;
    company: string;
    position: string;
    start: string;
    end: string;
  }>;
}

export default function ExperienceTimeline({ data }: ExperienceTimelineProps) {
  const timelineRef = useRef<HTMLDivElement>(null);

  // Sort experiences in descending order based on start year
  const experiences = [...(data || [])].sort((a, b) => {
    const startA = parseInt(a.start);
    const startB = parseInt(b.start);
    return startB - startA;
  });

  useGSAP(() => {
    if (!timelineRef.current || experiences.length === 0) return;
    gsap.registerPlugin(ScrollTrigger);
    const items = timelineRef.current.querySelectorAll('.experience-item');
    if (items.length === 0) return;
    gsap.fromTo(
      items,
      { opacity: 0, x: -80, rotateY: 30 },
      {
        opacity: 1,
        x: 0,
        rotateY: 0,
        duration: 0.8,
        ease: "power3.out",
        stagger: 0.18,
        scrollTrigger: {
          trigger: timelineRef.current,
          start: "top 80%",
          toggleActions: "restart none none none",
        },
      }
    );
    return () => {
      ScrollTrigger.getAll().forEach((st) => st.kill());
    };
  }, [experiences]);

  return (
    <div className="space-y-8" id="experience" ref={timelineRef}>
      <h2 className="text-3xl font-bold">Work Experience</h2>
      
      {experiences.length === 0 ? (
        <p className="text-gray-400">No experience entries found.</p>
      ) : (
        <div className="relative space-y-8">
          {/* Vertical line */}
          <div className="absolute left-6 top-0 bottom-0 w-0.5 bg-gradient-to-b from-blue-500 to-purple-600"></div>
          
          {experiences.map((experience) => (
            <div key={experience._id} className="experience-item relative flex gap-6">
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