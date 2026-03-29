import React from "react";
import { Doughnut, Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
  CategoryScale,
  LinearScale,
  BarElement,
} from "chart.js";
import { motion } from "framer-motion";

ChartJS.register(ArcElement, Tooltip, Legend, CategoryScale, LinearScale, BarElement);

const Dashboard = ({ results }) => {
  if (!results || results.length === 0) {
    return (
      <div className="glass-card p-12 text-center">
        <p className="text-dark-400 text-lg">
          No analysis results yet. Run some scans to see your dashboard.
        </p>
      </div>
    );
  }

  // Aggregate stats
  const totalScans = results.length;
  const highRisk = results.filter((r) => r.risk_level === "HIGH").length;
  const mediumRisk = results.filter((r) => r.risk_level === "MEDIUM").length;
  const lowRisk = results.filter((r) => r.risk_level === "LOW").length;

  const doughnutData = {
    labels: ["High Risk", "Medium Risk", "Low Risk"],
    datasets: [
      {
        data: [highRisk, mediumRisk, lowRisk],
        backgroundColor: [
          "rgba(239, 68, 68, 0.8)",
          "rgba(245, 158, 11, 0.8)",
          "rgba(16, 185, 129, 0.8)",
        ],
        borderColor: [
          "rgba(239, 68, 68, 1)",
          "rgba(245, 158, 11, 1)",
          "rgba(16, 185, 129, 1)",
        ],
        borderWidth: 2,
      },
    ],
  };

  const barData = {
    labels: results.map((_, i) => `Scan ${i + 1}`),
    datasets: [
      {
        label: "Confidence %",
        data: results.map((r) => r.confidence),
        backgroundColor: results.map((r) =>
          r.risk_level === "HIGH"
            ? "rgba(239, 68, 68, 0.6)"
            : r.risk_level === "MEDIUM"
            ? "rgba(245, 158, 11, 0.6)"
            : "rgba(16, 185, 129, 0.6)"
        ),
        borderColor: results.map((r) =>
          r.risk_level === "HIGH"
            ? "rgba(239, 68, 68, 1)"
            : r.risk_level === "MEDIUM"
            ? "rgba(245, 158, 11, 1)"
            : "rgba(16, 185, 129, 1)"
        ),
        borderWidth: 1,
        borderRadius: 8,
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    plugins: {
      legend: {
        labels: { color: "#94a3b8", font: { family: "Inter" } },
      },
    },
    scales: {
      x: {
        ticks: { color: "#64748b" },
        grid: { color: "rgba(51, 65, 85, 0.3)" },
      },
      y: {
        ticks: { color: "#64748b" },
        grid: { color: "rgba(51, 65, 85, 0.3)" },
        max: 100,
      },
    },
  };

  return (
    <div className="space-y-6">
      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: "Total Scans", value: totalScans, color: "text-primary-400" },
          { label: "High Risk", value: highRisk, color: "text-red-400" },
          { label: "Medium Risk", value: mediumRisk, color: "text-amber-400" },
          { label: "Low Risk", value: lowRisk, color: "text-emerald-400" },
        ].map((stat, i) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            className="glass-card p-6 text-center"
          >
            <p className={`text-3xl font-black ${stat.color}`}>{stat.value}</p>
            <p className="text-sm text-dark-400 mt-1">{stat.label}</p>
          </motion.div>
        ))}
      </div>

      {/* Charts */}
      <div className="grid lg:grid-cols-2 gap-6">
        <div className="glass-card p-6">
          <h3 className="text-lg font-semibold text-white mb-4">Risk Distribution</h3>
          <div className="max-w-[300px] mx-auto">
            <Doughnut data={doughnutData} />
          </div>
        </div>
        <div className="glass-card p-6">
          <h3 className="text-lg font-semibold text-white mb-4">Confidence Levels</h3>
          <Bar data={barData} options={chartOptions} />
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
