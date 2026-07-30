import { Router } from "express";
import { db } from "../../database/db.js";
import { sendAutoReplyEmail, sendNotificationEmail } from "../../config/nodemailer.js";
import { strictLimiter } from "../../middleware/rateLimiter.js";
import { validate } from "../../middleware/validate.js";
import { contactSchema } from "../../validations/schemas.js";

const router = Router();

router.get("/", async (req, res, next) => {
    try {
        const contacts = await db.collection("contacts").find({}).sort({ createdAt: -1 }).toArray();
        
        res.status(200).json({
            success: true,
            count: contacts.length,
            data: contacts
        });
    } catch (error) {
        next(error);
    }
});

router.get("/:id", async (req, res, next) => {
    try {
        const { ObjectId } = await import('mongodb');
        const contact = await db.collection("contacts").findOne({ _id: new ObjectId(req.params.id) });
        
        if (!contact) {
            return res.status(404).json({
                success: false,
                message: "Contact not found"
            });
        }
        
        res.status(200).json({
            success: true,
            data: contact
        });
    } catch (error) {
        next(error);
    }
});

router.post("/", strictLimiter, validate(contactSchema), async (req, res, next) => {
    try {
        const { name, email, message } = req.body;

        const newContact = {
            name: name.trim(),
            email: email.toLowerCase().trim(),
            message: message.trim(),
            isRead: false,
            createdAt: new Date(),
            updatedAt: new Date()
        };
        
        const result = await db.collection("contacts").insertOne(newContact);
        
        // Send auto-reply email to the user (don't await to avoid delay)
        sendAutoReplyEmail(newContact.email, newContact.name, newContact.message)
            .then(() => console.log("Auto-reply sent successfully"))
            .catch((err) => console.error("Failed to send auto-reply:", err));
        
        // Send notification email to yourself (don't await to avoid delay)
        sendNotificationEmail(newContact)
            .then(() => console.log("Notification sent successfully"))
            .catch((err) => console.error("Failed to send notification:", err));
        
        res.status(201).json({
            success: true,
            message: "Message sent successfully! Check your email for a confirmation.",
            data: {
                id: result.insertedId,
                name: newContact.name,
                email: newContact.email,
                message: newContact.message,
                createdAt: newContact.createdAt
            }
        });
    } catch (error) {
        next(error);
    }
});

router.put("/:id", async (req, res, next) => {
    try {
        const { isRead } = req.body;
        const { ObjectId } = await import('mongodb');
        
        const updateData = {
            updatedAt: new Date()
        };
        
        if (isRead !== undefined) {
            updateData.isRead = isRead;
        }
        
        const result = await db.collection("contacts").updateOne(
            { _id: new ObjectId(req.params.id) },
            { $set: updateData }
        );
        
        if (result.matchedCount === 0) {
            return res.status(404).json({
                success: false,
                message: "Contact not found"
            });
        }
        
        res.status(200).json({
            success: true,
            message: "Message updated successfully"
        });
    } catch (error) {
        next(error);
    }
});

router.delete("/:id", async (req, res, next) => {
    try {
        const { ObjectId } = await import('mongodb');
        
        const result = await db.collection("contacts").deleteOne({ _id: new ObjectId(req.params.id) });
        
        if (result.deletedCount === 0) {
            return res.status(404).json({
                success: false,
                message: "Contact not found"
            });
        }
        
        res.status(200).json({
            success: true,
            message: "Message deleted successfully"
        });
    } catch (error) {
        next(error);
    }
});

router.patch("/:id/read", async (req, res, next) => {
    try {
        const { ObjectId } = await import('mongodb');
        
        const result = await db.collection("contacts").updateOne(
            { _id: new ObjectId(req.params.id) },
            { 
                $set: { 
                    isRead: true,
                    updatedAt: new Date()
                } 
            }
        );
        
        if (result.matchedCount === 0) {
            return res.status(404).json({
                success: false,
                message: "Contact not found"
            });
        }
        
        res.status(200).json({
            success: true,
            message: "Message marked as read"
        });
    } catch (error) {
        next(error);
    }
});

export default router;