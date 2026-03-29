import React, { useState, useCallback } from "react";
import { useDropzone } from "react-dropzone";
import { motion, AnimatePresence } from "framer-motion";
import { HiPhotograph, HiUpload, HiX, HiDownload } from "react-icons/hi";
import { analyzeImage, generateReport } from "../services/api";
import ResultCard from "./ResultCard";
import HeatmapViewer from "./HeatmapViewer";
import toast from "react-hot-toast";

const ImageDetector = () => {
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);

  const onDrop = useCallback((acceptedFiles) => {
    const f = acceptedFiles[0];
    if (f) {
      setFile(f);
      setPreview(URL.createObjectURL(f));
      setResult(null);
    }
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { "image/*": [".jpg", ".jpeg", ".png", ".webp", ".bmp", ".gif"] },
    maxFiles: 1,
    maxSize: 50 * 1024 * 1024,
  });

  const handleAnalyze = async () => {
    if (!file) return;
    setLoading(true);
    try {
      const data = await analyzeImage(file);
      setResult(data);

      // Save to analysis history
      const history = JSON.parse(localStorage.getItem("sentinelai_history") || "[]");
      history.unshift({
        type: "image",
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
    setPreview(null);
    setResult(null);
  };

  return (
    <div className="space-y-8">
      {/* Upload area */}
      <div
        {...getRootProps()}
        className={`glass-card p-12 text-center cursor-pointer transition-all duration-300 ${
          isDragActive
            ? "border-primary-500 bg-primary-500/5 scale-[1.02]"
            : "hover:border-dark-500 hover:bg-dark-800/70"
        }`}
      >
        <input {...getInputProps()} />
        <HiPhotograph className="w-16 h-16 text-primary-500 mx-auto mb-4" />
        <p className="text-lg font-medium text-white mb-2">
          {isDragActive ? "Drop your image here..." : "Drag & drop an image, or click to select"}
        </p>
        <p className="text-dark-400 text-sm">
          Supports JPEG, PNG, WebP, BMP, GIF (max 50MB)
        </p>
      </div>

      {/* Preview */}
      <AnimatePresence>
        {preview && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="glass-card p-6"
          >
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-white">Selected Image</h3>
              <button onClick={handleClear} className="p-2 text-dark-400 hover:text-red-400 transition-colors">
                <HiX className="w-5 h-5" />
              </button>
            </div>
            <div className="flex flex-col md:flex-row gap-6">
              <div className="md:w-1/2">
                <img
                  src={preview}
                  alt="Preview"
                  className="w-full rounded-xl object-contain max-h-80 bg-dark-900"
                />
              </div>
              <div className="md:w-1/2 flex flex-col justify-center">
                <p className="text-dark-300 mb-1">
                  <span className="font-medium text-white">File:</span> {file.name}
                </p>
                <p className="text-dark-300 mb-4">
                  <span className="font-medium text-white">Size:</span>{" "}
                  {(file.size / 1024 / 1024).toFixed(2)} MB
                </p>
                <button
                  onClick={handleAnalyze}
                  disabled={loading}
                  className="btn-primary flex items-center justify-center gap-2"
                >
                  {loading ? (
                    <>
                      <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      Analyzing...
                    </>
                  ) : (
                    <>
                      <HiUpload className="w-5 h-5" />
                      Analyze for Deepfake
                    </>
                  )}
                </button>
              </div>
            </div>
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
            <ResultCard
              type="image"
              data={result.analysis}
              filename={result.filename}
            />
            {result.analysis.heatmap && (
              <HeatmapViewer heatmap={result.analysis.heatmap} />
            )}

            {/* Download Report */}
            <div className="flex justify-center">
              <button
                onClick={async () => {
                  try {
                    const blob = await generateReport("image", result.analysis, result.filename);
                    const url = URL.createObjectURL(blob);
                    const a = document.createElement("a");
                    a.href = url;
                    a.download = `SentinelAI_Image_Report_${result.filename || "analysis"}.pdf`;
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

export default ImageDetector;
