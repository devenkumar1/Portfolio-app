import { NextRequest, NextResponse } from "next/server";
import { connectDb } from "@/lib/mongodb";
import Project from "@/models/project.model";

// GET all projects
export async function GET() {
  try {
    await connectDb();
    const projects = await Project.find({}).sort({ timestamp: -1 });
    return NextResponse.json({ success: true, projects }, { status: 200 });
  } catch (error) {
    console.error("Error fetching projects:", error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch projects" },
      { status: 500 }
    );
  }
}

// POST a new project
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { title, category, description, image, github, live } = body;

    // Validate required fields
    if (!title || !category || !description || !image) {
      return NextResponse.json(
        { success: false, error: "Missing required fields" },
        { status: 400 }
      );
    }

    await connectDb();
    
    const newProject = new Project({
      title,
      category,
      descrition: description, // Note: There's a typo in the model schema (descrition instead of description)
      image,
      timestamp: new Date(),
      github: github || null,
      live: live || null,
    });

    await newProject.save();
    
    return NextResponse.json(
      { success: true, message: "Project created successfully", project: newProject },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error creating project:", error);
    return NextResponse.json(
      { success: false, error: "Failed to create project" },
      { status: 500 }
    );
  }
}

// PUT to update a project
export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    const { id, title, category, description, image, github, live } = body;

    if (!id) {
      return NextResponse.json(
        { success: false, error: "Project ID is required" },
        { status: 400 }
      );
    }

    await connectDb();
    
    const updatedProject = await Project.findByIdAndUpdate(
      id,
      {
        title,
        category,
        descrition: description, // Note: There's a typo in the model schema
        image,
        github: github || null,
        live: live || null,
      },
      { new: true }
    );

    if (!updatedProject) {
      return NextResponse.json(
        { success: false, error: "Project not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(
      { success: true, message: "Project updated successfully", project: updatedProject },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error updating project:", error);
    return NextResponse.json(
      { success: false, error: "Failed to update project" },
      { status: 500 }
    );
  }
}

// DELETE a project
export async function DELETE(request: NextRequest) {
  try {
    const url = new URL(request.url);
    const id = url.searchParams.get("id");

    if (!id) {
      return NextResponse.json(
        { success: false, error: "Project ID is required" },
        { status: 400 }
      );
    }

    await connectDb();
    
    const deletedProject = await Project.findByIdAndDelete(id);

    if (!deletedProject) {
      return NextResponse.json(
        { success: false, error: "Project not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(
      { success: true, message: "Project deleted successfully" },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error deleting project:", error);
    return NextResponse.json(
      { success: false, error: "Failed to delete project" },
      { status: 500 }
    );
  }
} 