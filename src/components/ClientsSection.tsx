"use client";
import React from 'react';
import Image from 'next/image';
import { usePortfolio } from '@/context/PortfolioContext';

function ClientsSection() {
  const { loading } = usePortfolio();
  
  // Client images - in a real app, these would come from the backend
  const clientImages = [
    "https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=1887&auto=format&fit=crop", 
    "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=1887&auto=format&fit=crop", 
    "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?q=80&w=1887&auto=format&fit=crop", 
    "https://images.unsplash.com/photo-1560250097-0b93528c311a?q=80&w=1887&auto=format&fit=crop"
  ];
  
  if (loading) {
    return (
      <section className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-xl p-8 border border-gray-700/50 animate-pulse">
        <div className="flex items-center gap-1 mb-4">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="w-5 h-5 bg-gray-700 rounded-full"></div>
          ))}
        </div>
        <div className="h-12 bg-gray-700 rounded w-1/4 mb-2"></div>
        <div className="h-4 bg-gray-700 rounded w-1/2 mb-6"></div>
        <div className="flex -space-x-3">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="w-11 h-11 bg-gray-700 rounded-full"></div>
          ))}
        </div>
      </section>
    );
  }

  return (
    <section className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-xl p-8 border border-gray-700/50">
      <div className="flex items-center gap-1 mb-4">
        {[...Array(5)].map((_, i) => (
          <svg key={i} className="w-5 h-5 text-yellow-400 fill-current" viewBox="0 0 20 20">
            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
          </svg>
        ))}
      </div>
      <h3 className="text-5xl font-bold mb-2 bg-gradient-to-r from-yellow-400 to-orange-500 text-transparent bg-clip-text">
        100%
      </h3>
      <p className="text-gray-400 mb-6">Client Satisfaction Rate</p>
      <div className="flex -space-x-3">
        {clientImages.map((src, i) => (
          <Image
            key={i}
            src={src || "/placeholder.svg"}
            alt={`Client ${i + 1}`}
            width={44}
            height={44}
            className="rounded-full border-2 border-gray-800 object-cover"
          />
        ))}
        <div className="w-11 h-11 rounded-full bg-blue-600 flex items-center justify-center text-sm font-medium border-2 border-gray-800">
          +12
        </div>
      </div>
    </section>
  );
}

export default ClientsSection;