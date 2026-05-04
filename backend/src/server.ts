import "dotenv/config";
import express from "express";
import cors from "cors";
import path from "path";
import authRoutes from "./routes/auth";
import fileRoutes from "./routes/file";
import { initCronJob } from "./utils/cron";

const app = express();

app.use(cors());
app.use(express.json());


// Routes
app.use("/api/auth", authRoutes);
app.use("/api/files", fileRoutes);

// Initialize Cron Job
initCronJob();

app.listen(5000, () => {
  console.log("Server running on port 5000");
});