import express from "express";
const router = express.Router();
import {
    getDashboardStats,
    getVendorStats,
    getProjectStats,
    getCountryStats,
    getUserActivity,
    getSurveyTrends,
    getDashboardOverview
} from "../controllers/dashboardController.js";
import { protect } from "../middleware/authMiddleware.js";

router.post("/overview", protect, getDashboardOverview);
router.post("/stats",protect, getDashboardStats);
router.post("/vendor-stats", protect, getVendorStats);
router.post("/project-stats", protect, getProjectStats);
router.post("/country-stats", protect, getCountryStats);
    
router.post("/user-activity", protect, getUserActivity);
router.post("/survey-trends", protect, getSurveyTrends);
    

export default router;
