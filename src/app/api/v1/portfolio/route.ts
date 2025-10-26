import { NextResponse } from "next/server";
import { getPortfolioData } from "@/lib/portfolio-data";

// GET all portfolio data with caching
export async function GET() {
  try {
    const portfolioData = await getPortfolioData();
    
    return NextResponse.json({ 
      success: true, 
      data: portfolioData 
    }, { 
      status: 200,
      headers: {
        'Cache-Control': 'public, s-maxage=3600, stale-while-revalidate=86400',
      }
    });
  } catch (error) {
    console.error("Error fetching portfolio data:", error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch portfolio data" },
      { status: 500 }
    );
  }
} 