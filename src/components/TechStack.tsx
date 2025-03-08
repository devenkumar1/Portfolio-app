"use client";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import { ArrowRight } from "lucide-react";
import { usePortfolio } from "@/context/PortfolioContext";

function TechStack() {
    const { portfolioData, loading } = usePortfolio();
    
    // Fallback tech stack data
    const fallbackTechStack = [
        { name: "Figma", icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/figma/figma-original.svg" },
        { name: "React", icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/react/react-original.svg" },
        {
          name: "TypeScript",
          icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/typescript/typescript-original.svg",
        },
        { name: "Tailwind", icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/tailwindcss/tailwindcss-plain.svg" },
        { name: "Next.js", icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/nextjs/nextjs-original.svg" },
    ];
    
    // Use skills data from API if available, otherwise use fallback
    const techStack = portfolioData?.skills?.length ? portfolioData.skills : fallbackTechStack;
    
    if (loading) {
        return (
            <section id="stack" className="rounded-xl p-8 bg-gradient-to-br from-blue-600/20 to-purple-600/20 border border-blue-500/20 backdrop-blur-sm">
                <div className="flex justify-between items-center mb-8">
                    <h2 className="text-3xl font-mono font-bold">My Tech Stack</h2>
                    <div className="w-24 h-10 bg-gray-700 rounded animate-pulse"></div>
                </div>
                <div className="flex flex-wrap gap-6 justify-center">
                    {[1, 2, 3, 4, 5].map((item) => (
                        <div key={item} className="flex flex-col items-center gap-2">
                            <div className="w-16 h-16 bg-gray-700 rounded-xl animate-pulse"></div>
                            <div className="w-16 h-4 bg-gray-700 rounded animate-pulse"></div>
                        </div>
                    ))}
                </div>
            </section>
        );
    }

    return (
        <section id="stack" className="rounded-xl p-8 bg-gradient-to-br from-blue-600/20 to-purple-600/20 border border-blue-500/20 backdrop-blur-sm">
            <div className="flex justify-between items-center mb-8">
                <h2 className="text-3xl font-mono font-bold">My Tech Stack</h2>
                <Button variant="ghost" className="text-white group">
                    Explore <ArrowRight className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </Button>
            </div>
            <div className="flex flex-wrap gap-6 justify-center">
                {techStack.map((tech: any) => (
                    <div key={tech._id || tech.name} className="flex flex-col items-center gap-2 group">
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