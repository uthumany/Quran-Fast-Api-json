import { useAuth } from "@/_core/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { BookOpen, Headphones, Search, Zap } from "lucide-react";
import { getLoginUrl } from "@/const";
import { Link } from "wouter";

export default function Home() {
  const { user, isAuthenticated } = useAuth();

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-slate-100">
      {/* Navigation */}
      <nav className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
          <div className="flex items-center gap-2">
            <BookOpen className="w-8 h-8 text-blue-600" />
            <h1 className="text-2xl font-bold text-slate-900">Quran-Api</h1>
          </div>
          <div className="flex gap-4">
            {isAuthenticated ? (
              <div className="flex items-center gap-4">
                <span className="text-slate-600">Welcome, {user?.name}</span>
                <Link href="/quran">
                  <Button className="bg-blue-600 hover:bg-blue-700">Browse Quran</Button>
                </Link>
              </div>
            ) : (
              <a href={getLoginUrl()}>
                <Button className="bg-blue-600 hover:bg-blue-700">Sign In</Button>
              </a>
            )}
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="text-center mb-12">
          <h2 className="text-5xl font-bold text-slate-900 mb-4">
            The Holy Quran API Platform
          </h2>
          <p className="text-xl text-slate-600 mb-8">
            Access comprehensive Quranic data with audio recitations, word-by-word synchronization, and multiple script formats
          </p>
          <div className="flex justify-center gap-4">
            {isAuthenticated ? (
              <Link href="/quran">
                <Button size="lg" className="bg-blue-600 hover:bg-blue-700 text-white">
                  Start Browsing
                </Button>
              </Link>
            ) : (
              <a href={getLoginUrl()}>
                <Button size="lg" className="bg-blue-600 hover:bg-blue-700 text-white">
                  Get Started
                </Button>
              </a>
            )}
            <a href="https://github.com/uthumany/Quran-Api" target="_blank" rel="noopener noreferrer">
              <Button size="lg" variant="outline">
                View on GitHub
              </Button>
            </a>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <h3 className="text-3xl font-bold text-slate-900 mb-12 text-center">
          Powerful Features
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {/* Feature 1 */}
          <Card className="p-6 hover:shadow-lg transition">
            <BookOpen className="w-12 h-12 text-blue-600 mb-4" />
            <h4 className="text-lg font-semibold text-slate-900 mb-2">Complete Quran</h4>
            <p className="text-slate-600">
              Access all 114 Surahs with Arabic text, English translation, and transliteration
            </p>
          </Card>

          {/* Feature 2 */}
          <Card className="p-6 hover:shadow-lg transition">
            <Headphones className="w-12 h-12 text-blue-600 mb-4" />
            <h4 className="text-lg font-semibold text-slate-900 mb-2">238 Reciters</h4>
            <p className="text-slate-600">
              Listen to audio recitations from 238 renowned Quranic reciters worldwide
            </p>
          </Card>

          {/* Feature 3 */}
          <Card className="p-6 hover:shadow-lg transition">
            <Zap className="w-12 h-12 text-blue-600 mb-4" />
            <h4 className="text-lg font-semibold text-slate-900 mb-2">Word Sync</h4>
            <p className="text-slate-600">
              Word-by-word synchronization with active highlighting during audio playback
            </p>
          </Card>

          {/* Feature 4 */}
          <Card className="p-6 hover:shadow-lg transition">
            <Search className="w-12 h-12 text-blue-600 mb-4" />
            <h4 className="text-lg font-semibold text-slate-900 mb-2">Multi-Script</h4>
            <p className="text-slate-600">
              Switch between 5 different Quranic scripts and fonts for optimal reading
            </p>
          </Card>
        </div>
      </section>

      {/* API Endpoints Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <h3 className="text-3xl font-bold text-slate-900 mb-12 text-center">
          RESTful API Endpoints
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card className="p-6 bg-slate-50">
            <h4 className="font-mono text-sm font-semibold text-blue-600 mb-2">
              GET /api/quran/surahs
            </h4>
            <p className="text-slate-600 text-sm">
              Retrieve a list of all 114 Surahs with metadata
            </p>
          </Card>

          <Card className="p-6 bg-slate-50">
            <h4 className="font-mono text-sm font-semibold text-blue-600 mb-2">
              GET /api/quran/ayah/{"{surah_id}/{ayah_id}"}
            </h4>
            <p className="text-slate-600 text-sm">
              Get a specific Ayah with Arabic, English, and transliteration
            </p>
          </Card>

          <Card className="p-6 bg-slate-50">
            <h4 className="font-mono text-sm font-semibold text-blue-600 mb-2">
              GET /api/reciters
            </h4>
            <p className="text-slate-600 text-sm">
              Access all 238 reciters with their metadata and audio URLs
            </p>
          </Card>

          <Card className="p-6 bg-slate-50">
            <h4 className="font-mono text-sm font-semibold text-blue-600 mb-2">
              GET /api/word-by-word/{"{surah_id}/{ayah_id}"}
            </h4>
            <p className="text-slate-600 text-sm">
              Fetch word-by-word synchronization data for audio highlighting
            </p>
          </Card>

          <Card className="p-6 bg-slate-50">
            <h4 className="font-mono text-sm font-semibold text-blue-600 mb-2">
              GET /api/scripts/{"{script_type}/{surah_id}/{ayah_id}"}
            </h4>
            <p className="text-slate-600 text-sm">
              Get Ayah text in different scripts (Hafs, Digital Khatt, Nastaleeq, etc.)
            </p>
          </Card>

          <Card className="p-6 bg-slate-50">
            <h4 className="font-mono text-sm font-semibold text-blue-600 mb-2">
              GET /api/search
            </h4>
            <p className="text-slate-600 text-sm">
              Search the Quran by keyword in Arabic or English text
            </p>
          </Card>
        </div>
      </section>

      {/* Scripts Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <h3 className="text-3xl font-bold text-slate-900 mb-12 text-center">
          Supported Quranic Scripts
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
          {[
            { name: "KFGQPC Hafs", code: "hafs" },
            { name: "Digital Khatt V2", code: "digital-khatt-v2" },
            { name: "QPC Nastaleeq", code: "nastaleeq" },
            { name: "QPC V4 Tajweed", code: "qpc-v4" },
            { name: "Uthmani Simple", code: "uthmani-simple" },
          ].map((script) => (
            <Card key={script.code} className="p-4 text-center hover:shadow-lg transition">
              <p className="font-semibold text-slate-900">{script.name}</p>
              <p className="text-xs text-slate-500 mt-2 font-mono">{script.code}</p>
            </Card>
          ))}
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-blue-600 text-white py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h3 className="text-3xl font-bold mb-4">Ready to Explore the Quran?</h3>
          <p className="text-lg mb-8 opacity-90">
            Start using the Quran-Api platform today to access comprehensive Quranic data and audio recitations
          </p>
          <div className="flex justify-center gap-4">
            {isAuthenticated ? (
              <Link href="/quran">
                <Button size="lg" className="bg-white text-blue-600 hover:bg-slate-100">
                  Browse Quran
                </Button>
              </Link>
            ) : (
              <a href={getLoginUrl()}>
                <Button size="lg" className="bg-white text-blue-600 hover:bg-slate-100">
                  Sign In to Get Started
                </Button>
              </a>
            )}
            <a href="https://github.com/uthumany/Quran-Api" target="_blank" rel="noopener noreferrer">
              <Button size="lg" variant="outline" className="border-white text-white hover:bg-blue-700">
                GitHub Repository
              </Button>
            </a>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-slate-900 text-slate-300 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <p>&copy; 2024 Quran-Api. All rights reserved. Built with FastAPI and React.</p>
        </div>
      </footer>
    </div>
  );
}
