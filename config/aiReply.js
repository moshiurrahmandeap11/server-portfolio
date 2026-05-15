import OpenAI from "openai";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load moshiur.json data
const moshiurData = JSON.parse(
    fs.readFileSync(path.join(__dirname, "moshiur.json"), "utf-8")
);

// Initialize OpenRouter client
const openai = new OpenAI({
    baseURL: "https://openrouter.ai/api/v1",
    apiKey: process.env.OPENROUTER_API_KEY,
    defaultHeaders: {
        "HTTP-Referer": "https://moshiurrahman.online",
        "X-Title": "Moshiur Portfolio",
    },
});

/**
 * Generate AI-powered email reply using OpenRouter
 */
export const generateAIReply = async (contactData) => {
    try {
        console.log("🔑 API Key exists:", !!process.env.OPENROUTER_API_KEY);

        const systemPrompt = `You are an email auto-reply writer for Moshiur Rahman (Software Engineer, Bangladesh).

Write a COMPLETE HTML email reply. The email goes to ${contactData.name} who sent: "${contactData.message}".

Moshibio:
- Name: Moshiur Rahman
- Role: Full-stack Software Engineer
- Website: https://moshiurrahman.online
- LinkedIn: https://www.linkedin.com/in/moshiurrahmandeap
- GitHub: https://github.com/moshiurrahmandeap11
- Skills: React, Next.js, TypeScript, Node.js, Express, MongoDB, Tailwind CSS
- Response time: 24-48 hours
- Location: Bangladesh

HTML RULES:
- Dark background: #0a0f1e or #111827
- ALL text color: #ffffff (white) - MANDATORY
- Headings can be: #f97316 (orange)
- Links color: #f97316
- Use ONLY inline styles
- Include: greeting, thank you, response time, relevant links, signature
- Professional but warm tone
- Output ONLY the HTML (no markdown, no code blocks)

TEMPLATE STRUCTURE:
<!DOCTYPE html>
<html>
<head><meta charset="UTF-8"></head>
<body style="margin:0;padding:20px;background-color:#0a0f1e;font-family:Arial,sans-serif;">
<div style="max-width:600px;margin:0 auto;">
<!-- Header -->
<div style="background:linear-gradient(135deg,#f97316,#ef4444);padding:40px 30px;border-radius:20px 20px 0 0;text-align:center;">
<h1 style="color:#ffffff;margin:0;font-size:28px;">Thanks for Reaching Out! </h1>
<p style="color:#ffffff;margin:10px 0 0;font-size:16px;">I'll get back to you soon</p>
</div>
<!-- Body -->
<div style="background:#111827;padding:30px;border-radius:0 0 20px 20px;border:1px solid #1f2937;">
<p style="color:#ffffff;font-size:16px;">Hi <strong style="color:#f97316;">${contactData.name}</strong>,</p>
<p style="color:#ffffff;font-size:15px;line-height:1.8;">[Write personalized reply referencing their message]</p>
<p style="color:#ffffff;font-size:15px;line-height:1.8;">I typically respond within <strong style="color:#f97316;">24-48 hours</strong>.</p>
<div style="border-top:1px solid #374151;margin:25px 0;"></div>
<p style="color:#ffffff;font-size:15px;">Best regards,<br><strong style="color:#f97316;">Moshiur Rahman</strong></p>
<div style="text-align:center;margin-top:20px;">
<a href="https://moshiurrahman.online" style="display:inline-block;background:#f97316;color:#ffffff;text-decoration:none;padding:10px 20px;border-radius:10px;margin:5px;">🌐 Website</a>
<a href="https://www.linkedin.com/in/moshiurrahmandeap" style="display:inline-block;background:#1f2937;color:#ffffff;text-decoration:none;padding:10px 20px;border-radius:10px;margin:5px;border:1px solid #374151;">💼 LinkedIn</a>
<a href="https://github.com/moshiurrahmandeap11" style="display:inline-block;background:#1f2937;color:#ffffff;text-decoration:none;padding:10px 20px;border-radius:10px;margin:5px;border:1px solid #374151;">🐙 GitHub</a>
</div>

<p style="color:#9ca3af;font-size:11px;">This is an automated acknowledgment. © ${new Date().getFullYear()} Moshiur Rahman</p>
</div>
</div>
</div>
</body>
</html>

IMPORTANT: Write the FULL HTML with all sections filled in. Make it personal. Minimum 1500 characters.`;

        let aiResponse = null;

        // Try primary model with higher max_tokens
        try {
            console.log("🟢 Attempting primary model...");
            
            const completion = await openai.chat.completions.create({
                model: "nvidia/nemotron-3-nano-omni-30b-a3b-reasoning:free",
                messages: [
                    { role: "system", content: systemPrompt },
                    { role: "user", content: `Write a complete HTML email reply for ${contactData.name}. Their message: "${contactData.message}". Output ONLY the full HTML.` }
                ],
                temperature: 0.8,
                max_tokens: 3000,
                top_p: 0.9,
            });

            console.log("📥 Primary status:", completion.choices?.[0]?.finish_reason);
            
            aiResponse = completion.choices[0]?.message?.content;
            
            // Check if response looks like valid HTML email
            if (aiResponse && aiResponse.includes("<!DOCTYPE html>") && aiResponse.length > 500) {
                console.log("✅ Primary model success, length:", aiResponse.length);
            } else {
                console.log("⚠️ Primary response invalid, length:", aiResponse?.length || 0);
                aiResponse = null;
            }
        } catch (primaryError) {
            console.error("❌ Primary model error:", primaryError.message);
        }

        // Try fallback model
        if (!aiResponse) {
            try {
                console.log("🟡 Attempting fallback model...");
                
                const fallbackCompletion = await openai.chat.completions.create({
                    model: "deepseek/deepseek-v4-flash:free",
                    messages: [
                        { role: "system", content: systemPrompt },
                        { role: "user", content: `Write a complete HTML email reply for ${contactData.name}. Their message: "${contactData.message}". Output the FULL HTML now.` }
                    ],
                    temperature: 0.8,
                    max_tokens: 4000,
                });

                console.log("📥 Fallback status:", fallbackCompletion.choices?.[0]?.finish_reason);
                
                aiResponse = fallbackCompletion.choices[0]?.message?.content;
                
                if (aiResponse && aiResponse.includes("<!DOCTYPE html>") && aiResponse.length > 500) {
                    console.log("✅ Fallback model success, length:", aiResponse.length);
                } else {
                    console.log("⚠️ Fallback response invalid, length:", aiResponse?.length || 0);
                    aiResponse = null;
                }
            } catch (fallbackError) {
                console.error("❌ Fallback model error:", fallbackError.message);
            }
        }

        if (!aiResponse || aiResponse.length < 500) {
            console.log("❌ No valid AI response generated");
            return null;
        }

        // Clean up
        aiResponse = aiResponse
            .replace(/```html\n?/gi, "")
            .replace(/```\n?/gi, "")
            .replace(/color:\s*#[0-9a-fA-F]{3,6}(?![fF])/g, "color: #ffffff")
            .trim();

        // Ensure it starts with DOCTYPE
        if (!aiResponse.toLowerCase().startsWith("<!doctype")) {
            aiResponse = "<!DOCTYPE html>\n" + aiResponse;
        }

        console.log(`✅ Final AI response: ${aiResponse.length} chars`);
        
        return aiResponse;
    } catch (error) {
        console.error("❌ Fatal error:", error.message);
        return null;
    }
};

export default openai;