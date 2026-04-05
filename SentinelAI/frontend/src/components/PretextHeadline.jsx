import React, { useEffect, useMemo, useRef, useState } from "react";
import { motion } from "framer-motion";
import { prepareWithSegments, layoutWithLines } from "@chenglou/pretext";

const MOBILE_BP = 640;
const DESKTOP_BP = 1024;

function getTypography(viewportWidth) {
  if (viewportWidth >= DESKTOP_BP) {
    return { fontPx: 72, lineHeight: 78 };
  }
  if (viewportWidth >= MOBILE_BP) {
    return { fontPx: 56, lineHeight: 62 };
  }
  return { fontPx: 40, lineHeight: 46 };
}

const PretextHeadline = ({ text, className = "" }) => {
  const hostRef = useRef(null);
  const [containerWidth, setContainerWidth] = useState(0);
  const [viewportWidth, setViewportWidth] = useState(
    typeof window === "undefined" ? 1280 : window.innerWidth
  );

  useEffect(() => {
    const onResize = () => setViewportWidth(window.innerWidth);
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, []);

  useEffect(() => {
    if (!hostRef.current || typeof ResizeObserver === "undefined") return undefined;

    const observer = new ResizeObserver((entries) => {
      const nextWidth = entries[0]?.contentRect?.width || 0;
      setContainerWidth(nextWidth);
    });

    observer.observe(hostRef.current);
    return () => observer.disconnect();
  }, []);

  const { fontPx, lineHeight } = getTypography(viewportWidth);
  const font = `800 ${fontPx}px "Space Grotesk"`;

  const prepared = useMemo(() => prepareWithSegments(text, font), [text, font]);

  const lines = useMemo(() => {
    if (!containerWidth) return [];
    const result = layoutWithLines(prepared, Math.max(220, containerWidth), lineHeight);
    return result.lines;
  }, [prepared, containerWidth, lineHeight]);

  return (
    <div ref={hostRef} className={className}>
      <h1
        className="font-extrabold tracking-tight leading-none text-balance"
        style={{
          fontFamily: '"Space Grotesk", sans-serif',
          fontSize: `${fontPx}px`,
          lineHeight: `${lineHeight}px`,
        }}
      >
        {lines.length > 0
          ? lines.map((line, idx) => (
              <motion.span
                key={`${line.text}-${idx}`}
                initial={{ opacity: 0, y: 16, filter: "blur(6px)" }}
                animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                transition={{ duration: 0.45, delay: 0.15 + idx * 0.08 }}
                className="block"
              >
                {line.text}
              </motion.span>
            ))
          : text}
      </h1>
    </div>
  );
};

export default PretextHeadline;
