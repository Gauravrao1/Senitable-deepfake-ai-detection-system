import React from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { HiShieldCheck, HiPhotograph, HiDocumentText, HiMicrophone, HiFilm } from "react-icons/hi";

const Hero = () => {
  const features = [
    {
      icon: HiPhotograph,
      title: "Image Detection",
      desc: "CNN + EfficientNet deep learning to detect AI-generated or manipulated images",
      path: "/image",
      color: "from-blue-500 to-cyan-500",
      glow: "blue",
    },
    {
      icon: HiDocumentText,
      title: "Text Detection",
      desc: "NLP & transformer models to identify AI-written content with per-sentence analysis",
      path: "/text",
      color: "from-purple-500 to-pink-500",
      glow: "purple",
    },
    {
      icon: HiMicrophone,
      title: "Audio Detection",
      desc: "Spectrogram analysis & MFCC features to detect voice cloning and synthesis",
      path: "/audio",
      color: "from-amber-500 to-orange-500",
      glow: "amber",
    },
    {
      icon: HiFilm,
      title: "Video Detection",
      desc: "Frame-level analysis & temporal consistency checks to detect deepfake videos",
      path: "/video",
      color: "from-rose-500 to-red-500",
      glow: "rose",
    },
  ];

  return (
    <div className="relative overflow-hidden">
      {/* Background effects */}
      <div className="absolute inset-0">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary-500/10 rounded-full blur-3xl animate-pulse-slow" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl animate-pulse-slow delay-1000" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-primary-900/20 rounded-full blur-3xl" />
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-32">
        {/* Main hero */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center mb-20"
        >
          <div className="flex justify-center mb-6">
            <div className="relative">
              <HiShieldCheck className="w-20 h-20 text-primary-500" />
              <div className="absolute inset-0 bg-primary-500/30 blur-2xl rounded-full" />
            </div>
          </div>

          <h1 className="text-5xl sm:text-6xl lg:text-7xl font-black mb-6 leading-tight">
            <span className="gradient-text">SentinelAI</span>
          </h1>

          <p className="text-xl sm:text-2xl text-dark-300 max-w-3xl mx-auto mb-4 font-light">
            Real-Time Deepfake & AI-Generated Content Detection
          </p>

          <p className="text-lg text-dark-400 max-w-2xl mx-auto mb-10">
            Multi-modal AI platform that detects manipulated images, AI-written text,
            and synthetic audio with forensic-grade analysis reports.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/image" className="btn-primary text-lg px-8 py-4 inline-flex items-center gap-2">
              <HiShieldCheck className="w-5 h-5" />
              Start Scanning
            </Link>
            <a href="#features" className="btn-secondary text-lg px-8 py-4 inline-flex items-center gap-2">
              Learn More
            </a>
          </div>
        </motion.div>

        {/* Feature cards */}
        <div id="features" className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8">
          {features.map((feature, index) => (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 + index * 0.15 }}
            >
              <Link to={feature.path} className="block group">
                <div className="glass-card p-8 h-full hover:border-primary-500/30 transition-all duration-500 glow-effect hover:glow-effect">
                  <div className={`w-14 h-14 rounded-xl bg-gradient-to-br ${feature.color} p-3 mb-6 shadow-lg group-hover:scale-110 transition-transform duration-300`}>
                    <feature.icon className="w-full h-full text-white" />
                  </div>
                  <h3 className="text-xl font-bold text-white mb-3 group-hover:text-primary-400 transition-colors">
                    {feature.title}
                  </h3>
                  <p className="text-dark-400 leading-relaxed">
                    {feature.desc}
                  </p>
                  <div className="mt-6 text-primary-400 text-sm font-semibold flex items-center gap-1 group-hover:gap-3 transition-all">
                    Analyze Now
                    <span className="text-lg">&rarr;</span>
                  </div>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Hero;
