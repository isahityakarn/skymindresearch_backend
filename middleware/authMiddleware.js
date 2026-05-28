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
