import React from "react";
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import ProtectedRoute from "./components/ProtectedRoute";
import Home from "./pages/Home";
import ImageAnalysis from "./pages/ImageAnalysis";
import TextAnalysis from "./pages/TextAnalysis";
import AudioAnalysis from "./pages/AudioAnalysis";
import VideoAnalysis from "./pages/VideoAnalysis";
import Reports from "./pages/Reports";
import Login from "./pages/Login";
import Register from "./pages/Register";
import { AuthProvider, useAuth } from "./context/AuthContext";

function AppRoutes() {
  const location = useLocation();
  const { isAuthenticated } = useAuth();

  const isAuthPage = location.pathname === "/login" || location.pathname === "/register";

  return (
    <div className="min-h-screen flex flex-col bg-dark-950"> 
      {(isAuthenticated || !isAuthPage) && <Navbar />}
      <main className="flex-1">
        <Routes>
          <Route
            path="/"
            element={isAuthenticated ? <Home /> : <Navigate to="/login" replace />}
          />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route
            path="/image"
            element={(
              <ProtectedRoute>
                <ImageAnalysis />
              </ProtectedRoute>
            )}
          />
          <Route
            path="/text"
            element={(
              <ProtectedRoute>
                <TextAnalysis />
              </ProtectedRoute>
            )}
          />
          <Route
            path="/audio"
            element={(
              <ProtectedRoute>
                <AudioAnalysis />
              </ProtectedRoute>
            )}
          />
          <Route
            path="/video"
            element={(
              <ProtectedRoute>
                <VideoAnalysis />
              </ProtectedRoute>
            )}
          />
          <Route
            path="/reports"
            element={(
              <ProtectedRoute>
                <Reports />
              </ProtectedRoute>
            )}
          />
          <Route
            path="*"
            element={<Navigate to={isAuthenticated ? "/" : "/login"} replace />}
          />
        </Routes>
      </main>
      {(isAuthenticated || !isAuthPage) && <Footer />}
      <Toaster
        position="bottom-right"
        toastOptions={{
          style: {
            background: "#1e293b",
            color: "#f1f5f9",
            border: "1px solid #334155",
          },
        }}
      />
    </div>
  );
}

function App() {
  return (
    <AuthProvider>
      <Router>
        <AppRoutes />
      </Router>
    </AuthProvider>
  );
}

export default App;
