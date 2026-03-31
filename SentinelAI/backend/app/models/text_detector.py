"""
AI Text Detector
Uses statistical analysis and transformer-based features to detect AI-generated text.
Analyzes perplexity, burstiness, and linguistic patterns.
"""

import re
import math
import logging
from collections import Counter

logger = logging.getLogger(__name__)

_model = None
_tokenizer = None

# Prefer higher-capacity detectors first; gracefully fall back if unavailable.
_MODEL_CANDIDATES = [
    "roberta-large-openai-detector",
    "roberta-base-openai-detector",
]


def _load_model():
    """Load transformer model for text analysis."""
    global _model, _tokenizer
    if _model is not None:
        return _model, _tokenizer

    try:
        from transformers import AutoTokenizer, AutoModelForSequenceClassification

        for model_name in _MODEL_CANDIDATES:
            try:
                _tokenizer = AutoTokenizer.from_pretrained(model_name)
                _model = AutoModelForSequenceClassification.from_pretrained(model_name)
                _model.eval()
                logger.info(f"Text detection model loaded successfully: {model_name}")
                return _model, _tokenizer
            except Exception as inner_e:
                logger.warning(f"Could not load text model '{model_name}': {inner_e}")

        logger.warning("No transformer text detector model could be loaded. Using statistical analysis.")
        return None, None
    except Exception as e:
        logger.warning(f"Could not load transformer model: {e}. Using statistical analysis.")
        return None, None


def _calculate_perplexity_features(text: str) -> dict:
    """Calculate perplexity-related features from text."""
    words = text.split()
    if len(words) < 5:
        return {"avg_word_length": 0, "vocabulary_richness": 0, "hapax_ratio": 0}

    word_lengths = [len(w) for w in words]
    avg_word_length = sum(word_lengths) / len(word_lengths)

    # Vocabulary richness (Type-Token Ratio)
    unique_words = set(w.lower() for w in words)
    vocabulary_richness = len(unique_words) / len(words)

    # Hapax legomena ratio (words appearing only once)
    word_counts = Counter(w.lower() for w in words)
    hapax = sum(1 for count in word_counts.values() if count == 1)
    hapax_ratio = hapax / len(words)

    return {
        "avg_word_length": round(avg_word_length, 3),
        "vocabulary_richness": round(vocabulary_richness, 4),
        "hapax_ratio": round(hapax_ratio, 4),
    }


def _calculate_burstiness(text: str) -> dict:
    """
    Calculate burstiness — AI text tends to have uniform sentence lengths
    while human text varies more.
    """
    sentences = re.split(r'[.!?]+', text)
    sentences = [s.strip() for s in sentences if s.strip()]

    if len(sentences) < 3:
        return {"burstiness_score": 0.5, "sentence_length_std": 0, "avg_sentence_length": 0}

    lengths = [len(s.split()) for s in sentences]
    avg_len = sum(lengths) / len(lengths)
    std_len = math.sqrt(sum((l - avg_len) ** 2 for l in lengths) / len(lengths))

    # Burstiness: coefficient of variation
    burstiness = std_len / (avg_len + 1e-7)

    return {
        "burstiness_score": round(burstiness, 4),
        "sentence_length_std": round(std_len, 2),
        "avg_sentence_length": round(avg_len, 2),
    }


def _analyze_linguistic_patterns(text: str) -> dict:
    """Analyze linguistic patterns that differ between AI and human text."""
    words = text.lower().split()
    total_words = len(words) if words else 1

    # AI text markers — common filler phrases AI models tend to overuse
    ai_markers = [
        "furthermore", "moreover", "additionally", "in conclusion",
        "it is important to note", "it's worth noting", "in today's",
        "in the realm of", "it is essential", "plays a crucial role",
        "in this article", "as we delve", "tapestry", "landscape",
        "comprehensive", "multifaceted", "leverage", "utilize",
        "delve", "crucial", "pivotal", "nuanced", "intricate",
        "facilitate", "encompasses", "subsequently", "noteworthy",
    ]

    text_lower = text.lower()
    ai_marker_count = sum(1 for marker in ai_markers if marker in text_lower)

    # Punctuation diversity
    punctuation = re.findall(r'[^\w\s]', text)
    punct_diversity = len(set(punctuation)) / (len(punctuation) + 1)

    # Contraction usage (humans use more contractions)
    contractions = re.findall(r"\b\w+'\w+\b", text)
    contraction_rate = len(contractions) / total_words

    # Paragraph analysis
    paragraphs = [p.strip() for p in text.split('\n') if p.strip()]
    para_lengths = [len(p.split()) for p in paragraphs]
    para_uniformity = 0
    if len(para_lengths) > 1:
        avg_para = sum(para_lengths) / len(para_lengths)
        para_uniformity = math.sqrt(
            sum((l - avg_para) ** 2 for l in para_lengths) / len(para_lengths)
        ) / (avg_para + 1e-7)

    # Repetition analysis
    bigrams = [f"{words[i]} {words[i+1]}" for i in range(len(words)-1)]
    bigram_counts = Counter(bigrams)
    repeated_bigrams = sum(1 for c in bigram_counts.values() if c > 2)
    repetition_rate = repeated_bigrams / (len(bigrams) + 1)

    return {
        "ai_marker_count": ai_marker_count,
        "punctuation_diversity": round(punct_diversity, 4),
        "contraction_rate": round(contraction_rate, 4),
        "paragraph_uniformity": round(para_uniformity, 4),
        "repetition_rate": round(repetition_rate, 4),
    }


def _calculate_entropy(text: str) -> float:
    """Calculate Shannon entropy of the text."""
    if not text:
        return 0.0
    freq = Counter(text.lower())
    total = len(text)
    entropy = -sum((count / total) * math.log2(count / total) for count in freq.values())
    return round(entropy, 4)


def analyze_text(text: str) -> dict:
    """
    Main function: Analyze text for AI-generation indicators.
    Returns confidence scores and detailed analysis.
    """
    if not text or len(text.strip()) < 20:
        return {"error": "Text too short for meaningful analysis. Please provide at least 20 characters."}

    text = text.strip()
    word_count = len(text.split())

    # Feature extraction
    perplexity_features = _calculate_perplexity_features(text)
    burstiness = _calculate_burstiness(text)
    linguistic = _analyze_linguistic_patterns(text)
    entropy = _calculate_entropy(text)

    # Score calculation
    signals = []

    # Burstiness signal — AI text has low burstiness (uniform sentence lengths)
    burstiness_score = burstiness["burstiness_score"]
    if burstiness_score < 0.3:
        signals.append(0.25)  # Very uniform → likely AI
    elif burstiness_score < 0.5:
        signals.append(0.15)
    else:
        signals.append(0.05)  # High variation → likely human

    # Vocabulary richness — AI tends to have moderate, consistent richness
    vr = perplexity_features["vocabulary_richness"]
    if 0.55 < vr < 0.75:
        signals.append(0.15)  # Suspiciously consistent
    else:
        signals.append(0.05)

    # AI markers
    marker_score = min(linguistic["ai_marker_count"] / 5.0, 1.0)
    signals.append(marker_score * 0.2)

    # Contraction rate — humans use more contractions
    if linguistic["contraction_rate"] < 0.005:
        signals.append(0.15)
    elif linguistic["contraction_rate"] < 0.02:
        signals.append(0.1)
    else:
        signals.append(0.02)

    # Paragraph uniformity
    if linguistic["paragraph_uniformity"] < 0.3:
        signals.append(0.1)
    else:
        signals.append(0.03)

    # Entropy
    if 3.8 < entropy < 4.5:
        signals.append(0.1)  # Typical AI range
    else:
        signals.append(0.03)

    # Repetition
    signals.append(min(linguistic["repetition_rate"] * 2, 0.1))

    ai_probability = sum(signals)
    ai_probability = max(0.0, min(1.0, ai_probability))

    # Try transformer model for enhanced detection
    model, tokenizer = _load_model()
    if model is not None and tokenizer is not None:
        try:
            import torch

            # Run chunked inference to reduce single-window bias on long text.
            chunk_scores = []
            step = 380
            chunk_size = 480
            for start in range(0, len(text), step):
                chunk = text[start:start + chunk_size]
                if len(chunk.strip()) < 40:
                    continue
                inputs = tokenizer(
                    chunk,
                    return_tensors="pt",
                    truncation=True,
                    max_length=512,
                    padding=True,
                )
                with torch.no_grad():
                    outputs = model(**inputs)
                    probs = torch.softmax(outputs.logits, dim=1)
                    chunk_scores.append(probs[0][1].item())
                if len(chunk_scores) >= 6:
                    break

            if chunk_scores:
                nn_ai_prob = float(sum(chunk_scores) / len(chunk_scores))
                # Heuristic + NN blend, weighted more toward detector model.
                ai_probability = 0.30 * ai_probability + 0.70 * nn_ai_prob
        except Exception as e:
            logger.warning(f"Transformer inference failed: {e}")

    # Conservative calibration: push weak evidence toward uncertainty.
    distance_from_mid = abs(ai_probability - 0.5)
    if distance_from_mid < 0.12:
        ai_probability = 0.5

    # Short text is less reliable for hard decisions.
    if word_count < 40 and 0.12 < ai_probability < 0.88:
        ai_probability = 0.5

    # Verdict (strict against opposite outcomes):
    # only assign human when AI probability is clearly low.
    if ai_probability >= 0.86:
        verdict = "LIKELY AI-GENERATED"
        risk_level = "HIGH"
    elif ai_probability >= 0.72:
        verdict = "POSSIBLY AI-ASSISTED"
        risk_level = "MEDIUM"
    elif ai_probability <= 0.18:
        verdict = "LIKELY HUMAN-WRITTEN"
        risk_level = "LOW"
    else:
        verdict = "INCONCLUSIVE - NEEDS LONGER OR HIGHER-QUALITY TEXT"
        risk_level = "MEDIUM"

    # Per-sentence breakdown
    sentences = re.split(r'(?<=[.!?])\s+', text)
    sentence_analysis = []
    for sent in sentences[:20]:  # Limit to 20 sentences
        sent_words = sent.split()
        sent_ai_score = 0.0
        # Short simple heuristic per sentence
        if len(sent_words) > 3:
            ai_word_count = sum(1 for w in ["furthermore", "moreover", "crucial", "comprehensive",
                                             "leverage", "facilitate", "delve", "nuanced"]
                                if w in sent.lower())
            has_contraction = bool(re.search(r"\b\w+'\w+\b", sent))
            sent_ai_score = min(ai_word_count * 0.2, 0.6)
            if not has_contraction and len(sent_words) > 10:
                sent_ai_score += 0.15
            sent_ai_score = min(sent_ai_score, 1.0)

        sentence_analysis.append({
            "text": sent[:100] + ("..." if len(sent) > 100 else ""),
            "ai_probability": round(sent_ai_score, 3),
        })

    return {
        "verdict": verdict,
        "risk_level": risk_level,
        "confidence": round(ai_probability * 100, 2),
        "is_ai_probability": round(ai_probability, 4),
        "is_human_probability": round(1 - ai_probability, 4),
        "decision_policy": "strict_v3",
        "word_count": word_count,
        "analysis_details": {
            "perplexity_features": perplexity_features,
            "burstiness": burstiness,
            "linguistic_patterns": linguistic,
            "entropy": entropy,
        },
        "sentence_analysis": sentence_analysis,
    }
