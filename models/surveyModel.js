import db from "../config/db.js";

const Survey = {

    // Find all surveys with pagination and filters
    findAllWithPagination: async ({ page = 1, limit = 100, status, id, pid, uid, sortBy = 'created_at', sortOrder = 'DESC' }) => {
        try {
            const offset = (page - 1) * limit;
            
            // Build WHERE clause dynamically
            let whereConditions = [];
            let queryParams = [];
            
            if (id) {
                whereConditions.push("s.id = ?");
                queryParams.push(id);
            }
            if (status) {
                whereConditions.push("s.status = ?");
                queryParams.push(status);
            }
            if (pid) {
                whereConditions.push("s.pid = ?");
                queryParams.push(pid);
            }
            if (uid) {
                whereConditions.push("s.uid = ?");
                queryParams.push(uid);
            }
            
            const whereClause = whereConditions.length > 0 
                ? `WHERE ${whereConditions.join(' AND ')}` 
                : '';
            
            // Validate sortBy to prevent SQL injection
            const allowedSortFields = ['id', 'pid', 'uid', 'status', 'created_at', 'updated_at'];
            const validSortBy = allowedSortFields.includes(sortBy) ? sortBy : 'created_at';
            const validSortOrder = sortOrder.toUpperCase() === 'ASC' ? 'ASC' : 'DESC';
            
            // Get total count
            const countQuery = `
                SELECT COUNT(*) as total 
                FROM surveys s 
                ${whereClause}
            `;
            const [countResult] = await db.query(countQuery, queryParams);
            const total = countResult[0].total;
            
            // Get paginated data
            const dataQuery = `
                SELECT s.*, 
                       p.pid AS project_pid, 
                       u.name AS user_name, 
                       u.email AS user_email 
                FROM surveys s 
                LEFT JOIN projects p ON s.pid = p.id 
                LEFT JOIN users u ON s.uid = u.id 
                ${whereClause}
                ORDER BY s.${validSortBy} ${validSortOrder}
                LIMIT ? OFFSET ?
            `;
            
            const [rows] = await db.query(dataQuery, [...queryParams, limit, offset]);
            
            return {
                surveys: rows,
                pagination: {
                    currentPage: page,
                    totalPages: Math.ceil(total / limit),
                    totalItems: total,
                    itemsPerPage: limit,
                    hasNextPage: page < Math.ceil(total / limit),
                    hasPrevPage: page > 1
                }
            };
        } catch (error) {
            console.error("Error in Survey.findAllWithPagination:", error.message);
            throw error;
        }
    },

    // Find all surveys (legacy method - kept for backward compatibility)
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
