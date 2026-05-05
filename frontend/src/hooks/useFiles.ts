import { useState, useEffect, useCallback, useMemo } from "react";
import axios from "axios";
import { API_URL } from "../config";
import { useNavigate } from "react-router-dom";
import type { FileItem } from "../types/file";

export const useFiles = () => {
  const navigate = useNavigate();
  const [files, setFiles] = useState<FileItem[]>([]);
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [successMsg, setSuccessMsg] = useState("");

  const token = localStorage.getItem("token");

  const api = useMemo(() => axios.create({
    baseURL: `${API_URL}/api`,
    headers: { Authorization: `Bearer ${token}` },
  }), [token]);

  const fetchFiles = useCallback(async () => {
    try {
      const res = await api.get("/files/my-files");
      setFiles(res.data);
    } catch (err: unknown) {
      if (axios.isAxiosError(err) && err.response?.status === 401) {
        localStorage.removeItem("token");
        navigate("/login");
      }
    }
  }, [api, navigate]);

  useEffect(() => {
    fetchFiles();
  }, [fetchFiles]);

  const handleUpload = async (file: File) => {
    setUploading(true);
    //1.set uploading to true
    //2.set progress to 0%
    setUploadProgress(0);
    const formData = new FormData();
    formData.append("file", file);

    try {
      await api.post("/files/upload", formData, {
        headers: { "Content-Type": "multipart/form-data" },
        onUploadProgress: (e) => {
          if (e.total) setUploadProgress(Math.round((e.loaded * 100) / e.total));
        },
      });
      setSuccessMsg(`"${file.name}" uploaded successfully!`);
      setTimeout(() => setSuccessMsg(""), 3000);
      fetchFiles();
    } catch (err: unknown) {
      if (axios.isAxiosError(err) && err.response?.status === 401) {
        localStorage.removeItem("token");
        navigate("/login");
      } else {
        alert("Upload failed");
      }
    } finally {
      setUploading(false);
      setUploadProgress(0);
    }
  };

  const handleDelete = async (id: number) => {
    try {
      await api.delete(`/files/${id}`);
      fetchFiles();
    } catch {
      alert("Delete failed");
    }
  };

  const handleShare = async (code?: string) => {
    if (!code) return;
    const url = `${window.location.origin}/share/${code}`;

    try {
      if (navigator.clipboard && window.isSecureContext) {
        await navigator.clipboard.writeText(url);
      } else {
        // Fallback for non-HTTPS environments (like mobile IP testing)
        const textArea = document.createElement("textarea");
        textArea.value = url;
        textArea.style.position = "absolute";
        textArea.style.left = "-999999px";
        document.body.prepend(textArea);
        textArea.select();
        try {
          document.execCommand('copy');
        } catch (error) {
          console.error("Fallback copy failed", error);
        } finally {
          textArea.remove();
        }
      }
      setSuccessMsg("Share link copied to clipboard!");
      setTimeout(() => setSuccessMsg(""), 3000);
    } catch (err) {
      console.error("Failed to copy link:", err);
      alert("Failed to copy link");
    }
  };

  return {
    files,
    uploading,
    uploadProgress,
    successMsg,
    handleUpload,
    handleDelete,
    handleShare
  };
};
