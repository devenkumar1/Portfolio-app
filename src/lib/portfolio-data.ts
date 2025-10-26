import { connectDb } from "@/lib/mongodb";
import Bio from "@/models/bio.model";
import Contact from "@/models/contact.model";
import Project from "@/models/project.model";
import Skills from "@/models/skills.model";
import Experience from "@/models/expirence.model";
import Education from "@/models/education.model";
import Achievement from "@/models/achievement.model";
import Certificate from "@/models/certificate.model";
import { unstable_cache } from 'next/cache';

export const getPortfolioData = unstable_cache(
  async () => {
    await connectDb();
    
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
      Bio.findOne().lean(),
      Contact.findOne().lean(),
      Project.find({}).sort({ timestamp: -1 }).lean(),
      Skills.find({}).lean(),
      Experience.find({}).lean(),
      Education.find({}).lean(),
      Achievement.find({}).sort({ year: -1 }).lean(),
      Certificate.find({}).sort({ timestamp: -1 }).lean()
    ]);
    
    // Serialize data to ensure it's JSON-safe
    return {
      bio: bio ? JSON.parse(JSON.stringify(bio)) : null,
      contact: contact ? JSON.parse(JSON.stringify(contact)) : null,
      projects: projects ? JSON.parse(JSON.stringify(projects)) : [],
      skills: skills ? JSON.parse(JSON.stringify(skills)) : [],
      experiences: experiences ? JSON.parse(JSON.stringify(experiences)) : [],
      educations: educations ? JSON.parse(JSON.stringify(educations)) : [],
      achievements: achievements ? JSON.parse(JSON.stringify(achievements)) : [],
      certificates: certificates ? JSON.parse(JSON.stringify(certificates)) : []
    };
  },
  ['portfolio-data'],
  {
    revalidate: false, // Cache indefinitely until manually revalidated
    tags: ['portfolio']
  }
);
