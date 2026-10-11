import { useState, useRef, useEffect } from 'react';
import { Search, Loader2, MapPin, X } from 'lucide-react';
import { searchBeach, type BeachLocation } from '@/lib/api';

interface SearchSectionProps {
  onBeachSelect: (beach: BeachLocation) => void;
  loading: boolean;
}

export default function SearchSection({ onBeachSelect, loading }: SearchSectionProps) {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<BeachLocation[]>([]);
  const [searching, setSearching] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showResults, setShowResults] = useState(false);
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  // Debounced search
  useEffect(() => {
    if (debounceRef.current) clearTimeout(debounceRef.current);
    if (query.trim().length < 3) {
      setResults([]);
      setShowResults(false);
      setError(null);
      return;
    }

    debounceRef.current = setTimeout(async () => {
      setSearching(true);
      setError(null);
      try {
        const beaches = await searchBeach(query);
        if (beaches.length === 0) {
          setError('No beaches found. Try a different name.');
        } else {
          setResults(beaches);
          setShowResults(true);
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Search failed');
      } finally {
        setSearching(false);
      }
    }, 500);

    return () => {
      if (debounceRef.current) clearTimeout(debounceRef.current);
    };
  }, [query]);

  // Close results on outside click
  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setShowResults(false);
      }
    }
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, []);

  function handleSelect(beach: BeachLocation) {
    setQuery(beach.name);
    setShowResults(false);
    setResults([]);
    onBeachSelect(beach);
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (results.length > 0) {
      handleSelect(results[0]);
    }
  }

  return (
    <section
      id="search-section"
      className="relative min-h-screen w-full flex flex-col items-center justify-center px-4 py-20 bg-gradient-to-b from-night-deep via-night-dark to-night-mid"
    >
      {/* Subtle starfield continuation */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none opacity-40">
        {[...Array(40)].map((_, i) => (
          <div
            key={i}
            className="absolute rounded-full bg-white"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 60}%`,
              width: `${Math.random() * 1.5 + 0.5}px`,
              height: `${Math.random() * 1.5 + 0.5}px`,
              opacity: Math.random() * 0.4 + 0.1,
              animation: `twinkle ${Math.random() * 3 + 2}s ease-in-out ${Math.random() * 4}s infinite`,
            }}
          />
        ))}
      </div>

      <div className="relative z-10 w-full max-w-2xl flex flex-col items-center">
        <h2 className="font-serif text-4xl md:text-5xl font-light text-moon-light/90 mb-3 text-center animate-fade-in-up">
          Find your beach
        </h2>
        <p className="font-sans text-sm font-light tracking-wide text-moon-mid/60 mb-12 text-center max-w-md animate-fade-in-up" style={{ animationDelay: '0.15s' }}>
          Search any beach in the world. We'll show you the Moon's phase and the
          best time to visit today.
        </p>

        <div ref={containerRef} className="relative w-full animate-fade-in-up" style={{ animationDelay: '0.3s' }}>
          <form onSubmit={handleSubmit}>
            <div className="relative">
              <Search
                className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-moon-mid/50"
                aria-hidden
              />
              <input
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                onFocus={() => results.length > 0 && setShowResults(true)}
                placeholder="e.g. Bondi Beach, Copacabana, Praia da Rocha..."
                className="w-full bg-night-light/40 backdrop-blur-md border border-moon-mid/20 rounded-full pl-14 pr-12 py-5 text-moon-light text-lg font-light placeholder:text-moon-mid/40 focus:outline-none focus:border-moon-glow/50 focus:ring-2 focus:ring-moon-glow/20 transition-all duration-300 shadow-2xl"
                disabled={loading}
              />
              {searching && (
                <Loader2 className="absolute right-5 top-1/2 -translate-y-1/2 w-5 h-5 text-moon-mid/50 animate-spin" />
              )}
              {query && !searching && (
                <button
                  type="button"
                  onClick={() => { setQuery(''); setResults([]); setShowResults(false); }}
                  className="absolute right-5 top-1/2 -translate-y-1/2 text-moon-mid/50 hover:text-moon-light transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              )}
            </div>
          </form>

          {/* Search results dropdown */}
          {showResults && results.length > 0 && (
            <div className="absolute top-full mt-3 w-full bg-night-dark/95 backdrop-blur-lg border border-moon-mid/20 rounded-2xl shadow-2xl overflow-hidden animate-slide-up max-h-80 overflow-y-auto custom-scroll">
              {results.map((beach, i) => (
                <button
                  key={`${beach.name}-${i}`}
                  onClick={() => handleSelect(beach)}
                  className="w-full flex items-start gap-3 px-5 py-4 hover:bg-night-light/40 transition-colors text-left border-b border-moon-mid/10 last:border-0"
                >
                  <MapPin className="w-4 h-4 text-moon-glow/60 mt-0.5 flex-shrink-0" />
                  <div className="flex-1 min-w-0">
                    <p className="text-moon-light font-light text-sm truncate">
                      {beach.name}
                    </p>
                    <p className="text-moon-mid/50 text-xs font-light truncate mt-0.5">
                      {beach.displayName}
                    </p>
                  </div>
                </button>
              ))}
            </div>
          )}

          {/* Error message */}
          {error && !showResults && (
            <p className="mt-4 text-center text-sm text-amber-400/70 font-light">
              {error}
            </p>
          )}

          {/* Loading overlay */}
          {loading && (
            <div className="mt-6 flex items-center justify-center gap-3 text-moon-mid/60">
              <Loader2 className="w-5 h-5 animate-spin" />
              <span className="text-sm font-light">Calculating Moon phase and optimal time...</span>
            </div>
          )}
        </div>

        {/* Quick suggestions */}
        {!query && !loading && (
          <div className="mt-10 flex flex-wrap items-center justify-center gap-2 animate-fade-in-up" style={{ animationDelay: '0.5s' }}>
            <span className="text-xs text-moon-mid/40 font-light tracking-wide">Try:</span>
            {['Bondi Beach', 'Copacabana', 'Malibu', 'Praia da Rocha', 'Whitehaven Beach'].map((s) => (
              <button
                key={s}
                onClick={() => setQuery(s)}
                className="text-xs font-light text-moon-glow/70 bg-moon-glow/5 border border-moon-glow/15 rounded-full px-3 py-1.5 hover:bg-moon-glow/10 hover:border-moon-glow/30 transition-all duration-200"
              >
                {s}
              </button>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
