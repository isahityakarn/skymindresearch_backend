import Vendor from "../models/vendorModel.js";
import { sendError, sendSuccess } from "../utils/responseHelper.js";

/**
 * @desc    Get all vendors
 * @route   GET /api/vendors
 * @access  Private
 */
const getAllVendors = async (req, res) => {
    try {
        const vendors = await Vendor.findAll();
        return sendSuccess(res, 200, "Vendors retrieved successfully", {
            vendors
        });
    } catch (error) {
        console.error("Error in getAllVendors controller:", error.message);
        return sendError(res, 500, "Internal server error retrieving vendors");
    }
};

/**
 * @desc    Get vendor by ID
 * @route   GET /api/vendors/:id
 * @access  Private
 */
const getVendorById = async (req, res) => {
    try {
        const { id } = req.params;
        const vendor = await Vendor.findById(id);

        if (!vendor) {
            return sendError(res, 404, "Vendor not found");
        }

        return sendSuccess(res, 200, "Vendor retrieved successfully", {
            vendor
        });
    } catch (error) {
        console.error("Error in getVendorById controller:", error.message);
        return sendError(res, 500, "Internal server error retrieving vendor");
    }
};

/**
 * @desc    Get vendor by email
 * @route   GET /api/vendors/email/:email
 * @access  Private
 */
const getVendorByEmail = async (req, res) => {
    try {
        const { email } = req.params;
        const vendor = await Vendor.findByEmail(email);

        if (!vendor) {
            return sendError(res, 404, "Vendor not found");
        }

        return sendSuccess(res, 200, "Vendor retrieved successfully", {
            vendor
        });
    } catch (error) {
        console.error("Error in getVendorByEmail controller:", error.message);
        return sendError(res, 500, "Internal server error retrieving vendor");
    }
};

/**
 * @desc    Get active vendors
 * @route   GET /api/vendors/active
 * @access  Private
 */
const getActiveVendors = async (req, res) => {
    try {
        const vendors = await Vendor.findActive();
        return sendSuccess(res, 200, "Active vendors retrieved successfully", {
            vendors
        });
    } catch (error) {
        console.error("Error in getActiveVendors controller:", error.message);
        return sendError(res, 500, "Internal server error retrieving active vendors");
    }
};

/**
 * @desc    Create a new vendor
 * @route   POST /api/vendors
 * @access  Private
 */
const createVendor = async (req, res) => {
    try {
        const { 
            name, 
            email, 
            redirect_complete, 
            redirect_quotafull, 
            redirect_terminate, 
            company, 
            address, 
            is_active 
        } = req.body;

        // Validation
        if (!name || !email) {
            return sendError(res, 400, "Please provide vendor name and email");
        }

        // Simple email regex validation
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            return sendError(res, 400, "Please enter a valid email address");
        }

        const normalizedEmail = email.toLowerCase().trim();

        // Check if vendor with email already exists
        const existingVendor = await Vendor.findByEmail(normalizedEmail);
        if (existingVendor) {
            return sendError(res, 400, "Vendor with this email already exists");
        }

        // Create vendor
        const newVendor = await Vendor.create({
            name: name.trim(),
            email: normalizedEmail,
            redirect_complete: redirect_complete || null,
            redirect_quotafull: redirect_quotafull || null,
            redirect_terminate: redirect_terminate || null,
            company: company || null,
            address: address || null,
            is_active: is_active !== undefined ? is_active : 1
        });

        return sendSuccess(res, 201, "Vendor created successfully", {
            vendor: newVendor
        });
    } catch (error) {
        console.error("Error in createVendor controller:", error.message);
        return sendError(res, 500, "Internal server error creating vendor");
    }
};

/**
 * @desc    Update a vendor
 * @route   PUT /api/vendors/:id
 * @access  Private
 */
const updateVendor = async (req, res) => {
    try {
        const { id } = req.params;
        const { 
            name, 
            email, 
            redirect_complete, 
            redirect_quotafull, 
            redirect_terminate, 
            company, 
            address, 
            is_active 
        } = req.body;

        // Check if vendor exists
        const existingVendor = await Vendor.findById(id);
        if (!existingVendor) {
            return sendError(res, 404, "Vendor not found");
        }

        // Validate email if provided
        if (email) {
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(email)) {
                return sendError(res, 400, "Please enter a valid email address");
            }

            const normalizedEmail = email.toLowerCase().trim();

            // Check if email conflicts with another vendor
            if (normalizedEmail !== existingVendor.email) {
                const emailExists = await Vendor.findByEmail(normalizedEmail);
                if (emailExists) {
                    return sendError(res, 400, "Email is already in use by another vendor");
                }
            }
        }

        // Update vendor
        const updatedVendor = await Vendor.update(id, {
            name: name !== undefined ? name.trim() : existingVendor.name,
            email: email !== undefined ? email.toLowerCase().trim() : existingVendor.email,
            redirect_complete: redirect_complete !== undefined ? redirect_complete : existingVendor.redirect_complete,
            redirect_quotafull: redirect_quotafull !== undefined ? redirect_quotafull : existingVendor.redirect_quotafull,
            redirect_terminate: redirect_terminate !== undefined ? redirect_terminate : existingVendor.redirect_terminate,
            company: company !== undefined ? company : existingVendor.company,
            address: address !== undefined ? address : existingVendor.address,
            is_active: is_active !== undefined ? is_active : existingVendor.is_active
        });

        return sendSuccess(res, 200, "Vendor updated successfully", {
            vendor: updatedVendor
        });
    } catch (error) {
        console.error("Error in updateVendor controller:", error.message);
        return sendError(res, 500, "Internal server error updating vendor");
    }
};

/**
 * @desc    Soft delete a vendor (deactivate)
 * @route   PATCH /api/vendors/:id/deactivate
 * @access  Private
 */
const deactivateVendor = async (req, res) => {
    try {
        const { id } = req.params;

        // Check if vendor exists
        const existingVendor = await Vendor.findById(id);
        if (!existingVendor) {
            return sendError(res, 404, "Vendor not found");
        }

        // Soft delete
        const deactivatedVendor = await Vendor.softDelete(id);

        return sendSuccess(res, 200, "Vendor deactivated successfully", {
            vendor: deactivatedVendor
        });
    } catch (error) {
        console.error("Error in deactivateVendor controller:", error.message);
        return sendError(res, 500, "Internal server error deactivating vendor");
    }
};

/**
 * @desc    Delete a vendor
 * @route   DELETE /api/vendors/:id
 * @access  Private
 */
const deleteVendor = async (req, res) => {
    try {
        const { id } = req.params;

        // Check if vendor exists
        const existingVendor = await Vendor.findById(id);
        if (!existingVendor) {
            return sendError(res, 404, "Vendor not found");
        }

        // Delete vendor
        await Vendor.delete(id);

        return sendSuccess(res, 200, "Vendor deleted successfully");
    } catch (error) {
        console.error("Error in deleteVendor controller:", error.message);
        return sendError(res, 500, "Internal server error deleting vendor");
    }
};

export {
    getAllVendors,
    getVendorById,
    getVendorByEmail,
    getActiveVendors,
    createVendor,
    updateVendor,
    deactivateVendor,
    deleteVendor
};
