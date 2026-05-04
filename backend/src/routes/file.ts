import express from "express";
import multer from "multer";
import path from "path";
import { authMiddleware } from "../middleware/authMiddleware";
import { uploadFile, getMyFiles, deleteFile, getSharedFile } from "../controllers/fileController";

// Multer Storage Configuration
const storage = multer.memoryStorage();

const upload = multer({
  storage,
  limits: { fileSize: 10 * 1024 * 1024 }, // 10MB max
});

const router = express.Router();

// All routes below are protected by authMiddleware
router.get("/share/:code", authMiddleware, getSharedFile);
router.post("/upload", authMiddleware, upload.single("file"), uploadFile);
router.get("/my-files", authMiddleware, getMyFiles);
router.delete("/:id", authMiddleware, deleteFile);

export default router;
