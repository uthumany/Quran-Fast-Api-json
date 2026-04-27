import React, { useState, useEffect, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ChevronLeft, ChevronRight, Play, Pause, Volume2 } from 'lucide-react';

interface Ayah {
  surah_id: number;
  ayah_id: number;
  surah_name: string;
  content: string;
  translation_eng: string;
  transliteration: string;
}

interface Surah {
  id: number;
  surah_name: string;
  surah_name_ar: string;
  translation: string;
  type: string;
  total_verses: number;
}

interface Reciter {
  id: number;
  name_arabic: string;
  name_transliteration: string;
  moshaf: Array<{
    id: number;
    moshaf_name: string;
    server_url: string;
    surah_total: number;
  }>;
}

export default function QuranBrowser() {
  const [surahs, setSurahs] = useState<Surah[]>([]);
  const [selectedSurah, setSelectedSurah] = useState<number>(1);
  const [selectedAyah, setSelectedAyah] = useState<number>(1);
  const [ayahData, setAyahData] = useState<Ayah | null>(null);
  const [reciters, setReciters] = useState<Reciter[]>([]);
  const [selectedReciter, setSelectedReciter] = useState<number>(1);
  const [scriptType, setScriptType] = useState<string>('hafs');
  const [isPlaying, setIsPlaying] = useState(false);
  const [highlightedWord, setHighlightedWord] = useState<string | null>(null);
  const audioRef = useRef<HTMLAudioElement>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<Ayah[]>([]);

  // Fetch Surahs on component mount
  useEffect(() => {
    const fetchSurahs = async () => {
      try {
        const response = await fetch('/api/quran/surahs');
        const data = await response.json();
        setSurahs(data.surahs);
      } catch (error) {
        console.error('Error fetching surahs:', error);
      }
    };

    const fetchReciters = async () => {
      try {
        const response = await fetch('/api/reciters');
        const data = await response.json();
        setReciters(data.reciters);
      } catch (error) {
        console.error('Error fetching reciters:', error);
      }
    };

    fetchSurahs();
    fetchReciters();
  }, []);

  // Fetch Ayah data when surah or ayah changes
  useEffect(() => {
    const fetchAyah = async () => {
      try {
        const response = await fetch(`/api/quran/ayah/${selectedSurah}/${selectedAyah}`);
        const data = await response.json();
        setAyahData(data);
      } catch (error) {
        console.error('Error fetching ayah:', error);
      }
    };

    fetchAyah();
  }, [selectedSurah, selectedAyah]);

  // Handle search
  const handleSearch = async () => {
    if (searchQuery.trim().length < 2) return;

    try {
      const response = await fetch(`/api/search?q=${encodeURIComponent(searchQuery)}`);
      const data = await response.json();
      setSearchResults(data.results);
    } catch (error) {
      console.error('Error searching:', error);
    }
  };

  // Handle audio playback
  const handlePlayAudio = () => {
    if (selectedReciter && reciters.length > 0) {
      const reciter = reciters.find(r => r.id === selectedReciter);
      if (reciter && reciter.moshaf.length > 0) {
        const moshaf = reciter.moshaf[0];
        const audioUrl = `${moshaf.server_url}${selectedSurah.toString().padStart(3, '0')}.mp3`;
        
        if (audioRef.current) {
          audioRef.current.src = audioUrl;
          audioRef.current.play();
          setIsPlaying(true);
        }
      }
    }
  };

  const handlePauseAudio = () => {
    if (audioRef.current) {
      audioRef.current.pause();
      setIsPlaying(false);
    }
  };

  // Navigate to next/previous ayah
  const goToNextAyah = () => {
    const currentSurah = surahs.find(s => s.id === selectedSurah);
    if (currentSurah && selectedAyah < currentSurah.total_verses) {
      setSelectedAyah(selectedAyah + 1);
    } else if (selectedSurah < 114) {
      setSelectedSurah(selectedSurah + 1);
      setSelectedAyah(1);
    }
  };

  const goToPreviousAyah = () => {
    if (selectedAyah > 1) {
      setSelectedAyah(selectedAyah - 1);
    } else if (selectedSurah > 1) {
      const previousSurah = surahs.find(s => s.id === selectedSurah - 1);
      if (previousSurah) {
        setSelectedSurah(selectedSurah - 1);
        setSelectedAyah(previousSurah.total_verses);
      }
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 p-4 md:p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-slate-900 mb-2">Quran Browser</h1>
          <p className="text-slate-600">Explore the Holy Quran with audio recitations and multiple script formats</p>
        </div>

        {/* Controls */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          {/* Surah Selector */}
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">Surah</label>
            <Select value={selectedSurah.toString()} onValueChange={(val) => {
              setSelectedSurah(parseInt(val));
              setSelectedAyah(1);
            }}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="max-h-60">
                {surahs.map(surah => (
                  <SelectItem key={surah.id} value={surah.id.toString()}>
                    {surah.id}. {surah.surah_name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Ayah Selector */}
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">Ayah</label>
            <Select value={selectedAyah.toString()} onValueChange={(val) => setSelectedAyah(parseInt(val))}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="max-h-60">
                {Array.from({ length: surahs.find(s => s.id === selectedSurah)?.total_verses || 0 }, (_, i) => (
                  <SelectItem key={i + 1} value={(i + 1).toString()}>
                    Verse {i + 1}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Reciter Selector */}
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">Reciter</label>
            <Select value={selectedReciter.toString()} onValueChange={(val) => setSelectedReciter(parseInt(val))}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="max-h-60">
                {reciters.slice(0, 20).map(reciter => (
                  <SelectItem key={reciter.id} value={reciter.id.toString()}>
                    {reciter.name_transliteration}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Script Type Selector */}
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">Script</label>
            <Select value={scriptType} onValueChange={setScriptType}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="hafs">KFGQPC Hafs</SelectItem>
                <SelectItem value="digital-khatt-v2">Digital Khatt V2</SelectItem>
                <SelectItem value="nastaleeq">QPC Nastaleeq</SelectItem>
                <SelectItem value="qpc-v4">QPC V4 Tajweed</SelectItem>
                <SelectItem value="uthmani-simple">Uthmani Simple</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Search Bar */}
        <div className="mb-8">
          <div className="flex gap-2">
            <Input
              type="text"
              placeholder="Search Quran..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
              className="flex-1"
            />
            <Button onClick={handleSearch} className="bg-blue-600 hover:bg-blue-700">
              Search
            </Button>
          </div>
        </div>

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Arabic Text Panel */}
          <Card className="lg:col-span-1 p-6 bg-white shadow-lg">
            <h2 className="text-xl font-bold text-slate-900 mb-4">Arabic Text</h2>
            {ayahData && (
              <div className="space-y-4">
                <div className="text-right text-3xl font-bold text-slate-900 leading-relaxed" dir="rtl">
                  {ayahData.content}
                </div>
                <div className="text-sm text-slate-600">
                  {ayahData.surah_name} - Verse {ayahData.ayah_id}
                </div>
              </div>
            )}
          </Card>

          {/* English Translation Panel */}
          <Card className="lg:col-span-1 p-6 bg-white shadow-lg">
            <h2 className="text-xl font-bold text-slate-900 mb-4">English Translation</h2>
            {ayahData && (
              <div className="space-y-4">
                <div className="text-lg text-slate-800 leading-relaxed">
                  {ayahData.translation_eng}
                </div>
              </div>
            )}
          </Card>

          {/* Transliteration Panel */}
          <Card className="lg:col-span-1 p-6 bg-white shadow-lg">
            <h2 className="text-xl font-bold text-slate-900 mb-4">Transliteration</h2>
            {ayahData && (
              <div className="space-y-4">
                <div className="text-lg text-slate-800 leading-relaxed font-mono">
                  {ayahData.transliteration}
                </div>
              </div>
            )}
          </Card>
        </div>

        {/* Audio Player */}
        <Card className="mt-8 p-6 bg-white shadow-lg">
          <h2 className="text-xl font-bold text-slate-900 mb-4">Audio Recitation</h2>
          <div className="flex items-center gap-4">
            <Button
              onClick={isPlaying ? handlePauseAudio : handlePlayAudio}
              className="bg-blue-600 hover:bg-blue-700 text-white"
            >
              {isPlaying ? <Pause size={20} /> : <Play size={20} />}
            </Button>
            <Volume2 size={20} className="text-slate-600" />
            <audio
              ref={audioRef}
              onEnded={() => setIsPlaying(false)}
              className="flex-1"
              controls
            />
          </div>
        </Card>

        {/* Navigation */}
        <div className="flex justify-between mt-8">
          <Button
            onClick={goToPreviousAyah}
            variant="outline"
            className="flex items-center gap-2"
          >
            <ChevronLeft size={20} /> Previous
          </Button>
          <Button
            onClick={goToNextAyah}
            variant="outline"
            className="flex items-center gap-2"
          >
            Next <ChevronRight size={20} />
          </Button>
        </div>

        {/* Search Results */}
        {searchResults.length > 0 && (
          <Card className="mt-8 p-6 bg-white shadow-lg">
            <h2 className="text-xl font-bold text-slate-900 mb-4">Search Results ({searchResults.length})</h2>
            <div className="space-y-4 max-h-96 overflow-y-auto">
              {searchResults.map((result, idx) => (
                <div
                  key={idx}
                  onClick={() => {
                    setSelectedSurah(result.surah_id);
                    setSelectedAyah(result.ayah_id);
                  }}
                  className="p-4 border border-slate-200 rounded-lg hover:bg-slate-50 cursor-pointer transition"
                >
                  <div className="font-semibold text-slate-900">
                    {result.surah_name} {result.ayah_id}
                  </div>
                  <div className="text-sm text-slate-600 mt-2">
                    {result.translation_eng}
                  </div>
                </div>
              ))}
            </div>
          </Card>
        )}
      </div>
    </div>
  );
}
