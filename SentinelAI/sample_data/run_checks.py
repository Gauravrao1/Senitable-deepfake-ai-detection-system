from __future__ import annotations

import json
from pathlib import Path

import httpx


ROOT = Path(__file__).resolve().parent
INPUTS = ROOT / "inputs"
RESULTS = ROOT / "results"
API_BASE_URL = "http://localhost:8000/api/v1"


SAMPLES = [
    ("image", INPUTS / "image_authentic.jpg", "image/jpeg", "/image/analyze"),
    ("image", INPUTS / "image_suspicious.jpg", "image/jpeg", "/image/analyze"),
    ("text", INPUTS / "text_human.txt", None, "/text/analyze"),
    ("text", INPUTS / "text_ai.txt", None, "/text/analyze"),
    ("audio", INPUTS / "audio_authentic.wav", "audio/wav", "/audio/analyze"),
    ("audio", INPUTS / "audio_suspicious.wav", "audio/wav", "/audio/analyze"),
    ("video", INPUTS / "video_authentic.webm", "video/webm", "/video/analyze"),
    ("video", INPUTS / "video_suspicious.webm", "video/webm", "/video/analyze"),
]


def post_sample(client: httpx.Client, kind: str, sample_path: Path, mime: str | None, endpoint: str) -> dict:
    if kind == "text":
        payload = {"text": sample_path.read_text(encoding="utf-8")}
        response = client.post(f"{API_BASE_URL}{endpoint}", json=payload)
    else:
        with sample_path.open("rb") as file_handle:
            files = {"file": (sample_path.name, file_handle, mime or "application/octet-stream")}
            response = client.post(f"{API_BASE_URL}{endpoint}", files=files)

    try:
        body = response.json()
    except Exception:
        body = {"raw": response.text}

    result = {
        "file": sample_path.name,
        "type": kind,
        "status_code": response.status_code,
        "response": body,
    }

    if isinstance(body, dict):
        analysis = body.get("analysis", body)
        if isinstance(analysis, dict):
            if kind == "text":
                result["yes_percentage"] = analysis.get("is_ai_probability")
                result["no_percentage"] = analysis.get("is_human_probability")
            else:
                result["yes_percentage"] = analysis.get("is_fake_probability")
                result["no_percentage"] = analysis.get("is_real_probability")
            result["verdict"] = analysis.get("verdict")

    return result


def main() -> None:
    RESULTS.mkdir(parents=True, exist_ok=True)
    results = []

    with httpx.Client(timeout=120) as client:
        for kind, sample_path, mime, endpoint in SAMPLES:
            results.append(post_sample(client, kind, sample_path, mime, endpoint))

    output_path = RESULTS / "analysis_results.json"
    output_path.write_text(json.dumps(results, indent=2), encoding="utf-8")

    for item in results:
        yes = item.get("yes_percentage")
        no = item.get("no_percentage")
        verdict = item.get("verdict")
        print(f"{item['file']}: yes={yes} no={no} verdict={verdict}")

    print(f"Saved results to {output_path}")


if __name__ == "__main__":
    main()