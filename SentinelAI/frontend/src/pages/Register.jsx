import React, { useState } from "react";
import { Link, Navigate, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { motion } from "framer-motion";
import { HiLockClosed, HiMail, HiShieldCheck, HiUser, HiSparkles } from "react-icons/hi";
import { useAuth } from "../context/AuthContext";
import PretextHeadline from "../components/PretextHeadline";

const Register = () => {
  const { register, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [submitting, setSubmitting] = useState(false);

  if (isAuthenticated) {
    return <Navigate to="/image" replace />;
  }

  const onChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const onSubmit = (e) => {
    e.preventDefault();

    if (form.password !== form.confirmPassword) {
      toast.error("Passwords do not match.");
      return;
    }

    if (form.password.length < 6) {
      toast.error("Password must be at least 6 characters.");
      return;
    }

    setSubmitting(true);

    const result = register({
      name: form.name,
      email: form.email,
      password: form.password,
    });

    if (!result.ok) {
      toast.error(result.message);
      setSubmitting(false);
      return;
    }

    toast.success("Account created successfully.");
    navigate("/image", { replace: true });
  };

  return (
    <section className="relative overflow-hidden px-4 py-10 sm:py-16 lg:px-8">
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute -top-20 right-1/2 h-[28rem] w-[28rem] translate-x-1/2 rounded-full bg-fuchsia-500/12 blur-3xl" />
        <div className="absolute bottom-0 left-0 h-[22rem] w-[22rem] rounded-full bg-cyan-500/10 blur-3xl" />
      </div>

      <div className="relative mx-auto grid max-w-6xl gap-8 lg:grid-cols-[0.9fr_1.1fr] lg:items-center">
        <motion.div
          initial={{ opacity: 0, x: 24 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.7 }}
          className="order-2 lg:order-1 mx-auto w-full max-w-xl"
        >
          <div className="glass-card shadow-soft-panel border-fuchsia-400/20 p-6 sm:p-8 lg:p-10">
            <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-fuchsia-400/25 bg-fuchsia-500/10 px-4 py-2 text-xs font-semibold uppercase tracking-[0.24em] text-fuchsia-200">
              Join SentinelAI
            </div>

            <div className="lg:hidden">
              <PretextHeadline text="Create Account" className="max-w-md text-white" />
              <p className="mt-3 text-sm sm:text-base text-dark-200">
                Start your own fraud-detection workspace with multi-modal analysis and clean reports.
              </p>
            </div>

            <h2 className="mt-6 lg:mt-0 text-xl font-semibold text-fuchsia-200">Register</h2>
            <p className="mt-1 text-sm text-dark-200">Create your account and start secure deepfake analysis.</p>

            <form onSubmit={onSubmit} className="mt-8 space-y-5">
              <div>
                <label className="mb-2 block text-sm font-semibold text-dark-100">Full Name</label>
                <div className="relative">
                  <HiUser className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-fuchsia-300/90" />
                  <input
                    type="text"
                    name="name"
                    value={form.name}
                    onChange={onChange}
                    required
                    className="input-field border-dark-600/80 bg-dark-900/70 pl-11 text-dark-50 placeholder-dark-400"
                    placeholder="Your name"
                  />
                </div>
              </div>

              <div>
                <label className="mb-2 block text-sm font-semibold text-dark-100">Email</label>
                <div className="relative">
                  <HiMail className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-fuchsia-300/90" />
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
                  <HiLockClosed className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-fuchsia-300/90" />
                  <input
                    type="password"
                    name="password"
                    value={form.password}
                    onChange={onChange}
                    required
                    className="input-field border-dark-600/80 bg-dark-900/70 pl-11 text-dark-50 placeholder-dark-400"
                    placeholder="At least 6 characters"
                  />
                </div>
              </div>

              <div>
                <label className="mb-2 block text-sm font-semibold text-dark-100">Confirm Password</label>
                <div className="relative">
                  <HiLockClosed className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-fuchsia-300/90" />
                  <input
                    type="password"
                    name="confirmPassword"
                    value={form.confirmPassword}
                    onChange={onChange}
                    required
                    className="input-field border-dark-600/80 bg-dark-900/70 pl-11 text-dark-50 placeholder-dark-400"
                    placeholder="Repeat password"
                  />
                </div>
              </div>

              <button type="submit" className="btn-primary w-full justify-center" disabled={submitting}>
                {submitting ? "Creating account..." : "Register"}
              </button>
            </form>

            <p className="mt-6 text-sm text-dark-200">
              Already have an account?{" "}
              <Link to="/login" className="font-semibold text-cyan-300 hover:text-cyan-200">
                Sign in
              </Link>
            </p>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: -24 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.7 }}
          className="order-1 lg:order-2 hidden lg:block"
        >
          <div className="glass-card shadow-soft-panel p-10 xl:p-12 border-fuchsia-400/20">
            <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-fuchsia-400/25 bg-fuchsia-500/10 px-4 py-2 text-sm text-fuchsia-200">
              <HiShieldCheck className="h-4 w-4" />
              Analysis workspace
            </div>
            <PretextHeadline text="Create Account" className="max-w-xl text-white" />
            <p className="mt-5 max-w-lg text-base leading-7 text-dark-200">
              Register once and manage every detection flow from a single polished dashboard.
            </p>

            <div className="mt-8 grid gap-4 sm:grid-cols-2">
              {[
                "One dashboard for all scan types",
                "Saved scans and PDF reporting",
                "Strict verdict thresholds",
                "Modern investigator interface",
              ].map((item) => (
                <div key={item} className="rounded-2xl border border-dark-700/60 bg-dark-900/60 px-4 py-4 text-sm text-dark-100">
                  <div className="mb-2 inline-flex h-9 w-9 items-center justify-center rounded-xl bg-fuchsia-500/15 text-fuchsia-300">
                    <HiSparkles className="h-4 w-4" />
                  </div>
                  {item}
                </div>
              ))}
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default Register;
