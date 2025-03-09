"use client";
import React from 'react';
import { Button } from '@/components/ui/button';
import { Mail } from 'lucide-react';
import { usePortfolio } from '@/context/PortfolioContext';

function ContactSection() {
    const { portfolioData, loading } = usePortfolio();
    
    // Use contact data if available, otherwise use fallback content
    const email = portfolioData?.contact?.email || 'contact@example.com';
    
    const handleContactClick = () => {
        window.location.href = `mailto:${email}`;
    };
    
    if (loading) {
        return (
            <section
                id="contact"
                className="relative overflow-hidden rounded-xl bg-gradient-to-br from-gray-800 to-gray-900 p-8 border border-gray-700/50 animate-pulse"
            >
                <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/20 rounded-full blur-3xl -mr-16 -mt-16"></div>
                <div className="h-8 bg-gray-700 rounded w-1/3 mb-4"></div>
                <div className="h-4 bg-gray-700 rounded w-2/3 mb-6"></div>
                <div className="h-10 bg-gray-700 rounded w-1/4"></div>
            </section>
        );
    }

    return (
        <section
            id="contact"
            className="relative overflow-hidden rounded-xl bg-gradient-to-br from-gray-800 to-gray-900 p-8 border border-gray-700/50"
        >
            <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/20 rounded-full blur-3xl -mr-16 -mt-16"></div>
            <h2 className="text-2xl font-bold mb-4 relative">Get in Touch</h2>
            <p className="text-gray-400 mb-6 relative">
                Have a project in mind? Let's create something amazing together.
            </p>
            <Button 
                className="relative bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
                onClick={handleContactClick}
            >
                Contact Me <Mail className="ml-2 w-4 h-4" />
            </Button>
        </section>
    );
}

export default ContactSection;