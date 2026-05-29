import db from "../config/db.js";

const Country = {

    // Find all countries
    findAll: async () => {
        try {
            const [rows] = await db.query(
                "SELECT * FROM countries ORDER BY name ASC"
            );
            return rows || null;
        } catch (error) {
            console.error("Error in Country.findAll:", error.message);
            throw error;
        }
    },

    // Find country by ID
    findById: async (id) => {
        try {
            const [rows] = await db.query(
                "SELECT * FROM countries WHERE id = ? LIMIT 1",
                [id]
            );
            return rows[0] || null;
        } catch (error) {
            console.error("Error in Country.findById:", error.message);
            throw error;
        }
    },

    // Find country by name
    findByName: async (name) => {
        try {
            const [rows] = await db.query(
                "SELECT * FROM countries WHERE name = ? LIMIT 1",
                [name]
            );
            return rows[0] || null;
        } catch (error) {
            console.error("Error in Country.findByName:", error.message);
            throw error;
        }
    },

    // Find active countries
    findActive: async () => {
        try {
            const [rows] = await db.query(
                "SELECT * FROM countries WHERE is_active = 1 ORDER BY name ASC"
            );
            return rows || null;
        } catch (error) {
            console.error("Error in Country.findActive:", error.message);
            throw error;
        }
    },

    // Create a new country
    create: async ({ name, is_active }) => {
        try {
            const [result] = await db.query(
                "INSERT INTO countries (name, is_active) VALUES (?, ?)",
                [name, is_active !== undefined ? is_active : 1]
            );
            return {
                id: result.insertId,
                name,
                is_active: is_active !== undefined ? is_active : 1
            };
        } catch (error) {
            console.error("Error in Country.create:", error.message);
            throw error;
        }
    },

    // Update an existing country
    update: async (id, { name, is_active }) => {
        try {
            const query = "UPDATE countries SET name = ?, is_active = ? WHERE id = ?";
            const params = [
                name,
                is_active !== undefined ? is_active : 1,
                id
            ];

            await db.query(query, params);
            return await Country.findById(id);
        } catch (error) {
            console.error("Error in Country.update:", error.message);
            throw error;
        }
    },

    // Soft delete a country (set is_active to 0)
    softDelete: async (id) => {
        try {
            await db.query(
                "UPDATE countries SET is_active = 0 WHERE id = ?",
                [id]
            );
            return await Country.findById(id);
        } catch (error) {
            console.error("Error in Country.softDelete:", error.message);
            throw error;
        }
    },

    // Hard delete a country
    delete: async (id) => {
        try {
            await db.query(
                "DELETE FROM countries WHERE id = ?",
                [id]
            );
            return { success: true };
        } catch (error) {
            console.error("Error in Country.delete:", error.message);
            throw error;
        }
    }
};

export default Country;
