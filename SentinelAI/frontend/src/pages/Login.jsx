import React, { useState } from "react";
import { Link, Navigate, useLocation, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { HiLockClosed, HiMail } from "react-icons/hi";
import { useAuth } from "../context/AuthContext";

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
    <section className="relative py-16 sm:py-24 px-4 sm:px-6 lg:px-8">
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-16 left-1/2 -translate-x-1/2 w-[520px] h-[520px] bg-primary-600/15 rounded-full blur-3xl" />
      </div>

      <div className="relative max-w-md mx-auto glass-card p-8 sm:p-10">
        <h1 className="text-3xl font-black text-white">Login</h1>
        <p className="text-dark-50 mt-2">Access your SentinelAI dashboard securely.</p>

        <form onSubmit={onSubmit} className="mt-8 space-y-5">
          <div>
            <label className="block text-sm font-semibold text-dark-50 mb-2">Email</label>
            <div className="relative">
              <HiMail className="w-5 h-5 text-dark-200 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="email"
                name="email"
                value={form.email}
                onChange={onChange}
                required
                className="input-field pl-10 text-dark-50"
                placeholder="you@example.com"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-semibold text-dark-50 mb-2">Password</label>
            <div className="relative">
              <HiLockClosed className="w-5 h-5 text-dark-200 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="password"
                name="password"
                value={form.password}
                onChange={onChange}
                required
                className="input-field pl-10 text-dark-50"
                placeholder="Enter password"
              />
            </div>
          </div>

          <button type="submit" className="btn-primary w-full" disabled={submitting}>
            {submitting ? "Signing in..." : "Login"}
          </button>
        </form>

        <p className="mt-6 text-sm text-dark-100">
          New user?{" "}
          <Link to="/register" className="text-primary-300 hover:text-primary-200 font-semibold">
            Create account
          </Link>
        </p>
      </div>
    </section>
  );
};

export default Login;
