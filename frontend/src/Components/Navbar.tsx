import { useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";

export default function Navbar() {
  const navigate = useNavigate();
  const location = useLocation();
  const token = localStorage.getItem("token");
  const [showToast, setShowToast] = useState(false);

  const handleLogout = () => {
    localStorage.removeItem("token");
    setShowToast(true);
    setTimeout(() => {
      setShowToast(false);
      navigate("/login");
    }, 2000);
  };

  const isDashboard = location.pathname === "/dashboard";

  return (
    <>
      {/* Logout Toast */}
      {showToast && (
        <div
          className="fixed top-20 right-4 w-auto z-[200] flex items-center gap-2 bg-slate-900 text-white px-3 py-2 sm:px-5 sm:py-3 rounded-xl shadow-2xl shadow-slate-900/30 font-bold text-[11px] sm:text-sm"
          style={{ animation: "slideDown 0.3s cubic-bezier(0.16, 1, 0.3, 1)" }}
        >
          <div className="w-4 h-4 sm:w-5 sm:h-5 rounded-full bg-red-500 flex items-center justify-center shrink-0">
            <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
              <path d="M20 6L9 17l-5-5" />
            </svg>
          </div>
          Logout successfully!
        </div>
      )}

      <nav className="fixed top-0 left-0 right-0 z-[100]">
        {/* Glass background */}
        <div className="absolute inset-0 bg-white/80 backdrop-blur-xl border-b border-slate-200/60" />

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6">
          <div className="flex items-center justify-between h-14 sm:h-16">

            {/* ── Logo ── */}
            <div className="flex items-center gap-2.5 group cursor-default">
              <div className="relative w-8 h-8 sm:w-9 sm:h-9 shrink-0">
                {/* Glow ring */}
                <div className="absolute inset-0 bg-indigo-600 rounded-xl opacity-0 group-hover:opacity-20 blur-md transition-opacity duration-300" />
                <div className="relative w-full h-full bg-gradient-to-br from-slate-800 to-slate-950 rounded-xl flex items-center justify-center shadow-lg shadow-slate-900/25 group-hover:scale-105 transition-transform duration-300">
                  <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                </div>
              </div>
              <span className="font-black text-lg sm:text-xl tracking-tighter text-slate-900 select-none">
                Doc<span className="text-indigo-600">Share</span>
              </span>
            </div>

            {/* ── Right actions ── */}
            <div className="flex items-center gap-1.5 sm:gap-3">
              {token ? (
                <>
                  {/* Dashboard link */}
                  {!isDashboard && (
                    <Link
                      to="/dashboard"
                      className="flex items-center gap-1.5 text-slate-600 hover:text-slate-900 text-xs sm:text-sm font-semibold px-2 sm:px-3 py-1.5 rounded-lg border border-slate-200 sm:border-transparent hover:bg-slate-100 transition-all duration-200 active:scale-95"
                    >
                      <svg className="w-3.5 h-3.5 sm:w-4 sm:h-4 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zm10 0a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zm10 0a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
                      </svg>
                      <span className="hidden sm:inline">Dashboard</span>
                    </Link>
                  )}

                  {/* Logout — icon only on mobile, icon+text on sm+ */}
                  <button
                    onClick={handleLogout}
                    title="Logout"
                    className="flex items-center gap-1.5 text-slate-500 hover:text-red-600 text-xs sm:text-sm font-semibold px-2 sm:px-4 py-1.5 sm:py-2 rounded-lg border border-slate-200 hover:border-red-200 hover:bg-red-50 transition-all duration-200 active:scale-95"
                  >
                    <svg className="w-3.5 h-3.5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                    </svg>
                    <span className="hidden sm:inline">Logout</span>
                  </button>
                </>
              ) : (
                <>
                  <Link
                    to="/login"
                    className="text-slate-500 hover:text-slate-900 text-xs sm:text-sm font-semibold px-2 sm:px-3 py-1.5 rounded-lg hover:bg-slate-100 transition-all duration-200"
                  >
                    Log in
                  </Link>
                  <Link
                    to="/signup"
                    className="flex items-center gap-1 bg-indigo-600 text-white text-xs sm:text-sm font-bold px-3 sm:px-5 py-1.5 sm:py-2 rounded-lg hover:bg-indigo-500 active:scale-[0.97] transition-all duration-200 shadow-md shadow-indigo-600/20 whitespace-nowrap"
                  >
                    <span className="sm:hidden">Sign up</span>
                    <span className="hidden sm:inline">Get Started</span>
                    <svg className="w-3 h-3 sm:w-3.5 sm:h-3.5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
                    </svg>
                  </Link>
                </>
              )}
            </div>
          </div>
        </div>
      </nav>
    </>
  );
}
