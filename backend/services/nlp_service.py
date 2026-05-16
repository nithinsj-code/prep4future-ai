import math
import re
from collections import Counter


STOP_WORDS = {
    "a", "an", "and", "are", "as", "at", "be", "by", "for", "from",
    "has", "have", "in", "is", "it", "of", "on", "or", "that", "the",
    "this", "to", "with", "you", "your", "we", "our", "will", "can",
    "using", "use", "used", "work", "working", "experience", "role",
}


def _tokenize(text: str) -> list[str]:
    words = re.findall(r"[a-zA-Z][a-zA-Z0-9+#.-]*", text.lower())
    return [word for word in words if len(word) > 2 and word not in STOP_WORDS]


def _cosine_similarity(tokens1: list[str], tokens2: list[str]) -> float:
    counts1 = Counter(tokens1)
    counts2 = Counter(tokens2)
    common_terms = set(counts1) & set(counts2)

    numerator = sum(counts1[term] * counts2[term] for term in common_terms)
    norm1 = math.sqrt(sum(value * value for value in counts1.values()))
    norm2 = math.sqrt(sum(value * value for value in counts2.values()))

    if not norm1 or not norm2:
        return 0.0

    return numerator / (norm1 * norm2)


def compute_similarity(text1: str, text2: str) -> float:
    """Compute a lightweight resume/JD similarity score without heavy ML deps."""
    tokens1 = _tokenize(text1)
    tokens2 = _tokenize(text2)
    return _cosine_similarity(tokens1, tokens2)
