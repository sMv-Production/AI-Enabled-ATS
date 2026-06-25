import { Router } from "express";
import { rateLimit } from "express-rate-limit";
import { handleMatch } from "../controllers/matchController.js";

const router = Router();

const matchLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, 
  max: 10, 
  message: { error: "Too many resume analysis requests. Please try again in 15 minutes." },
  standardHeaders: true, 
  legacyHeaders: false, 
});

router.post("/match", matchLimiter, handleMatch);

export default router;