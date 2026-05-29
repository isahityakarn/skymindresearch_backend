import User from "../models/userModel.js";
import Vendor from "../models/vendorModel.js";
import Country from "../models/countryModel.js";
import Project from "../models/projectModel.js";
import Role from "../models/roleModel.js";
import Survey from "../models/surveyModel.js";
import VendorSurvey from "../models/vendorSurveyModel.js";
import { sendError, sendSuccess } from "../utils/responseHelper.js";
import db from "../config/db.js";

/**
 * @desc    Get dashboard statistics
 * @route   GET /api/dashboard/stats
 * @access  Private
 */
const getDashboardStats = async (req, res) => {
    try {
        // Get counts for all entities
        const [userCount] = await db.query("SELECT COUNT(*) as count FROM users");
        const [vendorCount] = await db.query("SELECT COUNT(*) as count FROM vendors");
        const [activeVendorCount] = await db.query("SELECT COUNT(*) as count FROM vendors WHERE is_active = 1");
        const [countryCount] = await db.query("SELECT COUNT(*) as count FROM countries");
        const [activeCountryCount] = await db.query("SELECT COUNT(*) as count FROM countries WHERE is_active = 1");
        const [projectCount] = await db.query("SELECT COUNT(*) as count FROM projects");
        const [activeProjectCount] = await db.query("SELECT COUNT(*) as count FROM projects WHERE is_active = 1");
        const [surveyCount] = await db.query("SELECT COUNT(*) as count FROM surveys");
        const [vendorSurveyCount] = await db.query("SELECT COUNT(*) as count FROM vendor_surveys");
        const [roleCount] = await db.query("SELECT COUNT(*) as count FROM roles");

        // Get survey status breakdown
        const [surveyStatusBreakdown] = await db.query(
            "SELECT status, COUNT(*) as count FROM surveys GROUP BY status"
        );

        // Get vendor survey status breakdown
        const [vendorSurveyStatusBreakdown] = await db.query(
            "SELECT status, COUNT(*) as count FROM vendor_surveys GROUP BY status"
        );

        // Get recent activities (last 10 surveys)
        const [recentSurveys] = await db.query(
            "SELECT s.*, u.name as user_name FROM surveys s LEFT JOIN users u ON s.uid = u.id ORDER BY s.created_at DESC LIMIT 10"
        );

        // Get recent vendor surveys (last 10)
        const [recentVendorSurveys] = await db.query(
            "SELECT vs.*, v.name as vendor_name, u.name as user_name FROM vendor_surveys vs LEFT JOIN vendors v ON vs.vendor_id = v.id LEFT JOIN users u ON vs.uid = u.id ORDER BY vs.created_at DESC LIMIT 10"
        );

        return sendSuccess(res, 200, "Dashboard statistics retrieved successfully", {
            stats: {
                users: userCount[0].count,
                vendors: vendorCount[0].count,
                activeVendors: activeVendorCount[0].count,
                countries: countryCount[0].count,
                activeCountries: activeCountryCount[0].count,
                projects: projectCount[0].count,
                activeProjects: activeProjectCount[0].count,
                surveys: surveyCount[0].count,
                vendorSurveys: vendorSurveyCount[0].count,
                roles: roleCount[0].count
            },
            surveyStatusBreakdown,
            vendorSurveyStatusBreakdown,
            recentSurveys,
            recentVendorSurveys
        });

    } catch (error) {
        console.error("Error in getDashboardStats controller:", error.message);
        return sendError(res, 500, "Internal server error retrieving dashboard statistics");
    }
};

/**
 * @desc    Get vendor statistics
 * @route   GET /api/dashboard/vendor-stats
 * @access  Private
 */
const getVendorStats = async (req, res) => {
    try {
        // Get vendor statistics with project and survey counts
        const [vendorStats] = await db.query(`
            SELECT 
                v.id,
                v.name,
                v.email,
                v.company,
                v.is_active,
                COUNT(DISTINCT p.id) as project_count,
                COUNT(DISTINCT vs.id) as survey_count
            FROM vendors v
            LEFT JOIN projects p ON v.id = p.vendor_id
            LEFT JOIN vendor_surveys vs ON v.id = vs.vendor_id
            GROUP BY v.id
            ORDER BY survey_count DESC, project_count DESC
        `);

        return sendSuccess(res, 200, "Vendor statistics retrieved successfully", {
            vendorStats
        });

    } catch (error) {
        console.error("Error in getVendorStats controller:", error.message);
        return sendError(res, 500, "Internal server error retrieving vendor statistics");
    }
};

/**
 * @desc    Get project statistics
 * @route   GET /api/dashboard/project-stats
 * @access  Private
 */
const getProjectStats = async (req, res) => {
    try {
        // Get project statistics with survey counts
        const [projectStats] = await db.query(`
            SELECT 
                p.id,
                p.pid,
                p.mid,
                p.old_link,
                p.new_link,
                p.is_active,
                v.name as vendor_name,
                c.name as country_name,
                COUNT(DISTINCT s.id) as survey_count,
                COUNT(DISTINCT vs.id) as vendor_survey_count
            FROM projects p
            LEFT JOIN vendors v ON p.vendor_id = v.id
            LEFT JOIN countries c ON p.country_id = c.id
            LEFT JOIN surveys s ON p.id = s.pid
            LEFT JOIN vendor_surveys vs ON p.id = vs.project_id
            GROUP BY p.id
            ORDER BY survey_count DESC, vendor_survey_count DESC
        `);

        return sendSuccess(res, 200, "Project statistics retrieved successfully", {
            projectStats
        });

    } catch (error) {
        console.error("Error in getProjectStats controller:", error.message);
        return sendError(res, 500, "Internal server error retrieving project statistics");
    }
};

/**
 * @desc    Get country statistics
 * @route   GET /api/dashboard/country-stats
 * @access  Private
 */
const getCountryStats = async (req, res) => {
    try {
        // Get country statistics with project counts (only countries that have projects)
        const [countryStats] = await db.query(`
            SELECT 
                c.id,
                c.name,
                c.is_active,
                COUNT(DISTINCT p.id) as project_count
            FROM countries c
            INNER JOIN projects p ON c.id = p.country_id
            GROUP BY c.id
            HAVING project_count > 0
            ORDER BY project_count DESC
        `);

        return sendSuccess(res, 200, "Country statistics retrieved successfully", {
            countryStats
        });

    } catch (error) {
        console.error("Error in getCountryStats controller:", error.message);
        return sendError(res, 500, "Internal server error retrieving country statistics");
    }
};

/**
 * @desc    Get user activity statistics
 * @route   GET /api/dashboard/user-activity
 * @access  Private
 */
const getUserActivity = async (req, res) => {
    try {
        // Get user activity with survey counts
        const [userActivity] = await db.query(`
            SELECT 
                u.id,
                u.name,
                u.email,
                r.name as role_name,
                COUNT(DISTINCT s.id) as survey_count,
                COUNT(DISTINCT vs.id) as vendor_survey_count,
                MAX(s.created_at) as last_survey_date,
                MAX(vs.created_at) as last_vendor_survey_date
            FROM users u
            LEFT JOIN roles r ON u.role = r.id
            LEFT JOIN surveys s ON u.id = s.uid
            LEFT JOIN vendor_surveys vs ON u.id = vs.uid
            GROUP BY u.id
            ORDER BY survey_count DESC, vendor_survey_count DESC
        `);

        return sendSuccess(res, 200, "User activity retrieved successfully", {
            userActivity
        });

    } catch (error) {
        console.error("Error in getUserActivity controller:", error.message);
        return sendError(res, 500, "Internal server error retrieving user activity");
    }
};

/**
 * @desc    Get survey trends (last 30 days)
 * @route   GET /api/dashboard/survey-trends
 * @access  Private
 */
const getSurveyTrends = async (req, res) => {
    try {
        // Get survey trends for the last 30 days
        const [surveyTrends] = await db.query(`
            SELECT 
                DATE(created_at) as date,
                COUNT(*) as count
            FROM surveys
            WHERE created_at >= DATE_SUB(NOW(), INTERVAL 30 DAY)
            GROUP BY DATE(created_at)
            ORDER BY date ASC
        `);

        // Get vendor survey trends for the last 30 days
        const [vendorSurveyTrends] = await db.query(`
            SELECT 
                DATE(created_at) as date,
                COUNT(*) as count
            FROM vendor_surveys
            WHERE created_at >= DATE_SUB(NOW(), INTERVAL 30 DAY)
            GROUP BY DATE(created_at)
            ORDER BY date ASC
        `);

        return sendSuccess(res, 200, "Survey trends retrieved successfully", {
            surveyTrends,
            vendorSurveyTrends
        });

    } catch (error) {
        console.error("Error in getSurveyTrends controller:", error.message);
        return sendError(res, 500, "Internal server error retrieving survey trends");
    }
};

/**
 * @desc    Get overview data for dashboard
 * @route   GET /api/dashboard/overview
 * @access  Private
 */
const getDashboardOverview = async (req, res) => {
    try {
        // Get all necessary data in parallel
        const [
            userCount,
            vendorCount,
            projectCount,
            surveyCount,
            recentSurveys,
            topVendors,
            topProjects
        ] = await Promise.all([
            db.query("SELECT COUNT(*) as count FROM users"),
            db.query("SELECT COUNT(*) as count FROM vendors WHERE is_active = 1"),
            db.query("SELECT COUNT(*) as count FROM projects WHERE is_active = 1"),
            db.query("SELECT COUNT(*) as count FROM surveys"),
            db.query(`
                SELECT s.*, u.name as user_name, u.email as user_email 
                FROM surveys s 
                LEFT JOIN users u ON s.uid = u.id 
                ORDER BY s.created_at DESC 
                LIMIT 5
            `),
            db.query(`
                SELECT v.id, v.name, v.company, COUNT(vs.id) as survey_count
                FROM vendors v
                LEFT JOIN vendor_surveys vs ON v.id = vs.vendor_id
                WHERE v.is_active = 1
                GROUP BY v.id
                ORDER BY survey_count DESC
                LIMIT 5
            `),
            db.query(`
                SELECT p.id, p.pid, p.mid, v.name as vendor_name, COUNT(s.id) as survey_count
                FROM projects p
                LEFT JOIN vendors v ON p.vendor_id = v.id
                LEFT JOIN surveys s ON p.id = s.pid
                WHERE p.is_active = 1
                GROUP BY p.id
                ORDER BY survey_count DESC
                LIMIT 5
            `)
        ]);

        return sendSuccess(res, 200, "Dashboard overview retrieved successfully", {
            overview: {
                totalUsers: userCount[0][0].count,
                totalVendors: vendorCount[0][0].count,
                totalProjects: projectCount[0][0].count,
                totalSurveys: surveyCount[0][0].count
            },
            recentSurveys: recentSurveys[0],
            topVendors: topVendors[0],
            topProjects: topProjects[0]
        });

    } catch (error) {
        console.error("Error in getDashboardOverview controller:", error.message);
        return sendError(res, 500, "Internal server error retrieving dashboard overview");
    }
};

export {
    getDashboardStats,
    getVendorStats,
    getProjectStats,
    getCountryStats,
    getUserActivity,
    getSurveyTrends,
    getDashboardOverview
};
