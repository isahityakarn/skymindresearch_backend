import express from "express";
const router = express.Router();
import {
    getAllProjects,
    getProjectById,
    getProjectByPid,
    getProjectByMid,
    getProjectsByVendorId,
    getProjectsByCountryId,
    getActiveProjects,
    createProject,
    updateProject,
    deactivateProject,
    deleteProject
} from "../controllers/projectController.js";
import { protect } from "../middleware/authMiddleware.js";

// Route: Get all projects
// GET /api/projects
router.get("/", protect, getAllProjects);

// Route: Get active projects
// GET /api/projects/active
router.get("/active", protect, getActiveProjects);

// Route: Get projects by vendor ID
// GET /api/projects/vendor/:vendor_id
router.get("/vendor/:vendor_id", protect, getProjectsByVendorId);

// Route: Get projects by country ID
// GET /api/projects/country/:country_id
router.get("/country/:country_id", protect, getProjectsByCountryId);

// Route: Get project by PID
// GET /api/projects/pid/:pid
router.get("/pid/:pid", protect, getProjectByPid);

// Route: Get project by MID
// GET /api/projects/mid/:mid
router.get("/mid/:mid", protect, getProjectByMid);

// Route: Get project by ID
// GET /api/projects/:id
router.get("/:id", protect, getProjectById);

// Route: Create a new project
// POST /api/projects
router.post("/", protect, createProject);

// Route: Update a project
// PUT /api/projects/:id
router.put("/:id", protect, updateProject);

// Route: Deactivate a project (soft delete)
// PATCH /api/projects/:id/deactivate
router.patch("/:id/deactivate", protect, deactivateProject);

// Route: Delete a project
// DELETE /api/projects/:id
router.delete("/:id", protect, deleteProject);

export default router;
