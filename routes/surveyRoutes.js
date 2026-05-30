import express from "express";
const router = express.Router();
import {
    getAllSurveys,
    getSurveyById,
    getSurveysByProjectId,
    getSurveysByUserId,
    getSurveysByStatus,
    createSurvey,
    updateSurvey,
    updateSurveyStatus,
    updateSurveyEndIp,
    deleteSurvey
} from "../controllers/surveyController.js";
import { protect } from "../middleware/authMiddleware.js";

// Route: Get all surveys
// GET /api/surveys
router.get("/", protect, getAllSurveys);

// Route: Get surveys by project ID
// GET /api/surveys/project/:pid
router.get("/project/:pid", protect, getSurveysByProjectId);

// Route: Get surveys by user ID
// GET /api/surveys/user/:uid
router.get("/user/:uid", protect, getSurveysByUserId);

// Route: Get surveys by status
// GET /api/surveys/status/:status
router.get("/status/:status", protect, getSurveysByStatus);

// Route: Get survey by ID
// GET /api/surveys/:id
router.get("/:id", protect, getSurveyById);

// Route: Create a new survey
// POST /api/surveys
router.post("/", protect, createSurvey);

// Route: Update a survey
// PUT /api/surveys/:id
router.put("/:id", protect, updateSurvey);

// Route: Update survey status
// PATCH /api/surveys/:id/status
router.patch("/:id/status", protect, updateSurveyStatus);

// Route: Update survey end IP
// PATCH /api/surveys/:id/end-ip
router.patch("/:id/end-ip", protect, updateSurveyEndIp);

// Route: Delete a survey
// DELETE /api/surveys/:id
router.delete("/:id", protect, deleteSurvey);

export default router;
