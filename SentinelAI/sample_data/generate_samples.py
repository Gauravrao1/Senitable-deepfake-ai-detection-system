from __future__ import annotations

import math
import os
import random
import wave
from pathlib import Path

import numpy as np
from PIL import Image, ImageDraw, ImageFilter


ROOT = Path(__file__).resolve().parent
INPUTS = ROOT / "inputs"


def ensure_dirs() -> None:
    INPUTS.mkdir(parents=True, exist_ok=True)
    (ROOT / "results").mkdir(parents=True, exist_ok=True)


def save_image_authentic(path: Path) -> None:
    width, height = 1024, 768
    image = Image.new("RGB", (width, height))
    pixels = image.load()

    for y in range(height):
        for x in range(width):
            r = int(120 + 70 * math.sin(x / 110.0) + 18 * math.sin(y / 37.0))
            g = int(140 + 55 * math.sin((x + y) / 95.0) + 16 * math.cos(y / 41.0))
            b = int(170 + 35 * math.cos(x / 80.0) + 24 * math.sin(y / 59.0))
            noise = random.randint(-12, 12)
            pixels[x, y] = (
                max(0, min(255, r + noise)),
                max(0, min(255, g + noise // 2)),
                max(0, min(255, b + noise // 3)),
            )

    draw = ImageDraw.Draw(image)
    for offset in range(0, width, 90):
        draw.line((offset, 0, max(0, offset - 120), height), fill=(200, 200, 210), width=2)
    image = image.filter(ImageFilter.GaussianBlur(radius=1.2))
    image.save(path, format="JPEG", quality=92)


def save_image_suspicious(path: Path) -> None:
    width, height = 1024, 768
    image = Image.new("RGB", (width, height))
    pixels = image.load()

    for y in range(height):
        for x in range(width):
            r = int(215 + 8 * math.sin(x / 260.0))
            g = int(50 + 6 * math.sin(y / 280.0))
            b = int(85 + 6 * math.cos((x + y) / 320.0))
            pixels[x, y] = (
                max(0, min(255, r)),
                max(0, min(255, g)),
                max(0, min(255, b)),
            )

    draw = ImageDraw.Draw(image)
    draw.rectangle((210, 180, 810, 660), outline=(255, 255, 255), width=1)
    draw.ellipse((380, 160, 650, 430), outline=(245, 245, 245), width=2)
    draw.line((240, 520, 780, 520), fill=(255, 255, 255), width=1)
    image = image.filter(ImageFilter.GaussianBlur(radius=0.15))
    image.save(path, format="JPEG", quality=95)


def save_text_samples() -> None:
    human_text = (
        "I checked the results twice, and the numbers still looked off. "
        "The first run was noisy, but the second one settled down after I changed the sample file. "
        "It is not perfect, yet it makes sense now, and I can explain why each file behaves the way it does."
    )

    ai_text = (
        "Furthermore, this comprehensive approach is essential for evaluating the overall landscape of the system. "
        "Moreover, it is important to note that the method provides a structured and nuanced framework. "
        "In conclusion, the analysis is designed to facilitate clarity, coherence, and actionable insight."
    )

    (INPUTS / "text_human.txt").write_text(human_text, encoding="utf-8")
    (INPUTS / "text_ai.txt").write_text(ai_text, encoding="utf-8")


def save_audio(path: Path, synthetic: bool) -> None:
    sample_rate = 22050
    duration_seconds = 3.5
    total_samples = int(sample_rate * duration_seconds)
    time_axis = np.linspace(0.0, duration_seconds, total_samples, endpoint=False)

    if synthetic:
        signal = 0.55 * np.sin(2 * np.pi * 220 * time_axis)
    else:
        signal = (
            0.30 * np.sin(2 * np.pi * 180 * time_axis)
            + 0.20 * np.sin(2 * np.pi * 260 * time_axis + 0.5 * np.sin(2 * np.pi * 1.8 * time_axis))
            + 0.08 * np.sin(2 * np.pi * 90 * time_axis * (1.0 + 0.04 * np.sin(2 * np.pi * 0.7 * time_axis)))
        )
        signal += 0.01 * np.random.default_rng(42).normal(size=total_samples)

    signal = np.clip(signal, -0.95, 0.95)
    pcm = (signal * 32767).astype(np.int16)

    with wave.open(str(path), "wb") as wav_file:
        wav_file.setnchannels(1)
        wav_file.setsampwidth(2)
        wav_file.setframerate(sample_rate)
        wav_file.writeframes(pcm.tobytes())


def save_video_stub(path: Path, repetitive: bool) -> None:
    rng = random.Random(99 if repetitive else 17)
    if repetitive:
        payload = (b"SENTINELAI" * 4096) + bytes([7]) * 8192
    else:
        payload = bytes(rng.getrandbits(8) for _ in range(96 * 1024))

    path.write_bytes(payload)


def main() -> None:
    ensure_dirs()
    save_image_authentic(INPUTS / "image_authentic.jpg")
    save_image_suspicious(INPUTS / "image_suspicious.jpg")
    save_text_samples()
    save_audio(INPUTS / "audio_authentic.wav", synthetic=False)
    save_audio(INPUTS / "audio_suspicious.wav", synthetic=True)
    save_video_stub(INPUTS / "video_authentic.webm", repetitive=False)
    save_video_stub(INPUTS / "video_suspicious.webm", repetitive=True)
    print(f"Generated sample files in {INPUTS}")


if __name__ == "__main__":
    main()