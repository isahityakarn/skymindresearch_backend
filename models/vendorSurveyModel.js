import db from "../config/db.js";

const VendorSurvey = {

    // Find all vendor surveys
    findAll: async () => {
        try {
            const [rows] = await db.query(
                "SELECT vs.*, v.name AS vendor_name, p.pid AS project_pid, u.name AS user_name, u.email AS user_email FROM vendor_surveys vs LEFT JOIN vendors v ON vs.vendor_id = v.id LEFT JOIN projects p ON vs.project_id = p.id LEFT JOIN users u ON vs.uid = u.id ORDER BY vs.created_at DESC"
            );
            return rows || null;
        } catch (error) {
            console.error("Error in VendorSurvey.findAll:", error.message);
            throw error;
        }
    },

    // Find vendor survey by ID
    findById: async (id) => {
        try {
            const [rows] = await db.query(
                "SELECT vs.*, v.name AS vendor_name, p.pid AS project_pid, u.name AS user_name, u.email AS user_email FROM vendor_surveys vs LEFT JOIN vendors v ON vs.vendor_id = v.id LEFT JOIN projects p ON vs.project_id = p.id LEFT JOIN users u ON vs.uid = u.id WHERE vs.id = ? LIMIT 1",
                [id]
            );
            return rows[0] || null;
        } catch (error) {
            console.error("Error in VendorSurvey.findById:", error.message);
            throw error;
        }
    },

    // Find vendor surveys by vendor ID
    findByVendorId: async (vendor_id) => {
        try {
            const [rows] = await db.query(
                "SELECT vs.*, v.name AS vendor_name, p.pid AS project_pid, u.name AS user_name, u.email AS user_email FROM vendor_surveys vs LEFT JOIN vendors v ON vs.vendor_id = v.id LEFT JOIN projects p ON vs.project_id = p.id LEFT JOIN users u ON vs.uid = u.id WHERE vs.vendor_id = ? ORDER BY vs.created_at DESC",
                [vendor_id]
            );
            return rows || null;
        } catch (error) {
            console.error("Error in VendorSurvey.findByVendorId:", error.message);
            throw error;
        }
    },

    // Find vendor surveys by project ID
    findByProjectId: async (project_id) => {
        try {
            const [rows] = await db.query(
                "SELECT vs.*, v.name AS vendor_name, p.pid AS project_pid, u.name AS user_name, u.email AS user_email FROM vendor_surveys vs LEFT JOIN vendors v ON vs.vendor_id = v.id LEFT JOIN projects p ON vs.project_id = p.id LEFT JOIN users u ON vs.uid = u.id WHERE vs.project_id = ? ORDER BY vs.created_at DESC",
                [project_id]
            );
            return rows || null;
        } catch (error) {
            console.error("Error in VendorSurvey.findByProjectId:", error.message);
            throw error;
        }
    },

    // Find vendor surveys by PID
    findByPid: async (pid) => {
        try {
            const [rows] = await db.query(
                "SELECT vs.*, v.name AS vendor_name, p.pid AS project_pid, u.name AS user_name, u.email AS user_email FROM vendor_surveys vs LEFT JOIN vendors v ON vs.vendor_id = v.id LEFT JOIN projects p ON vs.project_id = p.id LEFT JOIN users u ON vs.uid = u.id WHERE vs.pid = ? ORDER BY vs.created_at DESC",
                [pid]
            );
            return rows || null;
        } catch (error) {
            console.error("Error in VendorSurvey.findByPid:", error.message);
            throw error;
        }
    },

    // Find vendor surveys by user ID
    findByUserId: async (uid) => {
        try {
            const [rows] = await db.query(
                "SELECT vs.*, v.name AS vendor_name, p.pid AS project_pid, u.name AS user_name, u.email AS user_email FROM vendor_surveys vs LEFT JOIN vendors v ON vs.vendor_id = v.id LEFT JOIN projects p ON vs.project_id = p.id LEFT JOIN users u ON vs.uid = u.id WHERE vs.uid = ? ORDER BY vs.created_at DESC",
                [uid]
            );
            return rows || null;
        } catch (error) {
            console.error("Error in VendorSurvey.findByUserId:", error.message);
            throw error;
        }
    },

    // Find vendor surveys by MID
    findByMid: async (mid) => {
        try {
            const [rows] = await db.query(
                "SELECT vs.*, v.name AS vendor_name, p.pid AS project_pid, u.name AS user_name, u.email AS user_email FROM vendor_surveys vs LEFT JOIN vendors v ON vs.vendor_id = v.id LEFT JOIN projects p ON vs.project_id = p.id LEFT JOIN users u ON vs.uid = u.id WHERE vs.mid = ? ORDER BY vs.created_at DESC",
                [mid]
            );
            return rows || null;
        } catch (error) {
            console.error("Error in VendorSurvey.findByMid:", error.message);
            throw error;
        }
    },

    // Find vendor surveys by status
    findByStatus: async (status) => {
        try {
            const [rows] = await db.query(
                "SELECT vs.*, v.name AS vendor_name, p.pid AS project_pid, u.name AS user_name, u.email AS user_email FROM vendor_surveys vs LEFT JOIN vendors v ON vs.vendor_id = v.id LEFT JOIN projects p ON vs.project_id = p.id LEFT JOIN users u ON vs.uid = u.id WHERE vs.status = ? ORDER BY vs.created_at DESC",
                [status]
            );
            return rows || null;
        } catch (error) {
            console.error("Error in VendorSurvey.findByStatus:", error.message);
            throw error;
        }
    },

    // Find vendor surveys by IP address
    findByIp: async (ip) => {
        try {
            const [rows] = await db.query(
                "SELECT vs.*, v.name AS vendor_name, p.pid AS project_pid, u.name AS user_name, u.email AS user_email FROM vendor_surveys vs LEFT JOIN vendors v ON vs.vendor_id = v.id LEFT JOIN projects p ON vs.project_id = p.id LEFT JOIN users u ON vs.uid = u.id WHERE vs.start_ip = ? OR vs.end_ip = ? ORDER BY vs.created_at DESC",
                [ip, ip]
            );
            return rows || null;
        } catch (error) {
            console.error("Error in VendorSurvey.findByIp:", error.message);
            throw error;
        }
    },

    // Create a new vendor survey
    create: async ({ vendor_id, project_id, pid, uid, mid, status, start_ip, end_ip }) => {
        try {
            const [result] = await db.query(
                "INSERT INTO vendor_surveys (vendor_id, project_id, pid, uid, mid, status, start_ip, end_ip) VALUES (?, ?, ?, ?, ?, ?, ?, ?)",
                [
                    vendor_id || null,
                    project_id || null,
                    pid || null,
                    uid || null,
                    mid || null,
                    status || null,
                    start_ip || null,
                    end_ip || null
                ]
            );
            return {
                id: result.insertId,
                vendor_id: vendor_id || null,
                project_id: project_id || null,
                pid: pid || null,
                uid: uid || null,
                mid: mid || null,
                status: status || null,
                start_ip: start_ip || null,
                end_ip: end_ip || null
            };
        } catch (error) {
            console.error("Error in VendorSurvey.create:", error.message);
            throw error;
        }
    },

    // Update an existing vendor survey
    update: async (id, { vendor_id, project_id, pid, uid, mid, status, start_ip, end_ip }) => {
        try {
            const query = "UPDATE vendor_surveys SET vendor_id = ?, project_id = ?, pid = ?, uid = ?, mid = ?, status = ?, start_ip = ?, end_ip = ? WHERE id = ?";
            const params = [
                vendor_id || null,
                project_id || null,
                pid || null,
                uid || null,
                mid || null,
                status || null,
                start_ip || null,
                end_ip || null,
                id
            ];

            await db.query(query, params);
            return await VendorSurvey.findById(id);
        } catch (error) {
            console.error("Error in VendorSurvey.update:", error.message);
            throw error;
        }
    },

    // Update vendor survey status
    updateStatus: async (id, status) => {
        try {
            await db.query(
                "UPDATE vendor_surveys SET status = ? WHERE id = ?",
                [status, id]
            );
            return await VendorSurvey.findById(id);
        } catch (error) {
            console.error("Error in VendorSurvey.updateStatus:", error.message);
            throw error;
        }
    },

    // Update end IP
    updateEndIp: async (id, end_ip) => {
        try {
            await db.query(
                "UPDATE vendor_surveys SET end_ip = ? WHERE id = ?",
                [end_ip, id]
            );
            return await VendorSurvey.findById(id);
        } catch (error) {
            console.error("Error in VendorSurvey.updateEndIp:", error.message);
            throw error;
        }
    },

    // Delete a vendor survey
    delete: async (id) => {
        try {
            await db.query(
                "DELETE FROM vendor_surveys WHERE id = ?",
                [id]
            );
            return { success: true };
        } catch (error) {
            console.error("Error in VendorSurvey.delete:", error.message);
            throw error;
        }
    }
};

export default VendorSurvey;
