import { NextRequest, NextResponse } from "next/server";
import { connectDb } from "@/lib/mongodb";
import Experience from "@/models/expirence.model";

// GET all experiences
export async function GET() {
  try {
    await connectDb();
    const experiences = await Experience.find({});
    return NextResponse.json({ success: true, experiences }, { status: 200 });
  } catch (error) {
    console.error("Error fetching experiences:", error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch experiences" },
      { status: 500 }
    );
  }
}

// POST a new experience
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { company, position, start, end } = body;

    // Validate required fields
    if (!company || !position || !start || !end) {
      return NextResponse.json(
        { success: false, error: "Missing required fields" },
        { status: 400 }
      );
    }

    await connectDb();
    
    const newExperience = new Experience({
      company,
      position,
      start,
      end,
    });

    await newExperience.save();
    
    return NextResponse.json(
      { success: true, message: "Experience created successfully", experience: newExperience },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error creating experience:", error);
    return NextResponse.json(
      { success: false, error: "Failed to create experience" },
      { status: 500 }
    );
  }
}

// PUT to update an experience
export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    const { id, company, position, start, end } = body;

    if (!id) {
      return NextResponse.json(
        { success: false, error: "Experience ID is required" },
        { status: 400 }
      );
    }

    await connectDb();
    
    const updatedExperience = await Experience.findByIdAndUpdate(
      id,
      {
        company,
        position,
        start,
        end,
      },
      { new: true }
    );

    if (!updatedExperience) {
      return NextResponse.json(
        { success: false, error: "Experience not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(
      { success: true, message: "Experience updated successfully", experience: updatedExperience },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error updating experience:", error);
    return NextResponse.json(
      { success: false, error: "Failed to update experience" },
      { status: 500 }
    );
  }
}

// DELETE an experience
export async function DELETE(request: NextRequest) {
  try {
    const url = new URL(request.url);
    const id = url.searchParams.get("id");

    if (!id) {
      return NextResponse.json(
        { success: false, error: "Experience ID is required" },
        { status: 400 }
      );
    }

    await connectDb();
    
    const deletedExperience = await Experience.findByIdAndDelete(id);

    if (!deletedExperience) {
      return NextResponse.json(
        { success: false, error: "Experience not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(
      { success: true, message: "Experience deleted successfully" },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error deleting experience:", error);
    return NextResponse.json(
      { success: false, error: "Failed to delete experience" },
      { status: 500 }
    );
  }
} 