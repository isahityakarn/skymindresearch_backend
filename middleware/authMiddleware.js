import jwt from "jsonwebtoken";
import User from "../models/userModel.js";
import { sendError } from "../utils/responseHelper.js";

export const protect = async (req, res, next) => {
    let token;

    if (
        req.headers.authorization &&
        req.headers.authorization.startsWith("Bearer")
    ) {
        try {
            // Get token from header
            token = req.headers.authorization.split(" ")[1];

            // Verify token
            const decoded = jwt.verify(token, process.env.JWT_SECRET);

            // Get user from database using the decoded ID
            const user = await User.findById(decoded.id);

            if (!user) {
                return sendError(res, 401, "Not authorized, user not found");
            }

            // Attach user details to request object
            req.user = user;
            return next();
        } catch (error) {
            console.error("Token verification failed:", error.message);
            return sendError(res, 401, "Not authorized, token failed");
        }
    }

    if (!token) {
        return sendError(res, 401, "Not authorized, no token provided");
    }
};

/**
 * Middleware to check if user has one of the allowed roles
 * Only accepts role IDs (numbers)
 * Usage: 
 *   - adminOnly() - defaults to role ID 2 (admin)
 *   - adminOnly(1, 2) - allows role IDs 1 or 2
 *   - adminOnly(3) - allows only role ID 3
 */
export const adminOnly = (...allowedRoles) => {
    // If no roles specified, default to role ID 2 (admin)
    if (allowedRoles.length === 0) {
        allowedRoles = [1,2];
    }

    return (req, res, next) => {
        if (!req.user) {
            return sendError(res, 401, "Not authorized, user not authenticated");
        }

        // Get user's role ID
        const userRoleId = req.user.role;

        // Check if user's role ID matches any of the allowed roles
        if (!allowedRoles.includes(userRoleId)) {
            return sendError(res, 403, "Access denied. Insufficient permissions.");
        }

        next();
    };
};

/**
 * Middleware to restrict access based on role IDs
 * Only accepts role IDs (numbers)
 * Usage: restrictTo(1, 2, 3)
 */
export const restrictTo = (...allowedRoles) => {
    return (req, res, next) => {
        if (!req.user) {
            return sendError(res, 401, "Not authorized, user not authenticated");
        }

        // Get user's role ID
        const userRoleId = req.user.role;

        // Check if user's role ID matches any of the allowed roles
        if (!allowedRoles.includes(userRoleId)) {
            return sendError(res, 403, "Access denied. Insufficient permissions.");
        }

        next();
    };
};
