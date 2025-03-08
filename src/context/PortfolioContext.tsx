"use client";

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

// Define types for our portfolio data
interface Bio {
  _id: string;
  name: string;
  title: string;
  description: string;
  image: string;
  resume: string;
}

interface Contact {
  _id: string;
  email: string;
  phone: string;
  address: string;
  github: string;
  linkedin: string;
  twitter: string;
  instagram: string;
}

interface Project {
  _id: string;
  title: string;
  category: string;
  descrition: string; // Note: This is a typo in the model, but we'll keep it consistent
  image: string;
  timestamp: string;
  github: string | null;
  live: string | null;
}

interface Skill {
  _id: string;
  name: string;
  icon: string;
}

interface Experience {
  _id: string;
  company: string;
  position: string;
  start: string;
  end: string;
}

interface Education {
  _id: string;
  course: string;
  start: string;
  end: string;
  percentage: number;
}

interface Achievement {
  _id: string;
  year: string;
  title: string;
  description: string;
}

interface Certificate {
  _id: string;
  title: string;
  platform: string;
  timestamp: string;
}

interface PortfolioData {
  bio: Bio | null;
  contact: Contact | null;
  projects: Project[];
  skills: Skill[];
  experiences: Experience[];
  educations: Education[];
  achievements: Achievement[];
  certificates: Certificate[];
}

interface PortfolioContextType {
  portfolioData: PortfolioData | null;
  loading: boolean;
  error: string | null;
  refreshData: () => Promise<void>;
}

// Create the context
const PortfolioContext = createContext<PortfolioContextType | undefined>(undefined);

// Create a provider component
export const PortfolioProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [portfolioData, setPortfolioData] = useState<PortfolioData | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const fetchPortfolioData = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await fetch('/api/v1/portfolio');
      
      if (!response.ok) {
        throw new Error('Failed to fetch portfolio data');
      }
      
      const result = await response.json();
      
      if (result.success) {
        setPortfolioData(result.data);
      } else {
        throw new Error(result.error || 'Failed to fetch portfolio data');
      }
    } catch (err) {
      console.error('Error fetching portfolio data:', err);
      setError(err instanceof Error ? err.message : 'An unknown error occurred');
    } finally {
      setLoading(false);
    }
  };

  // Fetch data on initial load
  useEffect(() => {
    fetchPortfolioData();
  }, []);

  // Function to refresh data
  const refreshData = async () => {
    await fetchPortfolioData();
  };

  return (
    <PortfolioContext.Provider value={{ portfolioData, loading, error, refreshData }}>
      {children}
    </PortfolioContext.Provider>
  );
};

// Custom hook to use the portfolio context
export const usePortfolio = () => {
  const context = useContext(PortfolioContext);
  
  if (context === undefined) {
    throw new Error('usePortfolio must be used within a PortfolioProvider');
  }
  
  return context;
}; 