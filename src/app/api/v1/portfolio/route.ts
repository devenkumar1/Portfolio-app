import { NextResponse } from "next/server";
import { connectDb } from "@/lib/mongodb";
import Bio from "@/models/bio.model";
import Contact from "@/models/contact.model";
import Project from "@/models/project.model";
import Skills from "@/models/skills.model";
import Experience from "@/models/expirence.model";
import Education from "@/models/education.model";
import Achievement from "@/models/achievement.model";
import Certificate from "@/models/certificate.model";

// GET all portfolio data
export async function GET() {
  try {
    await connectDb();
    
    // Fetch all data in parallel for better performance
    const [
      bio,
      contact,
      projects,
      skills,
      experiences,
      educations,
      achievements,
      certificates
    ] = await Promise.all([
      Bio.findOne(),
      Contact.findOne(),
      Project.find({}).sort({ timestamp: -1 }),
      Skills.find({}),
      Experience.find({}),
      Education.find({}),
      Achievement.find({}).sort({ year: -1 }),
      Certificate.find({}).sort({ timestamp: -1 })
    ]);
    
    // Construct the portfolio data object
    const portfolioData = {
      bio: bio || null,
      contact: contact || null,
      projects: projects || [],
      skills: skills || [],
      experiences: experiences || [],
      educations: educations || [],
      achievements: achievements || [],
      certificates: certificates || []
    };
    
    return NextResponse.json({ 
      success: true, 
      data: portfolioData 
    }, { status: 200 });
  } catch (error) {
    console.error("Error fetching portfolio data:", error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch portfolio data" },
      { status: 500 }
    );
  }
} 