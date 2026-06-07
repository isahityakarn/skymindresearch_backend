import db from "../config/db.js";

const User = {

    // Find all users
    findAll: async () => {
        try {
            const [rows] = await db.query(
                "SELECT u.*, r.name AS role_name FROM users u LEFT JOIN roles r ON u.role = r.id"
            );
            return rows || null;
        } catch (error) {
            console.error("Error in User.findAll:", error.message);
            throw error;
        }
    },


    // Find user by email
    findByEmail: async (email) => {
        try {
            const [rows] = await db.query(
                "SELECT u.*, r.name AS role_name FROM users u LEFT JOIN roles r ON u.role = r.id WHERE u.email = ? LIMIT 1",
                [email]
            );
            return rows[0] || null;
        } catch (error) {
            console.error("Error in User.findByEmail:", error.message);
            throw error;
        }
    },

    // Find user by ID
    findById: async (id) => {
        try {
            const [rows] = await db.query(
                "SELECT u.id, u.name, u.email, u.role, u.phone, u.address, u.user_img, r.name AS role_name, u.created_at FROM users u LEFT JOIN roles r ON u.role = r.id WHERE u.id = ? LIMIT 1",
                [id]
            );
            return rows[0] || null;
        } catch (error) {
            console.error("Error in User.findById:", error.message);
            throw error;
        }
    },

    // Create a new user
    create: async ({ name, email, password, role, phone, address, user_img }) => {
        try {
            const [result] = await db.query(
                "INSERT INTO users (name, email, password, role, phone, address, user_img) VALUES (?, ?, ?, ?, ?, ?, ?)",
                [name, email, password, role || null, phone || null, address || null, user_img || null]
            );
            return {
                id: result.insertId,
                name,
                email,
                role: role || null,
                phone: phone || null,
                address: address || null,
                user_img: user_img || null
            };
        } catch (error) {
            console.error("Error in User.create:", error.message);
            throw error;
        }
    },

    // Update password only
    updatePassword: async (id, hashedPassword) => {
        try {
            await db.query("UPDATE users SET password = ? WHERE id = ?", [hashedPassword, id]);
            return true;
        } catch (error) {
            console.error("Error in User.updatePassword:", error.message);
            throw error;
        }
    },

    // Update an existing user
    update: async (id, { name, email, password, role, phone, address, user_img }) => {
        try {
            let query = "UPDATE users SET name = ?, email = ?, role = ?, phone = ?, address = ?";
            const params = [name, email, role || null, phone || null, address || null];

            if (password) {
                query += ", password = ?";
                params.push(password);
            }

            if (user_img !== undefined) {
                query += ", user_img = ?";
                params.push(user_img);
            }

            query += " WHERE id = ?";
            params.push(id);

            await db.query(query, params);
            return await User.findById(id);
        } catch (error) {
            console.error("Error in User.update:", error.message);
            throw error;
        }
    }
};

export default User;
