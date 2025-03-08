import React from 'react';
import { Button } from '@/components/ui/button';
import { Mail } from 'lucide-react';

function ContactSection() {
    const email = 'tony@example.com';
    const phone = '+1 (234) 567-890';
    const contactButtonText = 'Contact Me';

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
        <Button className="relative bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700">
          Contact Me <Mail className="ml-2 w-4 h-4" />
        </Button>
      </section>
    );
}

export default ContactSection