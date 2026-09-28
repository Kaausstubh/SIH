import React from "react";
import {
  LayoutDashboard,
  FileSpreadsheet,
  SearchCode,
  MapPin,
  BarChart3,
  CheckCircle2,
  Database,
  Sliders,
  ShieldCheck,
} from "lucide-react";

export type NavItem =
  | "overview"
  | "investigations"
  | "map"
  | "analytics"
  | "data-quality"
  | "ingest"
  | "methodology";

interface Props {
  activeItem: NavItem;
  onSelect: (item: NavItem) => void;
  priorityCount?: number;
  qualityIssueCount?: number;
}

import { useLanguage } from "../context/LanguageContext";

export const Sidebar: React.FC<Props> = ({
  activeItem,
  onSelect,
  priorityCount = 0,
  qualityIssueCount = 0,
}) => {
  const { t } = useLanguage();

  const mainNav = [
    {
      id: "investigations",
      label: t("nav_investigations", "Investigations"),
      icon: SearchCode,
      badge: priorityCount > 0 ? priorityCount : undefined,
      badgeColor: "bg-[#FFF1F2] text-[#E11D48] border-[#FECDD3]",
    },
    { id: "overview", label: t("nav_overview", "Dashboard"), icon: LayoutDashboard },
    { id: "map", label: t("nav_map", "Geographic Map"), icon: MapPin },
    { id: "analytics", label: t("nav_analytics", "Analytics"), icon: BarChart3 },
    {
      id: "data-quality",
      label: t("nav_data_quality", "Data Quality"),
      icon: CheckCircle2,
      badge: qualityIssueCount > 0 ? qualityIssueCount : undefined,
      badgeColor: "bg-[#FEFCE8] text-[#CA8A04] border-[#FEF08A]",
    },
  ];

  const secondaryNav = [
    { id: "ingest", label: t("nav_ingest", "Data Ingestion"), icon: Database },
    { id: "methodology", label: t("nav_methodology", "Settings"), icon: Sliders },
  ];

  return (
    <aside className="w-56 lg:w-60 bg-white border-r border-[#E2E8F0] flex flex-col justify-between shrink-0 h-full overflow-y-auto select-none">
      <div className="p-4 space-y-6">
        {/* Main Section */}
        <div>
          <div className="px-3 mb-2.5">
            <span className="text-[11px] font-bold uppercase tracking-wider text-[#94A3B8]">
              Navigation
            </span>
          </div>
          <nav className="space-y-1">
            {mainNav.map((item) => {
              const Icon = item.icon;
              const isActive = activeItem === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => onSelect(item.id as NavItem)}
                  className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-sm font-semibold transition cursor-pointer ${
                    isActive
                      ? "bg-[#16A66A] text-white shadow-xs"
                      : "text-[#475569] hover:bg-[#F1F5F9] hover:text-[#1E293B]"
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <Icon
                      className={`w-4 h-4 ${
                        isActive ? "text-white" : "text-[#64748B]"
                      }`}
                    />
                    <span>{item.label}</span>
                  </div>
                  {item.badge !== undefined && (
                    <span
                      className={`px-2 py-0.5 rounded-full text-[11px] font-bold border ${
                        isActive
                          ? "bg-white text-[#16A66A] border-white"
                          : item.badgeColor
                      }`}
                    >
                      {item.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </nav>
        </div>

        {/* Administration Section */}
        <div>
          <div className="px-3 mb-2.5">
            <span className="text-[11px] font-bold uppercase tracking-wider text-[#94A3B8]">
              Administration
            </span>
          </div>
          <nav className="space-y-1">
            {secondaryNav.map((item) => {
              const Icon = item.icon;
              const isActive = activeItem === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => onSelect(item.id as NavItem)}
                  className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm font-semibold transition cursor-pointer ${
                    isActive
                      ? "bg-[#16A66A] text-white shadow-xs"
                      : "text-[#475569] hover:bg-[#F1F5F9] hover:text-[#1E293B]"
                  }`}
                >
                  <Icon
                    className={`w-4 h-4 ${
                      isActive ? "text-white" : "text-[#64748B]"
                    }`}
                  />
                  <span>{item.label}</span>
                </button>
              );
            })}
          </nav>
        </div>
      </div>

      {/* Footer Multi-Agent Engine Status */}
      <div className="p-4 border-t border-[#E2E8F0] m-3 bg-[#F8FAFC] rounded-2xl text-xs text-[#64748B] space-y-1.5">
        <div className="flex items-center justify-between text-[#1E293B] font-bold">
          <div className="flex items-center gap-1.5">
            <ShieldCheck className="w-4 h-4 text-[#16A66A]" />
            <span>निरीक्षक कोर (Nirikshak)</span>
          </div>
          <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-amber-100 text-amber-800 font-bold border border-amber-200">v2.0</span>
        </div>
        <div className="flex items-center justify-between text-[11px]">
          <span>Specialist Agents:</span>
          <span className="font-semibold text-[#16A66A]">5 Online</span>
        </div>
        <div className="flex items-center justify-between text-[11px]">
          <span>ML Outlier Engine:</span>
          <span className="font-semibold text-[#625BE8]">Isolation Forest</span>
        </div>
      </div>
    </aside>
  );
};
