import React, { useState, useCallback } from "react";
import { useDropzone } from "react-dropzone";
import { motion, AnimatePresence } from "framer-motion";
import { HiFilm, HiUpload, HiX, HiDownload } from "react-icons/hi";
import { analyzeVideo, generateReport } from "../services/api";
import ResultCard from "./ResultCard";
import toast from "react-hot-toast";

const VideoDetector = () => {
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);

  const onDrop = useCallback((acceptedFiles) => {
    const f = acceptedFiles[0];
    if (f) {
      setFile(f);
      setResult(null);
    }
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      "video/*": [".mp4", ".mpeg", ".webm", ".avi", ".mov", ".mkv"],
    },
    maxFiles: 1,
    maxSize: 50 * 1024 * 1024,
  });

  const handleAnalyze = async () => {
    if (!file) return;
    setLoading(true);
    try {
      const data = await analyzeVideo(file);
      setResult(data);

      // Save to analysis history
      const history = JSON.parse(localStorage.getItem("sentinelai_history") || "[]");
      history.unshift({
        type: "video",
        filename: data.filename,
        verdict: data.analysis.verdict,
        confidence: data.analysis.confidence,
        risk_level: data.analysis.risk_level,
        timestamp: new Date().toISOString(),
        analysis_data: data.analysis,
      });
      localStorage.setItem("sentinelai_history", JSON.stringify(history.slice(0, 20)));

      toast.success("Video analysis complete!");
    } catch (err) {
      toast.error(err.response?.data?.detail || "Analysis failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleClear = () => {
    setFile(null);
    setResult(null);
  };

  const handleDownloadReport = async () => {
    if (!result) return;
    try {
      const blob = await generateReport("video", result.analysis, result.filename);
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `SentinelAI_Video_Report_${result.filename || "analysis"}.pdf`;
      a.click();
      URL.revokeObjectURL(url);
      toast.success("Report downloaded!");
    } catch {
      toast.error("Failed to generate report.");
    }
  };

  return (
    <div className="space-y-8">
      {/* Upload area */}
      <div
        {...getRootProps()}
        className={`glass-card p-12 text-center cursor-pointer transition-all duration-300 ${
          isDragActive
            ? "border-rose-500 bg-rose-500/5 scale-[1.02]"
            : "hover:border-dark-500 hover:bg-dark-800/70"
        }`}
      >
        <input {...getInputProps()} />
        <HiFilm className="w-16 h-16 text-rose-500 mx-auto mb-4" />
        <p className="text-lg font-medium text-white mb-2">
          {isDragActive ? "Drop your video here..." : "Drag & drop a video file, or click to select"}
        </p>
        <p className="text-dark-400 text-sm">
          Supports MP4, WebM, AVI, MOV, MKV (max 50MB)
        </p>
      </div>

      {/* File info */}
      <AnimatePresence>
        {file && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="glass-card p-6"
          >
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-rose-500 to-red-500 flex items-center justify-center">
                  <HiFilm className="w-6 h-6 text-white" />
                </div>
                <div>
                  <p className="font-medium text-white">{file.name}</p>
                  <p className="text-sm text-dark-400">
                    {(file.size / 1024 / 1024).toFixed(2)} MB
                  </p>
                </div>
              </div>
              <button onClick={handleClear} className="p-2 text-dark-400 hover:text-red-400 transition-colors">
                <HiX className="w-5 h-5" />
              </button>
            </div>

            <button
              onClick={handleAnalyze}
              disabled={loading}
              className="btn-primary flex items-center justify-center gap-2 w-full"
            >
              {loading ? (
                <>
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Analyzing Video...
                </>
              ) : (
                <>
                  <HiUpload className="w-5 h-5" />
                  Analyze for Deepfake
                </>
              )}
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Results */}
      <AnimatePresence>
        {result && (
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-6"
          >
            <ResultCard type="video" data={result.analysis} filename={result.filename} />

            {/* Video info */}
            {result.analysis.video_info && (
              <div className="glass-card p-6">
                <h3 className="text-lg font-semibold text-white mb-4">Video Properties</h3>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                  {Object.entries(result.analysis.video_info)
                    .filter(([key]) => key !== "note")
                    .map(([key, value]) => (
                      <div key={key} className="bg-dark-800/50 rounded-lg p-4 text-center">
                        <p className="text-2xl font-bold text-white">
                          {typeof value === "number" ? (Number.isInteger(value) ? value : value.toFixed(1)) : value}
                        </p>
                        <p className="text-xs text-dark-400 mt-1">
                          {key.replace(/_/g, " ").toUpperCase()}
                        </p>
                      </div>
                    ))}
                </div>
              </div>
            )}

            {/* Download Report */}
            <div className="flex justify-center">
              <button onClick={handleDownloadReport} className="btn-primary flex items-center gap-2">
                <HiDownload className="w-5 h-5" />
                Download Forensic Report
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default VideoDetector;
