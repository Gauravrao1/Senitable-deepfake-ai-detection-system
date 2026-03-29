import React, { useState, useCallback } from "react";
import { useDropzone } from "react-dropzone";
import { motion, AnimatePresence } from "framer-motion";
import { HiMicrophone, HiUpload, HiX, HiDownload } from "react-icons/hi";
import { analyzeAudio, generateReport } from "../services/api";
import ResultCard from "./ResultCard";
import toast from "react-hot-toast";

const AudioDetector = () => {
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
      "audio/*": [".wav", ".mp3", ".ogg", ".flac", ".webm"],
    },
    maxFiles: 1,
    maxSize: 50 * 1024 * 1024,
  });

  const handleAnalyze = async () => {
    if (!file) return;
    setLoading(true);
    try {
      const data = await analyzeAudio(file);
      setResult(data);

      // Save to analysis history
      const history = JSON.parse(localStorage.getItem("sentinelai_history") || "[]");
      history.unshift({
        type: "audio",
        filename: data.filename,
        verdict: data.analysis.verdict,
        confidence: data.analysis.confidence,
        risk_level: data.analysis.risk_level,
        timestamp: new Date().toISOString(),
        analysis_data: data.analysis,
      });
      localStorage.setItem("sentinelai_history", JSON.stringify(history.slice(0, 20)));

      toast.success("Analysis complete!");
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

  return (
    <div className="space-y-8">
      {/* Upload area */}
      <div
        {...getRootProps()}
        className={`glass-card p-12 text-center cursor-pointer transition-all duration-300 ${
          isDragActive
            ? "border-amber-500 bg-amber-500/5 scale-[1.02]"
            : "hover:border-dark-500 hover:bg-dark-800/70"
        }`}
      >
        <input {...getInputProps()} />
        <HiMicrophone className="w-16 h-16 text-amber-500 mx-auto mb-4" />
        <p className="text-lg font-medium text-white mb-2">
          {isDragActive ? "Drop your audio file here..." : "Drag & drop an audio file, or click to select"}
        </p>
        <p className="text-dark-400 text-sm">
          Supports WAV, MP3, OGG, FLAC, WebM (max 50MB)
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
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-amber-500 to-orange-500 flex items-center justify-center">
                  <HiMicrophone className="w-6 h-6 text-white" />
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
                  Analyzing Audio...
                </>
              ) : (
                <>
                  <HiUpload className="w-5 h-5" />
                  Analyze for Voice Cloning
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
            <ResultCard type="audio" data={result.analysis} filename={result.filename} />

            {/* Audio info */}
            {result.analysis.audio_info && (
              <div className="glass-card p-6">
                <h3 className="text-lg font-semibold text-white mb-4">Audio Properties</h3>
                <div className="grid grid-cols-3 gap-4">
                  {Object.entries(result.analysis.audio_info).map(([key, value]) => (
                    <div key={key} className="bg-dark-800/50 rounded-lg p-4 text-center">
                      <p className="text-2xl font-bold text-white">{value}</p>
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
              <button
                onClick={async () => {
                  try {
                    const blob = await generateReport("audio", result.analysis, result.filename);
                    const url = URL.createObjectURL(blob);
                    const a = document.createElement("a");
                    a.href = url;
                    a.download = `SentinelAI_Audio_Report_${result.filename || "analysis"}.pdf`;
                    a.click();
                    URL.revokeObjectURL(url);
                    toast.success("Report downloaded!");
                  } catch {
                    toast.error("Failed to generate report.");
                  }
                }}
                className="btn-primary flex items-center gap-2"
              >
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

export default AudioDetector;
