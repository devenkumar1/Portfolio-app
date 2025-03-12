"use client";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { usePortfolio } from "@/context/PortfolioContext";
import { FaTwitter, FaLinkedinIn, FaGithub, FaInstagram } from "react-icons/fa";

function SocialLinks() {
  const { portfolioData, loading } = usePortfolio();
  
  // Use contact data if available, otherwise use empty strings
  const github = portfolioData?.contact?.github || "";
  const linkedin = portfolioData?.contact?.linkedin || "";
  const twitter = portfolioData?.contact?.twitter || "";
  const instagram = portfolioData?.contact?.instagram || "";
  
  if (loading) {
    return (
      <div className="space-y-4 animate-pulse">
        <h2 className="text-xl font-semibold">Socials</h2>
        <div className="flex gap-4">
          <div className="w-10 h-10 bg-gray-700 rounded-full"></div>
          <div className="w-10 h-10 bg-gray-700 rounded-full"></div>
          <div className="w-10 h-10 bg-gray-700 rounded-full"></div>
        </div>
      </div>
    );
  }
  
  return (
    <div className="space-y-4">
      <h2 className="text-xl font-semibold">Socials</h2>
      <div className="flex gap-4">
        {twitter && (
          <Button variant="outline" size="icon" className="rounded-full border-gray-700 text-gray-300 hover:border-blue-500 hover:bg-blue-500/10 hover:text-blue-500 transition-all">
            <Link href={twitter} target="_blank" aria-label="Twitter">
              <FaTwitter className="w-5 h-5" />
            </Link>
          </Button>
        )}
        
        {linkedin && (
          <Button variant="outline" size="icon" className="rounded-full border-gray-700 text-gray-300 hover:border-blue-600 hover:bg-blue-600/10 hover:text-blue-600 transition-all">
            <Link href={linkedin} target="_blank" aria-label="LinkedIn">
              <FaLinkedinIn className="w-5 h-5" />
            </Link>
          </Button>
        )}
        
        {github && (
          <Button variant="outline" size="icon" className="rounded-full border-gray-700 text-gray-300 hover:border-gray-400 hover:bg-gray-700/50 hover:text-white transition-all">
            <Link href={github} target="_blank" aria-label="GitHub">
              <FaGithub className="w-5 h-5" />
            </Link>
          </Button>
        )}
        
        {instagram && (
          <Button variant="outline" size="icon" className="rounded-full border-gray-700 text-gray-300 hover:border-pink-500 hover:bg-pink-500/10 hover:text-pink-500 transition-all">
            <Link href={instagram} target="_blank" aria-label="Instagram">
              <FaInstagram className="w-5 h-5" />
            </Link>
          </Button>
        )}
      </div>
    </div>
  );
}

export default SocialLinks;