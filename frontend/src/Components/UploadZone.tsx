import React, { useRef, useState } from "react";

interface UploadZoneProps {
  uploading: boolean;
  uploadProgress: number;
  onUpload: (file: File) => void;
}

export const UploadZone: React.FC<UploadZoneProps> = ({ uploading, uploadProgress, onUpload }) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [dragActive, setDragActive] = useState(false);

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") setDragActive(true);
    else if (e.type === "dragleave") setDragActive(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files?.[0]) onUpload(e.dataTransfer.files[0]);
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files?.[0]) onUpload(e.target.files[0]);
  };

  return (
    <div
      className={`relative border-2 border-dashed rounded-3xl p-8 sm:p-12 flex flex-col items-center justify-center cursor-pointer transition-all duration-300 backdrop-blur-sm overflow-hidden group
        ${dragActive ? "border-indigo-500 bg-indigo-50/50 scale-[1.02] shadow-2xl shadow-indigo-500/10" : "border-slate-200 hover:border-indigo-400 bg-slate-50/50 hover:bg-white hover:shadow-xl hover:shadow-slate-200/50"} 
        ${uploading ? "border-slate-300 bg-white cursor-default scale-100 shadow-none pointer-events-none" : ""}`}
      onDragEnter={handleDrag}
      onDragOver={handleDrag}
      onDragLeave={handleDrag}
      onDrop={handleDrop}
      onClick={() => !uploading && fileInputRef.current?.click()}
    >
      {/* Decorative gradient blur in background */}
      {!uploading && (
        <div className={`absolute -top-10 -right-10 w-32 h-32 bg-indigo-500 rounded-full mix-blend-multiply filter blur-3xl opacity-0 transition-opacity duration-500 ${dragActive ? 'opacity-20' : 'group-hover:opacity-10'}`} />
      )}

      <input
        ref={fileInputRef}
        type="file"
        className="hidden"
        onChange={handleFileSelect}
        style={{ display: "none" }}
      />

      {uploading ? (
        <div className="flex flex-col items-center gap-4 w-full max-w-xs z-10">
          <div className="w-14 h-14 rounded-full border-4 border-slate-100 border-t-indigo-600 animate-spin shadow-lg" />
          <p className="text-slate-900 font-black text-lg tracking-tight animate-pulse">Uploading... {uploadProgress}%</p>
          <div className="w-full h-3 bg-slate-100 rounded-full overflow-hidden shadow-inner">
            <div
              className="h-full bg-gradient-to-r from-indigo-500 to-blue-500 rounded-full transition-all duration-300 ease-out"
              style={{ width: `${uploadProgress}%` }}
            />
          </div>
        </div>
      ) : (
        <div className="flex flex-col items-center z-10 transition-transform duration-300">
          <div className={`w-16 h-16 sm:w-20 sm:h-20 rounded-2xl flex items-center justify-center mb-5 transition-all duration-300 shadow-sm
            ${dragActive ? "bg-indigo-600 text-white scale-110 shadow-indigo-500/30 shadow-xl" : "bg-white text-slate-400 group-hover:bg-slate-900 group-hover:text-white group-hover:scale-110 group-hover:shadow-xl group-hover:shadow-slate-900/20"}`}>
            <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="sm:w-10 sm:h-10">
              <path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4" />
              <polyline points="17 8 12 3 7 8" />
              <line x1="12" y1="3" x2="12" y2="15" />
            </svg>
          </div>
          <p className="text-slate-900 font-black text-xl sm:text-2xl tracking-tighter mb-2 text-center">
            {dragActive ? "Drop your file here" : "Click or drag file to upload"}
          </p>
          <p className="text-slate-500 font-medium text-xs sm:text-sm tracking-tight text-center max-w-xs">
            Securely upload your document. Maximum file size is <span className="font-bold text-slate-700">10MB</span>.
          </p>
        </div>
      )}
    </div>
  );
};
