'use client'
import { useState, useEffect, useRef } from "react"
import Image from "next/image"
import Link from "next/link"
import { Menu, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { motion } from "framer-motion"
import gsap from "gsap"
import {useGSAP} from '@gsap/react'

interface NavBarProps {
  name?: string;
}

function NavBar({ name: propName }: NavBarProps = {}) {
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const [scrolled, setScrolled] = useState(false)
    
    // Use prop name or fallback
    const name = propName?.split(' ')[0] || "Deven";
    const initial = name.charAt(0);
  const logoDiv = useRef(null);
  const navLinks = useRef<HTMLDivElement>(null);
  const mobileNavLinks = useRef<HTMLDivElement>(null);
    
  const tl= gsap.timeline()
  useGSAP(() => {
    tl.from(logoDiv.current, {
      y: -50,
      scale: 0,
      opacity: 0,
      duration: 1,
      delay: 0.2,
      stagger: 0.2
    });
    if (navLinks.current) {
      tl.from(navLinks.current.querySelectorAll('a'), {
        y: -50,
        scale: 0,
        opacity: 0,
        duration:0.7,
        stagger: 0.12
      });
    }
  });

useGSAP(() => {
  if (mobileMenuOpen && mobileNavLinks.current) {
    gsap.from(mobileNavLinks.current.querySelectorAll('a'), {
      x: -500,
      scale: 0,
      opacity: 0,
      duration: 0.6,
      delay: 0.3,
      stagger: 0.2
    });
  }
}, [mobileMenuOpen]);
   

    useEffect(() => {
        const handleScroll = () => {
          setScrolled(window.scrollY > 20)
        }
        window.addEventListener("scroll", handleScroll)
        return () => window.removeEventListener("scroll", handleScroll)
      }, [])

    const scrollToSection = (e: React.MouseEvent<HTMLAnchorElement>, sectionId: string) => {
        e.preventDefault();
        setMobileMenuOpen(false);
        
        // Check if we're on the homepage
        if (window.location.pathname === '/') {
            const element = document.querySelector(sectionId);
            element?.scrollIntoView({ behavior: 'smooth' });
        } else {
            // Navigate to homepage with hash
            window.location.href = `/${sectionId}`;
        }
    };

  return (
    <div className="w-full bg-gradient-to-br from-gray-950 via-gray-900 to-gray-950 text-white">

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 z-50 bg-black bg-opacity-95 lg:hidden">
          <div className="flex flex-col h-full p-8">
            <div className="flex justify-end">
              <Button variant="ghost" size="icon" onClick={() => setMobileMenuOpen(false)}>
                <X className="w-6 h-6" />
              </Button>
            </div>
            <div ref={mobileNavLinks}  className="flex flex-col items-center justify-center flex-1 space-y-8 text-2xl">
              <Link  href="#about" onClick={(e) => scrollToSection(e, '#about')}>
                About
              </Link>
              <Link href={"#projects"} onClick={(e) => scrollToSection(e, '#projects')} className="hover:text-blue-400 transition-colors">
                Projects
              </Link>
              <Link href="#stack" onClick={(e) => scrollToSection(e, '#stack')}>
                Stack
              </Link>
              <Link  href="#contact" onClick={(e) => scrollToSection(e, '#contact')}>
                Contact
              </Link>
              <Link  href="/github" className="hover:text-blue-400 transition-colors">
                GitHub
              </Link>
            </div>
          </div>
        </div>
      )}

      {/* Desktop Navigation */}
      <header
        className={`fixed top-0 left-0 right-0 z-40 transition-all duration-300 ${scrolled ? "bg-gray-900/80 backdrop-blur-md py-3" : "py-6"}`}
      >
        <div className="container mx-auto px-6 flex justify-between items-center">
          <div ref={logoDiv} className="flex items-center gap-2">
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
              <span className="font-bold"><Link href="/">{initial}</Link></span>
            </div>
            <span className="font-mono font-bold"><Link href="/">{name}</Link></span>
          </div>
          <nav ref={navLinks} className="hidden lg:flex items-center gap-8">
            <Link  href="#about" onClick={(e) => scrollToSection(e, '#about')} className="hover:text-blue-400 transition-colors">
              About
            </Link>
            <Link href="#projects" onClick={(e) => scrollToSection(e, '#projects')} className="hover:text-blue-400 transition-colors">
              Projects
            </Link>
            <Link href="#stack" onClick={(e) => scrollToSection(e, '#stack')} className="hover:text-blue-400 transition-colors">
              Stack
            </Link>
            <Link href="#contact" onClick={(e) => scrollToSection(e, '#contact')} className="hover:text-blue-400 transition-colors">
              Contact
            </Link>
            <Link href="/github" className="hover:text-blue-400 transition-colors">
              GitHub details
            </Link>
          </nav>
          <Button variant="ghost" size="icon" className="lg:hidden" onClick={() => setMobileMenuOpen(true)}>
            <Menu className="w-6 h-6" />
          </Button>
        </div>
      </header>
        
   </div>
  )
}

export default NavBar