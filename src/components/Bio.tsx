"use client";

import { usePortfolio } from "@/context/PortfolioContext";

const Bio = () => {
  const { portfolioData, loading } = usePortfolio();
  
  if (loading) {
    return (
      <div className="space-y-4 font-inter animate-pulse">
        <h1 className="text-3xl font-bold">About Me</h1>
        <div className="h-6 bg-gray-700 rounded w-3/4 mb-2"></div>
        <div className="h-6 bg-gray-700 rounded w-full mb-2"></div>
        <div className="h-6 bg-gray-700 rounded w-5/6"></div>
      </div>
    );
  }

  // Use bio data if available, otherwise use fallback content
  const bioDescription = portfolioData?.bio?.description || 
    "Full Stack Web Developer specializing in building exceptional digital experiences. With expertise in Next JS, React, Node.js, and modern web technologies, I craft scalable solutions that combine clean code with intuitive design.";

  return (
    <div className="space-y-4 font-inter">
      <h1 className="text-3xl font-bold">About Me</h1>
      <p className="text-gray-300 text-lg leading-relaxed tracking-wide">
        {bioDescription}
      </p>
      <p className="text-gray-300/80 text-lg leading-relaxed tracking-wide">
        Passionate about transforming complex challenges into elegant solutions, I focus on creating high-performance applications that drive business growth and user engagement.
      </p>
    </div>
  );
};

export default Bio;
