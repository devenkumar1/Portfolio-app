import { NextRequest, NextResponse } from "next/server";
import { connectDb } from "@/lib/mongodb";
import Bio from "@/models/bio.model";
import { revalidateTag } from 'next/cache';

// GET bio information
export async function GET() {
  try {
    await connectDb();
    const bio = await Bio.findOne();
    
    if (!bio) {
      return NextResponse.json(
        { success: false, error: "Bio information not found" },
        { status: 404 }
      );
    }
    
    return NextResponse.json({ success: true, bio }, { status: 200 });
  } catch (error) {
    console.error("Error fetching bio information:", error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch bio information" },
      { status: 500 }
    );
  }
}

// POST or update bio information
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { name, title, description, image, resume } = body;

    // Validate required fields
    if (!name || !title || !description || !image) {
      return NextResponse.json(
        { success: false, error: "Missing required fields" },
        { status: 400 }
      );
    }

    await connectDb();
    
    // Find existing bio or create new one
    const existingBio = await Bio.findOne();
    
    let bio;
    if (existingBio) {
      // Update existing bio
      bio = await Bio.findByIdAndUpdate(
        existingBio._id,
        {
          name,
          title,
          description,
          image,
          resume: resume || existingBio.resume,
        },
        { new: true }
      );
    } else {
      // Create new bio
      bio = new Bio({
        name,
        title,
        description,
        image,
        resume: resume || "",
      });
      await bio.save();
    }
    
    // Revalidate cache after updating
    revalidateTag('portfolio', 'default');
    
    return NextResponse.json(
      { success: true, message: "Bio information saved successfully", bio },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error saving bio information:", error);
    return NextResponse.json(
      { success: false, error: "Failed to save bio information" },
      { status: 500 }
    );
  }
}

// PUT to update bio information (alternative to POST)
export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    const { name, title, description, image, resume } = body;

    await connectDb();
    
    // Find existing bio
    const existingBio = await Bio.findOne();
    
    if (!existingBio) {
      return NextResponse.json(
        { success: false, error: "Bio information not found. Use POST to create." },
        { status: 404 }
      );
    }
    
    // Update fields only if provided
    const updateData: any = {};
    if (name) updateData.name = name;
    if (title) updateData.title = title;
    if (description) updateData.description = description;
    if (image) updateData.image = image;
    if (resume !== undefined) updateData.resume = resume;
    
    const updatedBio = await Bio.findByIdAndUpdate(
      existingBio._id,
      updateData,
      { new: true }
    );
    
    // Revalidate cache after updating
    revalidateTag('portfolio', 'default');
    
    return NextResponse.json(
      { success: true, message: "Bio information updated successfully", bio: updatedBio },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error updating bio information:", error);
    return NextResponse.json(
      { success: false, error: "Failed to update bio information" },
      { status: 500 }
    );
  }
} 