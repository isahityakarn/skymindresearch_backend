import Project from "../models/projectModel.js";
import { sendError, sendSuccess } from "../utils/responseHelper.js";

/**
 * @desc    Get all projects
 * @route   GET /api/projects
 * @access  Private
 */
const getAllProjects = async (req, res) => {
    try {
        const projects = await Project.findAll();
        return sendSuccess(res, 200, "Projects retrieved successfully", {
            projects
        });
    } catch (error) {
        console.error("Error in getAllProjects controller:", error.message);
        return sendError(res, 500, "Internal server error retrieving projects");
    }
};

/**
 * @desc    Get project by ID
 * @route   GET /api/projects/:id
 * @access  Private
 */
const getProjectById = async (req, res) => {
    try {
        const { id } = req.params;
        const project = await Project.findById(id);

        if (!project) {
            return sendError(res, 404, "Project not found");
        }

        return sendSuccess(res, 200, "Project retrieved successfully", {
            project
        });
    } catch (error) {
        console.error("Error in getProjectById controller:", error.message);
        return sendError(res, 500, "Internal server error retrieving project");
    }
};

/**
 * @desc    Get project by PID
 * @route   GET /api/projects/pid/:pid
 * @access  Private
 */
const getProjectByPid = async (req, res) => {
    try {
        const { pid } = req.params;
        const project = await Project.findByPid(pid);

        if (!project) {
            return sendError(res, 404, "Project not found");
        }

        return sendSuccess(res, 200, "Project retrieved successfully", {
            project
        });
    } catch (error) {
        console.error("Error in getProjectByPid controller:", error.message);
        return sendError(res, 500, "Internal server error retrieving project");
    }
};

/**
 * @desc    Get project by MID
 * @route   GET /api/projects/mid/:mid
 * @access  Private
 */
const getProjectByMid = async (req, res) => {
    try {
        const { mid } = req.params;
        const project = await Project.findByMid(mid);

        if (!project) {
            return sendError(res, 404, "Project not found");
        }

        return sendSuccess(res, 200, "Project retrieved successfully", {
            project
        });
    } catch (error) {
        console.error("Error in getProjectByMid controller:", error.message);
        return sendError(res, 500, "Internal server error retrieving project");
    }
};

/**
 * @desc    Get projects by vendor ID
 * @route   GET /api/projects/vendor/:vendor_id
 * @access  Private
 */
const getProjectsByVendorId = async (req, res) => {
    try {
        const { vendor_id } = req.params;
        const projects = await Project.findByVendorId(vendor_id);

        return sendSuccess(res, 200, "Projects retrieved successfully", {
            projects
        });
    } catch (error) {
        console.error("Error in getProjectsByVendorId controller:", error.message);
        return sendError(res, 500, "Internal server error retrieving projects");
    }
};

/**
 * @desc    Get projects by country ID
 * @route   GET /api/projects/country/:country_id
 * @access  Private
 */
const getProjectsByCountryId = async (req, res) => {
    try {
        const { country_id } = req.params;
        const projects = await Project.findByCountryId(country_id);

        return sendSuccess(res, 200, "Projects retrieved successfully", {
            projects
        });
    } catch (error) {
        console.error("Error in getProjectsByCountryId controller:", error.message);
        return sendError(res, 500, "Internal server error retrieving projects");
    }
};

/**
 * @desc    Get active projects
 * @route   GET /api/projects/active
 * @access  Private
 */
const getActiveProjects = async (req, res) => {
    try {
        const projects = await Project.findActive();
        return sendSuccess(res, 200, "Active projects retrieved successfully", {
            projects
        });
    } catch (error) {
        console.error("Error in getActiveProjects controller:", error.message);
        return sendError(res, 500, "Internal server error retrieving active projects");
    }
};

/**
 * @desc    Create a new project
 * @route   POST /api/projects
 * @access  Private
 */
const createProject = async (req, res) => {
    try {
        const { old_link, new_link, pid, mid, vendor_id, country_id, info, is_active } = req.body;

        // Validation
        if (!pid) {
            return sendError(res, 400, "Please provide project ID (pid)");
        }

        // Create project
        const newProject = await Project.create({
            old_link: old_link || null,
            new_link: new_link || null,
            pid,
            mid: mid || null,
            vendor_id: vendor_id || null,
            country_id: country_id || null,
            info: info || null,
            is_active: is_active !== undefined ? is_active : 1
        });

        return sendSuccess(res, 201, "Project created successfully", {
            project: newProject
        });
    } catch (error) {
        console.error("Error in createProject controller:", error.message);
        return sendError(res, 500, "Internal server error creating project");
    }
};

/**
 * @desc    Update a project
 * @route   PUT /api/projects/:id
 * @access  Private
 */
const updateProject = async (req, res) => {
    try {
        const { id } = req.params;
        const { old_link, new_link, pid, mid, vendor_id, country_id, info, is_active } = req.body;

        // Check if project exists
        const existingProject = await Project.findById(id);
        if (!existingProject) {
            return sendError(res, 404, "Project not found");
        }

        // Update project
        const updatedProject = await Project.update(id, {
            old_link: old_link !== undefined ? old_link : existingProject.old_link,
            new_link: new_link !== undefined ? new_link : existingProject.new_link,
            pid: pid !== undefined ? pid : existingProject.pid,
            mid: mid !== undefined ? mid : existingProject.mid,
            vendor_id: vendor_id !== undefined ? vendor_id : existingProject.vendor_id,
            country_id: country_id !== undefined ? country_id : existingProject.country_id,
            info: info !== undefined ? info : existingProject.info,
            is_active: is_active !== undefined ? is_active : existingProject.is_active
        });

        return sendSuccess(res, 200, "Project updated successfully", {
            project: updatedProject
        });
    } catch (error) {
        console.error("Error in updateProject controller:", error.message);
        return sendError(res, 500, "Internal server error updating project");
    }
};

/**
 * @desc    Soft delete a project (deactivate)
 * @route   PATCH /api/projects/:id/deactivate
 * @access  Private
 */
const deactivateProject = async (req, res) => {
    try {
        const { id } = req.params;

        // Check if project exists
        const existingProject = await Project.findById(id);
        if (!existingProject) {
            return sendError(res, 404, "Project not found");
        }

        // Soft delete
        const deactivatedProject = await Project.softDelete(id);

        return sendSuccess(res, 200, "Project deactivated successfully", {
            project: deactivatedProject
        });
    } catch (error) {
        console.error("Error in deactivateProject controller:", error.message);
        return sendError(res, 500, "Internal server error deactivating project");
    }
};

/**
 * @desc    Delete a project
 * @route   DELETE /api/projects/:id
 * @access  Private
 */
const deleteProject = async (req, res) => {
    try {
        const { id } = req.params;

        // Check if project exists
        const existingProject = await Project.findById(id);
        if (!existingProject) {
            return sendError(res, 404, "Project not found");
        }

        // Delete project
        await Project.delete(id);

        return sendSuccess(res, 200, "Project deleted successfully");
    } catch (error) {
        console.error("Error in deleteProject controller:", error.message);
        return sendError(res, 500, "Internal server error deleting project");
    }
};

export {
    getAllProjects,
    getProjectById,
    getProjectByPid,
    getProjectByMid,
    getProjectsByVendorId,
    getProjectsByCountryId,
    getActiveProjects,
    createProject,
    updateProject,
    deactivateProject,
    deleteProject
};
