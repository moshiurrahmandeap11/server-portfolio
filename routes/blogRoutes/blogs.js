import { Router } from "express";
import { ObjectId } from "mongodb";
import { cloudinary, upload } from "../../config/cloudinary.js";
import { db } from "../../database/db.js";

const router = Router();

// GET all blogs with limitation
router.get("/", async (req, res) => {
    try {
        const limit = parseInt(req.query.limit) || 10;
        const page = parseInt(req.query.page) || 1;
        const skip = (page - 1) * limit;
        
        const blogs = await db.collection("blogs")
            .find({})
            .sort({ createdAt: -1 })
            .skip(skip)
            .limit(limit)
            .toArray();
        
        const total = await db.collection("blogs").countDocuments();
        
        res.status(200).json({
            success: true,
            message: "All blogs successfully fetched",
            data: blogs,
            pagination: {
                currentPage: page,
                totalPages: Math.ceil(total / limit),
                totalItems: total,
                itemsPerPage: limit
            }
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Error fetching blogs",
            error: error.message
        });
    }
});

// GET single blog by ID
router.get("/:id", async (req, res) => {
    try {
        const { id } = req.params;
        
        if (!ObjectId.isValid(id)) {
            return res.status(400).json({
                success: false,
                message: "Invalid blog ID format"
            });
        }
        
        const blog = await db.collection("blogs").findOne({ _id: new ObjectId(id) });
        
        if (!blog) {
            return res.status(404).json({
                success: false,
                message: "Blog not found"
            });
        }
        
        res.status(200).json({
            success: true,
            message: "Blog fetched successfully",
            data: blog
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Error fetching blog",
            error: error.message
        });
    }
});

// POST create new blog with thumbnail and media
router.post("/", upload.fields([
    { name: "thumbnail", maxCount: 1 },
    { name: "media", maxCount: 1 }
]), async (req, res) => {
    try {
        const { title, content, author, description } = req.body;
        
        // Validation
        if (!title || !content || !author) {
            return res.status(400).json({
                success: false,
                message: "Title, content and author are required"
            });
        }
        
        // Handle thumbnail upload
        let thumbnailData = null;
        if (req.files && req.files['thumbnail']) {
            const thumbnailFile = req.files['thumbnail'][0];
            thumbnailData = {
                url: thumbnailFile.path,
                publicId: thumbnailFile.filename,
                mediaType: 'image'
            };
        }
        
        // Handle media upload (video/image)
        let mediaData = null;
        if (req.files && req.files['media']) {
            const mediaFile = req.files['media'][0];
            const mediaType = mediaFile.mimetype.startsWith('video/') ? 'video' : 'image';
            mediaData = {
                url: mediaFile.path,
                publicId: mediaFile.filename,
                mediaType: mediaType
            };
        }
        
        const blog = {
            title,
            content,
            author,
            description: description || content.substring(0, 150), // Auto description if not provided
            thumbnail: thumbnailData,
            media: mediaData,
            createdAt: new Date(),
            updatedAt: new Date()
        };
        
        const result = await db.collection("blogs").insertOne(blog);
        
        res.status(201).json({
            success: true,
            message: "Blog created successfully with thumbnail",
            data: { ...blog, _id: result.insertedId }
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Error creating blog",
            error: error.message
        });
    }
});

// PUT update complete blog
router.put("/:id", upload.fields([
    { name: "thumbnail", maxCount: 1 },
    { name: "media", maxCount: 1 }
]), async (req, res) => {
    try {
        const { id } = req.params;
        const { title, content, author, description } = req.body;
        
        if (!ObjectId.isValid(id)) {
            return res.status(400).json({
                success: false,
                message: "Invalid blog ID format"
            });
        }
        
        const existingBlog = await db.collection("blogs").findOne({ _id: new ObjectId(id) });
        
        if (!existingBlog) {
            return res.status(404).json({
                success: false,
                message: "Blog not found"
            });
        }
        
        let updateData = {
            title: title || existingBlog.title,
            content: content || existingBlog.content,
            author: author || existingBlog.author,
            description: description || existingBlog.description,
            updatedAt: new Date()
        };
        
        // Handle thumbnail update
        if (req.files && req.files['thumbnail']) {
            // Delete old thumbnail from Cloudinary if exists
            if (existingBlog.thumbnail && existingBlog.thumbnail.publicId) {
                await cloudinary.uploader.destroy(existingBlog.thumbnail.publicId);
            }
            
            const thumbnailFile = req.files['thumbnail'][0];
            updateData.thumbnail = {
                url: thumbnailFile.path,
                publicId: thumbnailFile.filename,
                mediaType: 'image'
            };
        } else {
            updateData.thumbnail = existingBlog.thumbnail;
        }
        
        // Handle media update
        if (req.files && req.files['media']) {
            // Delete old media from Cloudinary if exists
            if (existingBlog.media && existingBlog.media.publicId) {
                await cloudinary.uploader.destroy(existingBlog.media.publicId);
            }
            
            const mediaFile = req.files['media'][0];
            const mediaType = mediaFile.mimetype.startsWith('video/') ? 'video' : 'image';
            updateData.media = {
                url: mediaFile.path,
                publicId: mediaFile.filename,
                mediaType: mediaType
            };
        } else {
            updateData.media = existingBlog.media;
        }
        
        await db.collection("blogs").updateOne(
            { _id: new ObjectId(id) },
            { $set: updateData }
        );
        
        const updatedBlog = await db.collection("blogs").findOne({ _id: new ObjectId(id) });
        
        res.status(200).json({
            success: true,
            message: "Blog updated successfully",
            data: updatedBlog
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Error updating blog",
            error: error.message
        });
    }
});

// PATCH partially update blog
router.patch("/:id", upload.fields([
    { name: "thumbnail", maxCount: 1 },
    { name: "media", maxCount: 1 }
]), async (req, res) => {
    try {
        const { id } = req.params;
        const updates = req.body;
        
        if (!ObjectId.isValid(id)) {
            return res.status(400).json({
                success: false,
                message: "Invalid blog ID format"
            });
        }
        
        const existingBlog = await db.collection("blogs").findOne({ _id: new ObjectId(id) });
        
        if (!existingBlog) {
            return res.status(404).json({
                success: false,
                message: "Blog not found"
            });
        }
        
        let updateData = { updatedAt: new Date() };
        
        // Only add fields that are provided
        if (updates.title) updateData.title = updates.title;
        if (updates.content) updateData.content = updates.content;
        if (updates.author) updateData.author = updates.author;
        if (updates.description) updateData.description = updates.description;
        
        // Handle thumbnail update
        if (req.files && req.files['thumbnail']) {
            // Delete old thumbnail from Cloudinary if exists
            if (existingBlog.thumbnail && existingBlog.thumbnail.publicId) {
                await cloudinary.uploader.destroy(existingBlog.thumbnail.publicId);
            }
            
            const thumbnailFile = req.files['thumbnail'][0];
            updateData.thumbnail = {
                url: thumbnailFile.path,
                publicId: thumbnailFile.filename,
                mediaType: 'image'
            };
        }
        
        // Handle media update
        if (req.files && req.files['media']) {
            // Delete old media from Cloudinary if exists
            if (existingBlog.media && existingBlog.media.publicId) {
                await cloudinary.uploader.destroy(existingBlog.media.publicId);
            }
            
            const mediaFile = req.files['media'][0];
            const mediaType = mediaFile.mimetype.startsWith('video/') ? 'video' : 'image';
            updateData.media = {
                url: mediaFile.path,
                publicId: mediaFile.filename,
                mediaType: mediaType
            };
        }
        
        await db.collection("blogs").updateOne(
            { _id: new ObjectId(id) },
            { $set: updateData }
        );
        
        const updatedBlog = await db.collection("blogs").findOne({ _id: new ObjectId(id) });
        
        res.status(200).json({
            success: true,
            message: "Blog partially updated successfully",
            data: updatedBlog
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Error updating blog",
            error: error.message
        });
    }
});

// DELETE blog
router.delete("/:id", async (req, res) => {
    try {
        const { id } = req.params;
        
        if (!ObjectId.isValid(id)) {
            return res.status(400).json({
                success: false,
                message: "Invalid blog ID format"
            });
        }
        
        const blog = await db.collection("blogs").findOne({ _id: new ObjectId(id) });
        
        if (!blog) {
            return res.status(404).json({
                success: false,
                message: "Blog not found"
            });
        }
        
        // Delete thumbnail from Cloudinary if exists
        if (blog.thumbnail && blog.thumbnail.publicId) {
            await cloudinary.uploader.destroy(blog.thumbnail.publicId);
        }
        
        // Delete media from Cloudinary if exists
        if (blog.media && blog.media.publicId) {
            await cloudinary.uploader.destroy(blog.media.publicId);
        }
        
        await db.collection("blogs").deleteOne({ _id: new ObjectId(id) });
        
        res.status(200).json({
            success: true,
            message: "Blog deleted successfully"
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Error deleting blog",
            error: error.message
        });
    }
});




export default router;