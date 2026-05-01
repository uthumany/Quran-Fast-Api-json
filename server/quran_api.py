"""
Quran-Api: FastAPI-based Quran JSON API with audio synchronization and multi-script support.
"""
import json
import os
from fastapi import FastAPI, HTTPException, Query
from fastapi.middleware.cors import CORSMiddleware
from typing import Optional, Dict, Any, List
import logging

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

app = FastAPI(
    title="Quran-Api",
    description="A comprehensive Quran JSON API with metadata, audio reciters, word-by-word synchronization, and multi-script support.",
    version="1.0.0"
)

# Add CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Data directory
DATA_DIR = os.path.join(os.path.dirname(__file__), "../data")

# Global data cache
_quran_data = None
_reciters_data = None
_word_by_word_data = None
_scripts_data = {}

def load_json_file(filename: str) -> Dict[str, Any]:
    """Load a JSON file from the data directory."""
    filepath = os.path.join(DATA_DIR, filename)
    try:
        with open(filepath, 'r', encoding='utf-8') as f:
            return json.load(f)
    except FileNotFoundError:
        logger.error(f"File not found: {filepath}")
        raise HTTPException(status_code=500, detail=f"Data file not found: {filename}")
    except json.JSONDecodeError as e:
        logger.error(f"JSON decode error in {filename}: {e}")
        raise HTTPException(status_code=500, detail=f"Invalid JSON in {filename}")

def get_quran_data() -> Dict[str, Any]:
    """Get Quran data with lazy loading."""
    global _quran_data
    if _quran_data is None:
        _quran_data = load_json_file("quran_complete.json")
    return _quran_data

def get_reciters_data() -> Dict[str, Any]:
    """Get reciters data with lazy loading."""
    global _reciters_data
    if _reciters_data is None:
        _reciters_data = load_json_file("quran_reciters.json")
    return _reciters_data

def get_word_by_word_data() -> Dict[str, Any]:
    """Get word-by-word synchronization data with lazy loading."""
    global _word_by_word_data
    if _word_by_word_data is None:
        _word_by_word_data = load_json_file("qpc-hafs-word-by-word.json")
    return _word_by_word_data

def get_script_data(script_type: str) -> Dict[str, Any]:
    """Get script/font data with lazy loading."""
    if script_type not in _scripts_data:
        script_files = {
            "hafs": "qpc-hafs-word-by-word.json",
            "digital-khatt-v2": "digital-khatt-v2.json",
            "nastaleeq": "qpc-nastaleeq.json",
            "qpc-v4": "qpc-v4.json",
            "uthmani-simple": "uthmani-simple.json"
        }
        if script_type not in script_files:
            raise HTTPException(status_code=400, detail=f"Unknown script type: {script_type}")
        _scripts_data[script_type] = load_json_file(script_files[script_type])
    return _scripts_data[script_type]

# ==================== Root Endpoints ====================

@app.get("/")
async def root():
    """Welcome endpoint with API information."""
    return {
        "name": "Quran-Api",
        "version": "1.0.0",
        "description": "A comprehensive Quran JSON API",
        "endpoints": {
            "quran_metadata": "/api/quran",
            "all_surahs": "/api/quran/surahs",
            "surah_detail": "/api/quran/surah/{surah_id}",
            "ayah_detail": "/api/quran/ayah/{surah_id}/{ayah_id}",
            "reciters": "/api/reciters",
            "reciter_detail": "/api/reciters/{reciter_id}",
            "word_by_word": "/api/word-by-word/{surah_id}/{ayah_id}",
            "scripts": "/api/scripts/{script_type}/{surah_id}/{ayah_id}",
            "available_scripts": "/api/scripts/available",
            "search": "/api/search",
            "transcribe": "/api/transcribe",
            "caption": "/api/caption"
        }
    }

@app.get("/health")
async def health():
    """Health check endpoint."""
    return {"status": "healthy"}

# ==================== Quran Endpoints ====================

@app.get("/api/quran")
async def get_quran_metadata():
    """Get Quran metadata including total surahs, verses, and words."""
    quran = get_quran_data()
    return {
        "total_surahs": quran.get("total_surahs"),
        "total_meccan_surahs": quran.get("total_meccan_surahs"),
        "total_medinan_surahs": quran.get("total_medinan_surahs"),
        "total_verses": quran.get("total_verses"),
        "number_of_words": quran.get("number_of_words"),
        "number_of_unique_words": quran.get("number_of_unique_words"),
        "number_of_stems": quran.get("number_of_stems"),
        "number_of_lemmas": quran.get("number_of_lemmas"),
        "number_of_roots": quran.get("number_of_roots")
    }

@app.get("/api/quran/surahs")
async def get_all_surahs_list():
    """Get a list of all Surahs with basic metadata."""
    quran = get_quran_data()
    chapters = quran.get("chapters", {})
    
    surahs_list = []
    for surah_id in sorted(chapters.keys(), key=lambda x: int(x)):
        surah = chapters[surah_id]
        surahs_list.append({
            "id": surah.get("id"),
            "surah_name": surah.get("surah_name"),
            "surah_name_ar": surah.get("surah_name_ar"),
            "translation": surah.get("translation"),
            "type": surah.get("type"),
            "total_verses": surah.get("total_verses")
        })
    
    return {"surahs": surahs_list}

@app.get("/api/quran/surah/{surah_id}")
async def get_surah(surah_id: int):
    """Get a complete Surah with all verses and metadata."""
    quran = get_quran_data()
    chapters = quran.get("chapters", {})
    
    surah_key = str(surah_id)
    if surah_key not in chapters:
        raise HTTPException(status_code=404, detail=f"Surah {surah_id} not found")
    
    surah = chapters[surah_key]
    return {
        "id": surah.get("id"),
        "surah_name": surah.get("surah_name"),
        "surah_name_ar": surah.get("surah_name_ar"),
        "translation": surah.get("translation"),
        "type": surah.get("type"),
        "total_verses": surah.get("total_verses"),
        "description": surah.get("description"),
        "verses": surah.get("verses", {})
    }

@app.get("/api/quran/ayah/{surah_id}/{ayah_id}")
async def get_ayah(surah_id: int, ayah_id: int):
    """Get a specific Ayah with Arabic text, English translation, and transliteration."""
    quran = get_quran_data()
    chapters = quran.get("chapters", {})
    
    surah_key = str(surah_id)
    if surah_key not in chapters:
        raise HTTPException(status_code=404, detail=f"Surah {surah_id} not found")
    
    surah = chapters[surah_key]
    verses = surah.get("verses", {})
    ayah_key = str(ayah_id)
    
    if ayah_key not in verses:
        raise HTTPException(status_code=404, detail=f"Ayah {ayah_id} not found in Surah {surah_id}")
    
    ayah = verses[ayah_key]
    return {
        "surah_id": surah_id,
        "ayah_id": ayah_id,
        "surah_name": surah.get("surah_name"),
        "surah_name_ar": surah.get("surah_name_ar"),
        "arabic_text": ayah.get("content"),
        "english_translation": ayah.get("translation_eng"),
        "transliteration": ayah.get("transliteration")
    }

# ==================== Reciters Endpoints ====================

@app.get("/api/reciters")
async def get_reciters():
    """Get all reciters with full metadata (Arabic/Transliterated names, IDs, Moshaf details)."""
    reciters = get_reciters_data()
    return {
        "total": reciters.get("total"),
        "reciters": reciters.get("reciters", [])
    }

@app.get("/api/reciters/{reciter_id}")
async def get_reciter(reciter_id: int):
    """Get a specific reciter's details including all Moshaf metadata."""
    reciters = get_reciters_data()
    reciters_list = reciters.get("reciters", [])
    
    for reciter in reciters_list:
        if reciter.get("id") == reciter_id:
            return reciter
    
    raise HTTPException(status_code=404, detail=f"Reciter {reciter_id} not found")

# ==================== Word-by-Word Synchronization Endpoints ====================

@app.get("/api/word-by-word/{surah_id}/{ayah_id}")
async def get_word_by_word(surah_id: int, ayah_id: int):
    """Get word-by-word synchronization data for an Ayah with real-time highlighting support."""
    wbw_data = get_word_by_word_data()
    
    ayah_words = []
    prefix = f"{surah_id}:{ayah_id}:"
    
    # Sort keys to ensure word order
    sorted_keys = sorted([k for k in wbw_data.keys() if k.startswith(prefix)], 
                         key=lambda x: int(x.split(':')[-1]))
    
    for key in sorted_keys:
        ayah_words.append(wbw_data[key])
    
    if not ayah_words:
        raise HTTPException(status_code=404, detail=f"Word-by-word data not found for {surah_id}:{ayah_id}")
    
    return {
        "surah_id": surah_id,
        "ayah_id": ayah_id,
        "words": ayah_words
    }

# ==================== Multi-Script Endpoints ====================

@app.get("/api/scripts/available")
async def get_available_scripts():
    """Get list of available Arabic fonts and scripts for dynamic switching."""
    return {
        "scripts": [
            {"type": "hafs", "name": "KFGQPC Hafs", "description": "Standard Hafs script"},
            {"type": "digital-khatt-v2", "name": "Digital Khatt V2", "description": "Modern digital script"},
            {"type": "nastaleeq", "name": "QPC Nastaleeq", "description": "Indo-Pak style script"},
            {"type": "qpc-v4", "name": "QPC V4", "description": "Latest QPC script"},
            {"type": "uthmani-simple", "name": "Uthmani Simple", "description": "Simplified Uthmani script"}
        ]
    }

@app.get("/api/scripts/{script_type}/{surah_id}/{ayah_id}")
async def get_script_ayah(script_type: str, surah_id: int, ayah_id: int):
    """Get Ayah text in a specific script/font for dynamic styling."""
    script_data = get_script_data(script_type)
    
    ayah_words = []
    prefix = f"{surah_id}:{ayah_id}:"
    
    sorted_keys = sorted([k for k in script_data.keys() if k.startswith(prefix)], 
                         key=lambda x: int(x.split(':')[-1]))
    
    for key in sorted_keys:
        ayah_words.append(script_data[key])
    
    if not ayah_words:
        raise HTTPException(status_code=404, detail=f"Script data not found for {surah_id}:{ayah_id}")
    
    return {
        "surah_id": surah_id,
        "ayah_id": ayah_id,
        "script_type": script_type,
        "words": ayah_words
    }

# ==================== Search Endpoints ====================

@app.get("/api/search")
async def search_quran(q: str = Query(..., min_length=2)):
    """Search the Quran for verses containing specific text."""
    quran = get_quran_data()
    chapters = quran.get("chapters", {})
    
    q_lower = q.lower()
    results = []
    
    for surah_id, surah in chapters.items():
        verses = surah.get("verses", {})
        for ayah_id, ayah in verses.items():
            content = ayah.get("content", "").lower()
            translation = ayah.get("translation_eng", "").lower()
            
            if q_lower in content or q_lower in translation:
                results.append({
                    "surah_id": int(surah_id),
                    "ayah_id": int(ayah_id),
                    "surah_name": surah.get("surah_name"),
                    "arabic_text": ayah.get("content"),
                    "english_translation": ayah.get("translation_eng")
                })
    
    return {
        "query": q,
        "count": len(results),
        "results": results[:100]
    }

# ==================== Media Services Endpoints ====================

@app.get("/api/transcribe")
async def transcribe_audio(audio_url: str = Query(...)):
    """Deliver Qur’an recitation transcription (Placeholder for Whisper integration)."""
    return {
        "status": "implemented_placeholder",
        "message": "Transcription service for Quranic recitation",
        "audio_url": audio_url,
        "model": "tarteel-ai/whisper-base-ar-quran"
    }

@app.get("/api/caption")
async def caption_audio(audio_url: str = Query(...)):
    """Deliver Qur’an audio captioning (Placeholder for AI captioning service)."""
    return {
        "status": "implemented_placeholder",
        "message": "Audio captioning service for Quranic recitation",
        "audio_url": audio_url
    }

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
