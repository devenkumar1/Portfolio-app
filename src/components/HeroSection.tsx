"use client";
import { useState, useEffect, useRef } from "react";
import Image from "next/image";
import devenImage from "@/assets/deven-picture.png"
import { Button } from '@/components/ui/button';
import { ArrowRight } from "lucide-react";
import { usePortfolio } from "@/context/PortfolioContext";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";

function HeroSection() {
    const { portfolioData, loading } = usePortfolio();
    const nameRef = useRef<HTMLDivElement>(null)

    const textArray = [
        "A web solution provider",
        "A problem solver.",
        "A passionate learner.",
    ];
    const [text, setText] = useState("");
    const [index, setIndex] = useState(0);
    const [charIndex, setCharIndex] = useState(0);
    const [isDeleting, setIsDeleting] = useState(false);

    const tl = gsap.timeline()
    const arrowRef = useRef(null)
    const imgRef = useRef(null)

    useEffect(() => {

        if (nameRef.current && !loading) {
            tl.from(nameRef.current.querySelectorAll('h3'), {
                scale: 0,
                x: -40,
                opacity: 0,
                duration: 0.2,
                delay: 0.2,
            });
            tl.from(nameRef.current.querySelectorAll("h1"), {
                scale: 0,
                opacity: 0,
                x: 40,
                duration: 1,
                stagger: 0.3,
                ease: "power1.inOut",
            });

            tl.from(imgRef.current,{
                scale: 0,
                opacity:0,
                duration: 0.5,
                y:20,
                ease: "power1.in",

            })

            gsap.from(arrowRef.current, {
                scale: 0,
                opacity: 0,
                duration: 1,
                delay: 1,
                repeat: -1,
                yoyo: true
            })

        }
    }, [loading]);

    useEffect(() => {
        const timeout = setTimeout(() => {
            if (!isDeleting && charIndex < textArray[index].length) {
                setText(text + textArray[index][charIndex]);
                setCharIndex(charIndex + 1);
            } else if (isDeleting && charIndex > 0) {
                setText(text.substring(0, charIndex - 1));
                setCharIndex(charIndex - 1);
            } else {
                setIsDeleting(!isDeleting);
                if (!isDeleting) {
                    setIndex((index + 1) % textArray.length);
                }
            }
        }, isDeleting ? 50 : 100);

        return () => clearTimeout(timeout);
    }, [text, isDeleting, charIndex, index]);

    const name = portfolioData?.bio?.name || "Deven Kumar";
    const title = portfolioData?.bio?.title || "Full Stack Developer";
    const profileImage = portfolioData?.bio?.image || devenImage;
    const resumeUrl = portfolioData?.bio?.resume || "";

    const handleResumeDownload = () => {
        if (resumeUrl) {
            window.open(resumeUrl, '_blank');
        }
    };

    if (loading) {
        return (
            <div className="w-full min-h-[80vh] text-white flex justify-center items-center animate-pulse">
                <div className="max-w-6xl w-full flex flex-col-reverse gap-5 md:flex-row md:justify-around items-center">
                    <div className="text-center md:text-left w-full md:w-1/2">
                        <div className="h-6 bg-gray-700 rounded w-1/2 mb-4"></div>
                        <div className="h-10 bg-gray-700 rounded w-3/4 mb-4"></div>
                        <div className="h-8 bg-gray-700 rounded w-2/3 mb-6"></div>
                        <div className="h-6 bg-gray-700 rounded w-1/2 mb-4"></div>
                        <div className="h-10 bg-gray-700 rounded w-1/3"></div>
                    </div>
                    <div className="mt-8 md:mt-0 md:w-1/2 flex justify-center">
                        <div className="w-[300px] h-[300px] md:w-[400px] md:h-[400px] bg-gray-700 rounded-lg"></div>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="w-full min-h-[80vh] text-white flex justify-center items-center" id="home">
            <div className="max-w-6xl w-full flex flex-col-reverse gap-5  md:flex-row md:justify-around items-center">

                {/* Left Section - Text Content */}
                <div ref={nameRef} className="text-center md:text-left w-full md:w-1/2">
                    <h3 className="text-lg font-medium text-gray-300">Hi there, I'm</h3>
                    <h1 className=" text-3xl  tracking-tight md:text-5xl font-extrabold text-white mt-2">
                        {name},
                    </h1>
                    <br />
                    <h1 className=" text-2xl tracking-tight md:text-4xl font-bold text-blue-400">
                        {title}.
                    </h1>

                    {/* Typewriter Effect */}
                    <p className="text-gray-400 mt-4 text-xl h-8">
                        {text}
                        <span className="text-white font-bold animate-blink">|</span>
                    </p>

                    <Button
                        className="rounded-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 transition-all duration-300 mt-4"
                        onClick={handleResumeDownload}
                        disabled={!resumeUrl}
                    >
                        Download Resume <ArrowRight ref={arrowRef} className="ml-2 w-4 h-4" />
                    </Button>
                </div>

                {/* Right Section - Profile Image  */}
                <div className="mt-8 md:mt-0 md:w-1/2 flex justify-center relative">
                    <div ref={imgRef} className="relative group">
                        {/* Profile Image */}
                        <Image
                        
                            src={typeof profileImage === 'string' ? profileImage : devenImage}
                            alt={name}
                            width={500}
                            height={500}
                            loading="lazy"
                            className="rounded-lg shadow-lg transition-all duration-300  mb-8 md:mb-0 group-hover:scale-105 h-60  md:mt-3 md:w-[500px] md:h-[500px] object-cover"
                            style={{
                                 boxShadow: `
        0 4px 14px 0px rgba(0, 0, 0, 0.25),      /* soft dark shadow for depth */
        0 0 32px 8px #0077b688,                    /* neon blue outer glow */
        0 0 8px 2px #0077b688                      /* inner blue accent */
    `
                            }}
                        />
                    </div>
                </div>


            </div>
        </div>
    );
}

export default HeroSection;
