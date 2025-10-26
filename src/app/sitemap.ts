import { MetadataRoute } from 'next'
import { getPortfolioData } from "@/lib/portfolio-data"

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://yoursite.com';
  
  try {
    const data = await getPortfolioData();
    
    // Generate project URLs
    const projectUrls = data.projects.map((project: { _id: any; timestamp: string | number | Date; }) => ({
      url: `${baseUrl}/project/${project._id}`,
      lastModified: new Date(project.timestamp),
      changeFrequency: 'monthly' as const,
      priority: 0.8,
    }));

    return [
      {
        url: baseUrl,
        lastModified: new Date(),
        changeFrequency: 'daily',
        priority: 1,
      },
      {
        url: `${baseUrl}/all-projects`,
        lastModified: new Date(),
        changeFrequency: 'weekly',
        priority: 0.9,
      },
      {
        url: `${baseUrl}/github`,
        lastModified: new Date(),
        changeFrequency: 'weekly',
        priority: 0.7,
      },
      ...projectUrls,
    ]
  } catch (error) {
    console.error('Error generating sitemap:', error);
    // Return basic sitemap if data fetching fails
    return [
      {
        url: baseUrl,
        lastModified: new Date(),
        changeFrequency: 'daily',
        priority: 1,
      },
    ]
  }
}
