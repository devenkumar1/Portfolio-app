"use client";
import { useState, useEffect } from "react";
import Image from "next/image";
import devenImage from "@/assets/deven-picture.png"
import {Button} from '@/components/ui/button';
import { ArrowRight } from "lucide-react";
function HeroSection() {
    const textArray = [
        "A web solution provider",
        "A problem solver.",
        "A passionate learner.",
    ];
    const [text, setText] = useState("");
    const [index, setIndex] = useState(0);
    const [charIndex, setCharIndex] = useState(0);
    const [isDeleting, setIsDeleting] = useState(false);

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
        }, isDeleting ? 50 : 100); // Typing speed

        return () => clearTimeout(timeout);
    }, [text, isDeleting, charIndex, index]);

    return (
        <div className="w-full min-h-[80vh] text-white flex justify-center items-center" id="home">
            <div className="max-w-6xl w-full flex flex-col-reverse gap-5  md:flex-row md:justify-around items-center">

                {/* Left Section - Text Content */}
                <div className="text-center md:text-left w-full md:w-1/2">
                    <h3 className="text-lg font-medium text-gray-300">Hi there, I'm</h3>
                    <h1 className=" text-3xl  md:text-5xl font-extrabold text-white mt-2">
                        Deven Kumar,
                    </h1>
                    <br />
                    <h1 className=" text-2xl md:text-4xl font-bold text-blue-400">
                        Full Stack Developer.
                    </h1>

                    {/* Typewriter Effect */}
                    <p className="text-gray-400 mt-4 text-xl h-8">
                        {text}
                        <span className="text-white font-bold animate-blink">|</span>
                    </p>

                     <Button className="rounded-full  bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 transition-all duration-300 mt-4">
                        Download Resume <ArrowRight className="ml-2 w-4 h-4" />
                      </Button>
                </div>

                {/* Right Section - Profile Image  */}
                <div className="mt-8 md:mt-0 md:w-1/2 flex justify-center relative">
                    <div className="relative group">
                        {/* Profile Image */}
                        <Image
                            src={devenImage}
                            alt="Deven Kumar"
                            className="rounded-lg shadow-lg transition-all duration-300 group-hover:scale-105 mt-3 md:w-[400px] md:h-[400px] object-cover"
                            style={{
                                maskImage: 'radial-gradient(circle, rgba(0, 0, 0, 1) 50%, rgba(0, 0, 0, 0) 100%)',
                                WebkitMaskImage: 'radial-gradient(circle, rgba(0, 0, 0, 1) 50%, rgba(0, 0, 0, 0) 100%)' // For Safari
                            }}
                        />
                    </div>
                </div>


            </div>
        </div>
    );
}

export default HeroSection;
