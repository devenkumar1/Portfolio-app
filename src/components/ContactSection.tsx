"use client";
import React from 'react';
import { Button } from '@/components/ui/button';
import { Mail } from 'lucide-react';
import ContactForm from './ContactForm';

interface ContactSectionProps {
  data: {
    email: string;
    phone: string;
    address: string;
    github: string;
    linkedin: string;
    twitter: string;
    instagram: string;
  } | null;
}

export default function ContactSection({ data }: ContactSectionProps) {
    const email = data?.email || 'contact@example.com';
    
    const handleContactClick = () => {
        window.location.href = `mailto:${email}`;
    };
    
    return (
        <section id="contact" className="space-y-8">
            <h2 className="text-3xl font-mono font-bold">Get in Touch</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="space-y-4">
                    <p className="text-gray-300 text-lg">
                        Have a project in mind? Let's create something amazing together.
                    </p>
                    
                    <p className="text-gray-400">
                        Fill out the form or reach out directly via email. I'm always open to discussing new projects, 
                        creative ideas, or opportunities to be part of your vision.
                    </p>
                    
                    <Button 
                        className="mt-4 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
                        onClick={handleContactClick}
                    >
                        Email Me Directly <Mail className="ml-2 w-4 h-4" />
                    </Button>
              

                </div>
                
                <ContactForm />
                
              
            </div>
        </section>
    );
}