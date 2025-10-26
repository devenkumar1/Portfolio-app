"use client";
import { useState, useEffect, useRef } from "react";
import Image from "next/image";
// import devenImage from "@/assets/deven-picture.png"
import { Button } from '@/components/ui/button';
import { ArrowRight } from "lucide-react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";

interface HeroSectionProps {
  data: {
    name: string;
    title: string;
    description: string;
    image: string;
    resume: string;
  } | null;
}

function HeroSection({ data }: HeroSectionProps) {
    const nameRef = useRef<HTMLDivElement>(null)

    const textArray = [
        "A passionate Software developer.",
        "A web solution provider",
        "A problem solver.",
        "A learner.",
    ];
    const [text, setText] = useState("");
    const [index, setIndex] = useState(0);
    const [charIndex, setCharIndex] = useState(0);
    const [isDeleting, setIsDeleting] = useState(false);

    const tl = gsap.timeline()
    const arrowRef = useRef(null)
    const imgRef = useRef(null)

    useEffect(() => {

        if (nameRef.current) {
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

            tl.from(imgRef.current, {
                scale: 0,
                opacity: 0,
                duration: 0.5,
                y: 20,
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
    }, []);

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

    const name = data?.name || "Deven Kumar";
    const title = data?.title || "Full Stack Developer";
    const profileImage = data?.image 
    const resumeUrl = data?.resume || "";

    const handleResumeDownload = () => {
        if (resumeUrl) {
            window.open(resumeUrl, '_blank');
        }
    };

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

                            src={profileImage? profileImage:  "" }
                            alt={name}
                            width={500}
                            height={500}
                            priority
                            // loading={lazy}
                            sizes="(max-width: 768px) 100vw, 500px"
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
