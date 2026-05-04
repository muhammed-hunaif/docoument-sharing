import { useFiles } from "../../hooks/useFiles";
import { UploadZone } from "../../Components/UploadZone";
import { FileCard } from "./Components/FileCard";

export default function Dashboard() {
  const {
    files,
    uploading,
    uploadProgress,
    successMsg,
    handleUpload,
    handleDelete,
    handleShare
  } = useFiles();

  return (
    <div className="dashboard-page">
      {/* Header */}
      <div className="dashboard-header">
        <div>
          <h1 className="dashboard-title">My Documents</h1>
          <p className="dashboard-subtitle">
            {files.length} file{files.length !== 1 ? "s" : ""} uploaded
          </p>
        </div>
      </div>

      {/* Success Toast */}
      {successMsg && (
        <div
          className="fixed top-20 right-4 w-auto z-50 flex items-center gap-2 bg-slate-900 text-white px-3 py-2 sm:px-6 sm:py-4 rounded-xl sm:rounded-2xl shadow-2xl shadow-slate-900/30 font-bold text-[11px] sm:text-sm sm:top-24 sm:right-6"
          style={{ animation: "slideDown 0.4s cubic-bezier(0.16, 1, 0.3, 1)", maxWidth: "calc(100vw - 32px)" }}
        >
          <div className="w-5 h-5 rounded-full bg-emerald-500 flex items-center justify-center shrink-0">
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
              <path d="M20 6L9 17l-5-5" />
            </svg>
          </div>
          {successMsg}
        </div>
      )}

      {/* Upload Zone */}
      <UploadZone
        uploading={uploading}
        uploadProgress={uploadProgress}
        onUpload={handleUpload}
      />

      {/* Files List */}
      {files.length > 0 && (
        <div className="files-section">
          <h2 className="files-section-title">Recent Uploads</h2>
          <div className="files-grid">
            {files.map((file) => (
              <FileCard
                key={file.id}
                file={file}
                onDelete={handleDelete}
                onShare={handleShare}
              />
            ))}
          </div>
        </div>
      )}

      {/* Empty State */}
      {files.length === 0 && !uploading && (
        <div className="empty-state">
          <div className="empty-state-icon">📂</div>
          <h3 className="empty-state-title">No documents yet</h3>
          <p className="empty-state-text">Upload your first file to get started</p>
        </div>
      )}
    </div>
  );
}
