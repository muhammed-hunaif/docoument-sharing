import { Response } from "express";
import { AuthRequest } from "../middleware/authMiddleware";
import { db } from "../db";
import crypto from "crypto";
import imagekit, { isImageKitConfigured } from "../config/imagekit";

//PUT: /api/files/upload
export const uploadFile = (req: AuthRequest, res: Response): void => {
  if (!req.file) {
    res.status(400).json({ message: "No file uploaded" });
    return;
  }

  if (!isImageKitConfigured() || !imagekit) {
    res.status(503).json({
      message: "ImageKit is not configured. Add IMAGEKIT_PUBLIC_KEY, IMAGEKIT_PRIVATE_KEY, and IMAGEKIT_URL_ENDPOINT to your backend .env file.",
    });
    return;
  }

  const { originalname, size, mimetype } = req.file;
  const userId = req.userId;

  imagekit.upload({
    file: req.file.buffer, // buffer from memoryStorage
    fileName: originalname,
    folder: "/doc-sharing-platform",
  }, (error, result) => {
    if (error) {
      console.error(error);
      res.status(500).json({ message: "ImageKit upload failed", error });
      return;
    }

    const fileUrl = result?.url; // The imagekit url
    const fileId = result?.fileId; //internal system ID
    const fileCode = crypto.randomUUID().substring(0, 8);

    const sql =
      "INSERT INTO files (user_id, original_name, filename, size, mimetype, file_code, expires_at, imagekit_id) VALUES (?, ?, ?, ?, ?, ?, DATE_ADD(NOW(), INTERVAL 24 HOUR), ?)";

    db.query(sql, [userId, originalname, fileUrl, size, mimetype, fileCode, result?.fileId], (dbErr) => {
      if (dbErr) {
        res.status(500).json({ message: "Database error", error: dbErr });
        return;
      }
      res.json({
        message: "File uploaded successfully",
        file: {
          originalName: originalname,
          filename: fileUrl,
          size,
          mimetype,
          file_code: fileCode,
        },
      });
    });
  });
};

//GET: /api/files/share/:code
export const getSharedFile = (req: AuthRequest, res: Response): void => {
  const code = req.params.code;

  const sql = "SELECT original_name, filename, size, mimetype, created_at FROM files WHERE file_code = ? AND (expires_at IS NULL OR expires_at > NOW())";

  db.query(sql, [code], (err, results: any[]) => {
    if (err) {
      res.status(500).json({ message: "Database error", error: err });
      return;
    }
    if (results.length === 0) {
      res.status(404).json({ message: "File not found or link expired" });
      return;
    }
    res.json(results[0]);
  });
};


//GET: /api/files/my-files
export const getMyFiles = (req: AuthRequest, res: Response): void => {
  const userId = req.userId;

  const sql =
    "SELECT * FROM files WHERE user_id = ? ORDER BY created_at DESC";

  db.query(sql, [userId], (err, results) => {
    if (err) {
      res.status(500).json({ message: "Database error", error: err });
      return;
    }
    res.json(results);
  });
};

// DELETE: /api/files/:id
export const deleteFile = (req: AuthRequest, res: Response): void => {
  const fileId = req.params.id;
  //DELETE /files/10...which file ?
  const userId = req.userId;
  //Which user?


  const sql = "DELETE FROM files WHERE id = ? AND user_id = ?";

  db.query(sql, [fileId, userId], (err, result: any) => {
    if (err) {
      res.status(500).json({ message: "Database error", error: err });
      return;
    }
    if (result.affectedRows === 0) {
      res.status(404).json({ message: "File not found or unauthorized" });
      return;
    }
    res.json({ message: "File deleted successfully" });
  });
};
