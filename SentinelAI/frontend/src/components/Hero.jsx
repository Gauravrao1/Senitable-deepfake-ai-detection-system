import React from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { HiShieldCheck, HiPhotograph, HiDocumentText, HiMicrophone, HiFilm } from "react-icons/hi";
import PretextHeadline from "./PretextHeadline";

const Hero = () => {
  const features = [
    {
      icon: HiPhotograph,
      title: "Image Detection",
      desc: "Forensic pixel and frequency artifact analysis with localized heatmaps",
      path: "/image",
      color: "from-cyan-500 to-sky-500",
    },
    {
      icon: HiDocumentText,
      title: "Text Detection",
      desc: "Model-backed transformer classification with sentence-level risk clues",
      path: "/text",
      color: "from-emerald-500 to-teal-500",
    },
    {
      icon: HiMicrophone,
      title: "Audio Detection",
      desc: "Spectrogram, MFCC, and pitch consistency checks for cloned voices",
      path: "/audio",
      color: "from-amber-500 to-orange-500",
    },
    {
      icon: HiFilm,
      title: "Video Detection",
      desc: "Frame consistency and byte-pattern diagnostics for deepfake indicators",
      path: "/video",
      color: "from-fuchsia-500 to-rose-500",
    },
  ];

  return (
    <div className="relative overflow-hidden">
      {/* Background effects */}
      <div className="absolute inset-0">
        <div className="absolute -top-28 -left-28 w-[440px] h-[440px] bg-cyan-500/20 rounded-full blur-3xl animate-pulse-slow" />
        <div className="absolute -bottom-24 -right-16 w-[360px] h-[360px] bg-amber-500/20 rounded-full blur-3xl animate-pulse-slow delay-1000" />
        <div className="absolute inset-0 hero-grid-mask" />
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-24 sm:pb-28">
        {/* Main hero */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <div className="flex justify-center mb-5">
            <div className="relative inline-flex items-center gap-2 rounded-full border border-dark-700/70 bg-dark-900/70 px-4 py-2 text-sm text-dark-200 backdrop-blur-lg">
              <HiShieldCheck className="w-5 h-5 text-cyan-400" />
              Detection Studio
            </div>
          </div>

          <PretextHeadline
            text="Trust Signals in a Synthetic World"
            className="mx-auto max-w-5xl mb-5 text-white"
          />

          <p className="text-xl sm:text-2xl text-dark-100 max-w-3xl mx-auto mb-3 font-medium">
            SentinelAI Forensic Console
          </p>

          <p className="text-base sm:text-lg text-dark-200 max-w-3xl mx-auto mb-10">
            A multi-modal workspace for image, text, audio, and video fraud detection with strict confidence policy and investigator-friendly reports.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/image" className="btn-primary text-lg px-8 py-4 inline-flex items-center gap-2 justify-center">
              <HiShieldCheck className="w-5 h-5" />
              Start Scanning
            </Link>
            <a href="#features" className="btn-secondary text-lg px-8 py-4 inline-flex items-center gap-2 justify-center">
              Learn More
            </a>
          </div>
        </motion.div>

        {/* Feature cards */}
        <div id="features" className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-7">
          {features.map((feature, index) => (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 + index * 0.15 }}
            >
              <Link to={feature.path} className="block group">
                <div className="glass-card p-7 h-full hover:border-cyan-400/40 transition-all duration-500 hover:-translate-y-1.5 shadow-soft-panel">
                  <div className={`w-14 h-14 rounded-xl bg-gradient-to-br ${feature.color} p-3 mb-6 shadow-lg group-hover:scale-110 transition-transform duration-300`}>
                    <feature.icon className="w-full h-full text-white" />
                  </div>
                  <h3 className="text-xl font-bold text-white mb-3 group-hover:text-cyan-300 transition-colors">
                    {feature.title}
                  </h3>
                  <p className="text-dark-200 leading-relaxed">
                    {feature.desc}
                  </p>
                  <div className="mt-6 text-cyan-300 text-sm font-semibold flex items-center gap-1 group-hover:gap-3 transition-all">
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
