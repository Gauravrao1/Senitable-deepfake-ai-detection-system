import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import Home from "./pages/Home";
import ImageAnalysis from "./pages/ImageAnalysis";
import TextAnalysis from "./pages/TextAnalysis";
import AudioAnalysis from "./pages/AudioAnalysis";
import VideoAnalysis from "./pages/VideoAnalysis";
import Reports from "./pages/Reports";

function App() {
  return (
    <Router>
      <div className="min-h-screen flex flex-col bg-dark-950">
        <Navbar />
        <main className="flex-1">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/image" element={<ImageAnalysis />} />
            <Route path="/text" element={<TextAnalysis />} />
            <Route path="/audio" element={<AudioAnalysis />} />
            <Route path="/video" element={<VideoAnalysis />} />
            <Route path="/reports" element={<Reports />} />
          </Routes>
        </main>
        <Footer />
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
    </Router>
  );
}

export default App;
