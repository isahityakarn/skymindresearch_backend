import express from "express";
const router = express.Router();
import {
    createSurveyComplete,createSurveyTerminate,createSurveyQuotafull
} from "../controllers/redirectSurveyController.js";

// Route: Get all redirect surveys
// GET /api/redirect/complete
router.get("/complete", createSurveyComplete);
router.get("/terminate", createSurveyTerminate);
router.get("/quotafull", createSurveyQuotafull);


export default router;
