import React from "react";
import { motion } from "framer-motion";
import { HiMicrophone } from "react-icons/hi";
import AudioDetector from "../components/AudioDetector";

const AudioAnalysis = () => {
  return (
    <div className="min-h-screen">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <div className="flex items-center gap-3 mb-3">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-amber-500 to-orange-500 flex items-center justify-center shadow-lg">
              <HiMicrophone className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-black text-white">Audio Deepfake Detection</h1>
              <p className="text-dark-400">Spectrogram & MFCC Analysis</p>
            </div>
          </div>
          <p className="text-dark-400 mt-3 max-w-2xl">
            Upload an audio file to detect voice cloning, text-to-speech synthesis, or
            audio manipulation. The system analyzes MFCCs, pitch consistency, spectral
            characteristics, and energy dynamics to identify synthetic audio.
          </p>
        </motion.div>

        <AudioDetector />
      </div>
    </div>
  );
};

export default AudioAnalysis;
