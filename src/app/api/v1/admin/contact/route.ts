import { NextRequest, NextResponse } from "next/server";
import { connectDb } from "@/lib/mongodb";
import Contact from "@/models/contact.model";
import { revalidateTag } from 'next/cache';

// GET contact information
export async function GET() {
  try {
    await connectDb();
    const contact = await Contact.findOne();
    
    if (!contact) {
      return NextResponse.json(
        { success: false, error: "Contact information not found" },
        { status: 404 }
      );
    }
    
    return NextResponse.json({ success: true, contact }, { status: 200 });
  } catch (error) {
    console.error("Error fetching contact information:", error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch contact information" },
      { status: 500 }
    );
  }
}

// POST or update contact information
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { email, phone, address, github, linkedin, twitter, instagram } = body;

    // Validate required fields
    if (!email) {
      return NextResponse.json(
        { success: false, error: "Email is required" },
        { status: 400 }
      );
    }

    await connectDb();
    
    // Find existing contact or create new one
    const existingContact = await Contact.findOne();
    
    let contact;
    if (existingContact) {
      // Update existing contact
      contact = await Contact.findByIdAndUpdate(
        existingContact._id,
        {
          email,
          phone: phone || existingContact.phone,
          address: address || existingContact.address,
          github: github || existingContact.github,
          linkedin: linkedin || existingContact.linkedin,
          twitter: twitter || existingContact.twitter,
          instagram: instagram || existingContact.instagram,
        },
        { new: true }
      );
    } else {
      // Create new contact
      contact = new Contact({
        email,
        phone: phone || "",
        address: address || "",
        github: github || "",
        linkedin: linkedin || "",
        twitter: twitter || "",
        instagram: instagram || "",
      });
      await contact.save();
    }
    
    // Revalidate cache
    revalidateTag('portfolio', 'default');
    
    return NextResponse.json(
      { success: true, message: "Contact information saved successfully", contact },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error saving contact information:", error);
    return NextResponse.json(
      { success: false, error: "Failed to save contact information" },
      { status: 500 }
    );
  }
}

// PUT to update contact information (alternative to POST)
export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    const { email, phone, address, github, linkedin, twitter, instagram } = body;

    await connectDb();
    
    // Find existing contact
    const existingContact = await Contact.findOne();
    
    if (!existingContact) {
      return NextResponse.json(
        { success: false, error: "Contact information not found. Use POST to create." },
        { status: 404 }
      );
    }
    
    // Update fields only if provided
    const updateData: any = {};
    if (email) updateData.email = email;
    if (phone !== undefined) updateData.phone = phone;
    if (address !== undefined) updateData.address = address;
    if (github !== undefined) updateData.github = github;
    if (linkedin !== undefined) updateData.linkedin = linkedin;
    if (twitter !== undefined) updateData.twitter = twitter;
    if (instagram !== undefined) updateData.instagram = instagram;
    
    const updatedContact = await Contact.findByIdAndUpdate(
      existingContact._id,
      updateData,
      { new: true }
    );
    
    // Revalidate cache
    revalidateTag('portfolio', 'default');
    
    return NextResponse.json(
      { success: true, message: "Contact information updated successfully", contact: updatedContact },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error updating contact information:", error);
    return NextResponse.json(
      { success: false, error: "Failed to update contact information" },
      { status: 500 }
    );
  }
} 