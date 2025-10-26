"use client";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import { ArrowRight } from "lucide-react";
import { useRef } from "react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

interface TechStackProps {
  data: Array<{
    _id: string;
    name: string;
    icon: string;
  }>;
}

function TechStack({ data }: TechStackProps) {
    const stackRef = useRef<HTMLDivElement>(null);
    
    // Fallback tech stack data
    const fallbackTechStack = [
        { _id: '1', name: "Figma", icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/figma/figma-original.svg" },
        { _id: '2', name: "React", icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/react/react-original.svg" },
        {
          _id: '3',
          name: "TypeScript",
          icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/typescript/typescript-original.svg",
        },
        { _id: '4', name: "Tailwind", icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/tailwindcss/tailwindcss-plain.svg" },
        { _id: '5', name: "Next.js", icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/nextjs/nextjs-original.svg" },
    ];
    
    // Use skills data from API if available, otherwise use fallback
    const techStack = data?.length ? data : fallbackTechStack;
    
    useGSAP(() => {
        if (!stackRef.current) return;
        gsap.registerPlugin(ScrollTrigger);
        const icons = stackRef.current.querySelectorAll('.tech-icon');
        if (icons.length === 0) return; // Check if icons exist before animating
        gsap.fromTo(
            icons,
            { y: -100, opacity: 0, scale: 0.7 },
            {
                y: 0,
                opacity: 1,
                scale: 1,
                duration: 0.7,
                ease: "bounce.out",
                stagger: 0.15,
                scrollTrigger: {
                    trigger: stackRef.current,
                    start: "top 80%",
                    toggleActions: "restart none none none",
                },
            }
        );
        return () => {
            ScrollTrigger.getAll().forEach((st) => st.kill());
        };
    }, [techStack]);

    return (
        <section id="stack" ref={stackRef} className="rounded-xl p-8 bg-gradient-to-br from-blue-600/20 to-purple-600/20 border border-blue-500/20 backdrop-blur-sm">
            <div className="flex justify-between items-center mb-8">
                <h2 className="text-3xl font-mono font-bold">My Tech Stack</h2>
                <Button variant="ghost" className="text-white group">
                    Explore <ArrowRight className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </Button>
            </div>
            <div className="flex flex-wrap gap-6 justify-center">
                {techStack.map((tech: any) => (
                    <div key={tech._id || tech.name} className="tech-icon flex flex-col items-center gap-2 group">
                        <div className="w-16 h-16 bg-white/10 rounded-xl flex items-center justify-center p-3 transition-all duration-300 group-hover:bg-white/20 group-hover:shadow-lg group-hover:shadow-blue-500/20">
                            <Image src={tech.icon || "/placeholder.svg"} alt={tech.name} width={40} height={40} />
                        </div>
                        <span className="text-sm text-gray-400 group-hover:text-white transition-colors">{tech.name}</span>
                    </div>
                ))}
            </div>
        </section>
    );
}

export default TechStack;