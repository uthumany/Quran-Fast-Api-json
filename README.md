# Quran-Api: The Holy Quran JSON API Platform

**A comprehensive, production-ready FastAPI-based Quran JSON API with interactive frontend, audio recitations, word-by-word synchronization, and multi-script support.**

## 📖 Table of Contents

- [Overview](#overview)
- [Features](#features)
- [Quick Start](#quick-start)
- [Architecture](#architecture)
- [API Endpoints](#api-endpoints)
- [Frontend Implementation](#frontend-implementation)
- [Supported Scripts](#supported-scripts)
- [Audio Recitations](#audio-recitations)
- [Word-by-Word Synchronization](#word-by-word-synchronization)
- [Setup Instructions](#setup-instructions)
- [Progressive Web App (PWA)](#progressive-web-app-pwa)
- [Deployment Guide](#deployment-guide)
- [Usage Examples](#usage-examples)
- [Project Structure](#project-structure)
- [Contributing](#contributing)
- [License](#license)

---

## Overview

**Quran-Api** is a full-stack platform that provides developers and end-users with comprehensive access to the Holy Quran through a modern RESTful API and interactive web interface. The platform serves rich Quranic data including Arabic text (Uthmani script), English translations, transliterations, and audio recitations from 238 renowned reciters worldwide.

Built with **FastAPI** for the backend and **React 19** with **Tailwind CSS** for the frontend, Quran-Api delivers a seamless experience for exploring, searching, and listening to the Quran with advanced features like word-by-word audio synchronization and multiple script rendering options.

---

## Features

### 🕌 Core Quranic Data
- **Complete Quran**: All 114 Surahs with full metadata
- **Arabic Text**: Uthmani script with diacritical marks
- **English Translation**: Accurate English rendering of all verses
- **Transliteration**: Romanized transliteration for pronunciation guidance
- **Metadata**: Surah names (Arabic & English), verse counts, revelation type (Meccan/Medinan)

### 🎙️ Audio Recitations
- **238 Reciters**: Access audio from renowned Quranic reciters worldwide
- **Multiple Moshaf Versions**: Different recitation styles and speeds
- **Direct Audio URLs**: Stream audio directly from CDN servers
- **Reciter Metadata**: Arabic names, transliterations, and detailed moshaf information

### ⚡ Advanced Features
- **Word-by-Word Synchronization**: Timing and position data for active word highlighting during playback
- **Multi-Script Support**: Switch between 5 different Quranic scripts and fonts:
  - KFGQPC Hafs
  - Digital Khatt V2
  - QPC Nastaleeq
  - QPC V4 with Tajweed color coding
  - Uthmani Simple
- **Full-Text Search**: Search verses by Arabic text or English translation
- **Verse Reference Search**: Find verses by Surah and Ayah number
- **Tafsir Integration**: Access to classical Islamic commentary

### 🎨 Frontend Capabilities
- **RTL Arabic Display**: Proper right-to-left rendering of Arabic text
- **LTR English Panel**: Left-to-right English translation display
- **Transliteration Layout**: Separate panel for romanized text
- **Active-Word Highlighting**: CSS-based highlighting class for synchronized audio playback
- **Responsive Design**: Mobile-friendly interface for all devices
- **Dark/Light Theme Support**: User-preferred color scheme

### 🔍 Developer-Friendly API
- **RESTful Endpoints**: Clean, intuitive API design
- **CORS Enabled**: Full cross-origin support for web applications
- **JSON Responses**: Structured, parseable data format
- **Error Handling**: Comprehensive error messages and HTTP status codes
- **Rate Limiting Ready**: Infrastructure for implementing rate limits

---

## Quick Start

### Prerequisites
- Node.js 18+ and pnpm
- Python 3.8+
- Git

### Installation

```bash
# Clone the repository
git clone https://github.com/uthumany/Quran-Api.git
cd Quran-Api

# Install frontend dependencies
cd client
pnpm install

# Install backend dependencies
cd ../server
pip install -r requirements.txt

# Start the development server
cd ..
pnpm dev
```

### Running the Backend API

```bash
# From the project root
python server/quran_api.py

# The API will be available at http://localhost:8000
# API documentation: http://localhost:8000/docs
```

### Accessing the Frontend

```bash
# The frontend will be available at http://localhost:3000
```

---

## Architecture

### Backend Stack
- **Framework**: FastAPI (Python)
- **Server**: Uvicorn
- **Data Format**: JSON
- **CORS**: Enabled for all origins

### Frontend Stack
- **Framework**: React 19
- **Styling**: Tailwind CSS 4
- **State Management**: React Hooks + tRPC
- **Routing**: Wouter
- **UI Components**: shadcn/ui

### Data Sources
All data is sourced from the provided JSON files:
- `quran_complete.json` - Complete Quran with metadata, Arabic, English, and transliteration
- `quran_reciters.json` - 238 reciters with full metadata and audio URLs
- `qpc-hafs-word-by-word.json` - Word-by-word synchronization data
- `digital-khatt-v2.json`, `qpc-nastaleeq.json`, `qpc-v4.json`, `uthmani-simple.json` - Alternative scripts

---

## API Endpoints

### Base URL
```
http://localhost:8000/api
```

### Quran Endpoints

#### Get Quran Metadata
```http
GET /api/quran
```
Returns overall Quran statistics including total Surahs, verses, and words.

**Response:**
```json
{
  "total_surahs": 114,
  "total_meccan_surahs": 86,
  "total_medinan_surahs": 28,
  "total_verses": 6236,
  "number_of_words": 77797
}
```

#### Get All Surahs
```http
GET /api/quran/surahs
```
Retrieves a list of all 114 Surahs with basic metadata.

**Response:**
```json
{
  "surahs": [
    {
      "id": 1,
      "surah_name": "AL-FĀTIḤAH",
      "surah_name_ar": "الفاتحة",
      "translation": "THE OPENING",
      "type": "meccan",
      "total_verses": 7
    }
  ]
}
```

#### Get Specific Surah
```http
GET /api/quran/surah/{surah_id}
```
Retrieves a complete Surah with all verses.

**Example:**
```http
GET /api/quran/surah/1
```

**Response:**
```json
{
  "id": 1,
  "surah_name": "AL-FĀTIḤAH",
  "surah_name_ar": "الفاتحة",
  "translation": "THE OPENING",
  "type": "meccan",
  "total_verses": 7,
  "verses": {
    "1": {
      "id": 1.1,
      "content": "بِسمِ اللَّهِ الرَّحمٰنِ الرَّحيمِ",
      "translation_eng": "In the Name of Allah, the All-beneficent, the All-merciful.",
      "transliteration": "bi-smi llāhi r-raḥmāni r-raḥīmi"
    }
  }
}
```

#### Get Specific Ayah
```http
GET /api/quran/ayah/{surah_id}/{ayah_id}
```
Retrieves a specific verse with Arabic, English, and transliteration.

**Example:**
```http
GET /api/quran/ayah/1/1
```

**Response:**
```json
{
  "surah_id": 1,
  "ayah_id": 1,
  "surah_name": "AL-FĀTIḤAH",
  "surah_name_ar": "الفاتحة",
  "content": "بِسمِ اللَّهِ الرَّحمٰنِ الرَّحيمِ",
  "translation_eng": "In the Name of Allah, the All-beneficent, the All-merciful.",
  "transliteration": "bi-smi llāhi r-raḥmāni r-raḥīmi"
}
```

#### Search Quran
```http
GET /api/search?q={query}
```
Search the Quran by keyword in Arabic or English text.

**Example:**
```http
GET /api/search?q=mercy
```

**Response:**
```json
{
  "query": "mercy",
  "count": 45,
  "results": [
    {
      "surah_id": 1,
      "ayah_id": 1,
      "surah_name": "AL-FĀTIḤAH",
      "content": "بِسمِ اللَّهِ الرَّحمٰنِ الرَّحيمِ",
      "translation_eng": "In the Name of Allah, the All-beneficent, the All-merciful."
    }
  ]
}
```

### Reciters Endpoints

#### Get All Reciters
```http
GET /api/reciters
```
Returns all 238 reciters with their metadata.

**Response:**
```json
{
  "total": 238,
  "reciters": [
    {
      "id": 1,
      "name_arabic": "إبراهيم الأخضر",
      "name_transliteration": "Ibrahim Al-Akdar",
      "letter": "إ",
      "moshaf": [
        {
          "id": 1,
          "moshaf_name": "حفص عن عاصم - مرتل",
          "rewaya_id": 1,
          "server_url": "https://server6.mp3quran.net/akdr/",
          "surah_total": 114,
          "moshaf_type": 11
        }
      ]
    }
  ]
}
```

#### Get Specific Reciter
```http
GET /api/reciters/{reciter_id}
```
Retrieves details for a specific reciter.

**Example:**
```http
GET /api/reciters/1
```

#### Search Reciters
```http
GET /api/reciters/search?q={query}
```
Search reciters by name.

**Example:**
```http
GET /api/reciters/search?q=Ibrahim
```

### Word-by-Word Synchronization Endpoints

#### Get Word-by-Word Data
```http
GET /api/word-by-word/{surah_id}/{ayah_id}
```
Retrieves word-by-word synchronization data for active highlighting during audio playback.

**Example:**
```http
GET /api/word-by-word/1/1
```

**Response:**
```json
{
  "surah_id": 1,
  "ayah_id": 1,
  "words": {
    "1:1:1": {
      "id": 1,
      "surah": "1",
      "ayah": "1",
      "word": "1",
      "location": "1:1:1",
      "text": "بِسۡمِ"
    },
    "1:1:2": {
      "id": 2,
      "surah": "1",
      "ayah": "1",
      "word": "2",
      "location": "1:1:2",
      "text": "ٱللَّهِ"
    }
  }
}
```

### Multi-Script Endpoints

#### Get Available Scripts
```http
GET /api/scripts/available
```
Returns list of supported Quranic scripts and fonts.

**Response:**
```json
{
  "scripts": [
    {
      "type": "hafs",
      "name": "KFGQPC Hafs",
      "description": "Hafs script with word-by-word synchronization"
    },
    {
      "type": "digital-khatt-v2",
      "name": "Digital Khatt V2",
      "description": "Digital Khatt V2 script"
    },
    {
      "type": "nastaleeq",
      "name": "QPC Nastaleeq",
      "description": "QPC Nastaleeq script"
    },
    {
      "type": "qpc-v4",
      "name": "QPC V4 with Tajweed",
      "description": "QPC V4 glyphs with Tajweed color coding"
    },
    {
      "type": "uthmani-simple",
      "name": "Uthmani Simple",
      "description": "Simple Uthmani script"
    }
  ]
}
```

#### Get Ayah in Specific Script
```http
GET /api/scripts/{script_type}/{surah_id}/{ayah_id}
```
Retrieves Ayah text rendered in a specific script/font.

**Example:**
```http
GET /api/scripts/qpc-v4/1/1
```

---

## Frontend Implementation

### Quran Browser Component

The interactive Quran browser provides:

1. **Surah/Ayah Navigation**: Dropdown selectors for easy navigation
2. **Reciter Selection**: Choose from 238 reciters
3. **Script Switching**: Toggle between 5 different Quranic scripts
4. **Audio Player**: Built-in player with play/pause controls
5. **Full-Text Search**: Search functionality with instant results
6. **Multi-Panel Display**:
   - Arabic text (RTL) in right panel
   - English translation (LTR) in center panel
   - Transliteration in left panel

### Active-Word Highlighting

The frontend implements active-word highlighting using a dedicated CSS class:

```css
.highlighted {
  background-color: #fbbf24;
  color: #000;
  padding: 0.125rem 0.25rem;
  border-radius: 0.25rem;
  transition: background-color 0.2s ease;
}
```

During audio playback, the frontend:
1. Fetches word-by-word synchronization data
2. Tracks audio playback time
3. Applies the `.highlighted` class to the current word
4. Removes the class from the previous word
5. Updates in real-time as audio plays

### Example Implementation

```typescript
// Apply highlighting to current word
const highlightWord = (wordLocation: string) => {
  // Remove previous highlighting
  document.querySelectorAll('.highlighted').forEach(el => {
    el.classList.remove('highlighted');
  });
  
  // Apply highlighting to current word
  const wordElement = document.getElementById(`word-${wordLocation}`);
  if (wordElement) {
    wordElement.classList.add('highlighted');
  }
};
```

---

## Supported Scripts

Quran-Api supports 5 different Quranic scripts and fonts:

| Script Type | Name | Description | Use Case |
|------------|------|-------------|----------|
| `hafs` | KFGQPC Hafs | Standard Hafs script with word-by-word sync | General reading and study |
| `digital-khatt-v2` | Digital Khatt V2 | Modern digital Quranic font | Digital display |
| `nastaleeq` | QPC Nastaleeq | Elegant Nastaleeq calligraphic style | Aesthetic presentation |
| `qpc-v4` | QPC V4 with Tajweed | Colored Tajweed indicators | Tajweed learning |
| `uthmani-simple` | Uthmani Simple | Simplified Uthmani script | Accessibility |

### Switching Scripts

```typescript
// Frontend example
const [scriptType, setScriptType] = useState('hafs');

const handleScriptChange = async (newScript: string) => {
  const response = await fetch(
    `/api/scripts/${newScript}/${surahId}/${ayahId}`
  );
  const data = await response.json();
  setScriptType(newScript);
  // Update display with new script
};
```

---

## Audio Recitations

### 238 Reciters

Quran-Api provides access to 238 renowned Quranic reciters from around the world, including:
- Traditional reciters (Al-Husary, Al-Minshawi, etc.)
- Contemporary reciters
- Different recitation styles (Tajweed, Mujawwad, Murattal)
- Various speeds and emotional expressions

### Audio URL Structure

Audio files are hosted on CDN servers and follow this pattern:

```
{server_url}{surah_number}.mp3
```

**Example:**
```
https://server6.mp3quran.net/akdr/001.mp3
```

### Reciter Metadata

Each reciter includes:
- Arabic name (`name_arabic`)
- Transliteration (`name_transliteration`)
- Unique ID (`id`)
- Letter for alphabetical sorting (`letter`)
- Multiple moshaf versions with:
  - Moshaf ID and name
  - Rewaya ID
  - Server URL
  - Total Surahs available
  - Moshaf type

---

## Word-by-Word Synchronization

### Data Structure

Word-by-word data provides position information for each word:

```json
{
  "id": 1,
  "surah": "1",
  "ayah": "1",
  "word": "1",
  "location": "1:1:1",
  "text": "بِسۡمِ"
}
```

### Implementation

```typescript
// Fetch word-by-word data
const fetchWordData = async (surahId: number, ayahId: number) => {
  const response = await fetch(
    `/api/word-by-word/${surahId}/${ayahId}`
  );
  return response.json();
};

// Apply highlighting during playback
const onAudioTimeUpdate = (currentTime: number) => {
  const currentWord = calculateWordFromTime(currentTime);
  highlightWord(currentWord.location);
};
```

---

## Setup Instructions

### Development Environment

#### 1. Clone the Repository

```bash
git clone https://github.com/uthumany/Quran-Api.git
cd Quran-Api
```

#### 2. Install Dependencies

**Frontend:**
```bash
cd client
pnpm install
cd ..
```

**Backend:**
```bash
pip install -r requirements.txt
```

#### 3. Start Development Servers

**Terminal 1 - Backend API:**
```bash
python server/quran_api.py
# API runs on http://localhost:8000
```

**Terminal 2 - Frontend:**
```bash
pnpm dev
# Frontend runs on http://localhost:3000
```

#### 4. Access the Application

- **Frontend**: http://localhost:3000
- **API Documentation**: http://localhost:8000/docs
- **API Playground**: http://localhost:8000/redoc

### Production Environment

See [Deployment Guide](#deployment-guide) section below.

---

## Progressive Web App (PWA)

Quran-Api can be converted to a Progressive Web App for offline access and installation:

### PWA Features

1. **Offline Support**: Cache Quran data for offline browsing
2. **Installable**: Add to home screen on mobile and desktop
3. **Fast Loading**: Service worker caching for instant load times
4. **Push Notifications**: Optional prayer time reminders

### Implementation Steps

#### 1. Create `public/manifest.json`

```json
{
  "name": "Quran-Api",
  "short_name": "Quran",
  "description": "The Holy Quran API Platform",
  "start_url": "/",
  "display": "standalone",
  "background_color": "#ffffff",
  "theme_color": "#2563eb",
  "icons": [
    {
      "src": "/icon-192.png",
      "sizes": "192x192",
      "type": "image/png"
    },
    {
      "src": "/icon-512.png",
      "sizes": "512x512",
      "type": "image/png"
    }
  ]
}
```

#### 2. Create Service Worker

```typescript
// client/src/serviceWorker.ts
const CACHE_NAME = 'quran-api-v1';
const urlsToCache = [
  '/',
  '/index.html',
  '/api/quran/surahs'
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(urlsToCache);
    })
  );
});

self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.match(event.request).then((response) => {
      return response || fetch(event.request);
    })
  );
});
```

#### 3. Register Service Worker

```typescript
// client/src/main.tsx
if ('serviceWorker' in navigator) {
  navigator.serviceWorker.register('/serviceWorker.js');
}
```

---

## Deployment Guide

### Deploying to GitHub Pages (Frontend)

```bash
# Build the frontend
pnpm build

# Deploy to GitHub Pages
cd dist
git init
git add .
git commit -m "Deploy Quran-Api"
git branch -M gh-pages
git remote add origin https://github.com/uthumany/Quran-Api.git
git push -u origin gh-pages
```

### Deploying to Vercel

```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel
```

### Deploying to Heroku (Backend)

```bash
# Create Procfile
echo "web: uvicorn server.quran_api:app --host 0.0.0.0 --port \$PORT" > Procfile

# Deploy
heroku create quran-api
git push heroku main
```

### Docker Deployment

#### Dockerfile

```dockerfile
FROM python:3.11-slim

WORKDIR /app

COPY requirements.txt .
RUN pip install -r requirements.txt

COPY server/ ./server/
COPY data/ ./data/

CMD ["python", "server/quran_api.py"]
```

#### docker-compose.yml

```yaml
version: '3.8'

services:
  api:
    build: .
    ports:
      - "8000:8000"
    environment:
      - QURAN_API_URL=http://localhost:8000

  frontend:
    build:
      context: .
      dockerfile: Dockerfile.frontend
    ports:
      - "3000:3000"
    depends_on:
      - api
```

---

## Usage Examples

### JavaScript/TypeScript

```typescript
// Fetch all Surahs
const fetchSurahs = async () => {
  const response = await fetch('http://localhost:8000/api/quran/surahs');
  const data = await response.json();
  console.log(data.surahs);
};

// Get specific Ayah
const fetchAyah = async (surahId: number, ayahId: number) => {
  const response = await fetch(
    `http://localhost:8000/api/quran/ayah/${surahId}/${ayahId}`
  );
  return response.json();
};

// Search Quran
const searchQuran = async (query: string) => {
  const response = await fetch(
    `http://localhost:8000/api/search?q=${encodeURIComponent(query)}`
  );
  return response.json();
};

// Get reciters
const fetchReciters = async () => {
  const response = await fetch('http://localhost:8000/api/reciters');
  return response.json();
};

// Get word-by-word data
const fetchWordByWord = async (surahId: number, ayahId: number) => {
  const response = await fetch(
    `http://localhost:8000/api/word-by-word/${surahId}/${ayahId}`
  );
  return response.json();
};
```

### Python

```python
import requests

# Base URL
BASE_URL = "http://localhost:8000/api"

# Fetch all Surahs
response = requests.get(f"{BASE_URL}/quran/surahs")
surahs = response.json()

# Get specific Ayah
response = requests.get(f"{BASE_URL}/quran/ayah/1/1")
ayah = response.json()

# Search Quran
response = requests.get(f"{BASE_URL}/search", params={"q": "mercy"})
results = response.json()

# Get reciters
response = requests.get(f"{BASE_URL}/reciters")
reciters = response.json()
```

### cURL

```bash
# Get all Surahs
curl http://localhost:8000/api/quran/surahs

# Get specific Ayah
curl http://localhost:8000/api/quran/ayah/1/1

# Search Quran
curl "http://localhost:8000/api/search?q=mercy"

# Get reciters
curl http://localhost:8000/api/reciters

# Get word-by-word data
curl http://localhost:8000/api/word-by-word/1/1
```

---

## Project Structure

```
Quran-Api/
├── client/                          # React frontend
│   ├── src/
│   │   ├── pages/
│   │   │   ├── Home.tsx            # Landing page
│   │   │   ├── QuranBrowser.tsx    # Main Quran browser
│   │   │   └── NotFound.tsx
│   │   ├── components/
│   │   │   ├── ui/                 # shadcn/ui components
│   │   │   └── DashboardLayout.tsx
│   │   ├── App.tsx                 # Main app component
│   │   ├── main.tsx                # Entry point
│   │   └── index.css               # Global styles
│   ├── public/
│   │   ├── favicon.ico
│   │   ├── manifest.json           # PWA manifest
│   │   └── serviceWorker.js        # Service worker
│   └── package.json
├── server/                          # FastAPI backend
│   ├── quran_api.py               # Main API file
│   ├── routers.ts                 # tRPC routers
│   ├── db.ts                      # Database helpers
│   ├── _core/                     # Core framework files
│   └── auth.logout.test.ts        # Tests
├── data/                            # Quran data files
│   ├── quran_complete.json
│   ├── quran_reciters.json
│   ├── qpc-hafs-word-by-word.json
│   ├── digital-khatt-v2.json
│   ├── qpc-nastaleeq.json
│   ├── qpc-v4.json
│   └── uthmani-simple.json
├── requirements.txt                 # Python dependencies
├── package.json                     # Node.js dependencies
├── tsconfig.json                    # TypeScript config
├── tailwind.config.js              # Tailwind CSS config
├── vite.config.ts                  # Vite config
├── Dockerfile                       # Docker image
├── docker-compose.yml              # Docker compose
├── Procfile                         # Heroku deployment
└── README.md                        # This file
```

---

## Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

---

## License

This project is licensed under the MIT License - see the LICENSE file for details.

---

## Support & Contact

For issues, questions, or suggestions:
- **GitHub Issues**: [Report an issue](https://github.com/uthumany/Quran-Api/issues)
- **Email**: support@quran-api.com
- **Documentation**: [Full API Docs](http://localhost:8000/docs)

---

## Acknowledgments

- **Quran Data**: Sourced from reliable Islamic databases
- **Reciters**: 238 renowned Quranic reciters from mp3quran.net
- **Fonts**: KFGQPC, Digital Khatt, QPC, and Uthmani scripts
- **Framework**: FastAPI, React, and the open-source community

---

**Built with ❤️ for the Muslim community and Quran enthusiasts worldwide.**

*Last Updated: April 2024*
