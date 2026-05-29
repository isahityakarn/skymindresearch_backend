import express from "express";
const router = express.Router();
import {
    loginUser,
    registerUser,
    logoutUser,
    getAllUsers
} from "../controllers/userController.js";
import { protect } from "../middleware/authMiddleware.js";
import upload from "../middleware/uploadMiddleware.js";

// Route: Register user (Protected - Super Admin/Admin only)
// POST /api/users/register
router.post("/register", protect, (req, res, next) => {
    upload.single("user_img")(req, res, (err) => {
        if (err) {
            return res.status(400).json({ success: false, message: err.message });
        }
        next();
    });
}, registerUser);

// Route: Authenticate user
// POST /api/users/login
router.post("/login", loginUser);

// Route: Logout user
// POST /api/users/logout
router.post("/logout", logoutUser);

// Route: Get user profile
// GET /api/users/profile (Protected)
// router.get("/profile", protect, getUserProfile);
router.get("/all-users", protect, getAllUsers);

export default router;
