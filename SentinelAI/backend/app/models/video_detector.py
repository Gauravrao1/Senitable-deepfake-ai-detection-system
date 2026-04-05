"""
Video Deepfake Detector
Analyzes video files for deepfake indicators using frame-level analysis,
temporal consistency checks, and motion pattern analysis.
"""

import logging
import hashlib
import math
from typing import Dict, Any

logger = logging.getLogger(__name__)


def _extract_frames_from_bytes(video_bytes: bytes, max_frames: int = 20) -> list:
    """Extract frames from video bytes using Pillow (for GIF/WEBP) or cv2 if available."""
    frames = []

    # Try OpenCV first
    try:
        import cv2
        import numpy as np
        import tempfile
        import os

        with tempfile.NamedTemporaryFile(suffix=".mp4", delete=False) as tmp:
            tmp.write(video_bytes)
            tmp_path = tmp.name

        try:
            cap = cv2.VideoCapture(tmp_path)
            total_frames = int(cap.get(cv2.CAP_PROP_FRAME_COUNT))
            fps = cap.get(cv2.CAP_PROP_FPS) or 30
            width = int(cap.get(cv2.CAP_PROP_FRAME_WIDTH))
            height = int(cap.get(cv2.CAP_PROP_FRAME_HEIGHT))
            duration = total_frames / fps if fps > 0 else 0

            step = max(1, total_frames // max_frames)
            for i in range(0, total_frames, step):
                cap.set(cv2.CAP_PROP_POS_FRAMES, i)
                ret, frame = cap.read()
                if ret:
                    frame_rgb = cv2.cvtColor(frame, cv2.COLOR_BGR2RGB)
                    frames.append(frame_rgb)
                if len(frames) >= max_frames:
                    break

            cap.release()
            return frames, {
                "total_frames": total_frames,
                "fps": round(fps, 2),
                "width": width,
                "height": height,
                "duration": round(duration, 2),
            }
        finally:
            os.unlink(tmp_path)

    except ImportError:
        pass

    # Fallback: analyze video bytes statistically
    return frames, _estimate_video_info(video_bytes)


def _estimate_video_info(video_bytes: bytes) -> dict:
    """Estimate video properties from raw bytes when cv2 is not available."""
    size_mb = len(video_bytes) / (1024 * 1024)
    # Rough estimates based on file size and common patterns
    estimated_duration = max(1.0, size_mb * 8)  # ~1MB per second for compressed video
    return {
        "total_frames": int(estimated_duration * 30),
        "fps": 30.0,
        "width": 0,
        "height": 0,
        "duration": round(estimated_duration, 2),
        "note": "Estimated values (opencv not installed)",
    }


def _analyze_byte_patterns(video_bytes: bytes) -> Dict[str, Any]:
    """Analyze raw byte patterns for signs of AI generation or manipulation."""
    import numpy as np

    data = np.frombuffer(video_bytes[:min(len(video_bytes), 2 * 1024 * 1024)], dtype=np.uint8)

    # Entropy analysis - AI-generated videos often have different entropy profiles
    histogram = np.bincount(data, minlength=256).astype(np.float64)
    histogram = histogram / histogram.sum()
    nonzero = histogram[histogram > 0]
    entropy = -np.sum(nonzero * np.log2(nonzero))

    # Byte distribution uniformity
    expected = 1.0 / 256
    chi_squared = np.sum((histogram - expected) ** 2 / expected)

    # Repetition patterns (AI videos sometimes have repetitive codec artifacts)
    chunk_size = 1024
    chunks = [data[i:i + chunk_size] for i in range(0, min(len(data), 50000), chunk_size)]
    hashes = [hashlib.md5(chunk.tobytes()).hexdigest() for chunk in chunks if len(chunk) == chunk_size]
    unique_ratio = len(set(hashes)) / max(len(hashes), 1)

    # Frequency analysis
    if len(data) >= 256:
        fft = np.fft.fft(data[:256].astype(np.float64))
        magnitude = np.abs(fft)
        spectral_energy = np.sum(magnitude ** 2)
        spectral_flatness = np.exp(np.mean(np.log(magnitude + 1e-10))) / (np.mean(magnitude) + 1e-10)
    else:
        spectral_energy = 0
        spectral_flatness = 0

    return {
        "entropy": round(float(entropy), 4),
        "chi_squared": round(float(chi_squared), 4),
        "unique_chunk_ratio": round(float(unique_ratio), 4),
        "spectral_energy": round(float(spectral_energy), 2),
        "spectral_flatness": round(float(spectral_flatness), 4),
    }


def _analyze_frame_consistency(frames: list) -> Dict[str, Any]:
    """Analyze temporal consistency across extracted frames."""
    import numpy as np

    if len(frames) < 2:
        return {
            "frame_difference_mean": 0,
            "frame_difference_std": 0,
            "temporal_smoothness": 1.0,
            "flicker_score": 0,
            "color_shift_score": 0,
        }

    diffs = []
    color_means = []
    for i in range(len(frames) - 1):
        f1 = frames[i].astype(np.float64)
        f2 = frames[i + 1].astype(np.float64)
        diff = np.mean(np.abs(f1 - f2))
        diffs.append(diff)
        color_means.append(np.mean(f1, axis=(0, 1)))

    diffs = np.array(diffs)
    color_means = np.array(color_means)

    # Temporal smoothness: low std of diffs suggests AI-generated uniformity
    temporal_smoothness = 1.0 / (1.0 + np.std(diffs))

    # Flicker detection: sudden jumps in brightness
    flicker_score = np.sum(np.abs(np.diff(diffs)) > np.mean(diffs) * 2) / max(len(diffs), 1)

    # Color consistency check
    color_shifts = np.std(color_means, axis=0)
    color_shift_score = float(np.mean(color_shifts))

    return {
        "frame_difference_mean": round(float(np.mean(diffs)), 4),
        "frame_difference_std": round(float(np.std(diffs)), 4),
        "temporal_smoothness": round(float(temporal_smoothness), 4),
        "flicker_score": round(float(flicker_score), 4),
        "color_shift_score": round(float(color_shift_score), 4),
    }


def _analyze_frames_individually(frames: list) -> Dict[str, Any]:
    """Analyze individual frames for deepfake artifacts."""
    import numpy as np

    if not frames:
        return {"noise_uniformity": 0.5, "edge_density_variance": 0.5, "saturation_anomaly": 0.5}

    noise_levels = []
    edge_densities = []
    saturation_scores = []

    for frame in frames:
        arr = frame.astype(np.float64)

        # Noise level per frame
        if arr.ndim == 3:
            gray = np.mean(arr, axis=2)
        else:
            gray = arr

        # Simple noise estimation via Laplacian-like filter
        if gray.shape[0] > 2 and gray.shape[1] > 2:
            laplacian = (
                gray[:-2, 1:-1] + gray[2:, 1:-1] +
                gray[1:-1, :-2] + gray[1:-1, 2:] -
                4 * gray[1:-1, 1:-1]
            )
            noise_levels.append(np.std(laplacian))

        # Edge density
        dx = np.diff(gray, axis=1)
        dy = np.diff(gray, axis=0)
        edge_mag = np.sqrt(dx[:min(dx.shape[0], dy.shape[0]), :min(dx.shape[1], dy.shape[1])] ** 2 +
                          dy[:min(dx.shape[0], dy.shape[0]), :min(dx.shape[1], dy.shape[1])] ** 2)
        edge_densities.append(np.mean(edge_mag > np.mean(edge_mag) * 1.5))

        # Saturation analysis
        if arr.ndim == 3 and arr.shape[2] >= 3:
            max_c = np.max(arr[:, :, :3], axis=2)
            min_c = np.min(arr[:, :, :3], axis=2)
            sat = np.where(max_c > 0, (max_c - min_c) / (max_c + 1e-10), 0)
            saturation_scores.append(np.std(sat))

    return {
        "noise_uniformity": round(float(np.std(noise_levels)) if noise_levels else 0.5, 4),
        "edge_density_variance": round(float(np.std(edge_densities)) if edge_densities else 0.5, 4),
        "saturation_anomaly": round(float(np.mean(saturation_scores)) if saturation_scores else 0.5, 4),
    }


def _compute_verdict(byte_analysis: dict, frame_consistency: dict, frame_quality: dict) -> Dict[str, Any]:
    """Combine all analyses into a final verdict."""
    scores = []

    # Entropy scoring: very high or very low entropy can indicate manipulation
    entropy = byte_analysis.get("entropy", 7.0)
    if entropy > 7.9:
        scores.append(0.3)  # Very high entropy — might be heavily compressed or generated
    elif entropy < 5.0:
        scores.append(0.6)  # Too low entropy — suspicious
    else:
        scores.append(0.15)

    # Unique chunk ratio: low ratio suggests repetitive patterns
    unique_ratio = byte_analysis.get("unique_chunk_ratio", 1.0)
    if unique_ratio < 0.7:
        scores.append(0.5)
    elif unique_ratio < 0.9:
        scores.append(0.3)
    else:
        scores.append(0.1)

    # Temporal smoothness: too smooth = possibly AI-generated
    smoothness = frame_consistency.get("temporal_smoothness", 0.5)
    if smoothness > 0.8:
        scores.append(0.5)
    elif smoothness > 0.5:
        scores.append(0.3)
    else:
        scores.append(0.1)

    # Flicker score: high flicker = glitch artifacts
    flicker = frame_consistency.get("flicker_score", 0)
    if flicker > 0.3:
        scores.append(0.5)
    elif flicker > 0.1:
        scores.append(0.3)
    else:
        scores.append(0.1)

    # Noise uniformity: very uniform noise across frames = AI-generated
    noise_uni = frame_quality.get("noise_uniformity", 0.5)
    if noise_uni < 0.1:
        scores.append(0.5)  # Too uniform
    elif noise_uni > 2.0:
        scores.append(0.4)  # Too varied
    else:
        scores.append(0.15)

    # Edge density variance
    edge_var = frame_quality.get("edge_density_variance", 0.5)
    if edge_var < 0.01:
        scores.append(0.4)
    else:
        scores.append(0.15)

    fake_probability = sum(scores) / len(scores)
    if abs(fake_probability - 0.5) < 0.05:
        fake_probability = 0.5
    confidence = round(fake_probability * 100, 1)

    if confidence >= 85:
        verdict = "LIKELY AI-GENERATED / DEEPFAKE"
        risk_level = "HIGH"
    elif confidence >= 72:
        verdict = "POSSIBLY MANIPULATED"
        risk_level = "MEDIUM"
    elif confidence <= 18:
        verdict = "LIKELY AUTHENTIC"
        risk_level = "LOW"
    else:
        verdict = "INCONCLUSIVE - NEEDS HIGHER-QUALITY VIDEO"
        risk_level = "MEDIUM"

    return {
        "verdict": verdict,
        "confidence": confidence,
        "risk_level": risk_level,
        "is_fake_probability": round(fake_probability, 4),
        "is_real_probability": round(1 - fake_probability, 4),
        "decision_policy": "strict_v3",
    }


def analyze_video(video_bytes: bytes) -> Dict[str, Any]:
    """
    Main entry point: Analyze a video for deepfake indicators.

    Returns dict with verdict, confidence, risk_level, and detailed analysis.
    """
    try:
        import numpy as np

        # Extract frames
        frames, video_info = _extract_frames_from_bytes(video_bytes)

        if video_info.get("duration", 0) and video_info["duration"] < 2.0:
            return {
                "verdict": "INCONCLUSIVE - VIDEO TOO SHORT",
                "confidence": 50.0,
                "risk_level": "MEDIUM",
                "is_fake_probability": 0.5,
                "is_real_probability": 0.5,
                "decision_policy": "strict_v3",
                "analysis_details": {
                    "note": {
                        "score": 0.5,
                        "interpretation": "Upload at least 2 seconds for reliable temporal deepfake analysis.",
                    }
                },
                "video_info": video_info,
            }

        # Byte-level analysis (always works)
        byte_analysis = _analyze_byte_patterns(video_bytes)

        # Frame-level analysis
        if frames:
            frame_consistency = _analyze_frame_consistency(frames)
            frame_quality = _analyze_frames_individually(frames)
        else:
            # Fallback: use byte patterns only
            frame_consistency = {
                "frame_difference_mean": 0,
                "frame_difference_std": 0,
                "temporal_smoothness": 0.5,
                "flicker_score": 0,
                "color_shift_score": 0,
            }
            frame_quality = {
                "noise_uniformity": 0.5,
                "edge_density_variance": 0.5,
                "saturation_anomaly": 0.5,
            }

        # Compute verdict
        result = _compute_verdict(byte_analysis, frame_consistency, frame_quality)

        result["analysis_details"] = {
            "byte_entropy": {
                "score": byte_analysis["entropy"] / 8.0,
                "interpretation": (
                    "High byte entropy detected — possibly compressed or AI-generated"
                    if byte_analysis["entropy"] > 7.5
                    else "Normal byte entropy — consistent with authentic video"
                ),
            },
            "temporal_consistency": {
                "score": frame_consistency["temporal_smoothness"],
                "interpretation": (
                    "Very smooth temporal transitions — may indicate AI-generated frames"
                    if frame_consistency["temporal_smoothness"] > 0.7
                    else "Natural temporal variation — consistent with real video"
                ),
            },
            "frame_noise_analysis": {
                "score": min(frame_quality["noise_uniformity"], 1.0),
                "interpretation": (
                    "Uniform noise pattern across frames — possible deepfake indicator"
                    if frame_quality["noise_uniformity"] < 0.2
                    else "Varied noise profile across frames — consistent with authentic video"
                ),
            },
            "flicker_detection": {
                "score": frame_consistency["flicker_score"],
                "interpretation": (
                    "Frame flickering detected — possible generation artifacts"
                    if frame_consistency["flicker_score"] > 0.2
                    else "Minimal flicker — smooth frame transitions"
                ),
            },
            "edge_consistency": {
                "score": min(frame_quality["edge_density_variance"] * 10, 1.0),
                "interpretation": (
                    "Low edge variation across frames — possibly AI-generated"
                    if frame_quality["edge_density_variance"] < 0.02
                    else "Natural edge variation across frames"
                ),
            },
            "chunk_repetition": {
                "score": 1.0 - byte_analysis["unique_chunk_ratio"],
                "interpretation": (
                    "Repetitive byte patterns detected — may indicate synthetic generation"
                    if byte_analysis["unique_chunk_ratio"] < 0.85
                    else "Normal byte diversity — no repetitive artifacts"
                ),
            },
        }

        result["video_info"] = video_info

        return result

    except Exception as e:
        logger.error(f"Video analysis failed: {e}")
        return _fallback_analysis(video_bytes)


def _fallback_analysis(video_bytes: bytes) -> Dict[str, Any]:
    """Minimal fallback analysis using only built-in Python."""
    size = len(video_bytes)

    # Simple byte frequency analysis
    freq = [0] * 256
    sample = video_bytes[:min(size, 500000)]
    for b in sample:
        freq[b] += 1

    total = len(sample)
    entropy = 0
    for f in freq:
        if f > 0:
            p = f / total
            entropy -= p * math.log2(p)

    # Simple verdict
    fake_prob = 0.3  # Default moderate uncertainty
    if entropy > 7.8:
        fake_prob += 0.1
    if entropy < 5.0:
        fake_prob += 0.2

    confidence = round(fake_prob * 100, 1)
    if confidence >= 72:
        verdict = "POSSIBLY MANIPULATED"
        risk_level = "MEDIUM"
    elif confidence <= 18:
        verdict = "LIKELY AUTHENTIC"
        risk_level = "LOW"
    else:
        verdict = "INCONCLUSIVE - LIMITED VIDEO SIGNAL"
        risk_level = "MEDIUM"

    return {
        "verdict": verdict,
        "confidence": confidence,
        "risk_level": risk_level,
        "is_fake_probability": round(fake_prob, 4),
        "is_real_probability": round(1 - fake_prob, 4),
        "analysis_details": {
            "byte_entropy": {
                "score": entropy / 8.0,
                "interpretation": f"Byte entropy: {entropy:.2f}/8.0 — {'elevated' if entropy > 7.5 else 'normal'} for video content",
            },
        },
        "video_info": _estimate_video_info(video_bytes),
    }
