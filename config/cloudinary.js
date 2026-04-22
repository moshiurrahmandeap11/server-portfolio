import { v2 as cloudinary } from 'cloudinary';
import dotenv from 'dotenv';
import multer from 'multer';
import { CloudinaryStorage } from 'multer-storage-cloudinary';

dotenv.config();

// Cloudinary configuration
cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
});

// Configure multer storage for Cloudinary
const storage = new CloudinaryStorage({
    cloudinary: cloudinary,
    params: async (req, file) => {
        // Check file type
        const isVideo = file.mimetype.startsWith('video/');
        
        return {
            folder: "blogs", // Cloudinary folder name
            resource_type: "auto", // Automatically detect image/video
            allowed_formats: isVideo ? ["mp4", "mov", "avi", "mkv"] : ["jpg", "jpeg", "png", "gif", "webp"],
            transformation: isVideo ? [
                { width: 1280, height: 720, crop: "limit" }
            ] : [
                { width: 1200, height: 800, crop: "limit" }
            ]
        };
    }
});

// Multer upload middleware
const upload = multer({
    storage: storage,
    limits: {
        fileSize: isVideo ? 100 * 1024 * 1024 : 5 * 1024 * 1024 // 100MB for video, 5MB for image
    },
    fileFilter: (req, file, cb) => {
        const allowedImageTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp'];
        const allowedVideoTypes = ['video/mp4', 'video/mov', 'video/avi', 'video/mkv'];
        
        if (allowedImageTypes.includes(file.mimetype) || allowedVideoTypes.includes(file.mimetype)) {
            cb(null, true);
        } else {
            cb(new Error('Invalid file type. Only images and videos are allowed!'), false);
        }
    }
});

export { cloudinary, upload };
