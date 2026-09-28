import React, { useState, useEffect } from "react";
import { MapPin, ExternalLink, RefreshCw, Filter, Layers, Navigation, ArrowRight } from "lucide-react";
import type { Work } from "../types";
import { fetchWorks, formatINR } from "../services/api";
import { WorkLocationMap } from "../maps/WorkLocationMap";
import { RiskBadge } from "../components/RiskBadge";

interface Props {
  onSelectWork: (workId: string) => void;
}

export const MapPage: React.FC<Props> = ({ onSelectWork }) => {
  const [works, setWorks] = useState<Work[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [selectedWorkId, setSelectedWorkId] = useState<string | undefined>();
  const [riskFilter, setRiskFilter] = useState<string>("");
  const [workTypeFilter, setWorkTypeFilter] = useState<string>("");

  const WORK_TYPES = [
    "Rural Road & Culvert",
    "Drinking Water Facility",
    "Community Infrastructure",
    "School Classroom & Education",
    "Primary Health Sub-Center & Medical",
    "Solar & Public Lighting",
    "Sanitation & Public Amenities",
    "Sports & Youth Welfare",
  ];

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      try {
        const res = await fetchWorks({
          limit: 1200,
          risk_level: riskFilter || undefined,
          work_type: workTypeFilter || undefined,
        });
        setWorks(res.items);
      } catch (e) {
        console.error("Failed to load map works", e);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [riskFilter, workTypeFilter]);

  const criticalCount = works.filter((w) => w.risk_level === "CRITICAL").length;
  const highRiskCount = works.filter((w) => w.risk_level === "HIGH").length;
  const mediumCount = works.filter((w) => w.risk_level === "MEDIUM").length;
  const lowCount = works.filter((w) => w.risk_level === "LOW").length;

  return (
    <div className="space-y-6 pb-16">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold uppercase tracking-wider text-[#F5A20A] bg-[#FFF7ED] px-2.5 py-0.5 rounded-md border border-[#FFEDD5]">
              Spatial Intelligence
            </span>
          </div>
          <h1 className="text-2xl font-extrabold text-[#1E293B] tracking-tight mt-1 flex items-center gap-2">
            Geographic Risk Map
          </h1>
          <p className="text-xs text-[#64748B] mt-0.5">
            Geospatial density and cluster analysis across constituencies
          </p>
        </div>

        {/* Filters */}
        <div className="flex flex-wrap items-center gap-2.5">
          {/* Work Type Filter */}
          <select
            value={workTypeFilter}
            onChange={(e) => setWorkTypeFilter(e.target.value)}
            className="bg-white border border-[#CBD5E1] rounded-xl px-3 py-2 text-xs font-bold text-[#1E293B] focus:outline-none focus:ring-2 focus:ring-[#625BE8] cursor-pointer shadow-2xs"
          >
            <option value="">All Work Types</option>
            {WORK_TYPES.map((wt) => (
              <option key={wt} value={wt}>
                {wt}
              </option>
            ))}
          </select>

          {/* Risk Filter */}
          <select
            value={riskFilter}
            onChange={(e) => setRiskFilter(e.target.value)}
            className="bg-white border border-[#CBD5E1] rounded-xl px-3 py-2 text-xs font-bold text-[#1E293B] focus:outline-none focus:ring-2 focus:ring-[#F5A20A] cursor-pointer shadow-2xs"
          >
            <option value="">All Risk Tiers</option>
            <option value="CRITICAL">Critical Only</option>
            <option value="HIGH">High Only</option>
            <option value="MEDIUM">Medium Only</option>
            <option value="LOW">Low Only</option>
          </select>

          {(riskFilter || workTypeFilter) && (
            <button
              onClick={() => {
                setRiskFilter("");
                setWorkTypeFilter("");
              }}
              className="text-[11px] font-bold text-[#64748B] hover:text-[#0F172A] px-2.5 py-1.5 rounded-lg border border-[#E2E8F0] bg-white transition hover:bg-[#F8FAFC]"
            >
              Reset
            </button>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Map Canvas (8 columns) */}
        <div className="lg:col-span-8">
          <WorkLocationMap
            works={works}
            onSelectWork={onSelectWork}
            selectedWorkId={selectedWorkId}
            height="h-[620px]"
            onFilterRisk={(tier) => setRiskFilter(tier)}
            activeRiskFilter={riskFilter}
          />
        </div>

        {/* Side Panel: "WORKS IN VIEW" (4 columns) */}
        <div className="lg:col-span-4 bg-white border border-[#E2E8F0] rounded-3xl p-5 flex flex-col h-[620px] shadow-xs justify-between">
          <div className="border-b border-[#E2E8F0] pb-3.5 space-y-2.5">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-[#94A3B8]">
                Spatial Registry
              </span>
              <span className="text-xs font-bold text-[#625BE8]">{works.length} Geo-tagged</span>
            </div>
            <h3 className="text-base font-extrabold text-[#1E293B]">WORKS IN VIEW</h3>

            {/* 5-tier distribution cards (Interactive Quick-Filters) */}
            <div className="grid grid-cols-5 gap-1.5 text-center text-xs pt-1">
              <button
                type="button"
                onClick={() => setRiskFilter("")}
                title="Show all works"
                className={`p-2 rounded-xl border transition cursor-pointer text-center ${
                  !riskFilter
                    ? "bg-[#F1F5F9] border-[#94A3B8] ring-2 ring-[#625BE8]/30 font-extrabold shadow-2xs"
                    : "bg-[#F8FAFC] border-[#E2E8F0] hover:bg-[#F1F5F9]"
                }`}
              >
                <span className="text-[9px] text-[#64748B] font-bold uppercase block">TOTAL</span>
                <span className="font-extrabold text-xs text-[#1E293B] mt-0.5 block">{works.length}</span>
              </button>
              <button
                type="button"
                onClick={() => setRiskFilter(riskFilter === "CRITICAL" ? "" : "CRITICAL")}
                title="Filter to Critical (Suspected Corruption)"
                className={`p-2 rounded-xl border transition cursor-pointer text-center ${
                  riskFilter === "CRITICAL"
                    ? "bg-[#FEF2F2] border-[#EF4444] ring-2 ring-[#EF4444]/40 font-extrabold shadow-2xs"
                    : "bg-[#FEF2F2]/60 border-[#FECDD3] hover:bg-[#FEF2F2]"
                }`}
              >
                <span className="text-[9px] text-[#EF4444] font-bold uppercase block">CRIT</span>
                <span className="font-extrabold text-xs text-[#EF4444] mt-0.5 block">{criticalCount}</span>
              </button>
              <button
                type="button"
                onClick={() => setRiskFilter(riskFilter === "HIGH" ? "" : "HIGH")}
                title="Filter to High Risk"
                className={`p-2 rounded-xl border transition cursor-pointer text-center ${
                  riskFilter === "HIGH"
                    ? "bg-[#FFF7ED] border-[#F97316] ring-2 ring-[#F97316]/40 font-extrabold shadow-2xs"
                    : "bg-[#FFF7ED]/60 border-[#FFEDD5] hover:bg-[#FFF7ED]"
                }`}
              >
                <span className="text-[9px] text-[#F97316] font-bold uppercase block">HIGH</span>
                <span className="font-extrabold text-xs text-[#F97316] mt-0.5 block">{highRiskCount}</span>
              </button>
              <button
                type="button"
                onClick={() => setRiskFilter(riskFilter === "MEDIUM" ? "" : "MEDIUM")}
                title="Filter to Medium Risk"
                className={`p-2 rounded-xl border transition cursor-pointer text-center ${
                  riskFilter === "MEDIUM"
                    ? "bg-[#FEFCE8] border-[#EAB308] ring-2 ring-[#EAB308]/40 font-extrabold shadow-2xs"
                    : "bg-[#FEFCE8]/60 border-[#FEF08A] hover:bg-[#FEFCE8]"
                }`}
              >
                <span className="text-[9px] text-[#CA8A04] font-bold uppercase block">MED</span>
                <span className="font-extrabold text-xs text-[#CA8A04] mt-0.5 block">{mediumCount}</span>
              </button>
              <button
                type="button"
                onClick={() => setRiskFilter(riskFilter === "LOW" ? "" : "LOW")}
                title="Filter to Compliant Works (Good Job)"
                className={`p-2 rounded-xl border transition cursor-pointer text-center ${
                  riskFilter === "LOW"
                    ? "bg-[#ECFDF5] border-[#10B981] ring-2 ring-[#10B981]/40 font-extrabold shadow-2xs"
                    : "bg-[#ECFDF5]/60 border-[#A7F3D0] hover:bg-[#ECFDF5]"
                }`}
              >
                <span className="text-[9px] text-[#10B981] font-bold uppercase block">LOW</span>
                <span className="font-extrabold text-xs text-[#10B981] mt-0.5 block">{lowCount}</span>
              </button>
            </div>
          </div>

          {/* List of works in view */}
          <div className="flex-1 overflow-y-auto divide-y divide-[#F1F5F9] my-2 pr-1 space-y-1">
            {works.slice(0, 40).map((w) => (
              <div
                key={w.work_id}
                onClick={() => setSelectedWorkId(w.work_id)}
                className={`py-2 px-3 rounded-2xl cursor-pointer transition text-xs ${
                  selectedWorkId === w.work_id
                    ? "bg-[#EEF2FF] border border-[#C7D2FE]"
                    : "hover:bg-[#F8FAFC]"
                }`}
              >
                <div className="flex items-center justify-between mb-1">
                  <span className="font-mono font-bold text-[#625BE8] text-xs">
                    {w.work_id}
                  </span>
                  <RiskBadge level={w.risk_level} size="sm" />
                </div>
                <p className="text-xs text-[#1E293B] truncate font-semibold mb-1">
                  {w.work_description}
                </p>
                <div className="flex items-center justify-between text-[11px] text-[#64748B] font-mono">
                  <span className="truncate max-w-[150px] font-sans text-[10px] bg-[#F1F5F9] px-1.5 py-0.5 rounded text-[#475569]">
                    {w.work_type}
                  </span>
                  <span className="font-bold text-[#1E293B]">{formatINR(w.sanctioned_amount)}</span>
                </div>
              </div>
            ))}
          </div>

          <div className="pt-2.5 border-t border-[#E2E8F0] text-center">
            <span className="text-[11px] text-[#94A3B8] font-medium block">
              Click any work to focus or click marker for dossier
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
