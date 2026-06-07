import express from "express";
import cors from "cors";
import { uploadDir } from "./constants.js";
import dotenv from "dotenv";
dotenv.config();

const app = express();

// Initialize Database connection & auto-table/seeding setup
import "./config/db.js";

const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors({
    origin: "*",
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use("/uploads", express.static(uploadDir));

// Import & Use Routes
import userRoutes from "./routes/userRoutes.js";
import dashboardRoutes from "./routes/dashboardRoutes.js";
import surveyRoutes from "./routes/surveyRoutes.js";
import projectRoutes from "./routes/projectRoutes.js";
import vendorRoutes from "./routes/vendorRoutes.js";
import vendorSurveyRoutes from "./routes/vendorSurveyRoutes.js";
import redirectSurveyRoutes from "./routes/redirectSurveyRoutes.js";
app.use("/api/users", userRoutes);
app.use("/api/dashboard", dashboardRoutes);
app.use("/api/surveys", surveyRoutes);
app.use("/api/projects", projectRoutes);
app.use("/api/vendors", vendorRoutes);
app.use("/api/vendor-surveys", vendorSurveyRoutes);
app.use("/api/redirect", redirectSurveyRoutes);

// Home Route
app.get("/", (req, res) => {
    res.send("Node.js Express App Running Successfully checking port");
});

// API Route
app.get("/api/test", (req, res) => {
    res.json({
        success: true,
        message: "API Working"
    });
});

// Start Server
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});