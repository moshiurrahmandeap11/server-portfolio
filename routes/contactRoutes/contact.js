import { Router } from "express";
import { db } from "../../database/db.js";
import { sendAutoReplyEmail, sendNotificationEmail } from "../../config/nodemailer.js";

const router = Router();

router.get("/", async (req, res) => {
    try {
        const contacts = await db.collection("contacts").find({}).sort({ createdAt: -1 }).toArray();
        
        res.status(200).json({
            success: true,
            count: contacts.length,
            data: contacts
        });
    } catch (error) {
        console.error("Error fetching contacts:", error);
        res.status(500).json({
            success: false,
            message: "Failed to fetch contacts",
            error: error.message
        });
    }
});

router.get("/:id", async (req, res) => {
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
        console.error("Error fetching contact:", error);
        res.status(500).json({
            success: false,
            message: "Failed to fetch contact",
            error: error.message
        });
    }
});

router.post("/", async (req, res) => {
    try {
        const { name, email, message } = req.body;
        
        // Validation
        if (!name || !email || !message) {
            return res.status(400).json({
                success: false,
                message: "Please provide name, email and message"
            });
        }
        
        // Email validation
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            return res.status(400).json({
                success: false,
                message: "Please provide a valid email address"
            });
        }
        
        // Name validation (minimum 2 characters)
        if (name.length < 2) {
            return res.status(400).json({
                success: false,
                message: "Name must be at least 2 characters long"
            });
        }
        
        // Message validation (minimum 10 characters)
        if (message.length < 10) {
            return res.status(400).json({
                success: false,
                message: "Message must be at least 10 characters long"
            });
        }

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
        sendAutoReplyEmail(newContact.email, newContact.name)
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
        console.error("Error creating contact:", error);
        res.status(500).json({
            success: false,
            message: "Failed to send message",
            error: error.message
        });
    }
});

router.put("/:id", async (req, res) => {
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
        console.error("Error updating contact:", error);
        res.status(500).json({
            success: false,
            message: "Failed to update message",
            error: error.message
        });
    }
});

router.delete("/:id", async (req, res) => {
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
        console.error("Error deleting contact:", error);
        res.status(500).json({
            success: false,
            message: "Failed to delete message",
            error: error.message
        });
    }
});

router.patch("/:id/read", async (req, res) => {
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
        console.error("Error marking as read:", error);
        res.status(500).json({
            success: false,
            message: "Failed to mark as read",
            error: error.message
        });
    }
});

export default router;