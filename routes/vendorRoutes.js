import express from "express";
const router = express.Router();
import {
    getAllVendors,
    getVendorById,
    getVendorByEmail,
    getActiveVendors,
    createVendor,
    updateVendor,
    deactivateVendor,
    deleteVendor
} from "../controllers/vendorController.js";
import { adminOnly, protect } from "../middleware/authMiddleware.js";

// Route: Get all vendors
// GET /api/vendors
router.get("/", protect,adminOnly(), getAllVendors);

// Route: Get active vendors
// GET /api/vendors/active
router.get("/active", protect,adminOnly(), getActiveVendors);

// Route: Get vendor by email
// GET /api/vendors/email/:email
router.get("/email/:email", protect,adminOnly(), getVendorByEmail);

// Route: Get vendor by ID
// GET /api/vendors/:id
router.get("/:id", protect,adminOnly(), getVendorById);

// Route: Create a new vendor
// POST /api/vendors
router.post("/", protect,adminOnly(), createVendor);

// Route: Update a vendor
// PUT /api/vendors/:id
router.put("/:id", protect, adminOnly(),updateVendor);

// Route: Deactivate a vendor (soft delete)
// PATCH /api/vendors/:id/deactivate
router.patch("/:id/deactivate", protect,adminOnly(), deactivateVendor);

// Route: Delete a vendor
// DELETE /api/vendors/:id
router.delete("/:id", protect,adminOnly(), deleteVendor);

export default router;
