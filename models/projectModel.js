import db from "../config/db.js";

const Project = {

    // Find all projects
    findAll: async () => {
        try {
            const [rows] = await db.query(
                "SELECT p.*, v.name AS vendor_name, c.name AS country_name FROM projects p LEFT JOIN vendors v ON p.vendor_id = v.id LEFT JOIN countries c ON p.country_id = c.id ORDER BY p.created_at DESC"
            );
            return rows || null;
        } catch (error) {
            console.error("Error in Project.findAll:", error.message);
            throw error;
        }
    },

    // Find project by ID
    findById: async (id) => {
        try {
            const [rows] = await db.query(
                "SELECT p.*, v.name AS vendor_name, c.name AS country_name FROM projects p LEFT JOIN vendors v ON p.vendor_id = v.id LEFT JOIN countries c ON p.country_id = c.id WHERE p.id = ? LIMIT 1",
                [id]
            );
            return rows[0] || null;
        } catch (error) {
            console.error("Error in Project.findById:", error.message);
            throw error;
        }
    },

    // Find project by PID
    findByPid: async (pid) => {
        try {
            const [rows] = await db.query(
                "SELECT p.*, v.name AS vendor_name, c.name AS country_name FROM projects p LEFT JOIN vendors v ON p.vendor_id = v.id LEFT JOIN countries c ON p.country_id = c.id WHERE p.pid = ? LIMIT 1",
                [pid]
            );
            return rows[0] || null;
        } catch (error) {
            console.error("Error in Project.findByPid:", error.message);
            throw error;
        }
    },

    // Find project by MID
    findByMid: async (mid) => {
        try {
            const [rows] = await db.query(
                "SELECT p.*, v.name AS vendor_name, c.name AS country_name FROM projects p LEFT JOIN vendors v ON p.vendor_id = v.id LEFT JOIN countries c ON p.country_id = c.id WHERE p.mid = ? LIMIT 1",
                [mid]
            );
            return rows[0] || null;
        } catch (error) {
            console.error("Error in Project.findByMid:", error.message);
            throw error;
        }
    },

    // Find projects by vendor ID
    findByVendorId: async (vendor_id) => {
        try {
            const [rows] = await db.query(
                "SELECT p.*, v.name AS vendor_name, c.name AS country_name FROM projects p LEFT JOIN vendors v ON p.vendor_id = v.id LEFT JOIN countries c ON p.country_id = c.id WHERE p.vendor_id = ? ORDER BY p.created_at DESC",
                [vendor_id]
            );
            return rows || null;
        } catch (error) {
            console.error("Error in Project.findByVendorId:", error.message);
            throw error;
        }
    },

    // Find projects by country ID
    findByCountryId: async (country_id) => {
        try {
            const [rows] = await db.query(
                "SELECT p.*, v.name AS vendor_name, c.name AS country_name FROM projects p LEFT JOIN vendors v ON p.vendor_id = v.id LEFT JOIN countries c ON p.country_id = c.id WHERE p.country_id = ? ORDER BY p.created_at DESC",
                [country_id]
            );
            return rows || null;
        } catch (error) {
            console.error("Error in Project.findByCountryId:", error.message);
            throw error;
        }
    },

    // Find active projects
    findActive: async () => {
        try {
            const [rows] = await db.query(
                "SELECT p.*, v.name AS vendor_name, c.name AS country_name FROM projects p LEFT JOIN vendors v ON p.vendor_id = v.id LEFT JOIN countries c ON p.country_id = c.id WHERE p.is_active = 1 ORDER BY p.created_at DESC"
            );
            return rows || null;
        } catch (error) {
            console.error("Error in Project.findActive:", error.message);
            throw error;
        }
    },

    // Create a new project
    create: async ({ 
        old_link, 
        new_link, 
        pid, 
        mid, 
        vendor_id, 
        country_id, 
        info, 
        is_active 
    }) => {
        try {
            const [result] = await db.query(
                "INSERT INTO projects (old_link, new_link, pid, mid, vendor_id, country_id, info, is_active) VALUES (?, ?, ?, ?, ?, ?, ?, ?)",
                [
                    old_link || null,
                    new_link || null,
                    pid || null,
                    mid || null,
                    vendor_id || null,
                    country_id || null,
                    info || null,
                    is_active !== undefined ? is_active : 1
                ]
            );
            return {
                id: result.insertId,
                old_link: old_link || null,
                new_link: new_link || null,
                pid: pid || null,
                mid: mid || null,
                vendor_id: vendor_id || null,
                country_id: country_id || null,
                info: info || null,
                is_active: is_active !== undefined ? is_active : 1
            };
        } catch (error) {
            console.error("Error in Project.create:", error.message);
            throw error;
        }
    },

    // Update an existing project
    update: async (id, { 
        old_link, 
        new_link, 
        pid, 
        mid, 
        vendor_id, 
        country_id, 
        info, 
        is_active 
    }) => {
        try {
            const query = "UPDATE projects SET old_link = ?, new_link = ?, pid = ?, mid = ?, vendor_id = ?, country_id = ?, info = ?, is_active = ? WHERE id = ?";
            const params = [
                old_link || null,
                new_link || null,
                pid || null,
                mid || null,
                vendor_id || null,
                country_id || null,
                info || null,
                is_active !== undefined ? is_active : 1,
                id
            ];

            await db.query(query, params);
            return await Project.findById(id);
        } catch (error) {
            console.error("Error in Project.update:", error.message);
            throw error;
        }
    },

    // Soft delete a project (set is_active to 0)
    softDelete: async (id) => {
        try {
            await db.query(
                "UPDATE projects SET is_active = 0 WHERE id = ?",
                [id]
            );
            return await Project.findById(id);
        } catch (error) {
            console.error("Error in Project.softDelete:", error.message);
            throw error;
        }
    },

    // Hard delete a project
    delete: async (id) => {
        try {
            await db.query(
                "DELETE FROM projects WHERE id = ?",
                [id]
            );
            return { success: true };
        } catch (error) {
            console.error("Error in Project.delete:", error.message);
            throw error;
        }
    }
};

export default Project;
