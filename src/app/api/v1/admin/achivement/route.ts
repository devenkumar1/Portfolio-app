import { NextRequest, NextResponse } from "next/server";
import { connectDb } from "@/lib/mongodb";
import Achievement from "@/models/achievement.model";
import { revalidateTag } from 'next/cache';

// GET all achievements
export async function GET() {
  try {
    await connectDb();
    const achievements = await Achievement.find({}).sort({ year: -1 });
    return NextResponse.json({ success: true, achievements }, { status: 200 });
  } catch (error) {
    console.error("Error fetching achievements:", error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch achievements" },
      { status: 500 }
    );
  }
}

// POST a new achievement
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { year, title, description } = body;

    // Validate required fields
    if (!year || !title || !description) {
      return NextResponse.json(
        { success: false, error: "Missing required fields" },
        { status: 400 }
      );
    }

    await connectDb();
    
    const newAchievement = new Achievement({
      year,
      title,
      description,
    });

    await newAchievement.save();
    
    // Revalidate cache
    revalidateTag('portfolio', 'default');
    
    return NextResponse.json(
      { success: true, message: "Achievement created successfully", achievement: newAchievement },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error creating achievement:", error);
    return NextResponse.json(
      { success: false, error: "Failed to create achievement" },
      { status: 500 }
    );
  }
}

// PUT to update an achievement
export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    const { id, year, title, description } = body;

    if (!id) {
      return NextResponse.json(
        { success: false, error: "Achievement ID is required" },
        { status: 400 }
      );
    }

    await connectDb();
    
    const updatedAchievement = await Achievement.findByIdAndUpdate(
      id,
      {
        year,
        title,
        description,
      },
      { new: true }
    );

    if (!updatedAchievement) {
      return NextResponse.json(
        { success: false, error: "Achievement not found" },
        { status: 404 }
      );
    }

    // Revalidate cache
    revalidateTag('portfolio', 'default');

    return NextResponse.json(
      { success: true, message: "Achievement updated successfully", achievement: updatedAchievement },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error updating achievement:", error);
    return NextResponse.json(
      { success: false, error: "Failed to update achievement" },
      { status: 500 }
    );
  }
}

// DELETE an achievement
export async function DELETE(request: NextRequest) {
  try {
    const url = new URL(request.url);
    const id = url.searchParams.get("id");

    if (!id) {
      return NextResponse.json(
        { success: false, error: "Achievement ID is required" },
        { status: 400 }
      );
    }

    await connectDb();
    
    const deletedAchievement = await Achievement.findByIdAndDelete(id);

    if (!deletedAchievement) {
      return NextResponse.json(
        { success: false, error: "Achievement not found" },
        { status: 404 }
      );
    }

    // Revalidate cache
    revalidateTag('portfolio', 'default');

    return NextResponse.json(
      { success: true, message: "Achievement deleted successfully" },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error deleting achievement:", error);
    return NextResponse.json(
      { success: false, error: "Failed to delete achievement" },
      { status: 500 }
    );
  }
} 