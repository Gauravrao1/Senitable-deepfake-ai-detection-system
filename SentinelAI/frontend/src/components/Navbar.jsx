import React, { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { HiShieldCheck, HiMenu, HiX } from "react-icons/hi";
import { useAuth } from "../context/AuthContext";

const navLinks = [
  { path: "/", label: "Home" },
  { path: "/image", label: "Image Scan" },
  { path: "/text", label: "Text Scan" },
  { path: "/audio", label: "Audio Scan" },
  { path: "/video", label: "Video Scan" },
  { path: "/reports", label: "Reports" },
];

const Navbar = () => {
  const location = useLocation();
  const [mobileOpen, setMobileOpen] = useState(false);
  const { user, logout } = useAuth();

  const handleLogout = () => {
    logout();
    setMobileOpen(false);
  };

  return (
    <nav className="sticky top-0 z-50 glass-card border-b border-dark-700/50 backdrop-blur-2xl">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2 group">
            <div className="relative">
              <HiShieldCheck className="w-8 h-8 text-primary-500 group-hover:text-primary-400 transition-colors" />
              <div className="absolute inset-0 bg-primary-500/20 blur-xl rounded-full group-hover:bg-primary-400/30 transition-all" />
            </div>
            <span className="text-xl font-bold gradient-text">SentinelAI</span>
          </Link>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center gap-1">
            {user &&
              navLinks.map((link) => (
                <Link
                  key={link.path}
                  to={link.path}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-300 ${
                    location.pathname === link.path
                      ? "bg-primary-500/15 text-primary-400 shadow-sm"
                      : "text-dark-300 hover:text-white hover:bg-dark-700/50"
                  }`}
                >
                  {link.label}
                </Link>
              ))}
            {user ? (
              <>
                <span className="ml-2 px-3 py-2 text-sm text-dark-100 bg-dark-800/70 rounded-lg border border-dark-600/70">
                  {user.name}
                </span>
                <button
                  onClick={handleLogout}
                  className="ml-1 px-3 py-2 text-sm font-medium rounded-lg text-red-200 bg-red-500/10 border border-red-500/30 hover:bg-red-500/20 transition-all"
                >
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link
                  to="/login"
                  className="ml-2 px-3 py-2 text-sm font-medium rounded-lg text-dark-100 hover:text-white hover:bg-dark-700/50 transition-all"
                >
                  Login
                </Link>
                <Link
                  to="/register"
                  className="px-3 py-2 text-sm font-semibold rounded-lg text-white bg-primary-600 hover:bg-primary-500 transition-all"
                >
                  Register
                </Link>
              </>
            )}
          </div>

          {/* Mobile toggle */}
          <button
            className="md:hidden p-2 text-dark-300 hover:text-white"
            onClick={() => setMobileOpen(!mobileOpen)}
          >
            {mobileOpen ? <HiX className="w-6 h-6" /> : <HiMenu className="w-6 h-6" />}
          </button>
        </div>

        {/* Mobile Nav */}
        {mobileOpen && (
          <div className="md:hidden pb-4 space-y-1">
            {user &&
              navLinks.map((link) => (
                <Link
                  key={link.path}
                  to={link.path}
                  onClick={() => setMobileOpen(false)}
                  className={`block px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                    location.pathname === link.path
                      ? "bg-primary-500/15 text-primary-400"
                      : "text-dark-300 hover:text-white hover:bg-dark-700/50"
                  }`}
                >
                  {link.label}
                </Link>
              ))}
            {user ? (
              <>
                <div className="px-4 py-2 text-sm text-dark-100">Signed in as {user.name}</div>
                <button
                  onClick={handleLogout}
                  className="w-full text-left px-4 py-2 rounded-lg text-sm font-medium text-red-200 bg-red-500/10 border border-red-500/30 hover:bg-red-500/20 transition-all"
                >
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link
                  to="/login"
                  onClick={() => setMobileOpen(false)}
                  className="block px-4 py-2 rounded-lg text-sm font-medium text-dark-100 hover:text-white hover:bg-dark-700/50 transition-all"
                >
                  Login
                </Link>
                <Link
                  to="/register"
                  onClick={() => setMobileOpen(false)}
                  className="block px-4 py-2 rounded-lg text-sm font-semibold text-white bg-primary-600 hover:bg-primary-500 transition-all"
                >
                  Register
                </Link>
              </>
            )}
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
