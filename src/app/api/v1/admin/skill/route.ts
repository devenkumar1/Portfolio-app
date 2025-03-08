import { NextRequest, NextResponse } from "next/server";
import { connectDb } from "@/lib/mongodb";
import Skills from "@/models/skills.model";

// GET all skills
export async function GET() {
  try {
    await connectDb();
    const skills = await Skills.find({});
    return NextResponse.json({ success: true, skills }, { status: 200 });
  } catch (error) {
    console.error("Error fetching skills:", error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch skills" },
      { status: 500 }
    );
  }
}

// POST a new skill
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { name, icon } = body;

    // Validate required fields
    if (!name || !icon) {
      return NextResponse.json(
        { success: false, error: "Missing required fields" },
        { status: 400 }
      );
    }

    await connectDb();
    
    // Check if skill with the same name already exists
    const existingSkill = await Skills.findOne({ name });
    if (existingSkill) {
      return NextResponse.json(
        { success: false, error: "Skill with this name already exists" },
        { status: 409 }
      );
    }
    
    const newSkill = new Skills({
      name,
      icon,
    });

    await newSkill.save();
    
    return NextResponse.json(
      { success: true, message: "Skill created successfully", skill: newSkill },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error creating skill:", error);
    return NextResponse.json(
      { success: false, error: "Failed to create skill" },
      { status: 500 }
    );
  }
}

// PUT to update a skill
export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    const { id, name, icon } = body;

    if (!id) {
      return NextResponse.json(
        { success: false, error: "Skill ID is required" },
        { status: 400 }
      );
    }

    await connectDb();
    
    // Check if skill with the same name already exists (excluding the current skill)
    if (name) {
      const existingSkill = await Skills.findOne({ name, _id: { $ne: id } });
      if (existingSkill) {
        return NextResponse.json(
          { success: false, error: "Another skill with this name already exists" },
          { status: 409 }
        );
      }
    }
    
    const updatedSkill = await Skills.findByIdAndUpdate(
      id,
      { name, icon },
      { new: true }
    );

    if (!updatedSkill) {
      return NextResponse.json(
        { success: false, error: "Skill not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(
      { success: true, message: "Skill updated successfully", skill: updatedSkill },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error updating skill:", error);
    return NextResponse.json(
      { success: false, error: "Failed to update skill" },
      { status: 500 }
    );
  }
}

// DELETE a skill
export async function DELETE(request: NextRequest) {
  try {
    const url = new URL(request.url);
    const id = url.searchParams.get("id");

    if (!id) {
      return NextResponse.json(
        { success: false, error: "Skill ID is required" },
        { status: 400 }
      );
    }

    await connectDb();
    
    const deletedSkill = await Skills.findByIdAndDelete(id);

    if (!deletedSkill) {
      return NextResponse.json(
        { success: false, error: "Skill not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(
      { success: true, message: "Skill deleted successfully" },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error deleting skill:", error);
    return NextResponse.json(
      { success: false, error: "Failed to delete skill" },
      { status: 500 }
    );
  }
} 