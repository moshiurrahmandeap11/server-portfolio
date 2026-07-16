import { Router } from "express";
import { ObjectId } from "mongodb";
import { cloudinary, upload } from "../../config/cloudinary.js";
import { db } from "../../database/db.js";
import {
  getCache,
  setCache,
  deleteCache,
  deleteCachePattern,
} from "../../config/redis.js";

const router = Router();

const PROJECTS_LIST_CACHE_PREFIX = "projects:list";
const PROJECT_DETAIL_CACHE_PREFIX = "projects:detail";
const DEFAULT_CACHE_TTL = 300; // 5 minutes

// GET all projects (no pagination, all projects for portfolio)
router.get("/", async (req, res) => {
  try {
    const cacheKey = `${PROJECTS_LIST_CACHE_PREFIX}:all`;

    // Try cache first
    const cached = await getCache(cacheKey);
    if (cached) {
      return res.status(200).json({
        success: true,
        message: "All projects successfully fetched (cached)",
        data: cached,
      });
    }

    const projects = await db
      .collection("projects")
      .find({})
      .sort({ order: 1, createdAt: -1 })
      .toArray();

    // Store in cache
    await setCache(cacheKey, projects, DEFAULT_CACHE_TTL);

    res.status(200).json({
      success: true,
      message: "All projects successfully fetched",
      data: projects,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error fetching projects",
      error: error.message,
    });
  }
});

// GET single project by slug
router.get("/:slug", async (req, res) => {
  try {
    const { slug } = req.params;
    const cacheKey = `${PROJECT_DETAIL_CACHE_PREFIX}:${slug}`;

    // Try cache first
    const cached = await getCache(cacheKey);
    if (cached) {
      return res.status(200).json({
        success: true,
        message: "Project fetched successfully (cached)",
        data: cached,
      });
    }

    const project = await db.collection("projects").findOne({ slug });

    if (!project) {
      return res.status(404).json({
        success: false,
        message: "Project not found",
      });
    }

    // Store in cache
    await setCache(cacheKey, project, DEFAULT_CACHE_TTL);

    res.status(200).json({
      success: true,
      message: "Project fetched successfully",
      data: project,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error fetching project",
      error: error.message,
    });
  }
});

// POST create new project with thumbnail
router.post(
  "/",
  upload.fields([{ name: "thumbnail", maxCount: 1 }]),
  async (req, res) => {
    try {
      const {
        title,
        slug,
        short_description,
        description,
        techStack,
        features,
        challenges,
        learnings,
        links,
        screenshots,
        order,
      } = req.body;

      // Validation
      if (!title || !slug || !short_description || !description) {
        return res.status(400).json({
          success: false,
          message: "Title, slug, short_description and description are required",
        });
      }

      // Check slug uniqueness
      const existing = await db.collection("projects").findOne({ slug });
      if (existing) {
        return res.status(400).json({
          success: false,
          message: "A project with this slug already exists",
        });
      }

      // Handle thumbnail upload
      let thumbnailData = null;
      if (req.files && req.files["thumbnail"]) {
        const thumbnailFile = req.files["thumbnail"][0];
        thumbnailData = {
          url: thumbnailFile.path,
          publicId: thumbnailFile.filename,
          mediaType: "image",
        };
      }

      // Parse JSON arrays from form data
      const parseArray = (val) => {
        if (!val) return [];
        if (Array.isArray(val)) return val;
        try {
          const parsed = JSON.parse(val);
          return Array.isArray(parsed) ? parsed : [parsed];
        } catch {
          return val.split(",").map((s) => s.trim()).filter(Boolean);
        }
      };

      const parseLinks = (val) => {
        if (!val) return [];
        try {
          const parsed = JSON.parse(val);
          return Array.isArray(parsed) ? parsed : [parsed];
        } catch {
          return [];
        }
      };

      const project = {
        title,
        slug,
        short_description,
        description,
        techStack: parseArray(techStack),
        features: parseArray(features),
        challenges: parseArray(challenges),
        learnings: parseArray(learnings),
        links: parseLinks(links),
        screenshots: parseArray(screenshots),
        thumbnail: thumbnailData,
        order: parseInt(order) || 0,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      const result = await db.collection("projects").insertOne(project);

      // Invalidate list cache
      await deleteCachePattern(`${PROJECTS_LIST_CACHE_PREFIX}:*`);

      res.status(201).json({
        success: true,
        message: "Project created successfully",
        data: { ...project, _id: result.insertedId },
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: "Error creating project",
        error: error.message,
      });
    }
  }
);

// PUT update complete project
router.put(
  "/:slug",
  upload.fields([{ name: "thumbnail", maxCount: 1 }]),
  async (req, res) => {
    try {
      const { slug } = req.params;
      const {
        title,
        newSlug,
        short_description,
        description,
        techStack,
        features,
        challenges,
        learnings,
        links,
        screenshots,
        order,
      } = req.body;

      const existingProject = await db.collection("projects").findOne({ slug });

      if (!existingProject) {
        return res.status(404).json({
          success: false,
          message: "Project not found",
        });
      }

      // Check new slug uniqueness if changing
      if (newSlug && newSlug !== slug) {
        const slugTaken = await db.collection("projects").findOne({ slug: newSlug });
        if (slugTaken) {
          return res.status(400).json({
            success: false,
            message: "A project with this slug already exists",
          });
        }
      }

      // Parse JSON arrays
      const parseArray = (val) => {
        if (!val) return undefined;
        if (Array.isArray(val)) return val;
        try {
          const parsed = JSON.parse(val);
          return Array.isArray(parsed) ? parsed : [parsed];
        } catch {
          return val.split(",").map((s) => s.trim()).filter(Boolean);
        }
      };

      const parseLinks = (val) => {
        if (!val) return undefined;
        try {
          const parsed = JSON.parse(val);
          return Array.isArray(parsed) ? parsed : [parsed];
        } catch {
          return undefined;
        }
      };

      let updateData = {
        updatedAt: new Date(),
      };

      if (title) updateData.title = title;
      if (newSlug) updateData.slug = newSlug;
      if (short_description) updateData.short_description = short_description;
      if (description) updateData.description = description;
      if (order !== undefined) updateData.order = parseInt(order);

      const parsedTech = parseArray(techStack);
      if (parsedTech) updateData.techStack = parsedTech;
      const parsedFeatures = parseArray(features);
      if (parsedFeatures) updateData.features = parsedFeatures;
      const parsedChallenges = parseArray(challenges);
      if (parsedChallenges) updateData.challenges = parsedChallenges;
      const parsedLearnings = parseArray(learnings);
      if (parsedLearnings) updateData.learnings = parsedLearnings;
      const parsedScreenshots = parseArray(screenshots);
      if (parsedScreenshots) updateData.screenshots = parsedScreenshots;
      const parsedLinks = parseLinks(links);
      if (parsedLinks) updateData.links = parsedLinks;

      // Handle thumbnail update
      if (req.files && req.files["thumbnail"]) {
        // Delete old thumbnail from Cloudinary if exists
        if (existingProject.thumbnail && existingProject.thumbnail.publicId) {
          await cloudinary.uploader.destroy(existingProject.thumbnail.publicId);
        }

        const thumbnailFile = req.files["thumbnail"][0];
        updateData.thumbnail = {
          url: thumbnailFile.path,
          publicId: thumbnailFile.filename,
          mediaType: "image",
        };
      }

      await db
        .collection("projects")
        .updateOne({ _id: existingProject._id }, { $set: updateData });

      const updatedProject = await db
        .collection("projects")
        .findOne({ _id: existingProject._id });

      // Invalidate caches
      await deleteCache(`${PROJECT_DETAIL_CACHE_PREFIX}:${slug}`);
      if (newSlug && newSlug !== slug) {
        await deleteCache(`${PROJECT_DETAIL_CACHE_PREFIX}:${newSlug}`);
      }
      await deleteCachePattern(`${PROJECTS_LIST_CACHE_PREFIX}:*`);
      // Update detail cache with new data
      await setCache(
        `${PROJECT_DETAIL_CACHE_PREFIX}:${updatedProject.slug}`,
        updatedProject,
        DEFAULT_CACHE_TTL
      );

      res.status(200).json({
        success: true,
        message: "Project updated successfully",
        data: updatedProject,
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: "Error updating project",
        error: error.message,
      });
    }
  }
);

// PATCH partially update project
router.patch(
  "/:slug",
  upload.fields([{ name: "thumbnail", maxCount: 1 }]),
  async (req, res) => {
    try {
      const { slug } = req.params;
      const updates = req.body;

      const existingProject = await db.collection("projects").findOne({ slug });

      if (!existingProject) {
        return res.status(404).json({
          success: false,
          message: "Project not found",
        });
      }

      let updateData = { updatedAt: new Date() };

      // Only add fields that are provided
      if (updates.title) updateData.title = updates.title;
      if (updates.slug) updateData.slug = updates.slug;
      if (updates.short_description)
        updateData.short_description = updates.short_description;
      if (updates.description) updateData.description = updates.description;
      if (updates.order !== undefined) updateData.order = parseInt(updates.order);

      // Parse arrays if provided
      const parseArray = (val) => {
        if (!val) return undefined;
        if (Array.isArray(val)) return val;
        try {
          const parsed = JSON.parse(val);
          return Array.isArray(parsed) ? parsed : [parsed];
        } catch {
          return val.split(",").map((s) => s.trim()).filter(Boolean);
        }
      };

      const parsedTech = parseArray(updates.techStack);
      if (parsedTech) updateData.techStack = parsedTech;
      const parsedFeatures = parseArray(updates.features);
      if (parsedFeatures) updateData.features = parsedFeatures;
      const parsedChallenges = parseArray(updates.challenges);
      if (parsedChallenges) updateData.challenges = parsedChallenges;
      const parsedLearnings = parseArray(updates.learnings);
      if (parsedLearnings) updateData.learnings = parsedLearnings;
      const parsedScreenshots = parseArray(updates.screenshots);
      if (parsedScreenshots) updateData.screenshots = parsedScreenshots;

      if (updates.links) {
        try {
          const parsed = JSON.parse(updates.links);
          updateData.links = Array.isArray(parsed) ? parsed : [parsed];
        } catch {
          /* ignore invalid links */
        }
      }

      // Handle thumbnail update
      if (req.files && req.files["thumbnail"]) {
        if (existingProject.thumbnail && existingProject.thumbnail.publicId) {
          await cloudinary.uploader.destroy(existingProject.thumbnail.publicId);
        }

        const thumbnailFile = req.files["thumbnail"][0];
        updateData.thumbnail = {
          url: thumbnailFile.path,
          publicId: thumbnailFile.filename,
          mediaType: "image",
        };
      }

      await db
        .collection("projects")
        .updateOne({ _id: existingProject._id }, { $set: updateData });

      const updatedProject = await db
        .collection("projects")
        .findOne({ _id: existingProject._id });

      // Invalidate caches
      await deleteCache(`${PROJECT_DETAIL_CACHE_PREFIX}:${slug}`);
      if (updates.slug && updates.slug !== slug) {
        await deleteCache(`${PROJECT_DETAIL_CACHE_PREFIX}:${updates.slug}`);
      }
      await deleteCachePattern(`${PROJECTS_LIST_CACHE_PREFIX}:*`);
      await setCache(
        `${PROJECT_DETAIL_CACHE_PREFIX}:${updatedProject.slug}`,
        updatedProject,
        DEFAULT_CACHE_TTL
      );

      res.status(200).json({
        success: true,
        message: "Project partially updated successfully",
        data: updatedProject,
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: "Error updating project",
        error: error.message,
      });
    }
  }
);

// DELETE project
router.delete("/:slug", async (req, res) => {
  try {
    const { slug } = req.params;

    const project = await db.collection("projects").findOne({ slug });

    if (!project) {
      return res.status(404).json({
        success: false,
        message: "Project not found",
      });
    }

    // Delete thumbnail from Cloudinary if exists
    if (project.thumbnail && project.thumbnail.publicId) {
      await cloudinary.uploader.destroy(project.thumbnail.publicId);
    }

    await db.collection("projects").deleteOne({ _id: project._id });

    // Invalidate caches
    await deleteCache(`${PROJECT_DETAIL_CACHE_PREFIX}:${slug}`);
    await deleteCachePattern(`${PROJECTS_LIST_CACHE_PREFIX}:*`);

    res.status(200).json({
      success: true,
      message: "Project deleted successfully",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error deleting project",
      error: error.message,
    });
  }
});

export default router;
