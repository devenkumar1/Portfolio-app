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
        { error: "No file uploaded" },
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
      folder: "portfolio_images",
      resource_type: "image",
    });

    return NextResponse.json({
      message: "File uploaded successfully",
      url: uploadResult.secure_url
    });

  } catch (error) {
    console.error('Upload error:', error);
    return NextResponse.json(
      { error: "File upload failed" },
      { status: 500 }
    );
  }
}

// Handle GET requests
export async function GET() {
  return NextResponse.json(
    { message: "Upload endpoint ready" },
    { status: 200 }
  );
}
