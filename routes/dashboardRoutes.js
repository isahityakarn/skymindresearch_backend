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

router.get("/overview", protect, getDashboardOverview);
router.get("/stats",protect, getDashboardStats);
router.get("/vendor-stats", protect, getVendorStats);
router.get("/project-stats", protect, getProjectStats);
router.get("/country-stats", protect, getCountryStats);
    
router.get("/user-activity", protect, getUserActivity);
router.get("/survey-trends", protect, getSurveyTrends);
    

export default router;
