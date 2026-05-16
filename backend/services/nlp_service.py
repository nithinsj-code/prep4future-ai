import spacy
from keybert import KeyBERT
from sentence_transformers import SentenceTransformer, util
import os

# Load spaCy model
try:
    nlp = spacy.load("en_core_web_sm")
except:
    # In production/local, this might need to be downloaded
    import subprocess
    subprocess.run(["python", "-m", "spacy", "download", "en_core_web_sm"])
    nlp = spacy.load("en_core_web_sm")

kw_model = KeyBERT()
similarity_model = SentenceTransformer('all-MiniLM-L6-v2')

def extract_keywords(text: str, top_n: int = 10):
    """Extract top keywords from text using KeyBERT."""
    keywords = kw_model.extract_keywords(text, keyphrase_ngram_range=(1, 2), stop_words='english', top_n=top_n)
    return [kw[0] for kw in keywords]

def compute_similarity(text1: str, text2: str) -> float:
    """Compute semantic similarity between two texts."""
    embeddings1 = similarity_model.encode(text1, convert_to_tensor=True)
    embeddings2 = similarity_model.encode(text2, convert_to_tensor=True)
    cosine_scores = util.cos_sim(embeddings1, embeddings2)
    return float(cosine_scores[0][0])
