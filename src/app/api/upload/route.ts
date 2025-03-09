import { NextRequest, NextResponse } from "next/server";
import cloudinary from "@/lib/Cloudinary";
import { writeFile } from 'fs/promises';
import { join } from 'path';
import { tmpdir } from 'os';
import { mkdir } from 'fs/promises';
import { existsSync } from 'fs';

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

    // Use system's temp directory instead of hardcoded /tmp
    const tempDir = tmpdir();
    
    // Create a unique filename to avoid collisions
    const uniqueFilename = `${Date.now()}-${file.name.replace(/\s+/g, '_')}`;
    const tempPath = join(tempDir, uniqueFilename);
    
    try {
      // Write the file to the temp directory
      await writeFile(tempPath, buffer);
      console.log(`File saved to: ${tempPath}`);
      
      // Upload to Cloudinary
      const uploadResult = await cloudinary.uploader.upload(tempPath, {
        folder: "portfolio_images",
        resource_type: "image",
      });

      return NextResponse.json({
        message: "File uploaded successfully",
        url: uploadResult.secure_url
      });
      
    } catch (writeError: any) {
      console.error('Error writing file:', writeError);
      return NextResponse.json(
        { error: `Failed to save file: ${writeError.message}` },
        { status: 500 }
      );
    }

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
