import React from "react";
import type { FileItem } from "../../../../src/types/file";
import { getFileIcon, formatSize, getRemainingTime } from "../../../utils/fileUtils";
import { formatDate } from "../../../utils/helpers";

interface FileCardProps {
  file: FileItem;
  onDelete: (id: number) => void;
  onShare: (code?: string) => void;
}

const getIconStyle = (mimetype: string) => {
  if (mimetype.startsWith("image/")) return { bg: "bg-violet-100", text: "text-violet-600", border: "border-violet-200" };
  if (mimetype === "application/pdf") return { bg: "bg-rose-100", text: "text-rose-600", border: "border-rose-200" };
  if (mimetype.includes("word") || mimetype.includes("document")) return { bg: "bg-blue-100", text: "text-blue-600", border: "border-blue-200" };
  if (mimetype.includes("sheet") || mimetype.includes("excel")) return { bg: "bg-emerald-100", text: "text-emerald-600", border: "border-emerald-200" };
  if (mimetype.includes("presentation") || mimetype.includes("powerpoint")) return { bg: "bg-orange-100", text: "text-orange-600", border: "border-orange-200" };
  return { bg: "bg-slate-100", text: "text-slate-600", border: "border-slate-200" };
};

export const FileCard: React.FC<FileCardProps> = ({ file, onDelete, onShare}) => {
  const isExpired = file.expires_at && new Date(file.expires_at) < new Date();
  const expiryText = file.expires_at ? getRemainingTime(file.expires_at) : null;
  const iconStyle = getIconStyle(file.mimetype);

  return (
    <div
      className="group relative bg-white border border-slate-100 rounded-2xl px-3 sm:px-5 py-3 sm:py-4 transition-all duration-300 hover:shadow-xl hover:shadow-slate-200/60 hover:border-slate-200 hover:-translate-y-0.5 overflow-hidden cursor-pointer"
      onClick={() => {
        if (file.file_code) window.open(`/share/${file.file_code}`,"_self");
      }}
      style={{ cursor: file.file_code ? "pointer" : "default" }}
    >


      {/* Subtle top accent line */}
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-slate-200 to-transparent group-hover:via-indigo-300 transition-colors duration-300" />

      {/* ── Row 1: Icon · Name · Buttons ── */}
      <div className="flex items-center gap-2.5 sm:gap-3">

        {/* File Icon */}
        <div className={`w-9 h-9 sm:w-11 sm:h-11 shrink-0 rounded-xl border ${iconStyle.bg} ${iconStyle.text} ${iconStyle.border} flex items-center justify-center text-base sm:text-xl font-medium shadow-sm`}>
          {getFileIcon(file.mimetype)}
        </div>

        {/* File Name */}
        <p
          className="min-w-0 flex-1 text-slate-800 font-semibold text-xs sm:text-sm truncate tracking-tight group-hover:text-indigo-700 transition-colors duration-200"
          title={file.original_name}
        >
          {file.original_name}
        </p>

        {/* Action Buttons */}
        <div className="flex items-center gap-1 sm:gap-1.5 shrink-0" onClick={(e) => e.stopPropagation()}>
          <a
            href={
              file.filename.startsWith("http")
                ? file.filename
                : `http://${window.location.hostname}:5000/uploads/${file.filename}`
            }
            download={file.original_name}
            target="_blank"
            rel="noopener noreferrer"
            title="Download"
            className="w-7 h-7 sm:w-8 sm:h-8 flex items-center justify-center rounded-lg bg-slate-50 border border-slate-200 text-slate-500 hover:bg-slate-900 hover:text-white hover:border-slate-900 hover:shadow-md transition-all duration-200 active:scale-95 shrink-0"
          >
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-3.5 h-3.5">
              <path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4" />
              <polyline points="7 10 12 15 17 10" />
              <line x1="12" y1="15" x2="12" y2="3" />
            </svg>
          </a>

          {file.file_code && (
            <button
              onClick={() => onShare(file.file_code)}
              title="Share"
              className="w-7 h-7 sm:w-8 sm:h-8 flex items-center justify-center rounded-lg bg-slate-50 border border-slate-200 text-slate-500 hover:bg-indigo-600 hover:text-white hover:border-indigo-600 hover:shadow-md transition-all duration-200 active:scale-95 shrink-0"
            >
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-3.5 h-3.5">
                <circle cx="18" cy="5" r="3" /><circle cx="6" cy="12" r="3" /><circle cx="18" cy="19" r="3" />
                <line x1="8.59" y1="13.51" x2="15.42" y2="17.49" />
                <line x1="15.41" y1="6.51" x2="8.59" y2="10.49" />
              </svg>
            </button>
          )}

          <button
            onClick={() => onDelete(file.id)}
            title="Delete"
            className="w-7 h-7 sm:w-8 sm:h-8 flex items-center justify-center rounded-lg bg-slate-50 border border-slate-200 text-slate-500 hover:bg-red-500 hover:text-white hover:border-red-500 hover:shadow-md transition-all duration-200 active:scale-95 shrink-0"
          >
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-3.5 h-3.5">
              <polyline points="3 6 5 6 21 6" />
              <path d="M19 6v14a2 2 0 01-2 2H7a2 2 0 01-2-2V6m3 0V4a2 2 0 012-2h4a2 2 0 012 2v2" />
            </svg>
          </button>
        </div>
      </div>

      {/* ── Row 2: Meta info ── */}
      <div className="flex items-center gap-1.5 mt-1.5 pl-[46px] sm:pl-[56px]">
        <span className="text-[10px] sm:text-xs text-slate-400 font-medium">
          {formatSize(file.size)}
        </span>

        <span className="text-slate-200 text-xs">·</span>

        <span className="text-[10px] sm:text-xs text-slate-400 font-medium hidden sm:inline">
          {formatDate(file.created_at)}
        </span>

        {expiryText && (
          <>
            <span className="text-slate-200 text-xs hidden sm:inline">·</span>
            <span className={`inline-flex items-center gap-1 text-[10px] sm:text-xs font-semibold px-1.5 py-0.5 rounded-md ${isExpired ? "bg-red-50 text-red-500" : "bg-amber-50 text-amber-600"}`}>
              <svg className="w-2.5 h-2.5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              {expiryText}
            </span>
          </>
        )}
      </div>
    </div>
  );
};
