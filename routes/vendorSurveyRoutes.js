import express from "express";
const router = express.Router();
import {
    getAllVendorSurveys,
    getVendorSurveyById,
    getVendorSurveysByVendorId,
    getVendorSurveysByProjectId,
    getVendorSurveysByPid,
    getVendorSurveysByUserId,
    getVendorSurveysByMid,
    getVendorSurveysByStatus,
    getVendorSurveysByIp,
    createVendorSurvey,
    updateVendorSurvey,
    updateVendorSurveyStatus,
    updateVendorSurveyEndIp,
    deleteVendorSurvey
} from "../controllers/vendorSurveyController.js";
import { protect } from "../middleware/authMiddleware.js";

// Route: Get all vendor surveys
// GET /api/vendor-surveys
router.get("/", protect, getAllVendorSurveys);

// Route: Get vendor surveys by vendor ID
// GET /api/vendor-surveys/vendor/:vendor_id
router.get("/vendor/:vendor_id", protect, getVendorSurveysByVendorId);

// Route: Get vendor surveys by project ID
// GET /api/vendor-surveys/project/:project_id
router.get("/project/:project_id", protect, getVendorSurveysByProjectId);

// Route: Get vendor surveys by PID
// GET /api/vendor-surveys/pid/:pid
router.get("/pid/:pid", protect, getVendorSurveysByPid);

// Route: Get vendor surveys by user ID
// GET /api/vendor-surveys/user/:uid
router.get("/user/:uid", protect, getVendorSurveysByUserId);

// Route: Get vendor surveys by MID
// GET /api/vendor-surveys/mid/:mid
router.get("/mid/:mid", protect, getVendorSurveysByMid);

// Route: Get vendor surveys by status
// GET /api/vendor-surveys/status/:status
router.get("/status/:status", protect, getVendorSurveysByStatus);

// Route: Get vendor surveys by IP address
// GET /api/vendor-surveys/ip/:ip
router.get("/ip/:ip", protect, getVendorSurveysByIp);

// Route: Get vendor survey by ID
// GET /api/vendor-surveys/:id
router.get("/:id", protect, getVendorSurveyById);

// Route: Create a new vendor survey
// POST /api/vendor-surveys
router.post("/", protect, createVendorSurvey);

// Route: Update a vendor survey
// PUT /api/vendor-surveys/:id
router.put("/:id", protect, updateVendorSurvey);

// Route: Update vendor survey status
// PATCH /api/vendor-surveys/:id/status
router.patch("/:id/status", protect, updateVendorSurveyStatus);

// Route: Update vendor survey end IP
// PATCH /api/vendor-surveys/:id/end-ip
router.patch("/:id/end-ip", protect, updateVendorSurveyEndIp);

// Route: Delete a vendor survey
// DELETE /api/vendor-surveys/:id
router.delete("/:id", protect, deleteVendorSurvey);

export default router;
