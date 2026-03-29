import React from "react";
import { motion } from "framer-motion";
import { HiFilm } from "react-icons/hi";
import VideoDetector from "../components/VideoDetector";

const VideoAnalysis = () => {
  return (
    <div className="min-h-screen">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <div className="flex items-center gap-3 mb-3">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-rose-500 to-red-500 flex items-center justify-center shadow-lg">
              <HiFilm className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-black text-white">Video Deepfake Detection</h1>
              <p className="text-dark-400">Frame Analysis & Temporal Consistency</p>
            </div>
          </div>
          <p className="text-dark-400 mt-3 max-w-2xl">
            Upload a video to detect deepfake manipulation. The system analyzes frame
            consistency, temporal patterns, noise uniformity, edge artifacts, and byte-level
            entropy to identify AI-generated or manipulated video content.
          </p>
        </motion.div>

        <VideoDetector />
      </div>
    </div>
  );
};

export default VideoAnalysis;
