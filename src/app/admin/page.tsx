"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { 
  User, 
  Briefcase, 
  Code, 
  GraduationCap, 
  Award, 
  Medal,
  Contact,
  RefreshCw
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { usePortfolio } from "@/context/PortfolioContext";

export default function AdminDashboard() {
  const { portfolioData, loading, refreshData } = usePortfolio();
  const [refreshing, setRefreshing] = useState(false);
  
  const handleRefresh = async () => {
    setRefreshing(true);
    await refreshData();
    setRefreshing(false);
  };
  
  const adminCards = [
    { 
      title: "Bio", 
      href: "/admin/bio", 
      icon: <User className="w-6 h-6" />,
      count: portfolioData?.bio ? 1 : 0,
      color: "bg-blue-500"
    },
    { 
      title: "Projects", 
      href: "/admin/projects", 
      icon: <Briefcase className="w-6 h-6" />,
      count: portfolioData?.projects?.length || 0,
      color: "bg-green-500"
    },
    { 
      title: "Skills", 
      href: "/admin/skills", 
      icon: <Code className="w-6 h-6" />,
      count: portfolioData?.skills?.length || 0,
      color: "bg-purple-500"
    },
    { 
      title: "Experience", 
      href: "/admin/experience", 
      icon: <Briefcase className="w-6 h-6" />,
      count: portfolioData?.experiences?.length || 0,
      color: "bg-yellow-500"
    },
    { 
      title: "Education", 
      href: "/admin/education", 
      icon: <GraduationCap className="w-6 h-6" />,
      count: portfolioData?.educations?.length || 0,
      color: "bg-red-500"
    },
    { 
      title: "Achievements", 
      href: "/admin/achievements", 
      icon: <Award className="w-6 h-6" />,
      count: portfolioData?.achievements?.length || 0,
      color: "bg-indigo-500"
    },
    { 
      title: "Certificates", 
      href: "/admin/certificates", 
      icon: <Medal className="w-6 h-6" />,
      count: portfolioData?.certificates?.length || 0,
      color: "bg-pink-500"
    },
    { 
      title: "Contact", 
      href: "/admin/contact", 
      icon: <Contact className="w-6 h-6" />,
      count: portfolioData?.contact ? 1 : 0,
      color: "bg-teal-500"
    },
  ];
  
  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Admin Dashboard</h1>
        <Button 
          onClick={handleRefresh} 
          disabled={loading || refreshing}
          variant="outline"
        >
          <RefreshCw className={`w-4 h-4 mr-2 ${refreshing ? 'animate-spin' : ''}`} />
          Refresh Data
        </Button>
      </div>
      
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[1, 2, 3, 4, 5, 6, 7, 8].map((item) => (
            <div key={item} className="h-32 bg-gray-200 rounded-lg animate-pulse"></div>
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {adminCards.map((card) => (
            <Link key={card.title} href={card.href}>
              <div className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow cursor-pointer">
                <div className="flex justify-between items-center">
                  <div className={`p-3 rounded-full ${card.color} text-white`}>
                    {card.icon}
                  </div>
                  <span className="text-3xl font-bold">{card.count}</span>
                </div>
                <h3 className="text-lg font-medium mt-4">{card.title}</h3>
                <p className="text-gray-500 text-sm mt-1">
                  {card.count === 0 ? "No entries yet" : card.count === 1 ? "1 entry" : `${card.count} entries`}
                </p>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
} 