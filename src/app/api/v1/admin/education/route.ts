import { NextRequest, NextResponse } from "next/server";
import { connectDb } from "@/lib/mongodb";
import Education from "@/models/education.model";

// GET all education entries
export async function GET() {
  try {
    await connectDb();
    const educations = await Education.find({});
    return NextResponse.json({ success: true, educations }, { status: 200 });
  } catch (error) {
    console.error("Error fetching education entries:", error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch education entries" },
      { status: 500 }
    );
  }
}

// POST a new education entry
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { course, start, end, percentage } = body;

    // Validate required fields
    if (!course || !start || !end || percentage === undefined) {
      return NextResponse.json(
        { success: false, error: "Missing required fields" },
        { status: 400 }
      );
    }

    // Validate percentage is a number
    if (isNaN(percentage)) {
      return NextResponse.json(
        { success: false, error: "Percentage must be a number" },
        { status: 400 }
      );
    }

    await connectDb();
    
    const newEducation = new Education({
      course,
      start,
      end,
      percentage: Number(percentage),
    });

    await newEducation.save();
    
    return NextResponse.json(
      { success: true, message: "Education entry created successfully", education: newEducation },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error creating education entry:", error);
    return NextResponse.json(
      { success: false, error: "Failed to create education entry" },
      { status: 500 }
    );
  }
}

// PUT to update an education entry
export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    const { id, course, start, end, percentage } = body;

    if (!id) {
      return NextResponse.json(
        { success: false, error: "Education ID is required" },
        { status: 400 }
      );
    }

    // Validate percentage is a number if provided
    if (percentage !== undefined && isNaN(percentage)) {
      return NextResponse.json(
        { success: false, error: "Percentage must be a number" },
        { status: 400 }
      );
    }

    await connectDb();
    
    const updatedEducation = await Education.findByIdAndUpdate(
      id,
      {
        course,
        start,
        end,
        percentage: percentage !== undefined ? Number(percentage) : undefined,
      },
      { new: true }
    );

    if (!updatedEducation) {
      return NextResponse.json(
        { success: false, error: "Education entry not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(
      { success: true, message: "Education entry updated successfully", education: updatedEducation },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error updating education entry:", error);
    return NextResponse.json(
      { success: false, error: "Failed to update education entry" },
      { status: 500 }
    );
  }
}

// DELETE an education entry
export async function DELETE(request: NextRequest) {
  try {
    const url = new URL(request.url);
    const id = url.searchParams.get("id");

    if (!id) {
      return NextResponse.json(
        { success: false, error: "Education ID is required" },
        { status: 400 }
      );
    }

    await connectDb();
    
    const deletedEducation = await Education.findByIdAndDelete(id);

    if (!deletedEducation) {
      return NextResponse.json(
        { success: false, error: "Education entry not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(
      { success: true, message: "Education entry deleted successfully" },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error deleting education entry:", error);
    return NextResponse.json(
      { success: false, error: "Failed to delete education entry" },
      { status: 500 }
    );
  }
} 