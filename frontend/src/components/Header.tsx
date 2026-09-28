import React from "react";
import { NirikshakLogo } from "./NirikshakLogo";
import { ShieldCheck, Eye, Languages } from "lucide-react";
import { useLanguage } from "../context/LanguageContext";

export const Header: React.FC = () => {
  const { language, toggleLanguage, t } = useLanguage();

  return (
    <header className="h-16 shrink-0 bg-white border-b border-[#E2E8F0] px-4 sm:px-6 flex items-center justify-between z-30 shadow-xs select-none">
      {/* Left Branding: Eagle Sovereign Emblem + Hindi / English Title */}
      <div className="flex items-center gap-3 min-w-0">
        <NirikshakLogo size={46} withGlow={true} />
        <div className="min-w-0">
          <div className="flex items-center gap-2">
            <h1 className="text-xl sm:text-2xl font-black text-[#0F172A] tracking-tight flex items-baseline gap-1.5 leading-none">
              <span className="text-xl sm:text-2xl font-black text-[#0F172A] font-serif">
                {t("brand_name")}
              </span>
              <span className="text-[11px] sm:text-xs font-black text-amber-700 font-mono tracking-widest uppercase">
                {t("brand_name_hi")}
              </span>
            </h1>

            {/* Sovereign Badge */}
            <span className="hidden sm:inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-md bg-gradient-to-r from-amber-50 to-orange-50 text-amber-900 border border-amber-300/80 shrink-0">
              <span className="w-1.5 h-1.5 rounded-full bg-[#EA580C]"></span>
              {t("gov_badge")}
            </span>

            <span className="hidden md:inline-flex items-center gap-1 text-[10px] font-semibold px-2 py-0.5 rounded-md bg-emerald-50 text-emerald-800 border border-emerald-200 shrink-0">
              <span className="w-1.5 h-1.5 rounded-full bg-[#16A34A] animate-pulse"></span>
              {t("core_badge")}
            </span>
          </div>

          <p className="text-[11px] text-[#475569] font-medium tracking-tight mt-0.5 truncate max-w-[320px] sm:max-w-[460px] lg:max-w-none">
            <span>{t("system_subtitle")}</span>
          </p>
        </div>
      </div>

      {/* Right Header Status + Bilingual Language Switcher */}
      <div className="flex items-center gap-2.5 shrink-0">
        {/* Language Switcher Toggle */}
        <button
          onClick={toggleLanguage}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 border border-slate-200 text-xs font-bold text-[#1E293B] transition cursor-pointer shadow-2xs"
          title="Switch Language / भाषा बदलें"
        >
          <Languages className="w-3.5 h-3.5 text-amber-600" />
          <span>{language === "en" ? "हिन्दी" : "English"}</span>
        </button>

        <div className="hidden lg:flex items-center gap-2 px-2.5 py-1.5 rounded-xl bg-gradient-to-r from-slate-50 to-amber-50/50 border border-slate-200 text-xs font-semibold text-[#1E293B]">
          <Eye className="w-3.5 h-3.5 text-amber-600 animate-pulse shrink-0" />
          <span className="font-serif text-[11px]">{t("eagle_eye_active")}</span>
        </div>
        
        <div className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl bg-[#ECFDF5] border border-[#A7F3D0] text-xs font-bold text-[#065F46]">
          <ShieldCheck className="w-3.5 h-3.5 text-[#059669] shrink-0" />
          <span className="hidden sm:inline">{t("audit_cell")}</span>
          <span className="sm:hidden">सतर्कता</span>
        </div>
      </div>
    </header>
  );
};
