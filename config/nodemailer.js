import nodemailer from "nodemailer";
import { generateAIReply } from "./aiReply.js";

// Create transporter
const transporter = nodemailer.createTransport({
    service: "gmail",
    host: process.env.SMTP_HOST || "smtp.gmail.com",
    port: parseInt(process.env.SMTP_PORT) || 587,
    secure: false,
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
    },
});

// Verify transporter connection
transporter.verify((error, success) => {
    if (error) {
        console.error("Email transporter error:", error);
    } else {
        console.log("Email server is ready to send messages");
    }
});

// Send auto-reply to the contact (with AI or fallback)
export const sendAutoReplyEmail = async (to, name, message) => {
    try {
        let htmlContent;
        let usedAI = false;

        // Try to generate AI reply
        try {
            console.log(` Generating AI reply for: ${name}`);
            const aiReply = await generateAIReply({ name, email: to, message });
            
            if (aiReply && aiReply.length > 100) {
                // Validate that AI returned proper HTML
                if (aiReply.includes('<!DOCTYPE html>') || aiReply.includes('<html')) {
                    htmlContent = aiReply;
                    usedAI = true;
                    console.log(" Using AI-generated reply");
                } else {
                    console.log(" AI response doesn't contain valid HTML, using fallback");
                }
            } else {
                console.log(" AI response too short or empty, using fallback");
            }
        } catch (aiError) {
            console.log(" AI generation failed:", aiError.message);
        }

        // Use fallback template if AI failed
        if (!htmlContent) {
            console.log(" Using fallback template");
            htmlContent = getFallbackTemplate(name, message);
        }

        const subject = usedAI 
            ? `Re: Your Message - Moshiur Rahman `
            : "Thank You for Contacting Me! ";

        const mailOptions = {
            from: `"noreply" <${process.env.EMAIL_USER}>`,
            to: to,
            subject: subject,
            html: htmlContent,
        };

        const info = await transporter.sendMail(mailOptions);
        console.log(` Auto-reply email sent (AI: ${usedAI}):`, info.messageId);
        return info;
    } catch (error) {
        console.error(" Error sending auto-reply email:", error);
        throw error;
    }
};

// Fallback template when AI fails
const getFallbackTemplate = (name) => {
    return `
        <!DOCTYPE html>
        <html>
        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
        </head>
        <body style="margin: 0; padding: 0; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background-color: #0a0f1e;">
            <div style="max-width: 600px; margin: 0 auto; padding: 20px;">
                
                <!-- Header -->
                <div style="background: linear-gradient(135deg, #f97316, #ef4444); padding: 40px 30px; border-radius: 20px 20px 0 0; text-align: center;">
                    <h1 style="color: white; margin: 0; font-size: 28px; font-weight: 700;">Message Received! </h1>
                    <p style="color: rgba(255,255,255,0.9); margin: 10px 0 0 0; font-size: 16px;">I'll get back to you soon</p>
                </div>
                
                <!-- Body -->
                <div style="background: #111827; padding: 30px; border-radius: 0 0 20px 20px; border: 1px solid #1f2937; border-top: none;">
                    
                    <p style="color: #ffffff; font-size: 16px; line-height: 1.6; margin: 0 0 20px 0;">
                        Hi <strong style="color: #f97316;">${name}</strong>, 
                    </p>
                    
                    <p style="color: #ffffff; font-size: 15px; line-height: 1.8; margin: 0 0 20px 0;">
                        Thank you for reaching out! I've received your message and will review it as soon as possible.
                    </p>
                    
                    <p style="color: #ffffff; font-size: 15px; line-height: 1.8; margin: 0 0 20px 0;">
                        I typically respond within <strong style="color: #f97316;">24-48 hours</strong>. If your matter is urgent, feel free to connect with me on LinkedIn.
                    </p>
                    
                    <!-- Divider -->
                    <div style="border-top: 1px solid #1f2937; margin: 25px 0;"></div>
                    
                    <!-- Quick Links -->
                    <div style="text-align: center; margin-bottom: 20px;">
                        <p style="color: #9ca3af; font-size: 14px; margin: 0 0 15px 0;">Connect with me:</p>
                        
                        <a href="https://moshiurrahman.online" style="display: inline-block; background: #f97316; color: white; text-decoration: none; padding: 12px 24px; border-radius: 10px; font-weight: 600; font-size: 14px; margin: 0 5px;"> Website</a>
                        
                        <a href="https://www.linkedin.com/in/moshiurrahmandeap" style="display: inline-block; background: #1f2937; color: white; text-decoration: none; padding: 12px 24px; border-radius: 10px; font-weight: 600; font-size: 14px; margin: 0 5px; border: 1px solid #374151;"> LinkedIn</a>
                        
                        <a href="https://github.com/moshiurrahmandeap11" style="display: inline-block; background: #1f2937; color: white; text-decoration: none; padding: 12px 24px; border-radius: 10px; font-weight: 600; font-size: 14px; margin: 0 5px; border: 1px solid #374151;"> GitHub</a>
                    </div>
                    
                    <!-- Footer -->
                    <div style="border-top: 1px solid #1f2937; padding-top: 20px; text-align: center;">
                        <p style="color: #6b7280; font-size: 12px; margin: 0 0 5px 0;">
                            This is an automated reply. Please do not reply to this email.
                        </p>
                        <p style="color: #6b7280; font-size: 12px; margin: 0;">
                            © ${new Date().getFullYear()} Moshiur Rahman. All rights reserved.
                        </p>
                    </div>
                </div>
            </div>
        </body>
        </html>
    `;
};

// Send notification to yourself
export const sendNotificationEmail = async (contactData) => {
    try {
        const mailOptions = {
            from: `"Portfolio Contact" <${process.env.EMAIL_USER}>`,
            to: process.env.PERSONAL_EMAIL || process.env.EMAIL_USER,
            subject: ` New Contact Message from ${contactData.name}`,
            html: `
                <!DOCTYPE html>
                <html>
                <head>
                    <meta charset="UTF-8">
                    <meta name="viewport" content="width=device-width, initial-scale=1.0">
                </head>
                <body style="margin: 0; padding: 0; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background-color: #0a0f1e;">
                    <div style="max-width: 600px; margin: 0 auto; padding: 20px;">
                        
                        <!-- Header -->
                        <div style="background: linear-gradient(135deg, #000000, #000000); padding: 30px; border-radius: 20px 20px 0 0; text-align: center;">
                            <h1 style="color: white; margin: 0; font-size: 24px; font-weight: 700;"> New Contact Message</h1>
                            <p style="color: rgba(255,255,255,0.8); margin: 8px 0 0 0; font-size: 14px;">You received a new message from your portfolio</p>
                        </div>
                        
                        <!-- Body -->
                        <div style="background: #111827; padding: 30px; border-radius: 0 0 20px 20px; border: 1px solid #1f2937; border-top: none;">
                            
                            <!-- Contact Details -->
                            <div style="background: #1a1f2e; border-radius: 12px; padding: 20px; margin-bottom: 20px;">
                                <div style="margin-bottom: 15px;">
                                    <p style="color: #6b7280; font-size: 12px; margin: 0 0 3px 0; text-transform: uppercase; letter-spacing: 1px;">From</p>
                                    <p style="color: #f97316; font-size: 16px; font-weight: 600; margin: 0;">${contactData.name}</p>
                                </div>
                                
                                <div style="margin-bottom: 15px;">
                                    <p style="color: #6b7280; font-size: 12px; margin: 0 0 3px 0; text-transform: uppercase; letter-spacing: 1px;">Email</p>
                                    <a href="mailto:${contactData.email}" style="color: #60a5fa; font-size: 15px; text-decoration: none; font-weight: 500;">${contactData.email}</a>
                                </div>
                                
                                <div style="margin-bottom: 15px;">
                                    <p style="color: #6b7280; font-size: 12px; margin: 0 0 3px 0; text-transform: uppercase; letter-spacing: 1px;">Date</p>
                                    <p style="color: #9ca3af; font-size: 14px; margin: 0;">${new Date(contactData.createdAt).toLocaleString('en-US', {
                                        year: 'numeric',
                                        month: 'long',
                                        day: 'numeric',
                                        hour: '2-digit',
                                        minute: '2-digit'
                                    })}</p>
                                </div>
                            </div>
                            
                            <!-- Message -->
                            <div style="background: #1a1f2e; border-radius: 12px; padding: 20px; margin-bottom: 20px;">
                                <p style="color: #6b7280; font-size: 12px; margin: 0 0 8px 0; text-transform: uppercase; letter-spacing: 1px;">Message</p>
                                <p style="color: #ffffff !important; font-size: 15px; line-height: 1.7; margin: 0; white-space: pre-wrap; word-break: break-word;">
                                    ${contactData.message}
                                </p>
                            </div>
                            
                            <!-- Quick Actions -->
                            <div style="text-align: center;">
                                <a href="mailto:${contactData.email}" style="display: inline-block; background: #f97316; color: white; text-decoration: none; padding: 12px 24px; border-radius: 10px; font-weight: 600; font-size: 14px; margin: 0 5px;"> Reply Now</a>
                                <a href="https://moshiurrahman.online/admin/contacts" style="display: inline-block; background: #1f2937; color: white; text-decoration: none; padding: 12px 24px; border-radius: 10px; font-weight: 600; font-size: 14px; margin: 0 5px; border: 1px solid #374151;"> View in Dashboard</a>
                            </div>
                        </div>
                    </div>
                </body>
                </html>
            `,
        };

        const info = await transporter.sendMail(mailOptions);
        console.log("Notification email sent:", info.messageId);
        return info;
    } catch (error) {
        console.error("Error sending notification email:", error);
        throw error;
    }
};

export default transporter;