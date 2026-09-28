import React, { createContext, useContext, useState, useEffect } from "react";

export type Language = "en" | "hi";

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  toggleLanguage: () => void;
  t: (key: string, fallback?: string) => string;
}

const translations: Record<Language, Record<string, string>> = {
  en: {
    // Brand & Header
    brand_name: "NIRIKSHAK",
    brand_name_hi: "निरीक्षक",
    gov_badge: "GOVT OF INDIA",
    core_badge: "Nirikshak Core",
    system_subtitle: "National MPLADS Vigilance & Audit System",
    eagle_eye_active: "Eagle-Eye AI Active",
    audit_cell: "Vigilance Cell (MoSPI/CAG)",

    // Navigation
    nav_overview: "Dashboard",
    nav_investigations: "Investigations",
    nav_map: "Geographic Map",
    nav_analytics: "Analytics",
    nav_data_quality: "Data Quality",
    nav_ingest: "Data Ingestion",
    nav_methodology: "Settings",

    // Risk Tiers
    risk_critical: "CRITICAL",
    risk_high: "HIGH",
    risk_medium: "MEDIUM",
    risk_low: "LOW",

    // Metrics & KPI
    stat_total_works: "Total Works",
    stat_sanctioned: "Total Sanctioned",
    stat_expenditure: "Total Expenditure",
    stat_utilization: "Avg Utilization",
    stat_critical_flagged: "Critical Prioritized",
    subtext_audited: "Audited projects",
    subtext_outlay: "Approved outlay",
    subtext_disbursed: "Disbursed funds",
    subtext_rate: "Scheme spend rate",
    subtext_require_audit: "Immediate on-site audit",

    // Common Actions
    action_investigate: "Investigate",
    action_view_dossier: "Official Audit Dossier",
    action_inspection_notice: "Physical Inspection Order",
    action_copilot: "Nirikshak AI Copilot",
    action_export: "Export Dossier",
    action_print: "Print Notice",
    action_close: "Close",

    // Investigation labels
    label_work_id: "Work ID",
    label_status: "Work Status",
    label_cost: "Sanctioned Cost",
    label_expenditure: "Expenditure",
    label_balance: "Balance",
    label_agency: "Implementing Agency",
    label_location: "Location",
    label_recommendation: "Audit Directive",
    label_satellite: "Geospatial & Satellite Ground Truth",
  },
  hi: {
    // Brand & Header
    brand_name: "निरीक्षक",
    brand_name_hi: "NIRIKSHAK",
    gov_badge: "भारत सरकार",
    core_badge: "निरीक्षक कोर",
    system_subtitle: "राष्ट्रीय एमपीलैड्स लेखापरीक्षा एवं निगरानी प्रणाली",
    eagle_eye_active: "गरुड़ दृष्टि सक्रिय",
    audit_cell: "सतर्कता प्रकोष्ठ (MoSPI/CAG)",

    // Navigation
    nav_overview: "डैशबोर्ड",
    nav_investigations: "जांच सूची",
    nav_map: "भौगोलिक मानचित्र",
    nav_analytics: "विश्लेषण एवं सांख्यिकी",
    nav_data_quality: "डेटा गुणवत्ता",
    nav_ingest: "डेटा प्रविष्टि",
    nav_methodology: "सेटिंग्स व नियम",

    // Risk Tiers
    risk_critical: "अति गंभीर",
    risk_high: "उच्च जोखिम",
    risk_medium: "मध्यम",
    risk_low: "सामान्य",

    // Metrics & KPI
    stat_total_works: "कुल परियोजनाएं",
    stat_sanctioned: "स्वीकृत राशि",
    stat_expenditure: "कुल व्यय",
    stat_utilization: "औसत उपयोग दर",
    stat_critical_flagged: "तत्काल सत्यापन योग्य",
    subtext_audited: "सत्यापित कार्य",
    subtext_outlay: "प्रशासनिक आवंटन",
    subtext_disbursed: "वितरित धनराशि",
    subtext_rate: "कुल व्यय प्रतिशत",
    subtext_require_audit: "तत्काल भौतिक सत्यापन",

    // Common Actions
    action_investigate: "विस्तृत जांच",
    action_view_dossier: "आधिकारिक ऑडिट डोजियर",
    action_inspection_notice: "भौतिक निरीक्षण आदेश",
    action_copilot: "निरीक्षक एआई सहायक",
    action_export: "डोजियर डाउनलोड",
    action_print: "प्रिंट आदेश",
    action_close: "बंद करें",

    // Investigation labels
    label_work_id: "कार्य पहचान संख्या",
    label_status: "कार्य स्थिति",
    label_cost: "स्वीकृत लागत",
    label_expenditure: "वास्तविक व्यय",
    label_balance: "शेष राशि",
    label_agency: "कार्यकारी एजेंसी",
    label_location: "स्थान / कार्यक्षेत्र",
    label_recommendation: "लेखापरीक्षा निर्देश",
    label_satellite: "भू-स्थानिक एवं उपग्रह सत्यापन",
  },
};

const LanguageContext = createContext<LanguageContextType>({
  language: "en",
  setLanguage: () => {},
  toggleLanguage: () => {},
  t: (key: string, fallback?: string) => fallback || key,
});

export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [language, setLanguageState] = useState<Language>(() => {
    return (localStorage.getItem("nirikshak_lang") as Language) || "en";
  });

  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
    localStorage.setItem("nirikshak_lang", lang);
  };

  const toggleLanguage = () => {
    const next = language === "en" ? "hi" : "en";
    setLanguage(next);
  };

  const t = (key: string, fallback?: string): string => {
    return translations[language]?.[key] || fallback || key;
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, toggleLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => useContext(LanguageContext);
export default LanguageContext;
