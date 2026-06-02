import { useState, useRef, useEffect } from 'react';
import { Search, MapPin, X, Loader, ExternalLink } from 'lucide-react';

/**
 * Buscador de ubicación con Nominatim (OpenStreetMap) + preview de mapa.
 * No requiere API key.
 *
 * Props:
 *  value: { address, lat, lng } | null
 *  onChange: (location | null) => void
 */
export function LocationPicker({ value, onChange }) {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);
  const [searching, setSearching] = useState(false);
  const [showResults, setShowResults] = useState(false);
  const debounceRef = useRef(null);
  const containerRef = useRef(null);

  // Cerrar dropdown al hacer clic fuera
  useEffect(() => {
    const handleClick = (e) => {
      if (containerRef.current && !containerRef.current.contains(e.target)) {
        setShowResults(false);
      }
    };
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, []);

  const search = async (q) => {
    if (!q.trim() || q.length < 3) { setResults([]); return; }
    setSearching(true);
    try {
      const res = await fetch(
        `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(q)}&limit=6&addressdetails=1`,
        { headers: { 'Accept-Language': 'es' } }
      );
      const data = await res.json();
      setResults(data);
      setShowResults(true);
    } catch {
      setResults([]);
    } finally {
      setSearching(false);
    }
  };

  const handleInput = (e) => {
    setQuery(e.target.value);
    clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => search(e.target.value), 500);
  };

  const handleSelect = (result) => {
    onChange({
      address: result.display_name,
      lat: parseFloat(result.lat),
      lng: parseFloat(result.lon),
    });
    setQuery('');
    setResults([]);
    setShowResults(false);
  };

  const handleClear = () => {
    onChange(null);
    setQuery('');
    setResults([]);
  };

  // URL del mapa iframe de OpenStreetMap
  const mapUrl = value
    ? `https://www.openstreetmap.org/export/embed.html?bbox=${value.lng - 0.008},${value.lat - 0.005},${value.lng + 0.008},${value.lat + 0.005}&layer=mapnik&marker=${value.lat},${value.lng}`
    : null;

  const googleMapsUrl = value
    ? `https://www.google.com/maps?q=${value.lat},${value.lng}`
    : null;

  return (
    <div className="space-y-3">
      {/* Search box */}
      <div ref={containerRef} className="relative">
        <div className="relative">
          <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-brand-midgray" />
          <input
            type="text"
            value={query}
            onChange={handleInput}
            onFocus={() => results.length > 0 && setShowResults(true)}
            placeholder="Busca una dirección, ciudad o lugar..."
            className="w-full border border-brand-gray rounded-sm pl-9 pr-9 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition"
          />
          {searching && (
            <Loader size={15} className="absolute right-3 top-1/2 -translate-y-1/2 text-brand-midgray animate-spin" />
          )}
        </div>

        {/* Results dropdown */}
        {showResults && results.length > 0 && (
          <div className="absolute top-full left-0 right-0 z-50 bg-white border border-brand-gray rounded-sm shadow-card-hover mt-1 max-h-64 overflow-y-auto">
            {results.map((r) => (
              <button
                key={r.place_id}
                type="button"
                onClick={() => handleSelect(r)}
                className="w-full text-left px-4 py-3 text-sm hover:bg-brand-lightgray transition-colors border-b border-brand-gray last:border-0 flex items-start gap-2"
              >
                <MapPin size={14} className="text-primary flex-shrink-0 mt-0.5" />
                <span className="text-brand-dark line-clamp-2">{r.display_name}</span>
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Selected location preview */}
      {value && (
        <div className="border border-brand-gray rounded-sm overflow-hidden">
          {/* Address bar */}
          <div className="flex items-start gap-2 p-3 bg-brand-lightgray border-b border-brand-gray">
            <MapPin size={15} className="text-primary flex-shrink-0 mt-0.5" />
            <p className="text-brand-dark text-sm flex-1 leading-snug">{value.address}</p>
            <button
              type="button"
              onClick={handleClear}
              className="text-brand-midgray hover:text-red-600 transition-colors flex-shrink-0 ml-1"
              title="Eliminar ubicación"
            >
              <X size={15} />
            </button>
          </div>

          {/* Map iframe */}
          <div className="relative">
            <iframe
              title="Ubicación del curso"
              src={mapUrl}
              width="100%"
              height="220"
              frameBorder="0"
              scrolling="no"
              marginHeight="0"
              marginWidth="0"
              className="block"
            />
            {/* Open in Google Maps */}
            <a
              href={googleMapsUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="absolute bottom-2 right-2 flex items-center gap-1 bg-white text-brand-dark text-xs font-semibold px-2.5 py-1.5 rounded shadow-card hover:bg-brand-lightgray transition-colors border border-brand-gray"
            >
              <ExternalLink size={11} />
              Google Maps
            </a>
          </div>
        </div>
      )}

      {/* Empty state hint */}
      {!value && (
        <p className="text-brand-midgray text-xs">
          Busca y selecciona la ubicación donde se realizará el curso. Este campo es opcional.
        </p>
      )}
    </div>
  );
}
