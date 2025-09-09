import { Resend } from 'resend'

const RESEND_API_KEY = process.env.RESEND_API_KEY;

if(!RESEND_API_KEY){
    throw new Error("Please provide RESEND_API_KEY in environment variables");
}

const resend = new Resend(RESEND_API_KEY);
const userEmail = 'devenkumar540@gmail.com';


export async function sendMailToDeveloper(senderName:string,senderMail:string,title:string,message:string){
    if(!senderMail || !message.trim()){
        throw Error("All fields are required");
    }
    
    // Resend requires a verified domain for the 'from' field
    // Use your verified domain instead of the sender's email
    await resend.emails.send({
        from: 'onboarding@resend.dev', // Use Resend's default sending domain
        to: userEmail,
        subject: title,
        html: `
            <h2>New Contact Form Submission</h2>
            <p><strong>From:</strong> ${senderName} (${senderMail})</p>
            <p><strong>Subject:</strong> ${title}</p>
            <p><strong>Message:</strong></p>
            <p>${message}</p>
        `,
        replyTo: senderMail // This allows you to reply directly to the sender
    });
}