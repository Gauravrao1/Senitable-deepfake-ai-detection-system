import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { HiDocumentReport, HiDownload, HiTrash, HiRefresh } from "react-icons/hi";
import Dashboard from "../components/Dashboard";
import { generateReport } from "../services/api";
import toast from "react-hot-toast";

const Reports = () => {
  const [analysisHistory, setAnalysisHistory] = useState([]);

  useEffect(() => {
    loadHistory();
  }, []);

  const loadHistory = () => {
    const history = JSON.parse(localStorage.getItem("sentinelai_history") || "[]");
    setAnalysisHistory(history.slice(0, 5));
  };

  const handleDownloadReport = async (item) => {
    try {
      const blob = await generateReport(
        item.type,
        item.analysis_data,
        item.filename || "N/A"
      );
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `SentinelAI_${item.type}_Report_${item.filename || "analysis"}.pdf`;
      a.click();
      URL.revokeObjectURL(url);
      toast.success("Report downloaded!");
    } catch {
      toast.error("Failed to generate report. Ensure the backend is running.");
    }
  };

  const handleClearHistory = () => {
    localStorage.removeItem("sentinelai_history");
    setAnalysisHistory([]);
    toast.success("History cleared");
  };

  const formatDate = (timestamp) => {
    try {
      return new Date(timestamp).toLocaleString();
    } catch {
      return "N/A";
    }
  };

  return (
    <div className="min-h-screen">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <div className="flex items-center justify-between flex-wrap gap-4">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-primary-500 to-purple-500 flex items-center justify-center shadow-lg">
                <HiDocumentReport className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-3xl font-black text-white">Dashboard & Reports</h1>
                <p className="text-dark-400">Your last 5 analyses with downloadable reports</p>
              </div>
            </div>
            <div className="flex gap-2">
              <button onClick={loadHistory} className="btn-secondary flex items-center gap-2">
                <HiRefresh className="w-4 h-4" />
                Refresh
              </button>
              {analysisHistory.length > 0 && (
                <button onClick={handleClearHistory} className="btn-secondary flex items-center gap-2 text-red-400 hover:text-red-300">
                  <HiTrash className="w-4 h-4" />
                  Clear
                </button>
              )}
            </div>
          </div>
        </motion.div>

        {analysisHistory.length > 0 && <Dashboard results={analysisHistory} />}

        {/* Recent scans table with download */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="glass-card mt-8 overflow-hidden"
        >
          <div className="px-6 py-4 border-b border-dark-700">
            <h3 className="text-lg font-semibold text-white">Recent Scans (Last 5)</h3>
          </div>

          {analysisHistory.length === 0 ? (
            <div className="px-6 py-16 text-center">
              <HiDocumentReport className="w-16 h-16 text-dark-600 mx-auto mb-4" />
              <p className="text-dark-400 text-lg mb-2">No analyses yet</p>
              <p className="text-dark-500 text-sm">
                Run an image, text, audio, or video scan to see results here.
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-dark-700">
                    <th className="text-left px-6 py-3 text-xs font-semibold text-dark-400 uppercase tracking-wide">Type</th>
                    <th className="text-left px-6 py-3 text-xs font-semibold text-dark-400 uppercase tracking-wide">File</th>
                    <th className="text-left px-6 py-3 text-xs font-semibold text-dark-400 uppercase tracking-wide">Verdict</th>
                    <th className="text-left px-6 py-3 text-xs font-semibold text-dark-400 uppercase tracking-wide">Confidence</th>
                    <th className="text-left px-6 py-3 text-xs font-semibold text-dark-400 uppercase tracking-wide">Risk</th>
                    <th className="text-left px-6 py-3 text-xs font-semibold text-dark-400 uppercase tracking-wide">Date</th>
                    <th className="text-left px-6 py-3 text-xs font-semibold text-dark-400 uppercase tracking-wide">Report</th>
                  </tr>
                </thead>
                <tbody>
                  {analysisHistory.map((item, i) => (
                    <tr key={i} className="border-b border-dark-800 hover:bg-dark-800/30 transition-colors">
                      <td className="px-6 py-4">
                        <span className={`px-3 py-1 rounded-full text-xs font-medium border ${
                          item.type === "image" ? "bg-blue-500/10 text-blue-400 border-blue-500/20" :
                          item.type === "text" ? "bg-purple-500/10 text-purple-400 border-purple-500/20" :
                          item.type === "audio" ? "bg-amber-500/10 text-amber-400 border-amber-500/20" :
                          "bg-rose-500/10 text-rose-400 border-rose-500/20"
                        }`}>
                          {item.type.toUpperCase()}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-sm text-dark-300 max-w-[150px] truncate">
                        {item.filename || "N/A"}
                      </td>
                      <td className="px-6 py-4 text-sm text-dark-300">{item.verdict}</td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2">
                          <div className="w-20 bg-dark-700 rounded-full h-2">
                            <div
                              className={`h-2 rounded-full ${
                                item.risk_level === "HIGH" ? "bg-red-500" :
                                item.risk_level === "MEDIUM" ? "bg-amber-500" : "bg-emerald-500"
                              }`}
                              style={{ width: `${item.confidence}%` }}
                            />
                          </div>
                          <span className="text-sm font-mono text-dark-300">{item.confidence}%</span>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span className={`px-3 py-1 rounded-full text-xs font-bold border ${
                          item.risk_level === "HIGH" ? "risk-high" :
                          item.risk_level === "MEDIUM" ? "risk-medium" : "risk-low"
                        }`}>
                          {item.risk_level}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-xs text-dark-400">
                        {formatDate(item.timestamp)}
                      </td>
                      <td className="px-6 py-4">
                        <button
                          onClick={() => handleDownloadReport(item)}
                          className="p-2 rounded-lg bg-primary-500/10 text-primary-400 hover:bg-primary-500/20 transition-colors"
                          title="Download Report"
                        >
                          <HiDownload className="w-4 h-4" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </motion.div>
      </div>
    </div>
  );
};

export default Reports;
