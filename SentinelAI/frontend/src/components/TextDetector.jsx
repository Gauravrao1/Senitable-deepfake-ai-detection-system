import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { HiDocumentText, HiSearch, HiDownload } from "react-icons/hi";
import { analyzeText, generateReport } from "../services/api";
import ResultCard from "./ResultCard";
import toast from "react-hot-toast";

const TextDetector = () => {
  const [text, setText] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);

  const handleAnalyze = async () => {
    if (text.trim().length < 20) {
      toast.error("Please enter at least 20 characters for analysis.");
      return;
    }
    setLoading(true);
    try {
      const data = await analyzeText(text);
      setResult(data);

      // Save to analysis history
      const history = JSON.parse(localStorage.getItem("sentinelai_history") || "[]");
      history.unshift({
        type: "text",
        filename: "Text Input",
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
    setText("");
    setResult(null);
  };

  return (
    <div className="space-y-8">
      {/* Input area */}
      <div className="glass-card p-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <HiDocumentText className="w-6 h-6 text-purple-400" />
            <h3 className="text-lg font-semibold text-white">Text Analysis</h3>
          </div>
          <span className="text-sm text-dark-400">
            {text.length} / 50,000 characters
          </span>
        </div>

        <textarea
          value={text}
          onChange={(e) => {
            setText(e.target.value);
            setResult(null);
          }}
          placeholder="Paste the text you want to analyze here... (minimum 20 characters)"
          className="input-field h-48 resize-y font-sans"
          maxLength={50000}
        />

        <div className="flex gap-3 mt-4">
          <button
            onClick={handleAnalyze}
            disabled={loading || text.trim().length < 20}
            className="btn-primary flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? (
              <>
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                Analyzing...
              </>
            ) : (
              <>
                <HiSearch className="w-5 h-5" />
                Detect AI Text
              </>
            )}
          </button>
          {text && (
            <button onClick={handleClear} className="btn-secondary">
              Clear
            </button>
          )}
        </div>
      </div>

      {/* Results */}
      <AnimatePresence>
        {result && (
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-6"
          >
            <ResultCard type="text" data={result.analysis} />

            {/* Per-sentence breakdown */}
            {result.analysis.sentence_analysis && result.analysis.sentence_analysis.length > 0 && (
              <div className="glass-card p-6">
                <h3 className="text-lg font-semibold text-white mb-4">
                  Per-Sentence AI Probability
                </h3>
                <div className="space-y-2">
                  {result.analysis.sentence_analysis.map((sent, i) => (
                    <div key={i} className="flex items-start gap-3 p-3 rounded-lg bg-dark-800/50">
                      <div className="flex-shrink-0 w-16 text-right">
                        <span
                          className={`text-sm font-mono font-bold ${
                            sent.ai_probability > 0.5
                              ? "text-red-400"
                              : sent.ai_probability > 0.25
                              ? "text-amber-400"
                              : "text-emerald-400"
                          }`}
                        >
                          {(sent.ai_probability * 100).toFixed(0)}%
                        </span>
                      </div>
                      <div className="flex-1">
                        <div className="w-full bg-dark-700 rounded-full h-1.5 mb-2">
                          <div
                            className={`h-1.5 rounded-full ${
                              sent.ai_probability > 0.5
                                ? "bg-red-500"
                                : sent.ai_probability > 0.25
                                ? "bg-amber-500"
                                : "bg-emerald-500"
                            }`}
                            style={{ width: `${sent.ai_probability * 100}%` }}
                          />
                        </div>
                        <p className="text-sm text-dark-300">{sent.text}</p>
                      </div>
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
                    const blob = await generateReport("text", result.analysis, "Text Input");
                    const url = URL.createObjectURL(blob);
                    const a = document.createElement("a");
                    a.href = url;
                    a.download = "SentinelAI_Text_Report.pdf";
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

export default TextDetector;
