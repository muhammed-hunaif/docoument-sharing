import { useState, useEffect } from "react";
import { useParams, Link, useNavigate, useLocation } from "react-router-dom";
import axios from "axios";
import { API_URL } from "../../config";

interface SharedFileItem {
  original_name: string;
  filename: string;
  size: number;
  mimetype: string;
  created_at: string;
}

const getFileEmoji = (mimetype: string) => {
  if (mimetype.startsWith("image/")) return "🖼️";
  if (mimetype === "application/pdf") return "📄";
  if (mimetype.includes("word") || mimetype.includes("document")) return "📝";
  if (mimetype.includes("sheet") || mimetype.includes("excel")) return "📊";
  if (mimetype.startsWith("video/")) return "🎬";
  if (mimetype.startsWith("audio/")) return "🎵";
  return "📎";
};

const formatSize = (bytes: number) => {
  if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + " KB";
  return (bytes / (1024 * 1024)).toFixed(2) + " MB";
};

export default function SharedFile() {
  const { code } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const [file, setFile] = useState<SharedFileItem | null>(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchFile = async () => {
      const token = localStorage.getItem("token");
      if (!token) {
        navigate("/login", { state: { returnTo: location.pathname } });
        return;
      }
      try {
        const res = await axios.get(`${API_URL}/api/files/share/${code}`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        setFile(res.data);
      } catch (err: unknown) {
        if (axios.isAxiosError(err)) {
          if (err.response?.status === 401) {
            localStorage.removeItem("token");
            navigate("/login", { state: { returnTo: location.pathname } });
            return;
          }
          setError(err.response?.data?.message || "File not found");
        } else {
          setError("An unexpected error occurred");
        }
      } finally {
        setLoading(false);
      }
    };
    fetchFile();
  }, [code, navigate, location.pathname]);

  /* ── Loading ── */
  if (loading) {
    return (
      <div className="flex w-full min-h-[60vh] items-center justify-center px-4">
        <div className="flex flex-col items-center gap-3">
          <div className="w-10 h-10 rounded-full border-4 border-slate-100 border-t-indigo-600 animate-spin" />
          <p className="text-slate-400 font-semibold text-sm">Loading document...</p>
        </div>
      </div>
    );
  }

  /* ── Error ── */
  if (error) {
    return (
      <div className="flex w-full min-h-[60vh] items-center justify-center px-4">
        <div className="bg-white border border-slate-100 rounded-2xl p-6 w-full max-w-xs text-center shadow-xl">
          <div className="w-12 h-12 bg-red-50 text-red-500 rounded-xl flex items-center justify-center mx-auto mb-4">
            <svg width="24" height="24" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </div>
          <h2 className="text-base font-black text-slate-900 mb-1">Link Invalid</h2>
          <p className="text-slate-400 text-sm font-medium mb-5">{error}</p>
          <Link
            to="/"
            className="w-full flex items-center justify-center bg-slate-900 text-white font-bold text-sm py-2.5 rounded-xl hover:bg-slate-800 transition-colors"
          >
            Go Home
          </Link>
        </div>
      </div>
    );
  }

  if (!file) return null;

  /* ── Main Card ── */
  return (
    <div className="flex w-full min-h-[60vh] items-center justify-center px-4 py-6">
      <div className="bg-white border border-slate-100 rounded-2xl w-full max-w-xs sm:max-w-md shadow-xl overflow-hidden">

        {/* Top accent bar */}
        <div className="h-1 w-full bg-gradient-to-r from-indigo-500 via-blue-500 to-purple-500" />

        <div className="p-5 sm:p-8">
          {/* File Icon */}
          <div className="w-14 h-14 sm:w-20 sm:h-20 bg-indigo-50 border border-indigo-100 rounded-2xl flex items-center justify-center mx-auto mb-4 sm:mb-6 text-3xl sm:text-5xl">
            {getFileEmoji(file.mimetype)}
          </div>

          {/* File Name */}
          <h1
            className="text-base sm:text-xl font-black text-slate-900 tracking-tight text-center truncate mb-1 px-2"
            title={file.original_name}
          >
            {file.original_name}
          </h1>

          {/* Meta */}
          <div className="flex items-center justify-center gap-2 text-xs sm:text-sm text-slate-400 font-medium mb-5 sm:mb-8">
            <span className="bg-slate-100 text-slate-600 px-2 py-0.5 rounded-md font-semibold">
              {formatSize(file.size)}
            </span>
            <span>·</span>
            <span>{new Date(file.created_at).toLocaleDateString()}</span>
          </div>

          {/* Download Button */}
          <a
            href={file.filename.startsWith("http") ? file.filename : `${API_URL}/uploads/${file.filename}`}
            target="_blank"
            rel="noopener noreferrer"
            download={file.original_name}
            className="w-full flex items-center justify-center gap-2 whitespace-nowrap bg-indigo-600 text-white font-bold text-sm py-3 sm:py-4 rounded-xl hover:bg-indigo-500 active:scale-95 transition-all duration-200 shadow-lg shadow-indigo-500/25"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="shrink-0">
              <path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4" />
              <polyline points="7 10 12 15 17 10" />
              <line x1="12" y1="15" x2="12" y2="3" />
            </svg>
            Download Document
          </a>

          {/* Footer note */}
          <p className="text-center text-[10px] sm:text-xs text-slate-300 font-medium mt-4">
            Shared via <span className="text-indigo-400 font-bold">DocShare</span>
          </p>
        </div>
      </div>
    </div>
  );
}
