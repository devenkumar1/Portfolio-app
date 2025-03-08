import { NextRequest, NextResponse } from "next/server";
import cloudinary from "@/lib/Cloudinary";
import { writeFile } from 'fs/promises';
import { join } from 'path';

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get('file') as File;
    
    if (!file) {
      return NextResponse.json(
        { success: false, error: "No file uploaded" },
        { status: 400 }
      );
    }

    // Check file type (allow PDF, DOC, DOCX)
    const fileType = file.type;
    if (!fileType.includes('pdf') && !fileType.includes('doc') && !fileType.includes('msword') && !fileType.includes('officedocument')) {
      return NextResponse.json(
        { success: false, error: "Invalid file type. Only PDF and Word documents are allowed." },
        { status: 400 }
      );
    }

    // Convert file to buffer
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // Save file temporarily
    const tempPath = join('/tmp', file.name);
    await writeFile(tempPath, buffer);

    // Upload to Cloudinary
    const uploadResult = await cloudinary.uploader.upload(tempPath, {
      folder: "portfolio_resumes",
      resource_type: "raw", // Use 'raw' for non-image files
    });

    return NextResponse.json({
      success: true,
      message: "Resume uploaded successfully",
      url: uploadResult.secure_url
    });

  } catch (error) {
    console.error('Resume upload error:', error);
    return NextResponse.json(
      { success: false, error: "Resume upload failed" },
      { status: 500 }
    );
  }
}

// Handle GET requests
export async function GET() {
  return NextResponse.json(
    { success: true, message: "Resume upload endpoint ready" },
    { status: 200 }
  );
} 