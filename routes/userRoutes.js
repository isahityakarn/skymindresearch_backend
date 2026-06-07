import express from "express";
const router = express.Router();
import {
    loginUser,
    registerUser,
    logoutUser,
    getAllUsers,
    changePassword
} from "../controllers/userController.js";
import { protect,adminOnly} from "../middleware/authMiddleware.js";
import upload from "../middleware/uploadMiddleware.js";

// Route: Register user (Protected - Super Admin/Admin only)
// POST /api/users/register
router.post("/register", protect,adminOnly(), (req, res, next) => {
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
router.get("/all-users", protect,adminOnly(), getAllUsers);

// Route: Change user password (Protected - Admin only)
// PATCH /api/users/:id/change-password
router.patch("/:id/change-password", adminOnly(),protect, changePassword);

export default router;
