import React from "react";
import { motion } from "framer-motion";
import {
  HiShieldCheck,
  HiShieldExclamation,
  HiExclamationCircle,
  HiCheckCircle,
} from "react-icons/hi";

const ResultCard = ({ type, data, filename }) => {
  const riskConfig = {
    HIGH: {
      icon: HiShieldExclamation,
      color: "text-red-400",
      bg: "bg-red-500/10",
      border: "border-red-500/30",
      barColor: "bg-red-500",
      label: "High Risk",
    },
    MEDIUM: {
      icon: HiExclamationCircle,
      color: "text-amber-400",
      bg: "bg-amber-500/10",
      border: "border-amber-500/30",
      barColor: "bg-amber-500",
      label: "Medium Risk",
    },
    LOW: {
      icon: HiCheckCircle,
      color: "text-emerald-400",
      bg: "bg-emerald-500/10",
      border: "border-emerald-500/30",
      barColor: "bg-emerald-500",
      label: "Low Risk",
    },
    UNKNOWN: {
      icon: HiShieldCheck,
      color: "text-dark-400",
      bg: "bg-dark-500/10",
      border: "border-dark-500/30",
      barColor: "bg-dark-500",
      label: "Unknown",
    },
  };

  const risk = riskConfig[data.risk_level] || riskConfig.UNKNOWN;
  const RiskIcon = risk.icon;

  const aiProbability = data.is_fake_probability ?? data.is_ai_probability ?? 0;
  const realProbability = data.is_real_probability ?? data.is_human_probability ?? 0;
  const verdictText = (data.verdict || "").toUpperCase();

  let displayConfidence = data.confidence ?? 0;
  if (verdictText.includes("INCONCLUSIVE")) {
    displayConfidence = 50;
  } else if (
    verdictText.includes("HUMAN") ||
    verdictText.includes("AUTHENTIC")
  ) {
    displayConfidence = realProbability * 100;
  } else if (
    verdictText.includes("AI") ||
    verdictText.includes("FAKE") ||
    verdictText.includes("MANIPULAT") ||
    verdictText.includes("DEEPFAKE") ||
    verdictText.includes("SYNTHETIC")
  ) {
    displayConfidence = aiProbability * 100;
  }
  displayConfidence = Math.max(0, Math.min(100, Number(displayConfidence.toFixed(1))));

  const typeLabels = {
    image: "Image Deepfake Detection",
    text: "AI Text Detection",
    audio: "Audio Deepfake Detection",
    video: "Video Deepfake Detection",
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className={`glass-card overflow-hidden`}
    >
      {/* Header bar */}
      <div className={`px-6 py-4 ${risk.bg} border-b ${risk.border}`}>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <RiskIcon className={`w-8 h-8 ${risk.color}`} />
            <div>
              <h3 className="text-lg font-bold text-white">{typeLabels[type]}</h3>
              {filename && <p className="text-sm text-dark-400">{filename}</p>}
            </div>
          </div>
          <span className={`px-4 py-1.5 rounded-full text-sm font-bold ${risk.bg} ${risk.color} border ${risk.border}`}>
            {risk.label}
          </span>
        </div>
      </div>

      <div className="p-6 space-y-6">
        {/* Verdict */}
        <div className="text-center py-4">
          <p className={`text-2xl font-black ${risk.color} mb-2`}>
            {data.verdict}
          </p>
          <p className="text-dark-400 text-sm">Detection Confidence</p>
        </div>

        {/* Confidence bar */}
        <div>
          <div className="flex justify-between text-sm mb-2">
            <span className="text-dark-400">Confidence Level</span>
            <span className={`font-bold ${risk.color}`}>{displayConfidence}%</span>
          </div>
          <div className="w-full bg-dark-700 rounded-full h-4 overflow-hidden">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${displayConfidence}%` }}
              transition={{ duration: 1, ease: "easeOut" }}
              className={`h-full rounded-full ${risk.barColor} relative`}
            >
              <div className="absolute inset-0 bg-gradient-to-r from-transparent to-white/10" />
            </motion.div>
          </div>
        </div>

        {/* Probability breakdown */}
        <div className="grid grid-cols-2 gap-4">
          <div className="bg-dark-800/50 rounded-xl p-4 text-center">
            <p className="text-3xl font-black text-red-400">
              {(aiProbability * 100).toFixed(1)}%
            </p>
            <p className="text-xs text-dark-400 mt-1 uppercase tracking-wide">
              {type === "text" ? "AI Generated" : "Fake / Manipulated"}
            </p>
          </div>
          <div className="bg-dark-800/50 rounded-xl p-4 text-center">
            <p className="text-3xl font-black text-emerald-400">
              {(realProbability * 100).toFixed(1)}%
            </p>
            <p className="text-xs text-dark-400 mt-1 uppercase tracking-wide">
              {type === "text" ? "Human Written" : "Authentic"}
            </p>
          </div>
        </div>

        {/* Detailed analysis */}
        {data.analysis_details && (
          <div>
            <h4 className="text-sm font-semibold text-dark-300 uppercase tracking-wide mb-3">
              Analysis Breakdown
            </h4>
            <div className="space-y-3">
              {Object.entries(data.analysis_details).map(([key, value]) => {
                if (typeof value === "object" && value !== null) {
                  return (
                    <div key={key} className="bg-dark-800/30 rounded-lg p-4">
                      <p className="text-sm font-medium text-white mb-1">
                        {key.replace(/_/g, " ").replace(/\b\w/g, (c) => c.toUpperCase())}
                      </p>
                      {value.interpretation && (
                        <p className="text-xs text-dark-400">{value.interpretation}</p>
                      )}
                      {value.score !== undefined && (
                        <div className="mt-2 flex items-center gap-2">
                          <div className="flex-1 bg-dark-700 rounded-full h-2">
                            <div
                              className="h-2 rounded-full bg-primary-500"
                              style={{ width: `${Math.min(value.score * 100, 100)}%` }}
                            />
                          </div>
                          <span className="text-xs text-dark-400 w-12 text-right">
                            {typeof value.score === "number" ? value.score.toFixed(2) : value.score}
                          </span>
                        </div>
                      )}
                    </div>
                  );
                }
                return (
                  <div key={key} className="flex justify-between py-2 border-b border-dark-700/50">
                    <span className="text-sm text-dark-400">
                      {key.replace(/_/g, " ").replace(/\b\w/g, (c) => c.toUpperCase())}
                    </span>
                    <span className="text-sm font-medium text-white">
                      {typeof value === "number" ? value.toFixed(4) : String(value)}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </motion.div>
  );
};

export default ResultCard;
