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
import { protect, adminOnly } from "../middleware/authMiddleware.js";

// All project routes require authentication and admin privileges
// adminOnly() defaults to 'admin' role only
// You can pass multiple roles: adminOnly('admin', 'manager', 'supervisor')

// Route: Get all projects
// GET /api/projects
router.get("/", protect, adminOnly(), getAllProjects);

// Route: Get active projects
// GET /api/projects/active
router.get("/active", protect, adminOnly(), getActiveProjects);

// Route: Get projects by vendor ID
// GET /api/projects/vendor/:vendor_id
router.get("/vendor/:vendor_id", protect, adminOnly(), getProjectsByVendorId);

// Route: Get projects by country ID
// GET /api/projects/country/:country_id
router.get("/country/:country_id", protect, adminOnly(), getProjectsByCountryId);

// Route: Get project by PID
// GET /api/projects/pid/:pid
router.get("/pid/:pid", protect, adminOnly(), getProjectByPid);

// Route: Get project by MID
// GET /api/projects/mid/:mid
router.get("/mid/:mid", protect, adminOnly(), getProjectByMid);

// Route: Get project by ID
// GET /api/projects/:id
router.get("/:id", protect, adminOnly(), getProjectById);

// Route: Create a new project
// POST /api/projects
router.post("/", protect, adminOnly(), createProject);

// Route: Update a project
// PUT /api/projects/:id
router.put("/:id", protect, adminOnly(), updateProject);

// Route: Deactivate a project (soft delete)
// PATCH /api/projects/:id/deactivate
router.patch("/:id/deactivate", protect, adminOnly(), deactivateProject);

// Route: Delete a project
// DELETE /api/projects/:id
router.delete("/:id", protect, adminOnly(), deleteProject);

export default router;


