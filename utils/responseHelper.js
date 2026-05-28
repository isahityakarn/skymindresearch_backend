/**
 * Standard utility helpers for HTTP responses.
 */

/**
 * Sends a standardized error response.
 * @param {Object} res - Express response object
 * @param {Number} statusCode - HTTP status code
 * @param {String} message - Error message
 * @param {Object} [extra={}] - Additional response payload fields
 */
export const sendError = (res, statusCode, message, extra = {}) => {
    return res.status(statusCode).json({
        success: false,
        message,
        ...extra
    });
};

/**
 * Sends a standardized success response.
 * @param {Object} res - Express response object
 * @param {Number} statusCode - HTTP status code
 * @param {String} message - Success message
 * @param {Object} [data={}] - Response data payload
 */
export const sendSuccess = (res, statusCode, message, data = {}) => {
    return res.status(statusCode).json({
        success: true,
        message,
        ...data
    });
};
