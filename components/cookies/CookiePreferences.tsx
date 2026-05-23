"use client";
import { useConsent } from "@/context/ConsentContext";
import { ConsentCategory } from "@/types/cookie-consent";

interface Props { onClose: () => void; }

const CATEGORIES = [
  { id: ConsentCategory.Necessary, label: "Necessary", desc: "Site functionality. Cannot be disabled.", locked: true },
  { id: ConsentCategory.Analytics, label: "Analytics", desc: "Helps us understand how visitors use the site.", locked: false },
  { id: ConsentCategory.Marketing, label: "Marketing", desc: "Used to show relevant ads.", locked: false },
] as const;

export default function CookiePreferences({ onClose }: Props) {
  const { consent, updateCategory, saveCustom } = useConsent();
  const handleSave = () => { saveCustom(); onClose(); };

  return (
    <div 
      className="fixed inset-0 z-[10000] flex items-end justify-center bg-black/50 md:items-center"
      onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
    >
      <div className="w-full rounded-t-2xl bg-[#f2f4f7] p-6 shadow-2xl md:max-w-md md:rounded-2xl md:p-8">
        
        {/* Header */}
        <div className="mb-5 flex items-center justify-between">
          <h2 className="text-lg font-semibold text-[#3d3730]">🍪 Cookie Preferences</h2>
          <button 
            onClick={onClose}
            className="text-[#8a7560] hover:text-[#3d3730] text-xl font-light transition"
          >
            ✕
          </button>
        </div>

        {/* Categories */}
        {CATEGORIES.map(({ id, label, desc, locked }) => (
          <div key={id} className="flex items-start justify-between border-b border-[#e8e4dd] py-4 last:border-0">
            <div className="flex-1 pr-4">
              <div className="flex items-center gap-2">
                <p className="text-sm font-medium text-[#3d3730]">{label}</p>
                {locked && (
                  <span className="rounded-full bg-[#e8e4dd] px-2 py-0.5 text-[10px] text-[#8a7560]">
                    Always on
                  </span>
                )}
              </div>
              <p className="mt-1 text-xs leading-relaxed text-[#8a7560]">{desc}</p>
            </div>
            <input
              type="checkbox"
              checked={consent.categories[id]}
              disabled={locked}
              onChange={(e) => updateCategory(id, e.target.checked)}
              className="mt-1 h-4 w-4 cursor-pointer accent-[#3d3730] disabled:cursor-default disabled:opacity-50"
            />
          </div>
        ))}

        {/* Buttons */}
        <div className="mt-6 flex gap-3">
          <button 
            onClick={handleSave} 
            className="flex-1 rounded-full bg-[#3d3730] py-2.5 text-sm font-medium text-white transition active:scale-95 hover:bg-[#5a5047]"
          >
            Save preferences
          </button>
          <button 
            onClick={onClose} 
            className="rounded-full border border-[#c8c0b4] px-5 py-2.5 text-sm text-[#5a5a5a] transition active:scale-95 hover:bg-[#e8e4dd]"
          >
            Cancel
          </button>
        </div>

      </div>
    </div>
  );
}
