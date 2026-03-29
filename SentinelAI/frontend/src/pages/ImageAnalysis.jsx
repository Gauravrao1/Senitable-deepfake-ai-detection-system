import React from "react";
import { motion } from "framer-motion";
import { HiPhotograph } from "react-icons/hi";
import ImageDetector from "../components/ImageDetector";

const ImageAnalysis = () => {
  return (
    <div className="min-h-screen">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <div className="flex items-center gap-3 mb-3">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center shadow-lg">
              <HiPhotograph className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-black text-white">Image Deepfake Detection</h1>
              <p className="text-dark-400">CNN + EfficientNet Transfer Learning</p>
            </div>
          </div>
          <p className="text-dark-400 mt-3 max-w-2xl">
            Upload an image to detect if it's AI-generated or manipulated. The system analyzes
            noise patterns, edge consistency, color distribution, and frequency spectrum to
            identify deepfake indicators. A manipulation heatmap shows the most suspicious regions.
          </p>
        </motion.div>

        <ImageDetector />
      </div>
    </div>
  );
};

export default ImageAnalysis;
