"use client"

import { useState, useEffect } from "react"
import Image from "next/image"
import Link from "next/link"
import { Menu, X, Twitter, Linkedin, Github, Mail, ArrowRight, ExternalLink } from "lucide-react"
import { Button } from "@/components/ui/button"
import { motion } from "framer-motion"
import NavBar from "@/components/ui/NavBar"
import ClientsSection from "@/components/ClientsSection"
import ContactSection from "@/components/ContactSection"
import TechStack from "@/components/TechStack"
import ProjectsSection from "@/components/ProjectsSection"
import SocialLinks from "@/components/SocialLinks"
import ContactInfo from "@/components/ContactInfo"
import Bio from "@/components/Bio"
import HeroSection from "@/components/HeroSection"

export default function Portfolio() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20)
    }
    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-950 via-gray-900 to-gray-950 text-white">
      <div className="container mx-auto px-6 pt-32 pb-20">
        {/* Entire content should now stack vertically */}
        <div className="space-y-12 w-[90%] mx-auto">
           <HeroSection/>
            {/* <ProfileHeader/> */}
            <Bio />
            <SocialLinks />

          {/* Projects Section */}

          <ProjectsSection />

          {/* Stack Section */}

          <TechStack />


          {/* Contact Section */}

          <ContactSection />


          {/* Happy Clients Section */}
          <ClientsSection />
            {/* Contact Info */}
            <ContactInfo />

        </div>
      </div>
    </div>
  )
}
