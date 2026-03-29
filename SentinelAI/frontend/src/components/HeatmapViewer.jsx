import React, { useRef, useEffect } from "react";
import { motion } from "framer-motion";
import { HiEye } from "react-icons/hi";

const HeatmapViewer = ({ heatmap }) => {
  const canvasRef = useRef(null);

  useEffect(() => {
    if (!heatmap || !heatmap.length || !canvasRef.current) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    const rows = heatmap.length;
    const cols = heatmap[0].length;

    const displaySize = 400;
    canvas.width = displaySize;
    canvas.height = displaySize;

    const cellWidth = displaySize / cols;
    const cellHeight = displaySize / rows;

    // Color mapping: low (blue/green) -> high (yellow/red)
    const getColor = (value) => {
      const v = Math.max(0, Math.min(1, value));
      if (v < 0.25) {
        const t = v / 0.25;
        return `rgb(${Math.round(0 + t * 0)}, ${Math.round(50 + t * 150)}, ${Math.round(200 - t * 50)})`;
      } else if (v < 0.5) {
        const t = (v - 0.25) / 0.25;
        return `rgb(${Math.round(0 + t * 200)}, ${Math.round(200 + t * 55)}, ${Math.round(150 - t * 150)})`;
      } else if (v < 0.75) {
        const t = (v - 0.5) / 0.25;
        return `rgb(${Math.round(200 + t * 55)}, ${Math.round(255 - t * 80)}, ${Math.round(0)})`;
      } else {
        const t = (v - 0.75) / 0.25;
        return `rgb(${Math.round(255)}, ${Math.round(175 - t * 175)}, ${Math.round(0)})`;
      }
    };

    // Draw heatmap cells
    for (let i = 0; i < rows; i++) {
      for (let j = 0; j < cols; j++) {
        ctx.fillStyle = getColor(heatmap[i][j]);
        ctx.fillRect(j * cellWidth, i * cellHeight, cellWidth + 1, cellHeight + 1);
      }
    }

    // Add slight blur for smoother look
    ctx.filter = "blur(2px)";
    ctx.drawImage(canvas, 0, 0);
    ctx.filter = "none";
  }, [heatmap]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="glass-card p-6"
    >
      <div className="flex items-center gap-3 mb-4">
        <HiEye className="w-6 h-6 text-primary-400" />
        <h3 className="text-lg font-semibold text-white">Manipulation Heatmap</h3>
      </div>

      <p className="text-sm text-dark-400 mb-4">
        Red/warm areas indicate regions with higher manipulation probability.
        Blue/cool areas appear authentic.
      </p>

      <div className="flex flex-col items-center">
        <canvas
          ref={canvasRef}
          className="rounded-xl border border-dark-700 max-w-full"
          style={{ imageRendering: "auto" }}
        />

        {/* Legend */}
        <div className="flex items-center gap-2 mt-4">
          <span className="text-xs text-dark-400">Authentic</span>
          <div className="w-48 h-3 rounded-full bg-gradient-to-r from-blue-500 via-green-400 via-yellow-400 to-red-500" />
          <span className="text-xs text-dark-400">Manipulated</span>
        </div>
      </div>
    </motion.div>
  );
};

export default HeatmapViewer;
