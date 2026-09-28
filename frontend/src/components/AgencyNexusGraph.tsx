import React, { useState } from "react";
import { Building2, AlertTriangle, ShieldAlert, Award, ExternalLink, Filter, TrendingUp, Users } from "lucide-react";
import { formatINR } from "../services/api";

interface AgencyStat {
  name: string;
  district: string;
  state: string;
  totalWorks: number;
  totalSanctioned: number;
  totalExpended: number;
  monopolyScore: number; // 0-100
  highRiskCount: number;
  isMonopolyFlagged: boolean;
  sampleWorkIds: string[];
}

const DEMO_AGENCIES: AgencyStat[] = [
  {
    name: "M/s Purvanchal InfraTech Services",
    district: "Varanasi",
    state: "Uttar Pradesh",
    totalWorks: 10,
    totalSanctioned: 18500000,
    totalExpended: 18450000,
    monopolyScore: 98.4,
    highRiskCount: 0,
    isMonopolyFlagged: true,
    sampleWorkIds: ["MPLADS-2023-UP-CL01", "MPLADS-2023-UP-CL02", "MPLADS-2023-UP-CL03"],
  },
  {
    name: "Zilla Parishad Pune (Gram Panchayat Division)",
    district: "Pune",
    state: "Maharashtra",
    totalWorks: 24,
    totalSanctioned: 84200000,
    totalExpended: 79500000,
    monopolyScore: 54.2,
    highRiskCount: 3,
    isMonopolyFlagged: false,
    sampleWorkIds: ["MPLADS-2023-MH-042"],
  },
  {
    name: "Tamil Nadu PWD (Rural Infrastructure Circle)",
    district: "Coimbatore",
    state: "Tamil Nadu",
    totalWorks: 18,
    totalSanctioned: 62000000,
    totalExpended: 68500000,
    monopolyScore: 61.0,
    highRiskCount: 4,
    isMonopolyFlagged: false,
    sampleWorkIds: ["MPLADS-2023-TN-164"],
  },
  {
    name: "Karnataka Rural Infrastructure Development Ltd (KRIDL)",
    district: "Mysuru",
    state: "Karnataka",
    totalWorks: 15,
    totalSanctioned: 48500000,
    totalExpended: 22100000,
    monopolyScore: 47.5,
    highRiskCount: 2,
    isMonopolyFlagged: false,
    sampleWorkIds: ["MPLADS-2023-KA-088"],
  },
  {
    name: "Nadia District Public Health Engineering Division",
    district: "Nadia",
    state: "West Bengal",
    totalWorks: 12,
    totalSanctioned: 39000000,
    totalExpended: 38200000,
    monopolyScore: 42.1,
    highRiskCount: 1,
    isMonopolyFlagged: false,
    sampleWorkIds: ["MPLADS-2023-WB-203"],
  },
];

export const AgencyNexusGraph: React.FC<{ onSelectWork?: (id: string) => void }> = ({ onSelectWork }) => {
  const [selectedAgency, setSelectedAgency] = useState<AgencyStat>(DEMO_AGENCIES[0]);
  const [filterMonopoliesOnly, setFilterMonopoliesOnly] = useState(false);

  const displayedAgencies = filterMonopoliesOnly
    ? DEMO_AGENCIES.filter((a) => a.isMonopolyFlagged)
    : DEMO_AGENCIES;

  return (
    <div className="bg-white border border-[#E2E8F0] rounded-3xl p-6 shadow-xs space-y-6">
      {/* Title & Filter Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-[#F1F5F9] pb-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-bold uppercase tracking-wider text-amber-800 bg-amber-50 px-2 py-0.5 rounded border border-amber-200">
              Contractor Nexus & Cartel Scrutiny
            </span>
          </div>
          <h3 className="text-base font-extrabold text-[#1E293B] mt-1">
            Vendor & Implementing Agency Concentration Network
          </h3>
          <p className="text-xs text-[#64748B]">
            Detecting micro-geographic vendor monopolies, contract clustering, and single-contractor award saturation
          </p>
        </div>

        <button
          onClick={() => setFilterMonopoliesOnly(!filterMonopoliesOnly)}
          className={`px-3 py-1.5 rounded-xl text-xs font-bold transition cursor-pointer flex items-center gap-1.5 ${
            filterMonopoliesOnly
              ? "bg-rose-600 text-white shadow-xs"
              : "bg-slate-100 hover:bg-slate-200 text-slate-700"
          }`}
        >
          <Filter className="w-3.5 h-3.5" />
          <span>{filterMonopoliesOnly ? "Showing Flagged Monopolies" : "Filter Monopolies"}</span>
        </button>
      </div>

      {/* Grid: Agency List Cards + Selected Agency Detail Panel */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Side: Agency List */}
        <div className="lg:col-span-7 space-y-3">
          <span className="text-[11px] font-bold uppercase tracking-wider text-[#94A3B8] block">
            Ranked Executing Agencies & Contractors
          </span>

          <div className="space-y-2.5">
            {displayedAgencies.map((agency) => {
              const isSelected = selectedAgency.name === agency.name;
              return (
                <div
                  key={agency.name}
                  onClick={() => setSelectedAgency(agency)}
                  className={`p-4 rounded-2xl border transition-all cursor-pointer ${
                    isSelected
                      ? "bg-slate-900 text-white border-slate-900 shadow-md scale-[1.01]"
                      : "bg-[#F8FAFC] hover:bg-white hover:border-slate-300 border-[#E2E8F0] text-[#1E293B]"
                  }`}
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="min-w-0">
                      <div className="flex items-center gap-2">
                        <Building2 className={`w-4 h-4 shrink-0 ${isSelected ? "text-amber-400" : "text-slate-500"}`} />
                        <h4 className="text-xs font-bold truncate">
                          {agency.name}
                        </h4>
                      </div>
                      <p className={`text-[11px] mt-1 ${isSelected ? "text-slate-300" : "text-[#64748B]"}`}>
                        {agency.district}, {agency.state} &bull; <strong className="font-mono">{agency.totalWorks} Works</strong>
                      </p>
                    </div>

                    <div className="text-right shrink-0">
                      {agency.isMonopolyFlagged ? (
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-extrabold bg-rose-500/20 text-rose-300 border border-rose-500/40 inline-flex items-center gap-1">
                          <AlertTriangle className="w-3 h-3" /> MONOPOLY
                        </span>
                      ) : (
                        <span className={`text-xs font-bold font-mono ${isSelected ? "text-emerald-400" : "text-emerald-600"}`}>
                          {agency.monopolyScore.toFixed(0)}% Share
                        </span>
                      )}
                      <span className={`text-[11px] font-mono block mt-0.5 ${isSelected ? "text-slate-300" : "text-slate-600"}`}>
                        {formatINR(agency.totalSanctioned)}
                      </span>
                    </div>
                  </div>

                  {/* Micro Progress Bar of Cluster Concentration */}
                  <div className="mt-3 w-full bg-slate-200/40 rounded-full h-1.5 overflow-hidden">
                    <div
                      className={`h-full rounded-full ${
                        agency.isMonopolyFlagged ? "bg-rose-500" : "bg-emerald-500"
                      }`}
                      style={{ width: `${agency.monopolyScore}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right Side: Selected Agency Deep-Dive Nexus Inspector */}
        <div className="lg:col-span-5 bg-[#F8FAFC] border border-[#E2E8F0] rounded-2xl p-5 flex flex-col justify-between space-y-4">
          <div>
            <div className="flex items-center justify-between border-b border-[#E2E8F0] pb-3">
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500">
                Nexus Intelligence Profile
              </span>
              {selectedAgency.isMonopolyFlagged && (
                <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-rose-100 text-rose-800 border border-rose-200">
                  Cartel Risk Alert
                </span>
              )}
            </div>

            <div className="mt-3">
              <h4 className="text-sm font-extrabold text-slate-900 leading-snug">
                {selectedAgency.name}
              </h4>
              <p className="text-xs text-slate-600 mt-1">
                District: <strong>{selectedAgency.district} ({selectedAgency.state})</strong>
              </p>
            </div>

            {/* Metrics Grid */}
            <div className="grid grid-cols-2 gap-2.5 mt-4 text-xs">
              <div className="bg-white p-2.5 rounded-xl border border-slate-200">
                <span className="text-[10px] text-slate-500 font-bold uppercase block">Cluster Outlay</span>
                <span className="font-extrabold text-slate-900 font-mono">{formatINR(selectedAgency.totalSanctioned)}</span>
              </div>
              <div className="bg-white p-2.5 rounded-xl border border-slate-200">
                <span className="text-[10px] text-slate-500 font-bold uppercase block">Concentration</span>
                <span className={`font-extrabold font-mono ${selectedAgency.isMonopolyFlagged ? "text-rose-600" : "text-emerald-700"}`}>
                  {selectedAgency.monopolyScore}% of Block
                </span>
              </div>
            </div>

            {/* Monopoly Analysis Context */}
            <div className="mt-4 p-3 rounded-xl bg-white border border-slate-200 text-xs space-y-1.5 text-slate-700">
              <span className="font-bold text-slate-900 block flex items-center gap-1.5">
                <ShieldAlert className="w-3.5 h-3.5 text-amber-600" />
                Vigilance Finding:
              </span>
              <p className="text-[11px] leading-relaxed text-slate-600">
                {selectedAgency.isMonopolyFlagged
                  ? "Extreme clustering: 100% of street lighting works in Kashi-Puram block were awarded exclusively to this single vendor without competitive peer distribution. Immediate tender process scrutiny advised."
                  : "Normal distribution across block works. Fund disbursement tracks standard public procurement thresholds."}
              </p>
            </div>

            {/* Linked Sample Works */}
            <div className="mt-4 space-y-2">
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500 block">
                Sample Awarded Works in Cluster:
              </span>
              <div className="space-y-1.5">
                {selectedAgency.sampleWorkIds.map((wid) => (
                  <button
                    key={wid}
                    onClick={() => onSelectWork && onSelectWork(wid)}
                    className="w-full flex items-center justify-between p-2 rounded-lg bg-white hover:bg-amber-50 border border-slate-200 text-xs font-mono font-bold text-slate-800 transition cursor-pointer"
                  >
                    <span>{wid}</span>
                    <ExternalLink className="w-3.5 h-3.5 text-slate-400" />
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
export default AgencyNexusGraph;
