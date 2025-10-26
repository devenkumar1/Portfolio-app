import ClientsSection from "@/components/ClientsSection"
import ContactSection from "@/components/ContactSection"
import TechStack from "@/components/TechStack"
import ProjectsSection from "@/components/ProjectsSection"
import SocialLinks from "@/components/SocialLinks"
import ContactInfo from "@/components/ContactInfo"
import Bio from "@/components/Bio"
import HeroSection from "@/components/HeroSection"
import EducationTimeline from "@/components/EducationTimeline"
import ExperienceTimeline from "@/components/ExperienceTimeline"
import { getPortfolioData } from "@/lib/portfolio-data"
import { Metadata } from 'next'

export async function generateMetadata(): Promise<Metadata> {
  const data = await getPortfolioData();
  
  const siteName = data.bio?.name || 'Deven Kumar Chaurasia';
  const siteTitle = data.bio?.title || 'Full Stack Developer';
  const siteDescription = data.bio?.description || 'Professional portfolio of Deven Kumar Chaurasia - Full Stack Developer specializing in web development, React, Next.js, Node.js, and modern JavaScript. Explore my projects, skills, and experience.';
  const siteImage = data.bio?.image || '/icons/icon-192x192.png';
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://yoursite.com';
  
  // Comprehensive keywords for SEO
  const comprehensiveKeywords = [
    // Name variations
    'Deven Kumar',
    'Deven Kumar Chaurasia',
    'Deven Chaurasia',
    'Deven',
    
    // Portfolio keywords
    'Deven portfolio',
    "Deven's portfolio",
    'Deven Kumar portfolio',
    'Deven Kumar Chaurasia portfolio',
    'best portfolio',
    'developer portfolio',
    'portfolio website',
    
    // Professional title
    siteTitle,
    'Full Stack Developer',
    'Web Developer',
    'Software Engineer',
    'Frontend Developer',
    'Backend Developer',
    'React Developer',
    'Next.js Developer',
    
    // Skills from database
    ...(data.skills?.map((s: { name: string }) => s.name.toLowerCase()) || []),
    
    // Popular tech keywords
    'JavaScript',
    'TypeScript',
    'React',
    'Next.js',
    'Node.js',
    'MongoDB',
    'Express',
    'Tailwind CSS',
    'Web Development',
    'Full Stack Development',
    
    // Location and experience
    'India developer',
    'Bihar developer',
    'remote developer',
    'freelance developer',
    
    // Project types
    'web applications',
    'responsive design',
    'modern web design',
    'UI/UX developer',
    
    // Additional relevant terms
    'hire developer',
    'professional developer',
    'experienced developer',
    'creative portfolio',
    'programming portfolio',
  ];
  
  return {
    title: `${siteName} - ${siteTitle} | Professional Portfolio`,
    description: siteDescription,
    keywords: comprehensiveKeywords,
    authors: [{ name: siteName }],
    creator: siteName,
    publisher: siteName,
    openGraph: {
      type: 'website',
      locale: 'en_US',
      url: siteUrl,
      siteName: `${siteName} Portfolio`,
      title: `${siteName} - ${siteTitle} | Professional Portfolio`,
      description: siteDescription,
      images: [
        {
          url: siteImage,
          width: 1200,
          height: 630,
          alt: `${siteName} - ${siteTitle} Portfolio`,
        }
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title: `${siteName} - ${siteTitle} | Portfolio`,
      description: siteDescription,
      images: [siteImage],
      creator: data.contact?.twitter ? `@${data.contact.twitter.split('/').pop()}` : undefined,
      site: data.contact?.twitter ? `@${data.contact.twitter.split('/').pop()}` : undefined,
    },
    alternates: {
      canonical: siteUrl,
    },
    category: 'technology',
    classification: 'Portfolio Website',
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        'max-video-preview': -1,
        'max-image-preview': 'large',
        'max-snippet': -1,
      },
    },
  }
}

export default async function Portfolio() {
  const portfolioData = await getPortfolioData();
  
  const siteName = portfolioData.bio?.name || 'Deven Kumar Chaurasia';
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://yoursite.com';
  
  // Enhanced JSON-LD structured data for better SEO
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Person',
    name: siteName,
    alternateName: [
      'Deven Kumar',
      'Deven Chaurasia',
      'Deven',
    ],
    jobTitle: portfolioData.bio?.title || 'Full Stack Developer',
    description: portfolioData.bio?.description,
    image: portfolioData.bio?.image,
    email: portfolioData.contact?.email,
    url: siteUrl,
    sameAs: [
      portfolioData.contact?.github,
      portfolioData.contact?.linkedin,
      portfolioData.contact?.twitter,
      portfolioData.contact?.instagram,
    ].filter(Boolean),
    alumniOf: portfolioData.educations?.map((edu: any) => ({
      '@type': 'EducationalOrganization',
      name: edu.course,
    })),
    worksFor: portfolioData.experiences?.map((exp: any) => ({
      '@type': 'Organization',
      name: exp.company,
    })),
    knowsAbout: portfolioData.skills?.map((skill: any) => skill.name),
    owns: {
      '@type': 'WebSite',
      name: `${siteName} Portfolio`,
      description: portfolioData.bio?.description,
      url: siteUrl,
    },
  };
  
  // Additional BreadcrumbList schema for better navigation understanding
  const breadcrumbJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      {
        '@type': 'ListItem',
        position: 1,
        name: 'Home',
        item: siteUrl,
      },
      {
        '@type': 'ListItem',
        position: 2,
        name: 'Portfolio',
        item: siteUrl,
      },
    ],
  };
  
  // WebPage schema
  const webPageJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'WebPage',
    name: `${siteName} - Professional Portfolio`,
    description: portfolioData.bio?.description,
    url: siteUrl,
    author: {
      '@type': 'Person',
      name: siteName,
    },
    mainEntity: {
      '@type': 'ProfilePage',
      about: {
        '@type': 'Person',
        name: siteName,
        jobTitle: portfolioData.bio?.title,
      },
    },
  };

  return (
    <>
      {/* Primary Person Schema */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      {/* Breadcrumb Schema */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }}
      />
      {/* WebPage Schema */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(webPageJsonLd) }}
      />
      <div className="min-h-screen bg-gradient-to-br from-gray-950 via-gray-900 to-gray-950 text-white">
        <div className="container mx-auto px-6 pt-32 pb-20">
          <div className="space-y-12 w-[90%] mx-auto">
            <HeroSection data={portfolioData.bio} />
            <Bio data={portfolioData.bio} />
            <SocialLinks data={portfolioData.contact} />
            <EducationTimeline data={portfolioData.educations} />
            <TechStack data={portfolioData.skills} />
            <ProjectsSection data={portfolioData.projects} />
            <ExperienceTimeline data={portfolioData.experiences} />
            <ContactSection data={portfolioData.contact} />
            <ClientsSection />
            <ContactInfo data={portfolioData.contact} />
          </div>
        </div>
      </div>
    </>
  )
}
