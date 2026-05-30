import VendorSurvey from "../models/vendorSurveyModel.js";
import { sendError, sendSuccess } from "../utils/responseHelper.js";

/**
 * @desc    Get all vendor surveys
 * @route   GET /api/vendor-surveys
 * @access  Private
 */
const getAllVendorSurveys = async (req, res) => {
    try {
        const vendorSurveys = await VendorSurvey.findAll();
        return sendSuccess(res, 200, "Vendor surveys retrieved successfully", {
            vendorSurveys
        });
    } catch (error) {
        console.error("Error in getAllVendorSurveys controller:", error.message);
        return sendError(res, 500, "Internal server error retrieving vendor surveys");
    }
};

/**
 * @desc    Get vendor survey by ID
 * @route   GET /api/vendor-surveys/:id
 * @access  Private
 */
const getVendorSurveyById = async (req, res) => {
    try {
        const { id } = req.params;
        const vendorSurvey = await VendorSurvey.findById(id);

        if (!vendorSurvey) {
            return sendError(res, 404, "Vendor survey not found");
        }

        return sendSuccess(res, 200, "Vendor survey retrieved successfully", {
            vendorSurvey
        });
    } catch (error) {
        console.error("Error in getVendorSurveyById controller:", error.message);
        return sendError(res, 500, "Internal server error retrieving vendor survey");
    }
};

/**
 * @desc    Get vendor surveys by vendor ID
 * @route   GET /api/vendor-surveys/vendor/:vendor_id
 * @access  Private
 */
const getVendorSurveysByVendorId = async (req, res) => {
    try {
        const { vendor_id } = req.params;
        const vendorSurveys = await VendorSurvey.findByVendorId(vendor_id);

        return sendSuccess(res, 200, "Vendor surveys retrieved successfully", {
            vendorSurveys
        });
    } catch (error) {
        console.error("Error in getVendorSurveysByVendorId controller:", error.message);
        return sendError(res, 500, "Internal server error retrieving vendor surveys");
    }
};

/**
 * @desc    Get vendor surveys by project ID
 * @route   GET /api/vendor-surveys/project/:project_id
 * @access  Private
 */
const getVendorSurveysByProjectId = async (req, res) => {
    try {
        const { project_id } = req.params;
        const vendorSurveys = await VendorSurvey.findByProjectId(project_id);

        return sendSuccess(res, 200, "Vendor surveys retrieved successfully", {
            vendorSurveys
        });
    } catch (error) {
        console.error("Error in getVendorSurveysByProjectId controller:", error.message);
        return sendError(res, 500, "Internal server error retrieving vendor surveys");
    }
};

/**
 * @desc    Get vendor surveys by PID
 * @route   GET /api/vendor-surveys/pid/:pid
 * @access  Private
 */
const getVendorSurveysByPid = async (req, res) => {
    try {
        const { pid } = req.params;
        const vendorSurveys = await VendorSurvey.findByPid(pid);

        return sendSuccess(res, 200, "Vendor surveys retrieved successfully", {
            vendorSurveys
        });
    } catch (error) {
        console.error("Error in getVendorSurveysByPid controller:", error.message);
        return sendError(res, 500, "Internal server error retrieving vendor surveys");
    }
};

/**
 * @desc    Get vendor surveys by user ID
 * @route   GET /api/vendor-surveys/user/:uid
 * @access  Private
 */
const getVendorSurveysByUserId = async (req, res) => {
    try {
        const { uid } = req.params;
        const vendorSurveys = await VendorSurvey.findByUserId(uid);

        return sendSuccess(res, 200, "Vendor surveys retrieved successfully", {
            vendorSurveys
        });
    } catch (error) {
        console.error("Error in getVendorSurveysByUserId controller:", error.message);
        return sendError(res, 500, "Internal server error retrieving vendor surveys");
    }
};

/**
 * @desc    Get vendor surveys by MID
 * @route   GET /api/vendor-surveys/mid/:mid
 * @access  Private
 */
const getVendorSurveysByMid = async (req, res) => {
    try {
        const { mid } = req.params;
        const vendorSurveys = await VendorSurvey.findByMid(mid);

        return sendSuccess(res, 200, "Vendor surveys retrieved successfully", {
            vendorSurveys
        });
    } catch (error) {
        console.error("Error in getVendorSurveysByMid controller:", error.message);
        return sendError(res, 500, "Internal server error retrieving vendor surveys");
    }
};

/**
 * @desc    Get vendor surveys by status
 * @route   GET /api/vendor-surveys/status/:status
 * @access  Private
 */
const getVendorSurveysByStatus = async (req, res) => {
    try {
        const { status } = req.params;
        const vendorSurveys = await VendorSurvey.findByStatus(status);

        return sendSuccess(res, 200, "Vendor surveys retrieved successfully", {
            vendorSurveys
        });
    } catch (error) {
        console.error("Error in getVendorSurveysByStatus controller:", error.message);
        return sendError(res, 500, "Internal server error retrieving vendor surveys");
    }
};

/**
 * @desc    Get vendor surveys by IP address
 * @route   GET /api/vendor-surveys/ip/:ip
 * @access  Private
 */
const getVendorSurveysByIp = async (req, res) => {
    try {
        const { ip } = req.params;
        const vendorSurveys = await VendorSurvey.findByIp(ip);

        return sendSuccess(res, 200, "Vendor surveys retrieved successfully", {
            vendorSurveys
        });
    } catch (error) {
        console.error("Error in getVendorSurveysByIp controller:", error.message);
        return sendError(res, 500, "Internal server error retrieving vendor surveys");
    }
};

/**
 * @desc    Create a new vendor survey
 * @route   POST /api/vendor-surveys
 * @access  Private
 */
const createVendorSurvey = async (req, res) => {
    try {
        const { vendor_id, project_id, pid, uid, mid, status, start_ip, end_ip } = req.body;

        // Validation
        if (!vendor_id || !project_id) {
            return sendError(res, 400, "Please provide vendor ID and project ID");
        }

        // Create vendor survey
        const newVendorSurvey = await VendorSurvey.create({
            vendor_id,
            project_id,
            pid: pid || null,
            uid: uid || null,
            mid: mid || null,
            status: status || null,
            start_ip: start_ip || null,
            end_ip: end_ip || null
        });

        return sendSuccess(res, 201, "Vendor survey created successfully", {
            vendorSurvey: newVendorSurvey
        });
    } catch (error) {
        console.error("Error in createVendorSurvey controller:", error.message);
        return sendError(res, 500, "Internal server error creating vendor survey");
    }
};

/**
 * @desc    Update a vendor survey
 * @route   PUT /api/vendor-surveys/:id
 * @access  Private
 */
const updateVendorSurvey = async (req, res) => {
    try {
        const { id } = req.params;
        const { vendor_id, project_id, pid, uid, mid, status, start_ip, end_ip } = req.body;

        // Check if vendor survey exists
        const existingVendorSurvey = await VendorSurvey.findById(id);
        if (!existingVendorSurvey) {
            return sendError(res, 404, "Vendor survey not found");
        }

        // Update vendor survey
        const updatedVendorSurvey = await VendorSurvey.update(id, {
            vendor_id: vendor_id !== undefined ? vendor_id : existingVendorSurvey.vendor_id,
            project_id: project_id !== undefined ? project_id : existingVendorSurvey.project_id,
            pid: pid !== undefined ? pid : existingVendorSurvey.pid,
            uid: uid !== undefined ? uid : existingVendorSurvey.uid,
            mid: mid !== undefined ? mid : existingVendorSurvey.mid,
            status: status !== undefined ? status : existingVendorSurvey.status,
            start_ip: start_ip !== undefined ? start_ip : existingVendorSurvey.start_ip,
            end_ip: end_ip !== undefined ? end_ip : existingVendorSurvey.end_ip
        });

        return sendSuccess(res, 200, "Vendor survey updated successfully", {
            vendorSurvey: updatedVendorSurvey
        });
    } catch (error) {
        console.error("Error in updateVendorSurvey controller:", error.message);
        return sendError(res, 500, "Internal server error updating vendor survey");
    }
};

/**
 * @desc    Update vendor survey status
 * @route   PATCH /api/vendor-surveys/:id/status
 * @access  Private
 */
const updateVendorSurveyStatus = async (req, res) => {
    try {
        const { id } = req.params;
        const { status } = req.body;

        if (!status) {
            return sendError(res, 400, "Please provide status");
        }

        // Check if vendor survey exists
        const existingVendorSurvey = await VendorSurvey.findById(id);
        if (!existingVendorSurvey) {
            return sendError(res, 404, "Vendor survey not found");
        }

        // Update status
        const updatedVendorSurvey = await VendorSurvey.updateStatus(id, status);

        return sendSuccess(res, 200, "Vendor survey status updated successfully", {
            vendorSurvey: updatedVendorSurvey
        });
    } catch (error) {
        console.error("Error in updateVendorSurveyStatus controller:", error.message);
        return sendError(res, 500, "Internal server error updating vendor survey status");
    }
};

/**
 * @desc    Update vendor survey end IP
 * @route   PATCH /api/vendor-surveys/:id/end-ip
 * @access  Private
 */
const updateVendorSurveyEndIp = async (req, res) => {
    try {
        const { id } = req.params;
        const { end_ip } = req.body;

        if (!end_ip) {
            return sendError(res, 400, "Please provide end IP");
        }

        // Check if vendor survey exists
        const existingVendorSurvey = await VendorSurvey.findById(id);
        if (!existingVendorSurvey) {
            return sendError(res, 404, "Vendor survey not found");
        }

        // Update end IP
        const updatedVendorSurvey = await VendorSurvey.updateEndIp(id, end_ip);

        return sendSuccess(res, 200, "Vendor survey end IP updated successfully", {
            vendorSurvey: updatedVendorSurvey
        });
    } catch (error) {
        console.error("Error in updateVendorSurveyEndIp controller:", error.message);
        return sendError(res, 500, "Internal server error updating vendor survey end IP");
    }
};

/**
 * @desc    Delete a vendor survey
 * @route   DELETE /api/vendor-surveys/:id
 * @access  Private
 */
const deleteVendorSurvey = async (req, res) => {
    try {
        const { id } = req.params;

        // Check if vendor survey exists
        const existingVendorSurvey = await VendorSurvey.findById(id);
        if (!existingVendorSurvey) {
            return sendError(res, 404, "Vendor survey not found");
        }

        // Delete vendor survey
        await VendorSurvey.delete(id);

        return sendSuccess(res, 200, "Vendor survey deleted successfully");
    } catch (error) {
        console.error("Error in deleteVendorSurvey controller:", error.message);
        return sendError(res, 500, "Internal server error deleting vendor survey");
    }
};

export {
    getAllVendorSurveys,
    getVendorSurveyById,
    getVendorSurveysByVendorId,
    getVendorSurveysByProjectId,
    getVendorSurveysByPid,
    getVendorSurveysByUserId,
    getVendorSurveysByMid,
    getVendorSurveysByStatus,
    getVendorSurveysByIp,
    createVendorSurvey,
    updateVendorSurvey,
    updateVendorSurveyStatus,
    updateVendorSurveyEndIp,
    deleteVendorSurvey
};
