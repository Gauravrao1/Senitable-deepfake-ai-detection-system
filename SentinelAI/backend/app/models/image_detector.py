"""
Image Deepfake Detector
Uses signal-based forensic analysis for detecting AI-generated/manipulated images.
Generates manipulation heatmaps from local artifact patterns.
"""

import numpy as np
from PIL import Image
import io
import logging

logger = logging.getLogger(__name__)


def _preprocess_image(image_bytes: bytes) -> np.ndarray:
    """Preprocess image for model input."""
    image = Image.open(io.BytesIO(image_bytes)).convert("RGB")
    image = image.resize((224, 224))
    img_array = np.array(image, dtype=np.float32) / 255.0
    return img_array


def _analyze_pixel_patterns(img_array: np.ndarray) -> dict:
    """Analyze pixel-level patterns for deepfake indicators."""
    # Noise analysis
    from scipy import ndimage
    gray = np.mean(img_array, axis=2)
    noise = gray - ndimage.uniform_filter(gray, size=3)
    noise_level = np.std(noise)

    # Edge consistency analysis
    edges_x = ndimage.sobel(gray, axis=0)
    edges_y = ndimage.sobel(gray, axis=1)
    edge_magnitude = np.hypot(edges_x, edges_y)
    edge_consistency = np.std(edge_magnitude) / (np.mean(edge_magnitude) + 1e-7)

    # Color distribution analysis
    color_std = np.std(img_array, axis=(0, 1))
    color_uniformity = np.mean(color_std)

    # Frequency domain analysis (DCT-like)
    fft = np.fft.fft2(gray)
    fft_shift = np.fft.fftshift(fft)
    magnitude_spectrum = np.log(np.abs(fft_shift) + 1)
    freq_energy_ratio = np.mean(magnitude_spectrum[:gray.shape[0]//4, :gray.shape[1]//4]) / \
                        (np.mean(magnitude_spectrum) + 1e-7)

    # Symmetry analysis
    h_symmetry = np.mean(np.abs(gray - np.fliplr(gray)))
    v_symmetry = np.mean(np.abs(gray - np.flipud(gray)))

    return {
        "noise_level": float(noise_level),
        "edge_consistency": float(edge_consistency),
        "color_uniformity": float(color_uniformity),
        "freq_energy_ratio": float(freq_energy_ratio),
        "h_symmetry": float(h_symmetry),
        "v_symmetry": float(v_symmetry),
    }


def _generate_heatmap(img_array: np.ndarray) -> list:
    """Generate manipulation probability heatmap."""
    from scipy import ndimage

    h, w = img_array.shape[:2]
    heatmap = np.zeros((h, w))

    gray = np.mean(img_array, axis=2)

    # Noise-based heatmap
    noise = gray - ndimage.uniform_filter(gray, size=5)
    noise_map = np.abs(noise)
    noise_map = (noise_map - noise_map.min()) / (noise_map.max() - noise_map.min() + 1e-7)

    # Edge inconsistency heatmap
    edges_x = ndimage.sobel(gray, axis=0)
    edges_y = ndimage.sobel(gray, axis=1)
    edge_map = np.hypot(edges_x, edges_y)
    edge_local_std = ndimage.generic_filter(edge_map, np.std, size=11)
    edge_local_std = (edge_local_std - edge_local_std.min()) / (edge_local_std.max() - edge_local_std.min() + 1e-7)

    # Color anomaly heatmap
    color_mean = ndimage.uniform_filter(img_array, size=(11, 11, 1))
    color_diff = np.mean(np.abs(img_array - color_mean), axis=2)
    color_diff = (color_diff - color_diff.min()) / (color_diff.max() - color_diff.min() + 1e-7)

    # Combine heatmaps
    heatmap = 0.4 * noise_map + 0.35 * edge_local_std + 0.25 * color_diff
    heatmap = (heatmap - heatmap.min()) / (heatmap.max() - heatmap.min() + 1e-7)

    # Downsample for JSON response (32x32 grid)
    from scipy.ndimage import zoom
    scale_h = 32 / h
    scale_w = 32 / w
    heatmap_small = zoom(heatmap, (scale_h, scale_w))

    return heatmap_small.tolist()


def analyze_image(image_bytes: bytes) -> dict:
    """
    Main function: Analyze an image for deepfake/AI-generation indicators.
    Returns confidence scores, heatmap, and detailed analysis.
    """
    try:
        img_array = _preprocess_image(image_bytes)
    except Exception as e:
        return {"error": f"Invalid image file: {str(e)}"}

    # Pixel-level analysis
    pixel_analysis = _analyze_pixel_patterns(img_array)

    # Score from forensic signals only.
    # Important: avoid untrained NN heads because they produce unstable outputs.
    noise_score = 1.0 - min(pixel_analysis["noise_level"] / 0.1, 1.0)
    edge_score = min(pixel_analysis["edge_consistency"] / 2.0, 1.0)
    color_score = 1.0 - min(pixel_analysis["color_uniformity"] / 0.3, 1.0)
    freq_score = min(abs(pixel_analysis["freq_energy_ratio"] - 1.5) / 1.5, 1.0)
    sym_score = 1.0 - min((pixel_analysis["h_symmetry"] + pixel_analysis["v_symmetry"]) / 0.2, 1.0)

    weighted_signals = [
        noise_score * 0.28,
        edge_score * 0.22,
        color_score * 0.20,
        freq_score * 0.20,
        sym_score * 0.10,
    ]

    fake_probability = sum(weighted_signals)
    fake_probability = max(0.0, min(1.0, fake_probability))

    # If all signals agree weakly, avoid hard claims.
    if np.std([noise_score, edge_score, color_score, freq_score, sym_score]) < 0.06:
        fake_probability = 0.5

    # Generate heatmap
    heatmap = _generate_heatmap(img_array)

    # Conservative calibration around uncertainty band.
    if abs(fake_probability - 0.5) < 0.12:
        fake_probability = 0.5

    # Determine verdict (strict against opposite outcomes):
    # only assign authentic when fake probability is clearly low.
    if fake_probability >= 0.85:
        verdict = "LIKELY AI-GENERATED/MANIPULATED"
        risk_level = "HIGH"
    elif fake_probability >= 0.72:
        verdict = "SUSPICIOUS - POSSIBLE MANIPULATION"
        risk_level = "MEDIUM"
    elif fake_probability <= 0.18:
        verdict = "LIKELY AUTHENTIC"
        risk_level = "LOW"
    else:
        verdict = "INCONCLUSIVE - NEEDS HIGHER-QUALITY IMAGE"
        risk_level = "MEDIUM"

    return {
        "verdict": verdict,
        "risk_level": risk_level,
        "confidence": round(fake_probability * 100, 2),
        "is_fake_probability": round(fake_probability, 4),
        "is_real_probability": round(1 - fake_probability, 4),
        "decision_policy": "strict_v3",
        "analysis_details": {
            "noise_analysis": {
                "score": round(pixel_analysis["noise_level"], 4),
                "interpretation": "Low noise uniformity suggests possible AI generation"
                if pixel_analysis["noise_level"] < 0.03
                else "Normal noise patterns detected",
            },
            "edge_consistency": {
                "score": round(pixel_analysis["edge_consistency"], 4),
                "interpretation": "Edge patterns show inconsistencies"
                if pixel_analysis["edge_consistency"] > 1.5
                else "Edge patterns appear natural",
            },
            "color_distribution": {
                "score": round(pixel_analysis["color_uniformity"], 4),
                "interpretation": "Unusual color distribution detected"
                if pixel_analysis["color_uniformity"] < 0.1
                else "Color distribution appears natural",
            },
            "frequency_analysis": {
                "score": round(pixel_analysis["freq_energy_ratio"], 4),
                "interpretation": "Frequency spectrum anomalies detected"
                if abs(pixel_analysis["freq_energy_ratio"] - 1.5) > 0.8
                else "Frequency spectrum appears normal",
            },
        },
        "heatmap": heatmap,
    }
