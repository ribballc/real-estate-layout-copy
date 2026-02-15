import { useState, useEffect, useRef, useCallback } from "react";
import { Input } from "@/components/ui/input";
import { MapPin } from "lucide-react";

interface Suggestion {
  display_name: string;
  place_id: number;
}

interface AddressAutocompleteProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  type?: "address" | "city";
  className?: string;
}

const AddressAutocomplete = ({ value, onChange, placeholder, type = "address", className = "" }: AddressAutocompleteProps) => {
  const [query, setQuery] = useState(value);
  const [suggestions, setSuggestions] = useState<Suggestion[]>([]);
  const [showDropdown, setShowDropdown] = useState(false);
  const [loading, setLoading] = useState(false);
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setQuery(value);
  }, [value]);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setShowDropdown(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const fetchSuggestions = useCallback(async (q: string) => {
    if (q.length < 2) { setSuggestions([]); return; }
    setLoading(true);
    try {
      const params = new URLSearchParams({
        q,
        format: "json",
        addressdetails: "1",
        limit: "6",
        countrycodes: "us",
      });
      if (type === "city") {
        params.set("featuretype", "city");
      }
      const res = await fetch(`https://nominatim.openstreetmap.org/search?${params}`, {
        headers: { "Accept-Language": "en" },
      });
      const data = await res.json();
      setSuggestions(
        data.map((item: any) => {
          let name = item.display_name;
          if (type === "city") {
            // Simplify to "City, State" format
            const parts = name.split(", ");
            const city = item.address?.city || item.address?.town || item.address?.village || parts[0];
            const state = item.address?.state || parts.find((p: string) => p.length === 2) || "";
            name = state ? `${city}, ${state}` : city;
          }
          return { display_name: name, place_id: item.place_id };
        })
      );
    } catch {
      setSuggestions([]);
    }
    setLoading(false);
  }, [type]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setQuery(val);
    onChange(val);
    setShowDropdown(true);
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => fetchSuggestions(val), 300);
  };

  const selectSuggestion = (s: Suggestion) => {
    setQuery(s.display_name);
    onChange(s.display_name);
    setShowDropdown(false);
    setSuggestions([]);
  };

  // Deduplicate suggestions by display_name
  const uniqueSuggestions = suggestions.filter(
    (s, i, arr) => arr.findIndex(x => x.display_name === s.display_name) === i
  );

  return (
    <div ref={containerRef} className="relative">
      <Input
        value={query}
        onChange={handleChange}
        onFocus={() => { if (suggestions.length) setShowDropdown(true); }}
        placeholder={placeholder}
        className={`h-11 bg-white/5 border-white/10 text-white placeholder:text-white/30 focus-visible:ring-accent ${className}`}
      />
      {showDropdown && uniqueSuggestions.length > 0 && (
        <div className="absolute z-50 top-full mt-1 w-full rounded-xl border border-white/10 bg-[hsl(215,50%,10%)] shadow-xl max-h-48 overflow-y-auto">
          {uniqueSuggestions.map((s) => (
            <button
              key={s.place_id}
              onClick={() => selectSuggestion(s)}
              className="w-full text-left px-4 py-2.5 text-sm text-white/70 hover:bg-white/10 hover:text-white transition-colors flex items-center gap-2"
            >
              <MapPin className="w-3.5 h-3.5 text-white/30 flex-shrink-0" />
              <span className="truncate">{s.display_name}</span>
            </button>
          ))}
        </div>
      )}
      {showDropdown && loading && (
        <div className="absolute z-50 top-full mt-1 w-full rounded-xl border border-white/10 bg-[hsl(215,50%,10%)] shadow-xl p-3 text-center text-white/40 text-sm">
          Searching...
        </div>
      )}
    </div>
  );
};

export default AddressAutocomplete;
