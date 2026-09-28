import React from "react";

interface NirikshakLogoProps {
  size?: number;
  className?: string;
  showText?: boolean;
  withGlow?: boolean;
}

export const NirikshakLogo: React.FC<NirikshakLogoProps> = ({
  size = 48,
  className = "",
  showText = false,
  withGlow = true,
}) => {
  return (
    <div className={`inline-flex items-center gap-3 select-none ${className}`}>
      {/* Inspiring Sovereign Eagle Eye & Head Emblem */}
      <div 
        className="relative group shrink-0" 
        style={{ width: size, height: size }}
      >
        {withGlow && (
          <div 
            className="absolute -inset-1 rounded-2xl bg-gradient-to-tr from-amber-500/40 via-orange-500/30 to-emerald-500/30 blur-md opacity-80 group-hover:opacity-100 transition duration-500" 
          />
        )}
        <svg
          viewBox="0 0 100 100"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="relative w-full h-full drop-shadow-lg transition-transform duration-300 group-hover:scale-105"
        >
          <defs>
            {/* Shield Midnight Slate Background */}
            <linearGradient id="nk-shield-bg" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#060C1A" />
              <stop offset="50%" stopColor="#0F172A" />
              <stop offset="100%" stopColor="#041E18" />
            </linearGradient>

            {/* Sovereign 24k Gold Rim */}
            <linearGradient id="nk-gold-rim" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#FEF08A" />
              <stop offset="30%" stopColor="#F59E0B" />
              <stop offset="70%" stopColor="#D97706" />
              <stop offset="100%" stopColor="#78350F" />
            </linearGradient>

            {/* Fierce Eagle Plumage Gold */}
            <linearGradient id="nk-feather-gold" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#FFFBEB" />
              <stop offset="25%" stopColor="#FDE68A" />
              <stop offset="60%" stopColor="#F59E0B" />
              <stop offset="100%" stopColor="#92400E" />
            </linearGradient>

            {/* Dark Metallic Shadow Feathers */}
            <linearGradient id="nk-feather-dark" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#1E293B" />
              <stop offset="60%" stopColor="#0F172A" />
              <stop offset="100%" stopColor="#09101F" />
            </linearGradient>

            {/* Razor Beak Gradient */}
            <linearGradient id="nk-beak" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#FEF08A" />
              <stop offset="40%" stopColor="#F59E0B" />
              <stop offset="85%" stopColor="#D97706" />
              <stop offset="100%" stopColor="#78350F" />
            </linearGradient>

            {/* Piercing Eagle Eye Glow */}
            <radialGradient id="nk-eagle-eye" cx="48%" cy="46%" r="52%">
              <stop offset="0%" stopColor="#FFFBEB" />
              <stop offset="25%" stopColor="#FDE047" />
              <stop offset="55%" stopColor="#F59E0B" />
              <stop offset="80%" stopColor="#EA580C" />
              <stop offset="100%" stopColor="#7C2D12" />
            </radialGradient>

            {/* Saffron National Accent */}
            <linearGradient id="nk-saffron" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#FF9933" />
              <stop offset="100%" stopColor="#EA580C" />
            </linearGradient>

            {/* Green National Accent */}
            <linearGradient id="nk-green" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#22C55E" />
              <stop offset="100%" stopColor="#15803D" />
            </linearGradient>

            {/* Eye Flare Laser Glint */}
            <filter id="nk-eye-glow" x="-30%" y="-30%" width="160%" height="160%">
              <feGaussianBlur stdDeviation="1.5" result="blur" />
              <feComposite in="SourceGraphic" in2="blur" operator="over" />
            </filter>
          </defs>

          {/* --- OUTER AERODYNAMIC SOVEREIGN SHIELD --- */}
          <path
            d="M 50 3 L 89 17 C 89 54 75 81 50 97 C 25 81 11 54 11 17 Z"
            fill="url(#nk-shield-bg)"
            stroke="url(#nk-gold-rim)"
            strokeWidth="2.8"
          />

          {/* Inner Tracery Rim */}
          <path
            d="M 50 7.5 L 85 20 C 85 52 72 76 50 91 C 28 76 15 52 15 20 Z"
            fill="none"
            stroke="url(#nk-gold-rim)"
            strokeWidth="0.9"
            strokeOpacity="0.55"
          />

          {/* Saffron & Green Sovereign Accents along Shield Shoulders */}
          <path d="M 22 19 L 50 8 L 78 19" stroke="url(#nk-saffron)" strokeWidth="2.5" strokeLinecap="round" />
          <path d="M 30 83 Q 50 89 70 83" stroke="url(#nk-green)" strokeWidth="2.2" strokeLinecap="round" />

          {/* Radar Telemetry Concentric Arcs (Targeting the Eagle's Vision) */}
          <circle cx="53" cy="38" r="28" stroke="#F59E0B" strokeOpacity="0.12" strokeWidth="0.8" strokeDasharray="3 3" />
          <circle cx="53" cy="38" r="18" stroke="#38BDF8" strokeOpacity="0.18" strokeWidth="0.8" />

          {/* --- INSPIRING EAGLE HEAD IN SHARP AERODYNAMIC VECTOR --- */}
          
          {/* Base Dark Plumage Under-Layers (Creates Dimensional Depth) */}
          <path
            d="M 26 23 Q 45 16 66 26 L 62 33 Q 48 27 30 31 Z"
            fill="url(#nk-feather-dark)"
          />
          <path
            d="M 18 34 Q 38 29 58 37 L 54 44 Q 38 39 20 42 Z"
            fill="url(#nk-feather-dark)"
          />
          <path
            d="M 16 46 Q 34 42 50 48 L 47 55 Q 32 50 18 53 Z"
            fill="url(#nk-feather-dark)"
          />

          {/* Top Imperial Crest Feathers (Aerodynamic Gold Blades) */}
          <path
            d="M 33 17 Q 52 12 70 23 C 65 25 56 26 48 24 Q 40 22 33 17 Z"
            fill="url(#nk-feather-gold)"
            stroke="#92400E"
            strokeWidth="0.6"
          />
          <path
            d="M 24 25 Q 46 20 64 30 C 58 32 50 33 42 31 Q 32 29 24 25 Z"
            fill="url(#nk-feather-gold)"
            stroke="#92400E"
            strokeWidth="0.6"
          />
          <path
            d="M 17 35 Q 38 30 57 38 C 51 40 44 41 36 39 Q 26 37 17 35 Z"
            fill="url(#nk-feather-gold)"
            stroke="#92400E"
            strokeWidth="0.6"
          />

          {/* Eagle Brow (Powerful, Intense, Determined Brow Ridge) */}
          <path
            d="M 36 30 C 45 27 55 30 63 35 L 64 38 C 56 36 47 34 38 34 Z"
            fill="#FFFBEB"
            stroke="#78350F"
            strokeWidth="0.6"
          />

          {/* Fierce Hooked Golden Beak */}
          <path
            d="M 63 35 C 70 38 80 43 85 52 C 86 54 84 57 80 57 C 74 57 69 51 63 47 L 61 47 Z"
            fill="url(#nk-beak)"
            stroke="#78350F"
            strokeWidth="0.8"
          />
          {/* Beak Inner Cavity / Lower Jaw */}
          <path
            d="M 63 47 L 74 52 C 70 55 65 56 58 54 L 54 48 Z"
            fill="#92400E"
          />
          {/* Beak High-Gloss Specular Blade Highlight */}
          <path
            d="M 65 37 Q 76 43 82 50"
            stroke="#FEF08A"
            strokeWidth="1.2"
            strokeLinecap="round"
          />
          {/* Nostril Slit */}
          <ellipse cx="67" cy="42" rx="1.8" ry="0.8" transform="rotate(-18 67 42)" fill="#451A03" />

          {/* --- THE PIERCING EAGLE EYE (THE EYE OF NIRIKSHAK) --- */}
          {/* Dark Eye Socket Shadow */}
          <path
            d="M 43 38 C 47 31 59 31 63 36 C 61 43 49 45 43 38 Z"
            fill="#060C18"
            stroke="#451A03"
            strokeWidth="0.8"
          />

          {/* Glowing Amber Almond Iris */}
          <ellipse cx="53" cy="38" rx="7" ry="5.2" transform="rotate(-5 53 38)" fill="url(#nk-eagle-eye)" />

          {/* Sharp Slit / Round Obsidian Pupil */}
          <ellipse cx="53.5" cy="38" rx="3.6" ry="3.8" fill="#030712" />

          {/* Inner Audit Crosshair Reticle on Eye */}
          <line x1="53.5" y1="33.5" x2="53.5" y2="35.5" stroke="#FDE047" strokeWidth="0.9" strokeLinecap="round" />
          <line x1="53.5" y1="40.5" x2="53.5" y2="42.5" stroke="#FDE047" strokeWidth="0.9" strokeLinecap="round" />
          <line x1="49" y1="38" x2="51" y2="38" stroke="#FDE047" strokeWidth="0.9" strokeLinecap="round" />
          <line x1="56" y1="38" x2="58" y2="38" stroke="#FDE047" strokeWidth="0.9" strokeLinecap="round" />

          {/* Specular White Catchlight Flash */}
          <circle cx="55.2" cy="36.2" r="1.4" fill="#FFFFFF" />
          <circle cx="52" cy="40" r="0.7" fill="#FEF08A" />

          {/* Starburst Laser Glint radiating from Eye */}
          <path
            d="M 53.5 32 L 53.5 44 M 47.5 38 L 59.5 38"
            stroke="#FEF08A"
            strokeWidth="0.6"
            strokeOpacity="0.7"
            filter="url(#nk-eye-glow)"
          />

          {/* Lower Cheek & Throat Plumage Feathers */}
          <path
            d="M 54 48 C 58 56 64 64 73 70 C 64 69 56 64 48 59 Z"
            fill="url(#nk-feather-gold)"
            stroke="#92400E"
            strokeWidth="0.6"
          />
          <path
            d="M 44 58 C 48 66 54 74 63 80 C 53 78 46 72 38 66 Z"
            fill="url(#nk-feather-gold)"
            stroke="#92400E"
            strokeWidth="0.6"
          />
          <path
            d="M 34 66 C 38 74 44 81 52 87 C 43 85 36 78 28 72 Z"
            fill="url(#nk-feather-gold)"
            stroke="#92400E"
            strokeWidth="0.6"
          />

          {/* Small 24-Spoke Sovereign Ashoka Chakra Medal at Chest/Base */}
          <circle cx="36" cy="81" r="7" fill="#0A1E3F" stroke="url(#nk-gold-rim)" strokeWidth="1.2" />
          <g stroke="#60A5FA" strokeWidth="0.55" strokeLinecap="round">
            {[0, 30, 60, 90, 120, 150, 180, 210, 240, 270, 300, 330].map((deg) => (
              <line
                key={deg}
                x1="36"
                y1="81"
                x2={36 + 5.2 * Math.cos((deg * Math.PI) / 180)}
                y2={81 + 5.2 * Math.sin((deg * Math.PI) / 180)}
              />
            ))}
          </g>
          <circle cx="36" cy="81" r="1.5" fill="#F59E0B" />

          {/* Golden Base Banner: NIRIKSHAK */}
          <path
            d="M 46 82 L 76 82 L 72 90 L 46 90 Z"
            fill="url(#nk-gold-rim)"
            stroke="#78350F"
            strokeWidth="0.6"
          />
          <text
            x="59"
            y="88.2"
            textAnchor="middle"
            fill="#060C18"
            fontSize="5.2"
            fontWeight="900"
            fontFamily="sans-serif"
            letterSpacing="0.4"
          >
            निरीक्षक
          </text>
        </svg>
      </div>

      {/* Optional Typographic Lockup */}
      {showText && (
        <div className="flex flex-col">
          <div className="flex items-center gap-2">
            <span className="font-serif font-black text-2xl tracking-tight text-[#0F172A]">
              निरीक्षक
            </span>
            <span className="text-xs font-black text-amber-800 font-mono tracking-widest uppercase">
              NIRIKSHAK
            </span>
          </div>
          <span className="text-[11px] font-medium text-slate-600">
            राष्ट्रीय एमपीलैड्स लेखापरीक्षा एवं निगरानी प्रणाली
          </span>
        </div>
      )}
    </div>
  );
};

export const NirikshanLogo = NirikshakLogo;
export default NirikshakLogo;
