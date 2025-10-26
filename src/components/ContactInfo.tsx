"use client";
import { Mail, Phone, MapPin } from "lucide-react";

interface ContactInfoProps {
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

function ContactInfo({ data }: ContactInfoProps) {
  const email = data?.email || "devenkumar540@gmail.com";
  const phone = data?.phone || "+91 9693838648";
  const address = data?.address || "Arrah,Bihar";
  
  return (
    <div className="space-y-4">
      <h2 className="text-xl font-semibold">Let's Connect</h2>
      <div className="flex flex-col space-y-3">
        <a href={`mailto:${email}`} className="flex items-center gap-3 text-gray-300 hover:text-blue-400 transition-colors">
          <Mail className="w-5 h-5" /> {email}
        </a>
        <a href={`tel:${phone}`} className="flex items-center gap-3 text-gray-300 hover:text-blue-400 transition-colors">
          <Phone className="w-5 h-5" /> {phone}
        </a>
        {address && (
          <div className="flex items-center gap-3 text-gray-300">
            <MapPin className="w-5 h-5" /> {address}
          </div>
        )}
      </div>

    </div>
  );
}

export default ContactInfo;