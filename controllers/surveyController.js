import Survey from "../models/surveyModel.js";
import { sendError, sendSuccess } from "../utils/responseHelper.js";
import { getClientIp } from "../utils/ipHelper.js";

/**
 * @desc    Get all surveys with pagination and filters
 * @route   GET /api/surveys
 * @query   page, limit, status, id, pid, uid, sortBy, sortOrder
 * @access  Private
 * 
 * Example: GET /api/surveys?page=1&limit=10&status=active&pid=5&sortBy=created_at&sortOrder=DESC
 */
const getAllSurveys = async (req, res) => {

    // console.log(req)
    try {
        // Extract query parameters
        const {
            page = 1,
            limit = 100,
            status,
            id,
            pid,
            uid,
            sortBy = 'created_at',
            sortOrder = 'DESC'
        } = req.query;

        // Convert to appropriate types
        const pageNum = parseInt(page, 10);
        const limitNum = parseInt(limit, 10);

        // Validate pagination parameters
        if (pageNum < 1 || limitNum < 1 || limitNum > 100) {
            return sendError(res, 400, "Invalid pagination parameters. Page must be >= 1 and limit must be between 1 and 100");
        }

        // Get paginated surveys
        const result = await Survey.findAllWithPagination({
            page: pageNum,
            limit: limitNum,
            status,
            id,
            pid,
            uid,
            sortBy,
            sortOrder
        });

        return sendSuccess(res, 200, "Surveys retrieved successfully", result);
    } catch (error) {
        console.error("Error in getAllSurveys controller:", error.message);
        return sendError(res, 500, "Internal server error retrieving surveys");
    }
};

/**
 * @desc    Get survey by ID
 * @route   GET /api/surveys/:id
 * @access  Private
 */
const getSurveyById = async (req, res) => {
    try {
        const { id } = req.params;
        const survey = await Survey.findById(id);

        if (!survey) {
            return sendError(res, 404, "Survey not found");
        }

        return sendSuccess(res, 200, "Survey retrieved successfully", {
            survey
        });
    } catch (error) {
        console.error("Error in getSurveyById controller:", error.message);
        return sendError(res, 500, "Internal server error retrieving survey");
    }
};

/**
 * @desc    Get surveys by project ID with pagination
 * @route   GET /api/surveys/project/:pid
 * @query   page, limit, status, sortBy, sortOrder
 * @access  Private
 */
const getSurveysByProjectId = async (req, res) => {
    try {
        const { pid } = req.params;
        const {
            page = 1,
            limit = 10,
            status,
            sortBy = 'created_at',
            sortOrder = 'DESC'
        } = req.query;

        const pageNum = parseInt(page, 10);
        const limitNum = parseInt(limit, 10);

        if (pageNum < 1 || limitNum < 1 || limitNum > 100) {
            return sendError(res, 400, "Invalid pagination parameters");
        }

        const result = await Survey.findAllWithPagination({
            page: pageNum,
            limit: limitNum,
            pid,
            status,
            sortBy,
            sortOrder
        });

        return sendSuccess(res, 200, "Surveys retrieved successfully", result);
    } catch (error) {
        console.error("Error in getSurveysByProjectId controller:", error.message);
        return sendError(res, 500, "Internal server error retrieving surveys");
    }
};

/**
 * @desc    Get surveys by user ID with pagination
 * @route   GET /api/surveys/user/:uid
 * @query   page, limit, status, sortBy, sortOrder
 * @access  Private
 */
const getSurveysByUserId = async (req, res) => {
    try {
        const { uid } = req.params;
        const {
            page = 1,
            limit = 10,
            status,
            sortBy = 'created_at',
            sortOrder = 'DESC'
        } = req.query;

        const pageNum = parseInt(page, 10);
        const limitNum = parseInt(limit, 10);

        if (pageNum < 1 || limitNum < 1 || limitNum > 100) {
            return sendError(res, 400, "Invalid pagination parameters");
        }

        const result = await Survey.findAllWithPagination({
            page: pageNum,
            limit: limitNum,
            uid,
            status,
            sortBy,
            sortOrder
        });

        return sendSuccess(res, 200, "Surveys retrieved successfully", result);
    } catch (error) {
        console.error("Error in getSurveysByUserId controller:", error.message);
        return sendError(res, 500, "Internal server error retrieving surveys");
    }
};

/**
 * @desc    Get surveys by status with pagination
 * @route   GET /api/surveys/status/:status
 * @query   page, limit, pid, uid, sortBy, sortOrder
 * @access  Private
 */
const getSurveysByStatus = async (req, res) => {
    try {
        const { status } = req.params;
        const {
            page = 1,
            limit = 10,
            pid,
            uid,
            sortBy = 'created_at',
            sortOrder = 'DESC'
        } = req.query;

        const pageNum = parseInt(page, 10);
        const limitNum = parseInt(limit, 10);

        if (pageNum < 1 || limitNum < 1 || limitNum > 100) {
            return sendError(res, 400, "Invalid pagination parameters");
        }

        const result = await Survey.findAllWithPagination({
            page: pageNum,
            limit: limitNum,
            status,
            pid,
            uid,
            sortBy,
            sortOrder
        });

        return sendSuccess(res, 200, "Surveys retrieved successfully", result);
    } catch (error) {
        console.error("Error in getSurveysByStatus controller:", error.message);
        return sendError(res, 500, "Internal server error retrieving surveys");
    }
};

/**
 * @desc    Create a new survey
 * @route   POST /api/surveys
 * @access  Private
 */
const createSurvey = async (req, res) => {
    try {
        const { pid, uid, status, start_ip, end_ip } = req.body;

        // Validation
        if (!pid || !uid) {
            return sendError(res, 400, "Please provide project ID (pid) and user ID (uid)");
        }

        // Check if survey already exists for this PID and UID with "complete" status
        const existingSurvey = await Survey.findByPidAndUid(pid, uid, "complete");
        
        if (existingSurvey) {
            return sendError(res, 409, "You have already punched entry for this project");
        }

        // Get user's current IP address
        const currentIp = getClientIp(req);

        // Create survey with current IP
        const newSurvey = await Survey.create({
            pid,
            uid,
            status: status || null,
            start_ip: start_ip || currentIp,
            end_ip: end_ip || currentIp
        });

        return sendSuccess(res, 201, "Survey created successfully", {
            survey: newSurvey
        });
    } catch (error) {
        console.error("Error in createSurvey controller:", error.message);
        return sendError(res, 500, "Internal server error creating survey");
    }
};

/**
 * @desc    Update a survey
 * @route   PUT /api/surveys/:id
 * @access  Private
 */
const updateSurvey = async (req, res) => {
    try {
        const { id } = req.params;
        const { pid, uid, status, start_ip, end_ip } = req.body;

        // Check if survey exists
        const existingSurvey = await Survey.findById(id);
        if (!existingSurvey) {
            return sendError(res, 404, "Survey not found");
        }

        // Update survey
        const updatedSurvey = await Survey.update(id, {
            pid: pid !== undefined ? pid : existingSurvey.pid,
            uid: uid !== undefined ? uid : existingSurvey.uid,
            status: status !== undefined ? status : existingSurvey.status,
            start_ip: start_ip !== undefined ? start_ip : existingSurvey.start_ip,
            end_ip: end_ip !== undefined ? end_ip : existingSurvey.end_ip
        });

        return sendSuccess(res, 200, "Survey updated successfully", {
            survey: updatedSurvey
        });
    } catch (error) {
        console.error("Error in updateSurvey controller:", error.message);
        return sendError(res, 500, "Internal server error updating survey");
    }
};

/**
 * @desc    Update survey status
 * @route   PATCH /api/surveys/:id/status
 * @access  Private
 */
const updateSurveyStatus = async (req, res) => {
    try {
        const { id } = req.params;
        const { status } = req.body;

        if (!status) {
            return sendError(res, 400, "Please provide status");
        }

        // Check if survey exists
        const existingSurvey = await Survey.findById(id);
        if (!existingSurvey) {
            return sendError(res, 404, "Survey not found");
        }

        // Update status
        const updatedSurvey = await Survey.updateStatus(id, status);

        return sendSuccess(res, 200, "Survey status updated successfully", {
            survey: updatedSurvey
        });
    } catch (error) {
        console.error("Error in updateSurveyStatus controller:", error.message);
        return sendError(res, 500, "Internal server error updating survey status");
    }
};

/**
 * @desc    Update survey end IP
 * @route   PATCH /api/surveys/:id/end-ip
 * @access  Private
 */
const updateSurveyEndIp = async (req, res) => {
    try {
        const { id } = req.params;
        const { end_ip } = req.body;

        if (!end_ip) {
            return sendError(res, 400, "Please provide end IP");
        }

        // Check if survey exists
        const existingSurvey = await Survey.findById(id);
        if (!existingSurvey) {
            return sendError(res, 404, "Survey not found");
        }

        // Update end IP
        const updatedSurvey = await Survey.updateEndIp(id, end_ip);

        return sendSuccess(res, 200, "Survey end IP updated successfully", {
            survey: updatedSurvey
        });
    } catch (error) {
        console.error("Error in updateSurveyEndIp controller:", error.message);
        return sendError(res, 500, "Internal server error updating survey end IP");
    }
};

/**
 * @desc    Delete a survey
 * @route   DELETE /api/surveys/:id
 * @access  Private
 */
const deleteSurvey = async (req, res) => {
    try {
        const { id } = req.params;

        // Check if survey exists
        const existingSurvey = await Survey.findById(id);
        if (!existingSurvey) {
            return sendError(res, 404, "Survey not found");
        }

        // Delete survey
        await Survey.delete(id);

        return sendSuccess(res, 200, "Survey deleted successfully");
    } catch (error) {
        console.error("Error in deleteSurvey controller:", error.message);
        return sendError(res, 500, "Internal server error deleting survey");
    }
};

export {
    getAllSurveys,
    getSurveyById,
    getSurveysByProjectId,
    getSurveysByUserId,
    getSurveysByStatus,
    createSurvey,
    updateSurvey,
    updateSurveyStatus,
    updateSurveyEndIp,
    deleteSurvey
};
