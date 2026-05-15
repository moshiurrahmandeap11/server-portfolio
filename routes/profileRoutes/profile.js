import { Router } from "express";
import { cloudinary, upload } from "../../config/cloudinary.js";
import { db } from "../../database/db.js";

const router = Router();

// GET profile
router.get("/", async (req, res) => {
    try {
        const profile = await db.collection("profile").findOne({});
        
        if (!profile) {
            return res.status(404).json({
                success: false,
                message: "Profile not found"
            });
        }
        
        res.status(200).json({
            success: true,
            data: profile
        });
    } catch (error) {
        console.error("Error fetching profile:", error);
        res.status(500).json({
            success: false,
            message: "Failed to fetch profile",
            error: error.message
        });
    }
});

// POST - Create profile with profile picture and resume link
router.post("/", upload.fields([
    { name: "profilePicture", maxCount: 1 }
]), async (req, res) => {
    try {
        // Check if profile already exists
        const existingProfile = await db.collection("profile").findOne({});
        if (existingProfile) {
            return res.status(400).json({
                success: false,
                message: "Profile already exists. Use PUT to update."
            });
        }
        
        const { resumeLink } = req.body;
        
        // Handle profile picture upload
        let profilePictureData = null;
        if (req.files && req.files['profilePicture']) {
            const profilePicFile = req.files['profilePicture'][0];
            profilePictureData = {
                url: profilePicFile.path,
                publicId: profilePicFile.filename,
                mediaType: 'image'
            };
        }
        
        // Handle resume link
        let resumeData = null;
        if (resumeLink) {
            resumeData = {
                url: resumeLink,
                fileName: "Resume.pdf"
            };
        }
        
        const profile = {
            profilePicture: profilePictureData,
            resume: resumeData,
            createdAt: new Date(),
            updatedAt: new Date()
        };
        
        const result = await db.collection("profile").insertOne(profile);
        
        res.status(201).json({
            success: true,
            message: "Profile created successfully",
            data: { ...profile, _id: result.insertedId }
        });
    } catch (error) {
        console.error("Error creating profile:", error);
        res.status(500).json({
            success: false,
            message: "Failed to create profile",
            error: error.message
        });
    }
});

// PUT - Update profile picture and/or resume link
router.put("/", upload.fields([
    { name: "profilePicture", maxCount: 1 }
]), async (req, res) => {
    try {
        const existingProfile = await db.collection("profile").findOne({});
        
        if (!existingProfile) {
            return res.status(404).json({
                success: false,
                message: "Profile not found. Use POST to create first."
            });
        }
        
        const { resumeLink } = req.body;
        
        let updateData = {
            updatedAt: new Date()
        };
        
        // Handle profile picture update
        if (req.files && req.files['profilePicture']) {
            if (existingProfile.profilePicture && existingProfile.profilePicture.publicId) {
                await cloudinary.uploader.destroy(existingProfile.profilePicture.publicId);
            }
            
            const profilePicFile = req.files['profilePicture'][0];
            updateData.profilePicture = {
                url: profilePicFile.path,
                publicId: profilePicFile.filename,
                mediaType: 'image'
            };
        } else {
            updateData.profilePicture = existingProfile.profilePicture;
        }
        
        // Handle resume link
        if (resumeLink) {
            updateData.resume = {
                url: resumeLink,
                fileName: "Resume.pdf"
            };
        } else {
            updateData.resume = existingProfile.resume;
        }
        
        await db.collection("profile").updateOne(
            { _id: existingProfile._id },
            { $set: updateData }
        );
        
        const updatedProfile = await db.collection("profile").findOne({ _id: existingProfile._id });
        
        res.status(200).json({
            success: true,
            message: "Profile updated successfully",
            data: updatedProfile
        });
    } catch (error) {
        console.error("Error updating profile:", error);
        res.status(500).json({
            success: false,
            message: "Failed to update profile",
            error: error.message
        });
    }
});

// DELETE - Remove profile picture only
router.put("/remove-picture", async (req, res) => {
    try {
        const existingProfile = await db.collection("profile").findOne({});
        
        if (!existingProfile) {
            return res.status(404).json({
                success: false,
                message: "Profile not found."
            });
        }
        
        if (existingProfile.profilePicture && existingProfile.profilePicture.publicId) {
            await cloudinary.uploader.destroy(existingProfile.profilePicture.publicId);
        }
        
        await db.collection("profile").updateOne(
            { _id: existingProfile._id },
            { 
                $set: { 
                    profilePicture: null,
                    updatedAt: new Date()
                } 
            }
        );
        
        res.status(200).json({
            success: true,
            message: "Profile picture removed successfully"
        });
    } catch (error) {
        console.error("Error removing profile picture:", error);
        res.status(500).json({
            success: false,
            message: "Failed to remove profile picture",
            error: error.message
        });
    }
});

// DELETE - Remove resume only
router.put("/remove-resume", async (req, res) => {
    try {
        const existingProfile = await db.collection("profile").findOne({});
        
        if (!existingProfile) {
            return res.status(404).json({
                success: false,
                message: "Profile not found."
            });
        }
        
        await db.collection("profile").updateOne(
            { _id: existingProfile._id },
            { 
                $set: { 
                    resume: null,
                    updatedAt: new Date()
                } 
            }
        );
        
        res.status(200).json({
            success: true,
            message: "Resume removed successfully"
        });
    } catch (error) {
        console.error("Error removing resume:", error);
        res.status(500).json({
            success: false,
            message: "Failed to remove resume",
            error: error.message
        });
    }
});

export default router;