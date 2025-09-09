import { NextRequest, NextResponse } from "next/server";
import { sendMailToDeveloper } from "@/lib/resend";

export async function POST(request: NextRequest) {
  try {
    const { name, email, title, message } = await request.json();
    
    // Validate input
    if (!name || !email || !message) {
      return NextResponse.json(
        { success: false, error: "Name, email, and message are required" },
        { status: 400 }
      );
    }
    
    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { success: false, error: "Please enter a valid email address" },
        { status: 400 }
      );
    }
    
    // Send email using Resend
    await sendMailToDeveloper(name, email, title || `Portfolio Contact: Message from ${name}`, message);
    
    return NextResponse.json({
      success: true,
      message: "Email sent successfully",
    });
    
  } catch (error) {
    console.error("Error sending email:", error);
    return NextResponse.json(
      { success: false, error: "Failed to send email" },
      { status: 500 }
    );
  }
}

export async function GET() {
  return NextResponse.json(
    { message: "Email endpoint ready" },
    { status: 200 }
  );
}
