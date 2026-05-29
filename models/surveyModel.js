import db from "../config/db.js";

const Survey = {

    // Find all surveys
    findAll: async () => {
        try {
            const [rows] = await db.query(
                "SELECT s.*, p.pid AS project_pid, u.name AS user_name, u.email AS user_email FROM surveys s LEFT JOIN projects p ON s.pid = p.id LEFT JOIN users u ON s.uid = u.id ORDER BY s.created_at DESC"
            );
            return rows || null;
        } catch (error) {
            console.error("Error in Survey.findAll:", error.message);
            throw error;
        }
    },

    // Find survey by ID
    findById: async (id) => {
        try {
            const [rows] = await db.query(
                "SELECT s.*, p.pid AS project_pid, u.name AS user_name, u.email AS user_email FROM surveys s LEFT JOIN projects p ON s.pid = p.id LEFT JOIN users u ON s.uid = u.id WHERE s.id = ? LIMIT 1",
                [id]
            );
            return rows[0] || null;
        } catch (error) {
            console.error("Error in Survey.findById:", error.message);
            throw error;
        }
    },

    // Find surveys by project ID
    findByProjectId: async (pid) => {
        try {
            const [rows] = await db.query(
                "SELECT s.*, p.pid AS project_pid, u.name AS user_name, u.email AS user_email FROM surveys s LEFT JOIN projects p ON s.pid = p.id LEFT JOIN users u ON s.uid = u.id WHERE s.pid = ? ORDER BY s.created_at DESC",
                [pid]
            );
            return rows || null;
        } catch (error) {
            console.error("Error in Survey.findByProjectId:", error.message);
            throw error;
        }
    },

    // Find surveys by user ID
    findByUserId: async (uid) => {
        try {
            const [rows] = await db.query(
                "SELECT s.*, p.pid AS project_pid, u.name AS user_name, u.email AS user_email FROM surveys s LEFT JOIN projects p ON s.pid = p.id LEFT JOIN users u ON s.uid = u.id WHERE s.uid = ? ORDER BY s.created_at DESC",
                [uid]
            );
            return rows || null;
        } catch (error) {
            console.error("Error in Survey.findByUserId:", error.message);
            throw error;
        }
    },

    // Find surveys by status
    findByStatus: async (status) => {
        try {
            const [rows] = await db.query(
                "SELECT s.*, p.pid AS project_pid, u.name AS user_name, u.email AS user_email FROM surveys s LEFT JOIN projects p ON s.pid = p.id LEFT JOIN users u ON s.uid = u.id WHERE s.status = ? ORDER BY s.created_at DESC",
                [status]
            );
            return rows || null;
        } catch (error) {
            console.error("Error in Survey.findByStatus:", error.message);
            throw error;
        }
    },

    // Find surveys by IP address
    findByIp: async (ip) => {
        try {
            const [rows] = await db.query(
                "SELECT s.*, p.pid AS project_pid, u.name AS user_name, u.email AS user_email FROM surveys s LEFT JOIN projects p ON s.pid = p.id LEFT JOIN users u ON s.uid = u.id WHERE s.start_ip = ? OR s.end_ip = ? ORDER BY s.created_at DESC",
                [ip, ip]
            );
            return rows || null;
        } catch (error) {
            console.error("Error in Survey.findByIp:", error.message);
            throw error;
        }
    },

    // Create a new survey
    create: async ({ pid, uid, status, start_ip, end_ip }) => {
        try {
            const [result] = await db.query(
                "INSERT INTO surveys (pid, uid, status, start_ip, end_ip) VALUES (?, ?, ?, ?, ?)",
                [
                    pid || null,
                    uid || null,
                    status || null,
                    start_ip || null,
                    end_ip || null
                ]
            );
            return {
                id: result.insertId,
                pid: pid || null,
                uid: uid || null,
                status: status || null,
                start_ip: start_ip || null,
                end_ip: end_ip || null
            };
        } catch (error) {
            console.error("Error in Survey.create:", error.message);
            throw error;
        }
    },

    // Update an existing survey
    update: async (id, { pid, uid, status, start_ip, end_ip }) => {
        try {
            const query = "UPDATE surveys SET pid = ?, uid = ?, status = ?, start_ip = ?, end_ip = ? WHERE id = ?";
            const params = [
                pid || null,
                uid || null,
                status || null,
                start_ip || null,
                end_ip || null,
                id
            ];

            await db.query(query, params);
            return await Survey.findById(id);
        } catch (error) {
            console.error("Error in Survey.update:", error.message);
            throw error;
        }
    },

    // Update survey status
    updateStatus: async (id, status) => {
        try {
            await db.query(
                "UPDATE surveys SET status = ? WHERE id = ?",
                [status, id]
            );
            return await Survey.findById(id);
        } catch (error) {
            console.error("Error in Survey.updateStatus:", error.message);
            throw error;
        }
    },

    // Update end IP
    updateEndIp: async (id, end_ip) => {
        try {
            await db.query(
                "UPDATE surveys SET end_ip = ? WHERE id = ?",
                [end_ip, id]
            );
            return await Survey.findById(id);
        } catch (error) {
            console.error("Error in Survey.updateEndIp:", error.message);
            throw error;
        }
    },

    // Delete a survey
    delete: async (id) => {
        try {
            await db.query(
                "DELETE FROM surveys WHERE id = ?",
                [id]
            );
            return { success: true };
        } catch (error) {
            console.error("Error in Survey.delete:", error.message);
            throw error;
        }
    }
};

export default Survey;
