import { NextRequest, NextResponse } from "next/server";
import { connectDb } from "@/lib/mongodb";
import Certificate from "@/models/certificate.model";
import { revalidateTag } from 'next/cache';

// GET all certificates
export async function GET() {
  try {
    await connectDb();
    const certificates = await Certificate.find({}).sort({ timestamp: -1 });
    return NextResponse.json({ success: true, certificates }, { status: 200 });
  } catch (error) {
    console.error("Error fetching certificates:", error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch certificates" },
      { status: 500 }
    );
  }
}

// POST a new certificate
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { title, platform, timestamp } = body;

    // Validate required fields
    if (!title || !platform) {
      return NextResponse.json(
        { success: false, error: "Missing required fields" },
        { status: 400 }
      );
    }

    await connectDb();
    
    const newCertificate = new Certificate({
      title,
      platform,
      timestamp: timestamp ? new Date(timestamp) : new Date(),
    });

    await newCertificate.save();
    
    // Revalidate cache
    revalidateTag('portfolio', 'default');
    
    return NextResponse.json(
      { success: true, message: "Certificate created successfully", certificate: newCertificate },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error creating certificate:", error);
    return NextResponse.json(
      { success: false, error: "Failed to create certificate" },
      { status: 500 }
    );
  }
}

// PUT to update a certificate
export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    const { id, title, platform, timestamp } = body;

    if (!id) {
      return NextResponse.json(
        { success: false, error: "Certificate ID is required" },
        { status: 400 }
      );
    }

    await connectDb();
    
    const updateData: any = {};
    if (title) updateData.title = title;
    if (platform) updateData.platform = platform;
    if (timestamp) updateData.timestamp = new Date(timestamp);
    
    const updatedCertificate = await Certificate.findByIdAndUpdate(
      id,
      updateData,
      { new: true }
    );

    if (!updatedCertificate) {
      return NextResponse.json(
        { success: false, error: "Certificate not found" },
        { status: 404 }
      );
    }

    // Revalidate cache
    revalidateTag('portfolio', 'default');

    return NextResponse.json(
      { success: true, message: "Certificate updated successfully", certificate: updatedCertificate },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error updating certificate:", error);
    return NextResponse.json(
      { success: false, error: "Failed to update certificate" },
      { status: 500 }
    );
  }
}

// DELETE a certificate
export async function DELETE(request: NextRequest) {
  try {
    const url = new URL(request.url);
    const id = url.searchParams.get("id");

    if (!id) {
      return NextResponse.json(
        { success: false, error: "Certificate ID is required" },
        { status: 400 }
      );
    }

    await connectDb();
    
    const deletedCertificate = await Certificate.findByIdAndDelete(id);

    if (!deletedCertificate) {
      return NextResponse.json(
        { success: false, error: "Certificate not found" },
        { status: 404 }
      );
    }

    // Revalidate cache
    revalidateTag('portfolio', 'default');

    return NextResponse.json(
      { success: true, message: "Certificate deleted successfully" },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error deleting certificate:", error);
    return NextResponse.json(
      { success: false, error: "Failed to delete certificate" },
      { status: 500 }
    );
  }
} 