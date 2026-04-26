import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";
import logger from "./config/logger.js";
import connectDB from "./config/db.js";
import loggerMiddleware from "./middleware/logger.middleware.js";
import errorMiddleware from "./middleware/error.middleware.js";
import authRoutes from "./routes/auth.routes.js";

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(loggerMiddleware);

// Routes
app.get("/", (req, res) => {
  res.json({ message: "Server is running successfully with Winston logging!" });
});

app.use("/api/auth", authRoutes);

// Error handling middleware (must be last)
app.use((err, req, res, next) => {
  errorMiddleware(err, req, res, next);
});

// Export for serverless (Vercel, AWS Lambda, etc.)
export default app;

// Start Server locally (development & traditional hosting)
const startServer = async () => {
  try {
    await connectDB();
    app.listen(PORT, () => {
      logger.info(`✅ Server running on http://localhost:${PORT}`);
    });
  } catch (error) {
    logger.error(`Failed to start server: ${error.message}`);
    process.exit(1);
  }
};

// Only start server if running locally (not imported as module)
if (process.env.NODE_ENV !== "production" && import.meta.url.endsWith("index.js")) {
  startServer();
}
