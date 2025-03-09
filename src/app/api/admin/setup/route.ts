import { NextRequest, NextResponse } from "next/server";
import { connectDb } from "@/lib/mongodb";
import User from "@/models/admin.model";

// This endpoint is used to create the first admin user
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { email, password, name } = body;

    // Validate required fields
    if (!email || !password || !name) {
      return NextResponse.json(
        { success: false, error: "Missing required fields" },
        { status: 400 }
      );
    }

    await connectDb();
    
    // Check if an admin already exists
    const adminCount = await User.countDocuments({ role: "admin" });
    if (adminCount > 0) {
      return NextResponse.json(
        { success: false, error: "Admin user already exists" },
        { status: 400 }
      );
    }
    
    // Create the admin user
    const admin = new User({
      email,
      password, // Will be hashed by the pre-save hook
      name,
      role: "admin"
    });

    await admin.save();
    
    return NextResponse.json(
      { 
        success: true, 
        message: "Admin user created successfully",
        admin: {
          email: admin.email,
          name: admin.name,
          id: admin._id
        }
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error creating admin user:", error);
    return NextResponse.json(
      { success: false, error: "Failed to create admin user" },
      { status: 500 }
    );
  }
} 