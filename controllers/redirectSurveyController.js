import Survey from "../models/surveyModel.js";
import {sendError, sendSuccess} from "../utils/responseHelper.js";
import {getClientIp} from "../utils/ipHelper.js";

export const createSurveyComplete = async (req, res) => {
    try {
        const {pid, uid} = req.query;
        const status = 'complete';
        // Validation
        if (!pid || !uid) {
            return sendError(res, 400, "Please provide project ID (pid) and user ID (uid)");
        }

        // Check if survey already exists for this PID and UID
        const existingSurvey = await Survey.findByPidAndUid(pid, uid, status);

        if (existingSurvey) {
            return sendError(res, 409, "You have already punched entry for this project");
        }

        // Get user's current IP address
        const currentIp = getClientIp(req);

        // Create survey with current IP and status "complete"
        const newSurvey = await Survey.create({
            pid,
            uid,
            status: status,
            start_ip: currentIp,
            end_ip: currentIp
        });

        return sendSuccess(res, 201, "Survey created successfully", {survey: newSurvey});
    } catch (error) {
        console.error("Error in createSurveyComplete controller:", error.message);
        return sendError(res, 500, "Internal server error creating survey");
    }
};

export const createSurveyQuotafull = async (req, res) => {
    try {
        const {pid, uid} = req.query;
        const status = 'quotafull';
        // Validation
        if (!pid || !uid) {
            return sendError(res, 400, "Please provide project ID (pid) and user ID (uid)");
        }

        // Check if survey already exists for this PID and UID with "quotafull" status
        const existingSurvey = await Survey.findByPidAndUid(pid, uid, status);

        if (existingSurvey) {
            return sendError(res, 409, "You have already punched entry for this project");
        }

        // Get user's current IP address
        const currentIp = getClientIp(req);

        // Create survey with current IP and status "quotafull"
        const newSurvey = await Survey.create({
            pid,
            uid,
            status: status,
            start_ip: currentIp,
            end_ip: currentIp
        });

        return sendSuccess(res, 201, "Survey created successfully", {survey: newSurvey});
    } catch (error) {
        console.error("Error in createSurveyQuotafull controller:", error.message);
        return sendError(res, 500, "Internal server error creating survey");
    }
};

export const createSurveyTerminate = async (req, res) => {
    try {
        const {pid, uid} = req.query;
        const status = 'terminate';
        // Validation
        if (!pid || !uid) {
            return sendError(res, 400, "Please provide project ID (pid) and user ID (uid)");
        }

        // Check if survey already exists for this PID and UID with "terminate" status
        const existingSurvey = await Survey.findByPidAndUid(pid, uid, status);

        if (existingSurvey) {
            return sendError(res, 409, "You have already punched entry for this project");
        }

        // Get user's current IP address
        const currentIp = getClientIp(req);

        // Create survey with current IP and status "terminate"
        const newSurvey = await Survey.create({
            pid,
            uid,
            status: status,
            start_ip: currentIp,
            end_ip: currentIp
        });

        return sendSuccess(res, 201, "Survey created successfully", {survey: newSurvey});
    } catch (error) {
        console.error("Error in createSurveyTerminate controller:", error.message);
        return sendError(res, 500, "Internal server error creating survey");
    }
};
