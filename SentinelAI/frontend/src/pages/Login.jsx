import React, { useState } from "react";
import { Link, Navigate, useLocation, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { motion } from "framer-motion";
import { HiLockClosed, HiMail, HiShieldCheck, HiSparkles } from "react-icons/hi";
import { useAuth } from "../context/AuthContext";
import PretextHeadline from "../components/PretextHeadline";

const Login = () => {
  const { login, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [form, setForm] = useState({ email: "", password: "" });
  const [submitting, setSubmitting] = useState(false);

  const fromPath = location.state?.from || "/image";

  if (isAuthenticated) {
    return <Navigate to={fromPath} replace />;
  }

  const onChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const onSubmit = (e) => {
    e.preventDefault();
    setSubmitting(true);

    const result = login({ email: form.email, password: form.password });

    if (!result.ok) {
      toast.error(result.message);
      setSubmitting(false);
      return;
    }

    toast.success("Login successful.");
    navigate(fromPath, { replace: true });
  };

  return (
    <section className="relative overflow-hidden px-4 py-10 sm:py-16 lg:px-8">
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute -top-20 left-1/2 h-[28rem] w-[28rem] -translate-x-1/2 rounded-full bg-cyan-500/12 blur-3xl" />
        <div className="absolute bottom-0 right-0 h-[22rem] w-[22rem] rounded-full bg-amber-500/10 blur-3xl" />
      </div>

      <div className="relative mx-auto grid max-w-6xl gap-8 lg:grid-cols-[1.1fr_0.9fr] lg:items-center">
        <motion.div
          initial={{ opacity: 0, x: -24 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.7 }}
          className="hidden lg:block"
        >
          <div className="glass-card shadow-soft-panel p-10 xl:p-12 border-cyan-400/20">
            <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-cyan-400/25 bg-cyan-500/10 px-4 py-2 text-sm text-cyan-200">
              <HiShieldCheck className="h-4 w-4" />
              Secure access portal
            </div>
            <PretextHeadline text="Welcome Back" className="max-w-xl text-white" />
            <p className="mt-5 max-w-lg text-base leading-7 text-dark-200">
              Sign in to review image, text, audio, and video analysis with the same forensic-grade dashboard.
            </p>

            <div className="mt-8 grid gap-4 sm:grid-cols-2">
              {[
                "Fast multi-modal scans",
                "Saved reports and audits",
                "Strict confidence policy",
                "Clean investigator workflow",
              ].map((item) => (
                <div key={item} className="rounded-2xl border border-dark-700/60 bg-dark-900/60 px-4 py-4 text-sm text-dark-100">
                  <div className="mb-2 inline-flex h-9 w-9 items-center justify-center rounded-xl bg-cyan-500/15 text-cyan-300">
                    <HiSparkles className="h-4 w-4" />
                  </div>
                  {item}
                </div>
              ))}
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
          className="mx-auto w-full max-w-xl"
        >
          <div className="glass-card shadow-soft-panel border-cyan-400/20 p-6 sm:p-8 lg:p-10">
            <div className="mb-6 lg:hidden">
              <div className="inline-flex items-center gap-2 rounded-full border border-cyan-400/25 bg-cyan-500/10 px-4 py-2 text-xs font-semibold uppercase tracking-[0.24em] text-cyan-200">
                Secure access portal
              </div>
              <PretextHeadline text="Welcome Back" className="mt-4 max-w-md text-white" />
              <p className="mt-3 text-sm sm:text-base text-dark-200">
                Sign in to continue your deepfake and AI-fraud investigations.
              </p>
            </div>

            <h2 className="text-xl font-semibold text-cyan-200">Login</h2>
            <p className="mt-1 text-sm text-dark-200">Access your SentinelAI dashboard securely.</p>

            <form onSubmit={onSubmit} className="mt-8 space-y-5">
              <div>
                <label className="mb-2 block text-sm font-semibold text-dark-100">Email</label>
                <div className="relative">
                  <HiMail className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-cyan-300/90" />
                  <input
                    type="email"
                    name="email"
                    value={form.email}
                    onChange={onChange}
                    required
                    className="input-field border-dark-600/80 bg-dark-900/70 pl-11 text-dark-50 placeholder-dark-400"
                    placeholder="you@example.com"
                  />
                </div>
              </div>

              <div>
                <label className="mb-2 block text-sm font-semibold text-dark-100">Password</label>
                <div className="relative">
                  <HiLockClosed className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-cyan-300/90" />
                  <input
                    type="password"
                    name="password"
                    value={form.password}
                    onChange={onChange}
                    required
                    className="input-field border-dark-600/80 bg-dark-900/70 pl-11 text-dark-50 placeholder-dark-400"
                    placeholder="Enter password"
                  />
                </div>
              </div>

              <button type="submit" className="btn-primary w-full justify-center" disabled={submitting}>
                {submitting ? "Signing in..." : "Login"}
              </button>
            </form>

            <p className="mt-6 text-sm text-dark-200">
              New user?{" "}
              <Link to="/register" className="font-semibold text-cyan-300 hover:text-cyan-200">
                Create account
              </Link>
            </p>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default Login;
