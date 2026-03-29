import React from "react";
import { motion } from "framer-motion";
import { HiDocumentText } from "react-icons/hi";
import TextDetector from "../components/TextDetector";

const TextAnalysis = () => {
  return (
    <div className="min-h-screen">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <div className="flex items-center gap-3 mb-3">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center shadow-lg">
              <HiDocumentText className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-black text-white">AI Text Detection</h1>
              <p className="text-dark-400">NLP & Transformer-Based Analysis</p>
            </div>
          </div>
          <p className="text-dark-400 mt-3 max-w-2xl">
            Paste any text to detect if it was written by AI (ChatGPT, Claude, Gemini, etc.)
            The system analyzes perplexity, burstiness, linguistic patterns, vocabulary richness,
            and provides a per-sentence AI probability breakdown.
          </p>
        </motion.div>

        <TextDetector />
      </div>
    </div>
  );
};

export default TextAnalysis;
