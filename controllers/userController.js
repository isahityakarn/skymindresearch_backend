import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import User from "../models/userModel.js";
import { sendError, sendSuccess } from "../utils/responseHelper.js";
import { userImgDir } from "../constants.js";

// Helper function to format user image with WEBSITE_URL prefix
const formatUserImage = (userImg) => {
    const websiteUrl = process.env.WEBSITE_URL || "";
    if (userImg && userImg.startsWith("/uploads")) {
        return `${websiteUrl}${userImg}`;
    }
    return userImg;
};

// Helper function to generate JWT token
const generateToken = (user) => {

    const token = jwt.sign(
        {
            id: user.id,
            name: user.name,
            email: user.email,
            role: user.role,
        },
        process.env.JWT_SECRET,
        {
            expiresIn: "7d"
        }
    );

    return token;
};


/**
 * @desc    Authenticate user & get token
 * @route   POST /api/users/login
 * @access  Public
 */
const loginUser = async (req, res) => {
    try {
        const { email, password } = req.body;

        // 1. Validation
        if (!email || !password) {
            return sendError(res, 400, "Please provide both email and password");
        }

        // 2. Find user and verify password
        const user = await User.findByEmail(email.toLowerCase().trim());
        if (!user || !(await bcrypt.compare(password, user.password))) {
            return sendError(res, 401, "Invalid email or password");
        }

        // 3. Send success response with token
        return sendSuccess(res, 200, "Login successful", {
            user: {
                id: user.id,
                name: user.name,
                email: user.email,
                role: user.role,
                role_name: user.role_name,
                user_img: formatUserImage(user.user_img),
                created_at: user.created_at
            },
            token: generateToken(user)
        });

    } catch (error) {
        console.error("Error in loginUser controller:", error.message);
        return sendError(res, 500, "Internal server error during login");
    }
};

/**
 * @desc    Register a new user
 * @route   POST /api/users/register
 * @access  Private (Super Admin or Admin only)
 */
const registerUser = async (req, res) => {
    try {


        // Ensure requester is logged in and has role 1 (Super Admin) or 2 (Admin)
        if (!req.user || (Number(req.user.role) !== 1 && Number(req.user.role) !== 2)) {
            return sendError(res, 403, "Not authorized. Only Super Admin or Admin can register new users.");
        }

        const { id, name, email, password, role, phone, address } = req.body;

        // 1. Core Validation
        if (!name || !email) {
            return sendError(res, 400, "Please fill in the required fields (name, email)");
        }

        // Simple email regex validation
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            return sendError(res, 400, "Please enter a valid email address");
        }

        const normalizedEmail = email.toLowerCase().trim();

        // 2. Check if this is an Update or Create request
        if (id) {
            // ==================== UPDATE MODE ====================
            const userToUpdate = await User.findById(id);
            if (!userToUpdate) {
                return sendError(res, 404, "User not found for update");
            }

            // Check if email conflicts with another user
            if (normalizedEmail !== userToUpdate.email) {
                const emailExists = await User.findByEmail(normalizedEmail);
                if (emailExists) {
                    return sendError(res, 400, "Email is already in use by another user");
                }
            }

            // Hash password if provided
            let hashedPassword = undefined;
            if (password) {
                if (password.length < 6) {
                    return sendError(res, 400, "Password must be at least 6 characters long");
                }
                const salt = await bcrypt.genSalt(10);
                hashedPassword = await bcrypt.hash(password, salt);
            }

            // Handle image uploads
            let user_img = undefined;
            if (req.file) {
                user_img = `/uploads/${userImgDir}/${req.file.filename}`;
            } else if (req.body.user_img !== undefined) {
                user_img = req.body.user_img || null;
            }

            // Update user in DB
            const updatedUser = await User.update(id, {
                name: name.trim(),
                email: normalizedEmail,
                password: hashedPassword,
                role: role || userToUpdate.role,
                phone: phone !== undefined ? (phone || null) : userToUpdate.phone,
                address: address !== undefined ? (address || null) : userToUpdate.address,
                user_img
            });

            return sendSuccess(res, 200, "User updated successfully", {
                user: {
                    id: updatedUser.id,
                    name: updatedUser.name,
                    email: updatedUser.email,
                    role: updatedUser.role,
                    phone: updatedUser.phone,
                    address: updatedUser.address,
                    user_img: formatUserImage(updatedUser.user_img)
                },
                token: generateToken(updatedUser)
            });
        } else {
            // ==================== CREATE MODE ====================
            if (!password) {
                return sendError(res, 400, "Password is required to register a new user");
            }

            if (password.length < 6) {
                return sendError(res, 400, "Password must be at least 6 characters long");
            }

            // Check if user already exists
            const userExists = await User.findByEmail(normalizedEmail);
            if (userExists) {
                return sendError(res, 400, "User with this email already exists");
            }

            // Hash password
            const salt = await bcrypt.genSalt(10);
            const hashedPassword = await bcrypt.hash(password, salt);

            // Determine user image path
            const user_img = req.file ? `/uploads/${userImgDir}/${req.file.filename}` : (req.body.user_img || null);

            // Create user in DB
            const newUser = await User.create({
                name: name.trim(),
                email: normalizedEmail,
                password: hashedPassword,
                role: role || 3,
                phone: phone || null,
                address: address || null,
                user_img
            });

            // Send success response
            return sendSuccess(res, 201, "User registered successfully", {
                user: {
                    id: newUser.id,
                    name: newUser.name,
                    email: newUser.email,
                    role: newUser.role,
                    phone: newUser.phone,
                    address: newUser.address,
                    user_img: formatUserImage(newUser.user_img)
                },
                token: generateToken(newUser)
            });
        }

    } catch (error) {
        console.error("Error in registerUser controller:", error.message);
        return sendError(res, 500, "Internal server error during registration");
    }
};

/**
 * @desc    Get user profile
 * @route   GET /api/users/profile
 * @access  Private
 */
const getAllUsers = async (req, res) => {
    try {
        const users = await User.findAll();
        const formattedUsers = users.map(user => ({
            ...user,
            user_img: formatUserImage(user.user_img)
        }));
        return sendSuccess(res, 200, " Users retrieved successfully", {
            users: formattedUsers
        });
    } catch (error) {
        console.error("Error in getAllUsers controller:", error.message);
        return sendError(res, 500, "Internal server error retrieving all users");
    }
};

/**
 * @desc    Logout user / clear token
 * @route   POST /api/users/logout
 * @access  Public
 */
const logoutUser = async (req, res) => {
    try {
        return sendSuccess(res, 200, "Logout successful");
    } catch (error) {
        console.error("Error in logoutUser controller:", error.message);
        return sendError(res, 500, "Internal server error during logout");
    }
};

export {
    loginUser,
    registerUser,
    getAllUsers,
    logoutUser
};

