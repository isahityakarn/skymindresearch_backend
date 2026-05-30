import db from "../config/db.js";

const Vendor = {

    // Find all vendors
    findAll: async () => {
        try {
            const [rows] = await db.query(
                "SELECT * FROM vendors ORDER BY created_at DESC"
            );
            return rows || null;
        } catch (error) {
            console.error("Error in Vendor.findAll:", error.message);
            throw error;
        }
    },

    // Find vendor by ID
    findById: async (id) => {
        try {
            const [rows] = await db.query(
                "SELECT * FROM vendors WHERE id = ? LIMIT 1",
                [id]
            );
            return rows[0] || null;
        } catch (error) {
            console.error("Error in Vendor.findById:", error.message);
            throw error;
        }
    },

    // Find vendor by email
    findByEmail: async (email) => {
        try {
            const [rows] = await db.query(
                "SELECT * FROM vendors WHERE email = ? LIMIT 1",
                [email]
            );
            return rows[0] || null;
        } catch (error) {
            console.error("Error in Vendor.findByEmail:", error.message);
            throw error;
        }
    },

    // Find active vendors
    findActive: async () => {
        try {
            const [rows] = await db.query(
                "SELECT * FROM vendors WHERE is_active = 1 ORDER BY created_at DESC"
            );
            return rows || null;
        } catch (error) {
            console.error("Error in Vendor.findActive:", error.message);
            throw error;
        }
    },

    // Create a new vendor
    create: async ({ 
        name, 
        email, 
        redirect_complete, 
        redirect_quotafull, 
        redirect_terminate, 
        company, 
        address, 
        is_active 
    }) => {
        try {
            const [result] = await db.query(
                "INSERT INTO vendors (name, email, redirect_complete, redirect_quotafull, redirect_terminate, company, address, is_active) VALUES (?, ?, ?, ?, ?, ?, ?, ?)",
                [
                    name, 
                    email, 
                    redirect_complete || null, 
                    redirect_quotafull || null, 
                    redirect_terminate || null, 
                    company || null, 
                    address || null, 
                    is_active !== undefined ? is_active : 1
                ]
            );
            return {
                id: result.insertId,
                name,
                email,
                redirect_complete: redirect_complete || null,
                redirect_quotafull: redirect_quotafull || null,
                redirect_terminate: redirect_terminate || null,
                company: company || null,
                address: address || null,
                is_active: is_active !== undefined ? is_active : 1
            };
        } catch (error) {
            console.error("Error in Vendor.create:", error.message);
            throw error;
        }
    },

    // Update an existing vendor
    update: async (id, { 
        name, 
        email, 
        redirect_complete, 
        redirect_quotafull, 
        redirect_terminate, 
        company, 
        address, 
        is_active 
    }) => {
        try {
            const query = "UPDATE vendors SET name = ?, email = ?, redirect_complete = ?, redirect_quotafull = ?, redirect_terminate = ?, company = ?, address = ?, is_active = ? WHERE id = ?";
            const params = [
                name, 
                email, 
                redirect_complete || null, 
                redirect_quotafull || null, 
                redirect_terminate || null, 
                company || null, 
                address || null, 
                is_active !== undefined ? is_active : 1,
                id
            ];

            await db.query(query, params);
            return await Vendor.findById(id);
        } catch (error) {
            console.error("Error in Vendor.update:", error.message);
            throw error;
        }
    },

    // Delete a vendor (soft delete by setting is_active to 0)
    softDelete: async (id) => {
        try {
            await db.query(
                "UPDATE vendors SET is_active = 0 WHERE id = ?",
                [id]
            );
            return await Vendor.findById(id);
        } catch (error) {
            console.error("Error in Vendor.softDelete:", error.message);
            throw error;
        }
    },

    // Hard delete a vendor
    delete: async (id) => {
        try {
            await db.query(
                "DELETE FROM vendors WHERE id = ?",
                [id]
            );
            return { success: true };
        } catch (error) {
            console.error("Error in Vendor.delete:", error.message);
            throw error;
        }
    }
};

export default Vendor;
