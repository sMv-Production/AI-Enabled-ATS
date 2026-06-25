import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import matchRoutes from "./routes/matchRoutes.js";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());
// app.set("trust proxy", 1);

// Routes
app.use("/api", matchRoutes);

// Health Check
app.get("/", (req, res) => {
  res.json({
    status: "running",
    service: "AI ATS Backend",
  });
});

// Start Server
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});