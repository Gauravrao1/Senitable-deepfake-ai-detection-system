"""
Audio Deepfake Detector
Uses spectrogram analysis and ML for detecting voice cloning/synthesis.
Analyzes spectral features, pitch patterns, and temporal characteristics.
"""

import numpy as np
import io
import logging

logger = logging.getLogger(__name__)


def _extract_audio_features(audio_bytes: bytes) -> dict:
    """Extract comprehensive audio features for deepfake detection."""
    try:
        import librosa
        import soundfile as sf

        # Load audio
        audio_data, sr = sf.read(io.BytesIO(audio_bytes))

        # Convert to mono if stereo
        if len(audio_data.shape) > 1:
            audio_data = np.mean(audio_data, axis=1)

        # Ensure float32
        audio_data = audio_data.astype(np.float32)
        duration = len(audio_data) / sr

        # 1. Mel Spectrogram features
        mel_spec = librosa.feature.melspectrogram(y=audio_data, sr=sr, n_mels=128)
        mel_spec_db = librosa.power_to_db(mel_spec, ref=np.max)

        # 2. MFCCs (Mel-frequency cepstral coefficients)
        mfccs = librosa.feature.mfcc(y=audio_data, sr=sr, n_mfcc=13)
        mfcc_mean = np.mean(mfccs, axis=1).tolist()
        mfcc_std = np.std(mfccs, axis=1).tolist()

        # 3. Spectral features
        spectral_centroid = librosa.feature.spectral_centroid(y=audio_data, sr=sr)[0]
        spectral_bandwidth = librosa.feature.spectral_bandwidth(y=audio_data, sr=sr)[0]
        spectral_rolloff = librosa.feature.spectral_rolloff(y=audio_data, sr=sr)[0]
        spectral_contrast = librosa.feature.spectral_contrast(y=audio_data, sr=sr)
        zero_crossing_rate = librosa.feature.zero_crossing_rate(audio_data)[0]

        # 4. Pitch analysis
        pitches, magnitudes = librosa.piptrack(y=audio_data, sr=sr)
        pitch_values = []
        for t in range(pitches.shape[1]):
            index = magnitudes[:, t].argmax()
            pitch = pitches[index, t]
            if pitch > 0:
                pitch_values.append(float(pitch))

        pitch_mean = float(np.mean(pitch_values)) if pitch_values else 0.0
        pitch_std = float(np.std(pitch_values)) if pitch_values else 0.0

        # 5. Temporal features
        rms = librosa.feature.rms(y=audio_data)[0]
        tempo, _ = librosa.beat.beat_track(y=audio_data, sr=sr)

        # 6. Chroma features
        chroma = librosa.feature.chroma_stft(y=audio_data, sr=sr)

        # Generate spectrogram for visualization (downsampled)
        spec_visual = mel_spec_db[:32, :min(mel_spec_db.shape[1], 64)]

        return {
            "duration": round(duration, 2),
            "sample_rate": sr,
            "mfcc_mean": [round(x, 4) for x in mfcc_mean],
            "mfcc_std": [round(x, 4) for x in mfcc_std],
            "spectral_centroid_mean": round(float(np.mean(spectral_centroid)), 2),
            "spectral_centroid_std": round(float(np.std(spectral_centroid)), 2),
            "spectral_bandwidth_mean": round(float(np.mean(spectral_bandwidth)), 2),
            "spectral_rolloff_mean": round(float(np.mean(spectral_rolloff)), 2),
            "spectral_contrast_mean": [round(float(x), 4) for x in np.mean(spectral_contrast, axis=1)],
            "zero_crossing_rate_mean": round(float(np.mean(zero_crossing_rate)), 6),
            "zero_crossing_rate_std": round(float(np.std(zero_crossing_rate)), 6),
            "pitch_mean": round(pitch_mean, 2),
            "pitch_std": round(pitch_std, 2),
            "rms_mean": round(float(np.mean(rms)), 6),
            "rms_std": round(float(np.std(rms)), 6),
            "tempo": round(float(tempo) if np.isscalar(tempo) else float(tempo[0]), 2),
            "chroma_mean": [round(float(x), 4) for x in np.mean(chroma, axis=1)],
            "spectrogram": spec_visual.tolist(),
        }

    except Exception as e:
        logger.error(f"Audio feature extraction failed: {e}")
        return None


def _analyze_deepfake_indicators(features: dict) -> dict:
    """Analyze extracted features for deepfake indicators."""
    indicators = {}

    # 1. MFCC analysis — synthetic voices have different MFCC distributions
    mfcc_std_avg = np.mean(features["mfcc_std"])
    if mfcc_std_avg < 8.0:
        indicators["mfcc_uniformity"] = {
            "score": 0.7,
            "detail": "MFCC coefficients show unusually low variance — synthetic voice indicator"
        }
    elif mfcc_std_avg < 12.0:
        indicators["mfcc_uniformity"] = {
            "score": 0.4,
            "detail": "MFCC variance is moderate"
        }
    else:
        indicators["mfcc_uniformity"] = {
            "score": 0.15,
            "detail": "MFCC variance appears natural"
        }

    # 2. Pitch consistency — cloned voices often have unnaturally consistent pitch
    pitch_variation = features["pitch_std"] / (features["pitch_mean"] + 1e-7)
    if pitch_variation < 0.1:
        indicators["pitch_consistency"] = {
            "score": 0.75,
            "detail": "Pitch is unnaturally consistent — strong cloning indicator"
        }
    elif pitch_variation < 0.25:
        indicators["pitch_consistency"] = {
            "score": 0.4,
            "detail": "Pitch variation is somewhat limited"
        }
    else:
        indicators["pitch_consistency"] = {
            "score": 0.1,
            "detail": "Natural pitch variation detected"
        }

    # 3. Spectral smoothness — synthesized audio often has smoother spectral characteristics
    spectral_cv = features["spectral_centroid_std"] / (features["spectral_centroid_mean"] + 1e-7)
    if spectral_cv < 0.15:
        indicators["spectral_smoothness"] = {
            "score": 0.65,
            "detail": "Spectral characteristics are unusually smooth"
        }
    elif spectral_cv < 0.3:
        indicators["spectral_smoothness"] = {
            "score": 0.35,
            "detail": "Moderate spectral variation"
        }
    else:
        indicators["spectral_smoothness"] = {
            "score": 0.1,
            "detail": "Natural spectral variation detected"
        }

    # 4. Zero-crossing rate analysis
    zcr = features["zero_crossing_rate_mean"]
    if zcr < 0.03:
        indicators["zero_crossing"] = {
            "score": 0.5,
            "detail": "Low zero-crossing rate may indicate synthetic generation"
        }
    else:
        indicators["zero_crossing"] = {
            "score": 0.15,
            "detail": "Zero-crossing rate appears natural"
        }

    # 5. Energy dynamics — synthesized audio may lack natural energy dynamics
    rms_cv = features["rms_std"] / (features["rms_mean"] + 1e-7)
    if rms_cv < 0.3:
        indicators["energy_dynamics"] = {
            "score": 0.55,
            "detail": "Energy dynamics are unusually uniform"
        }
    else:
        indicators["energy_dynamics"] = {
            "score": 0.1,
            "detail": "Natural energy dynamics detected"
        }

    return indicators


def analyze_audio(audio_bytes: bytes) -> dict:
    """
    Main function: Analyze audio for deepfake/voice cloning indicators.
    Returns confidence scores, spectrogram data, and detailed analysis.
    """
    features = _extract_audio_features(audio_bytes)

    if features is None:
        # Fallback: basic analysis without librosa
        return _fallback_analysis(audio_bytes)

    indicators = _analyze_deepfake_indicators(features)

    # Very short clips are often unreliable for robust deepfake decisions.
    if features["duration"] < 2.0:
        return {
            "verdict": "INCONCLUSIVE - AUDIO TOO SHORT",
            "risk_level": "MEDIUM",
            "confidence": 50.0,
            "is_fake_probability": 0.5,
            "is_real_probability": 0.5,
            "decision_policy": "strict_v3",
            "audio_info": {
                "duration_seconds": features["duration"],
                "sample_rate": features["sample_rate"],
                "tempo_bpm": features["tempo"],
            },
            "analysis_details": {
                "note": {
                    "score": 50.0,
                    "interpretation": "Upload at least 2 seconds for reliable voice-cloning analysis.",
                }
            },
            "spectral_features": {
                "mfcc_mean": features["mfcc_mean"],
                "spectral_centroid": features["spectral_centroid_mean"],
                "spectral_bandwidth": features["spectral_bandwidth_mean"],
                "pitch_mean": features["pitch_mean"],
                "pitch_std": features["pitch_std"],
            },
            "spectrogram": features["spectrogram"],
        }

    # Calculate overall probability
    scores = [ind["score"] for ind in indicators.values()]
    weights = [0.25, 0.25, 0.2, 0.15, 0.15]  # mfcc, pitch, spectral, zcr, energy
    fake_probability = sum(s * w for s, w in zip(scores, weights))
    fake_probability = max(0.0, min(1.0, fake_probability))

    # Conservative calibration around uncertainty band.
    if abs(fake_probability - 0.5) < 0.05:
        fake_probability = 0.5

    # Verdict (strict against opposite outcomes):
    # only assign authentic when fake probability is clearly low.
    if fake_probability >= 0.85:
        verdict = "LIKELY SYNTHETIC/CLONED VOICE"
        risk_level = "HIGH"
    elif fake_probability >= 0.72:
        verdict = "SUSPICIOUS — POSSIBLE VOICE MANIPULATION"
        risk_level = "MEDIUM"
    elif fake_probability <= 0.18:
        verdict = "LIKELY AUTHENTIC VOICE"
        risk_level = "LOW"
    else:
        verdict = "INCONCLUSIVE - NEEDS CLEANER OR LONGER AUDIO"
        risk_level = "MEDIUM"

    return {
        "verdict": verdict,
        "risk_level": risk_level,
        "confidence": round(fake_probability * 100, 2),
        "is_fake_probability": round(fake_probability, 4),
        "is_real_probability": round(1 - fake_probability, 4),
        "decision_policy": "strict_v3",
        "audio_info": {
            "duration_seconds": features["duration"],
            "sample_rate": features["sample_rate"],
            "tempo_bpm": features["tempo"],
        },
        "analysis_details": {
            indicator_name: {
                "score": round(data["score"] * 100, 1),
                "interpretation": data["detail"],
            }
            for indicator_name, data in indicators.items()
        },
        "spectral_features": {
            "mfcc_mean": features["mfcc_mean"],
            "spectral_centroid": features["spectral_centroid_mean"],
            "spectral_bandwidth": features["spectral_bandwidth_mean"],
            "pitch_mean": features["pitch_mean"],
            "pitch_std": features["pitch_std"],
        },
        "spectrogram": features["spectrogram"],
    }


def _fallback_analysis(audio_bytes: bytes) -> dict:
    """Fallback analysis when librosa is not available."""
    try:
        import wave
        audio_io = io.BytesIO(audio_bytes)
        with wave.open(audio_io, 'rb') as wav:
            n_channels = wav.getnchannels()
            sample_width = wav.getsampwidth()
            framerate = wav.getframerate()
            n_frames = wav.getnframes()
            duration = n_frames / framerate

            frames = wav.readframes(n_frames)
            audio_data = np.frombuffer(frames, dtype=np.int16).astype(np.float32)

            if n_channels == 2:
                audio_data = audio_data.reshape(-1, 2).mean(axis=1)

            audio_data = audio_data / (np.max(np.abs(audio_data)) + 1e-7)

        # Basic analysis
        rms = np.sqrt(np.mean(audio_data**2))
        zcr = np.mean(np.abs(np.diff(np.sign(audio_data)))) / 2

        fake_prob = 0.5  # Uncertain without full analysis

        return {
            "verdict": "ANALYSIS LIMITED — INSTALL LIBROSA FOR FULL DETECTION",
            "risk_level": "UNKNOWN",
            "confidence": 50.0,
            "is_fake_probability": 0.5,
            "is_real_probability": 0.5,
            "audio_info": {
                "duration_seconds": round(duration, 2),
                "sample_rate": framerate,
            },
            "analysis_details": {
                "note": "Install librosa for comprehensive audio analysis",
                "basic_rms": round(float(rms), 6),
                "basic_zcr": round(float(zcr), 6),
            },
            "spectrogram": [],
        }
    except Exception as e:
        return {"error": f"Could not analyze audio: {str(e)}"}
