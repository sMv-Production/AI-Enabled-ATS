import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import matchRoutes from "./routes/matchRoutes.js";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Server setting
app.set('trust proxy', 1); // Use the number of proxies your server sits behind
app.get('/ping', (req, res) => {
  res.status(200).send('success');
});

// Middleware
app.use(cors( { origin: process.env.FRONTEND_URL } ) );
app.use(express.json());

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
