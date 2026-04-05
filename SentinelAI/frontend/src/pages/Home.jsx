import React from "react";
import Hero from "../components/Hero";
import { motion } from "framer-motion";
import { HiLightningBolt, HiCube, HiChartBar, HiDocumentReport } from "react-icons/hi";

const stats = [
  { icon: HiLightningBolt, label: "Detection Modes", value: "4", desc: "Image + Text + Audio + Video" },
  { icon: HiCube, label: "Signal Engines", value: "6+", desc: "Text model + forensic analyzers" },
  { icon: HiChartBar, label: "Analysis Metrics", value: "25+", desc: "Deep feature extraction" },
  { icon: HiDocumentReport, label: "Report Format", value: "PDF", desc: "Forensic-grade reports" },
];

const Home = () => {
  return (
    <div>
      <Hero />

      {/* Stats section */}
      <section className="py-20 bg-dark-900/35 border-y border-dark-700/40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
            {stats.map((stat, i) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="glass-card p-6 text-center group hover:border-cyan-400/40 transition-all shadow-soft-panel"
              >
                <stat.icon className="w-8 h-8 text-cyan-300 mx-auto mb-3 group-hover:scale-110 transition-transform" />
                <p className="text-3xl font-black text-white mb-1">{stat.value}</p>
                <p className="text-sm font-medium text-dark-300">{stat.label}</p>
                <p className="text-xs text-dark-500 mt-1">{stat.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Tech stack */}
      <section className="py-20 bg-dark-900/35">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-black text-white mb-12">
            Powered by <span className="gradient-text">Advanced AI</span>
          </h2>
          <div className="flex flex-wrap justify-center gap-4">
            {[
              "Transformers", "FastAPI", "React", "Tailwind CSS",
              "NumPy", "SciPy", "librosa", "OpenCV",
              "ReportLab", "Framer Motion", "Chart.js", "Pydantic",
            ].map((tech) => (
              <span
                key={tech}
                className="px-5 py-2.5 glass-card text-dark-300 text-sm font-medium hover:text-cyan-300 hover:border-cyan-400/40 transition-all cursor-default"
              >
                {tech}
              </span>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
