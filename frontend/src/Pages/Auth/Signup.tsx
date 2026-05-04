import { useState } from "react";
import axios from "axios";
import { API_URL } from "../../config";
import Input from "../../Components/UI/Input";
import { Link, useNavigate, useLocation } from "react-router-dom";

export default function Signup() {
    const navigate = useNavigate();
    const location = useLocation();
    const [form, setForm] = useState({
        name: "",
        email: "",
        password: ""
    });
    const [loading, setLoading] = useState(false);
    const [toast, setToast] = useState<{ msg: string; ok: boolean } | null>(null);
    const [errors, setErrors] = useState({ name: "", email: "", password: "" });

    const fireToast = (msg: string, ok = true) => {
        setToast({ msg, ok });
        setTimeout(() => setToast(null), 3000);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        
        const newErrors = { name: "", email: "", password: "" };
        let hasError = false;
        if (!form.name) { newErrors.name = "Please fill out this field."; hasError = true; }
        if (!form.email) { newErrors.email = "Please fill out this field."; hasError = true; }
        if (!form.password) { newErrors.password = "Please fill out this field."; hasError = true; }
        
        if (hasError) {
            setErrors(newErrors);
            return;
        }
        
        setErrors({ name: "", email: "", password: "" });
        setLoading(true);
        try {
            await axios.post(`${API_URL}/api/auth/signup`, form);
            fireToast("Account created! Please log in");
            setTimeout(() => navigate("/login", { state: { returnTo: location.state?.returnTo } }), 1500);
        } catch (error) {
            const message = axios.isAxiosError(error)
                ? (error.response?.data?.message || "Check your details")
                : "An unexpected error occurred";
            fireToast("Signup failed: " + message, false);
        } finally {
            setLoading(false);
        }
    };

    return (
        <>
            {toast && (
                <div className="fixed top-12 right-5 w-auto z-[200] flex items-center gap-2 bg-slate-900 text-white px-3 py-2 sm:px-5 sm:py-3 rounded-xl shadow-2xl shadow-slate-900/30 font-bold text-[11px] sm:text-sm" style={{ animation: "slideDown 0.3s cubic-bezier(0.16,1,0.3,1)" }}>
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
                        <div className="absolute top-[-10%] right-[-10%] w-[80%] h-[80%] bg-indigo-600 rounded-full mix-blend-screen filter blur-[120px] opacity-40 animate-blob" />
                        <div className="absolute bottom-[-10%] left-[-10%] w-[60%] h-[60%] bg-blue-600 rounded-full mix-blend-screen filter blur-[100px] opacity-30 animate-blob animation-delay-2000" />

                        <div className="relative z-10 mt-12">
                            <div className="w-12 h-12 bg-white rounded-xl mb-8 flex items-center justify-center shadow-xl shadow-black/20">
                                <svg className="w-6 h-6 text-slate-900" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
                                </svg>
                            </div>
                            <h2 className="text-5xl lg:text-6xl font-black tracking-tighter leading-tight mb-6">
                                Join the Pro<br />
                                Network.
                            </h2>
                            <p className="text-slate-300 text-lg leading-relaxed max-w-md">
                                Create an account in seconds and experience the future of secure document collaboration.
                            </p>
                        </div>
                        <div className="relative z-10 text-sm text-slate-500 font-bold uppercase tracking-widest mb-4">
                            EST. 2026 • DOCSHARE PRO
                        </div>
                    </div>

                    {/* Right Side: Form */}
                    <div className="flex flex-col justify-center items-center flex-1 p-4 sm:p-12 bg-white relative w-full rounded-t-[32px] lg:rounded-none mt-2 lg:mt-0 shadow-[0_-8px_30px_-15px_rgba(0,0,0,0.1)] lg:shadow-none">
                        {/* Mobile Header (Shows only on small screens) */}
                        <div className="lg:hidden w-full max-w-md mb-6 text-center mt-2">
                            <div className="w-10 h-10 sm:w-12 sm:h-12 bg-slate-900 rounded-xl mb-3 flex items-center justify-center mx-auto shadow-lg shadow-slate-900/20">
                                <svg className="w-5 h-5 sm:w-6 sm:h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
                                </svg>
                            </div>
                            <h2 className="text-xl sm:text-3xl font-black tracking-tighter leading-tight mb-2 text-slate-900 whitespace-nowrap">
                                Join the Pro Network.
                            </h2>
                            <p className="text-slate-500 text-xs sm:text-sm px-2">
                                Create an account in seconds and experience the future of secure document collaboration.
                            </p>
                        </div>

                        <div className="w-full max-w-md bg-white sm:bg-transparent border border-slate-100 sm:border-0 rounded-2xl sm:rounded-none p-5 sm:p-0 shadow-xl shadow-slate-200/50 sm:shadow-none">
                            <div className="mb-6 sm:mb-10 text-center sm:text-left w-full overflow-hidden">
                                <h1 className="text-2xl sm:text-4xl font-black text-slate-900 tracking-tighter mb-2 sm:mb-3">Create account</h1>
                                <p className="text-slate-500 font-medium text-[11px] sm:text-base whitespace-nowrap tracking-tight">Be part of the specialized doc sharing vault.</p>
                            </div>

                            <form onSubmit={handleSubmit} className="flex flex-col gap-5" noValidate>
                                <Input
                                    label="Full Name"
                                    placeholder="Muhammed"
                                    error={errors.name}
                                    onChange={(e) => { setForm({ ...form, name: e.target.value }); setErrors({...errors, name: ""}); }}
                                />
                                <Input
                                    label="Email"
                                    placeholder="name@company.com"
                                    type="email"
                                    error={errors.email}
                                    onChange={(e) => { setForm({ ...form, email: e.target.value }); setErrors({...errors, email: ""}); }}
                                />
                                <Input
                                    label="Password"
                                    type="password"
                                    placeholder="Minimum 6 characters"
                                    error={errors.password}
                                    min={6}
                                    onChange={(e) => { setForm({ ...form, password: e.target.value }); setErrors({...errors, password: ""}); }}
                                />

                                <button
                                    disabled={loading}
                                    type="submit"
                                    className="w-full bg-slate-900 text-white font-bold py-3 px-6 rounded-xl hover:bg-slate-800 active:scale-[0.98] transition-all duration-200 shadow-lg shadow-slate-900/20 flex items-center justify-center gap-2 mt-2"
                                >
                                    {loading ? (
                                        <div className="w-5 h-5 border-2 border-slate-500 border-t-white rounded-full animate-spin" />
                                    ) : "Create Account"}
                                    {!loading && (
                                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-4 h-4">
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
                                        </svg>
                                    )}
                                </button>
                            </form>

                            <p className="text-center text-slate-500 text-sm mt-8 font-medium">
                                Already have an account?{" "}
                                <Link to="/login" state={{ returnTo: location.state?.returnTo }} className="text-slate-900 font-bold hover:underline">
                                    Sign in
                                </Link>
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}