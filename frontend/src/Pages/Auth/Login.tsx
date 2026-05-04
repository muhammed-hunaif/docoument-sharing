import { useState } from "react";
import axios from "axios";
import { API_URL } from "../../config";
import Input from "../../Components/UI/Input";
import { Link, useNavigate, useLocation } from "react-router-dom";

export default function Login() {
    const navigate = useNavigate();
    const location = useLocation();
    const [form, setForm] = useState({
        email: "",
        password: ""
    });
    const [loading, setLoading] = useState(false);
    const [toast, setToast] = useState<{ msg: string; ok: boolean } | null>(null);
    const [errors, setErrors] = useState({ email: "", password: "" });

    const fireToast = (msg: string, ok = true) => {
        setToast({ msg, ok });
        setTimeout(() => setToast(null), 3000);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        
        const newErrors = { email: "", password: "" };
        let hasError = false;
        if (!form.email) { newErrors.email = "Please fill out this field."; hasError = true; }
        if (!form.password) { newErrors.password = "Please fill out this field."; hasError = true; }
        
        if (hasError) {
            setErrors(newErrors);
            return;
        }
        
        setErrors({ email: "", password: "" });
        setLoading(true);
        try {
            const res = await axios.post(`${API_URL}/api/auth/login`, form);
            localStorage.setItem("token", res.data.token);
            fireToast("Login successfully ! ");
            const returnTo = location.state?.returnTo || "/dashboard";
            setTimeout(() => navigate(returnTo), 1500);
        } catch (error) {
            console.error("Login error:", error);
            fireToast("Login failed. Check your credentials.", false);
        } finally {
            setLoading(false);
        }
    };

    return (
        <>
            {toast && (
                <div className="fixed top-21 right-4 w-auto z-[200] flex items-center gap-2 bg-slate-900 text-white px-3 py-2 sm:px-5 sm:py-3 rounded-xl shadow-2xl shadow-slate-900/30 font-bold text-[11px] sm:text-sm" style={{ animation: "slideDown 0.3s cubic-bezier(0.16,1,0.3,1)" }}>
                    <div className={`w-4 h-4 sm:w-5 sm:h-5 rounded-full flex items-center justify-center shrink-0 ${toast.ok ? "bg-emerald-500" : "bg-red-500"}`}>
                        <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                            {toast.ok ? <path d="M20 6L9 17l-5-5" /> : <path d="M18 6L6 18M6 6l12 12" />}
                        </svg>
                    </div>
                    {toast.msg}
                </div>
            )}
            <div className="flex w-full min-h-screen bg-slate-50 overflow-hidden pt-20 lg:pt-0 lg:p-6">
                <div className="flex w-full max-w-7xl mx-auto lg:bg-white lg:rounded-[32px] lg:overflow-hidden lg:shadow-2xl">
                    {/* Left Side: Visual/Feature */}
                    <div className="hidden lg:flex flex-col justify-between p-16 w-[45%] max-w-2xl bg-slate-900 text-white relative overflow-hidden">
                        <div className="absolute top-[-10%] left-[-10%] w-[80%] h-[80%] bg-indigo-600 rounded-full mix-blend-screen filter blur-[120px] opacity-40 animate-blob" />
                        <div className="absolute bottom-[-10%] right-[-10%] w-[60%] h-[60%] bg-blue-600 rounded-full mix-blend-screen filter blur-[100px] opacity-30 animate-blob animation-delay-2000" />

                        <div className="relative z-10 mt-12">
                            <div className="w-12 h-12 bg-white rounded-xl mb-8 flex items-center justify-center shadow-xl shadow-black/20">
                                <svg className="w-6 h-6 text-slate-900" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                                </svg>
                            </div>
                            <h2 className="text-5xl lg:text-6xl font-black tracking-tighter leading-tight mb-6">
                                Secure Docs.<br />
                                Simply Shared.
                            </h2>
                            <p className="text-slate-300 text-lg leading-relaxed max-w-md">
                                The platform built for founders and teams who care about professional file management.
                            </p>
                        </div>
                        <div className="relative z-10 text-sm text-slate-500 font-bold uppercase tracking-widest mb-4">
                            © 2026 DOCSHARE PRO
                        </div>
                    </div>

                    {/* Right Side: Form */}
                    <div className="flex flex-col justify-center items-center flex-1 p-4 sm:p-12 bg-white relative w-full rounded-t-[32px] lg:rounded-none mt-2 lg:mt-0 shadow-[0_-8px_30px_-15px_rgba(0,0,0,0.1)] lg:shadow-none">
                        {/* Mobile Header (Shows only on small screens) */}
                        <div className="lg:hidden w-full max-w-md mb-6 text-center mt-2">
                            <div className="w-10 h-10 sm:w-12 sm:h-12 bg-slate-900 rounded-xl mb-3 flex items-center justify-center mx-auto shadow-lg shadow-slate-900/20">
                                <svg className="w-5 h-5 sm:w-6 sm:h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                                </svg>
                            </div>
                            <h2 className="text-xl sm:text-3xl font-black tracking-tighter leading-tight mb-2 text-slate-900 whitespace-nowrap">
                                Secure Docs. Simply Shared.
                            </h2>
                            <p className="text-slate-500 text-xs sm:text-sm px-2">
                                The platform built for founders and teams who care about professional file management.
                            </p>
                        </div>

                        <div className="w-full max-w-md bg-white sm:bg-transparent border border-slate-100 sm:border-0 rounded-2xl sm:rounded-none p-5 sm:p-0 shadow-xl shadow-slate-200/50 sm:shadow-none">
                            <div className="mb-6 sm:mb-10 text-center sm:text-left w-full overflow-hidden">
                                <h1 className="text-2xl sm:text-4xl font-black text-slate-900 tracking-tighter mb-2 sm:mb-3">Sign in</h1>
                                <p className="text-slate-500 font-medium text-[11px] sm:text-base whitespace-nowrap tracking-tight">Welcome back! Please enter your details.</p>
                            </div>

                            <form onSubmit={handleSubmit} className="flex flex-col gap-5" noValidate>
                                <Input
                                    label="Email"
                                    placeholder="name@company.com"
                                    type="email"
                                    error={errors.email}
                                    onChange={(e) => { setForm({ ...form, email: e.target.value }); setErrors({...errors, email: ""}); }}
                                />
                                <div className="flex flex-col gap-2">
                                    <Input
                                        label="Password"
                                        type="password"
                                        placeholder="••••••••"
                                        error={errors.password}
                                        onChange={(e) => { setForm({ ...form, password: e.target.value }); setErrors({...errors, password: ""}); }}
                                    />
                                    <div className="flex justify-end">
                                        <button type="button" className="text-xs font-bold text-indigo-600 hover:text-indigo-800 transition-colors">Forgot password?</button>
                                    </div>
                                </div>

                                <button
                                    disabled={loading}
                                    type="submit"
                                    className="w-full bg-slate-900 text-white font-bold py-3 px-6 rounded-xl hover:bg-slate-800 active:scale-[0.98] transition-all duration-200 shadow-lg shadow-slate-900/20 flex items-center justify-center gap-2 mt-2"
                                >
                                    {loading ? (
                                        <div className="w-5 h-5 border-2 border-slate-500 border-t-white rounded-full animate-spin" />
                                    ) : "Continue"}
                                    {!loading && (
                                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-4 h-4">
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
                                        </svg>
                                    )}
                                </button>
                            </form>

                            <p className="text-center text-slate-500 text-sm mt-8 font-medium">
                                Don't have an account?{" "}
                                <Link to="/signup" state={{ returnTo: location.state?.returnTo }} className="text-slate-900 font-bold hover:underline">
                                    Sign up
                                </Link>
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}