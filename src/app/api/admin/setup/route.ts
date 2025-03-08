import { NextRequest, NextResponse } from "next/server";
import { connectDb } from "@/lib/mongodb";
import Admin from "@/models/admin.model";

// This endpoint is used to create the first admin user
// It should be disabled in production after the first admin is created
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { email, password, name, setupKey } = body;

    // Validate required fields
    if (!email || !password || !name || !setupKey) {
      return NextResponse.json(
        { success: false, error: "Missing required fields" },
        { status: 400 }
      );
    }

    // Check setup key (this should match an environment variable)
    // This adds an extra layer of security to prevent unauthorized admin creation
    const validSetupKey = process.env.ADMIN_SETUP_KEY;
    if (!validSetupKey || setupKey !== validSetupKey) {
      return NextResponse.json(
        { success: false, error: "Invalid setup key" },
        { status: 403 }
      );
    }

    await connectDb();
    
    // Check if an admin already exists
    const adminCount = await Admin.countDocuments();
    if (adminCount > 0) {
      return NextResponse.json(
        { success: false, error: "Admin user already exists" },
        { status: 400 }
      );
    }
    
    // Create the admin user
    const admin = new Admin({
      email,
      password, // Will be hashed by the pre-save hook
      name,
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