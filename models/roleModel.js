import db from "../config/db.js";

const Role = {

    // Find all roles
    findAll: async () => {
        try {
            const [rows] = await db.query(
                "SELECT * FROM roles ORDER BY name ASC"
            );
            return rows || null;
        } catch (error) {
            console.error("Error in Role.findAll:", error.message);
            throw error;
        }
    },

    // Find role by ID
    findById: async (id) => {
        try {
            const [rows] = await db.query(
                "SELECT * FROM roles WHERE id = ? LIMIT 1",
                [id]
            );
            return rows[0] || null;
        } catch (error) {
            console.error("Error in Role.findById:", error.message);
            throw error;
        }
    },

    // Find role by name
    findByName: async (name) => {
        try {
            const [rows] = await db.query(
                "SELECT * FROM roles WHERE name = ? LIMIT 1",
                [name]
            );
            return rows[0] || null;
        } catch (error) {
            console.error("Error in Role.findByName:", error.message);
            throw error;
        }
    },

    // Create a new role
    create: async ({ name }) => {
        try {
            const [result] = await db.query(
                "INSERT INTO roles (name) VALUES (?)",
                [name]
            );
            return {
                id: result.insertId,
                name
            };
        } catch (error) {
            console.error("Error in Role.create:", error.message);
            throw error;
        }
    },

    // Update an existing role
    update: async (id, { name }) => {
        try {
            const query = "UPDATE roles SET name = ? WHERE id = ?";
            const params = [name, id];

            await db.query(query, params);
            return await Role.findById(id);
        } catch (error) {
            console.error("Error in Role.update:", error.message);
            throw error;
        }
    },

    // Delete a role
    delete: async (id) => {
        try {
            await db.query(
                "DELETE FROM roles WHERE id = ?",
                [id]
            );
            return { success: true };
        } catch (error) {
            console.error("Error in Role.delete:", error.message);
            throw error;
        }
    }
};

export default Role;
