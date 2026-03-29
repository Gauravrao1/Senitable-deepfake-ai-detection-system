import React from "react";
import { Link } from "react-router-dom";
import { HiShieldCheck } from "react-icons/hi";

const Footer = () => {
  return (
    <footer className="border-t border-dark-800 bg-dark-950/80 backdrop-blur-xl">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="md:col-span-2">
            <div className="flex items-center gap-2 mb-4">
              <HiShieldCheck className="w-7 h-7 text-primary-500" />
              <span className="text-lg font-bold gradient-text">SentinelAI</span>
            </div>
            <p className="text-dark-400 text-sm leading-relaxed max-w-md">
              Advanced multi-modal AI platform for detecting deepfakes, AI-generated text,
              and synthetic audio. Protecting truth in the age of artificial intelligence.
            </p>
          </div>

          {/* Detection */}
          <div>
            <h4 className="text-sm font-semibold text-white uppercase tracking-wide mb-4">
              Detection
            </h4>
            <ul className="space-y-2">
              {[
                { path: "/image", label: "Image Scan" },
                { path: "/text", label: "Text Scan" },
                { path: "/audio", label: "Audio Scan" },
                { path: "/reports", label: "Reports" },
              ].map((link) => (
                <li key={link.path}>
                  <Link
                    to={link.path}
                    className="text-dark-400 hover:text-primary-400 text-sm transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Tech */}
          <div>
            <h4 className="text-sm font-semibold text-white uppercase tracking-wide mb-4">
              Technology
            </h4>
            <ul className="space-y-2 text-sm text-dark-400">
              <li>EfficientNet CNN</li>
              <li>NLP Transformers</li>
              <li>Spectrogram Analysis</li>
              <li>Grad-CAM Heatmaps</li>
            </ul>
          </div>
        </div>

        <div className="border-t border-dark-800 mt-10 pt-8 flex flex-col sm:flex-row justify-between items-center gap-4">
          <p className="text-dark-500 text-sm">
            &copy; {new Date().getFullYear()} SentinelAI. Built for AI safety research.
          </p>
          <div className="flex items-center gap-4 text-dark-500 text-sm">
            <span>React</span>
            <span>&bull;</span>
            <span>FastAPI</span>
            <span>&bull;</span>
            <span>PyTorch</span>
            <span>&bull;</span>
            <span>TensorFlow</span>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
