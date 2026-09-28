import React, { useEffect } from "react";
import { MapContainer, TileLayer, CircleMarker, Popup, useMap } from "react-leaflet";
import type { Work } from "../types";
import { RiskBadge } from "../components/RiskBadge";
import { formatINR } from "../services/api";
import { ArrowRight, SearchCode, MapPin } from "lucide-react";

interface Props {
  works: Work[];
  onSelectWork: (workId: string) => void;
  selectedWorkId?: string;
  height?: string;
  onFilterRisk?: (risk: string) => void;
  activeRiskFilter?: string;
}

const MapRecenter: React.FC<{ center: [number, number]; zoom: number }> = ({ center, zoom }) => {
  const map = useMap();
  useEffect(() => {
    map.setView(center, zoom);
  }, [center, zoom, map]);
  return null;
};

export const WorkLocationMap: React.FC<Props> = ({
  works,
  onSelectWork,
  selectedWorkId,
  height = "h-[560px]",
  onFilterRisk,
  activeRiskFilter = "",
}) => {
  const validWorks = works.filter(
    (w) => w.latitude && w.longitude && !isNaN(w.latitude) && !isNaN(w.longitude)
  );

  const selectedWork = validWorks.find((w) => w.work_id === selectedWorkId);
  const center: [number, number] = selectedWork
    ? [selectedWork.latitude!, selectedWork.longitude!]
    : [20.5937, 78.9629];
  const zoom = selectedWork ? 12 : 5;

  const critCount = validWorks.filter((w) => w.risk_level?.toUpperCase() === "CRITICAL").length;
  const highCount = validWorks.filter((w) => w.risk_level?.toUpperCase() === "HIGH").length;
  const medCount = validWorks.filter((w) => w.risk_level?.toUpperCase() === "MEDIUM").length;
  const lowCount = validWorks.filter((w) => w.risk_level?.toUpperCase() === "LOW").length;

  const getColor = (risk: string) => {
    switch (risk?.toUpperCase()) {
      case "CRITICAL":
        return "#EF4444"; // Vivid Crimson Red
      case "HIGH":
        return "#F97316"; // Bright Amber Orange
      case "MEDIUM":
        return "#EAB308"; // Bright Golden Yellow
      case "LOW":
        return "#10B981"; // Vibrant Emerald Green
      default:
        return "#64748B";
    }
  };

  // Render LOW markers first, then MEDIUM, HIGH, and CRITICAL on top
  const sortedWorks = [...validWorks].sort((a, b) => {
    const priority: Record<string, number> = {
      LOW: 1,
      MEDIUM: 2,
      HIGH: 3,
      CRITICAL: 4,
    };
    return (
      (priority[a.risk_level?.toUpperCase() || ""] || 0) -
      (priority[b.risk_level?.toUpperCase() || ""] || 0)
    );
  });

  return (
    <div className={`w-full ${height} rounded-3xl overflow-hidden border border-[#E2E8F0] relative shadow-xs`}>
      {/* Interactive Legend Overlay with Clickable Filter Pills */}
      <div className="absolute top-4 right-4 z-[1000] bg-white/95 backdrop-blur-md border border-[#E2E8F0] rounded-2xl px-3 py-1.5 text-xs font-semibold flex items-center gap-1.5 shadow-md">
        <button
          onClick={() => onFilterRisk?.(activeRiskFilter === "CRITICAL" ? "" : "CRITICAL")}
          title="Filter to Critical (Suspected Corruption)"
          className={`flex items-center gap-1.5 px-2 py-1 rounded-xl transition cursor-pointer text-[#1E293B] ${
            activeRiskFilter === "CRITICAL" ? "bg-[#FEF2F2] ring-1 ring-[#EF4444] font-bold" : "hover:bg-[#F8FAFC]"
          }`}
        >
          <span className="w-2.5 h-2.5 rounded-full bg-[#EF4444]" /> Critical ({critCount})
        </button>
        <button
          onClick={() => onFilterRisk?.(activeRiskFilter === "HIGH" ? "" : "HIGH")}
          title="Filter to High Risk"
          className={`flex items-center gap-1.5 px-2 py-1 rounded-xl transition cursor-pointer text-[#1E293B] ${
            activeRiskFilter === "HIGH" ? "bg-[#FFF7ED] ring-1 ring-[#F97316] font-bold" : "hover:bg-[#F8FAFC]"
          }`}
        >
          <span className="w-2.5 h-2.5 rounded-full bg-[#F97316]" /> High ({highCount})
        </button>
        <button
          onClick={() => onFilterRisk?.(activeRiskFilter === "MEDIUM" ? "" : "MEDIUM")}
          title="Filter to Medium Risk"
          className={`flex items-center gap-1.5 px-2 py-1 rounded-xl transition cursor-pointer text-[#1E293B] ${
            activeRiskFilter === "MEDIUM" ? "bg-[#FEFCE8] ring-1 ring-[#EAB308] font-bold" : "hover:bg-[#F8FAFC]"
          }`}
        >
          <span className="w-2.5 h-2.5 rounded-full bg-[#EAB308]" /> Med ({medCount})
        </button>
        <button
          onClick={() => onFilterRisk?.(activeRiskFilter === "LOW" ? "" : "LOW")}
          title="Filter to Compliant Works (Good Job)"
          className={`flex items-center gap-1.5 px-2 py-1 rounded-xl transition cursor-pointer text-[#1E293B] ${
            activeRiskFilter === "LOW" ? "bg-[#ECFDF5] ring-1 ring-[#10B981] font-bold" : "hover:bg-[#F8FAFC]"
          }`}
        >
          <span className="w-2.5 h-2.5 rounded-full bg-[#10B981]" /> Low ({lowCount})
        </button>
        <button
          onClick={() => onFilterRisk?.("")}
          title="Show All Works"
          className={`text-[#64748B] border-l border-[#E2E8F0] pl-2 font-mono font-bold cursor-pointer hover:text-[#0F172A] ${
            !activeRiskFilter ? "text-[#625BE8]" : ""
          }`}
        >
          {validWorks.length} All
        </button>
      </div>

      <MapContainer
        center={center}
        zoom={zoom}
        scrollWheelZoom={false}
        className="w-full h-full"
      >
        <MapRecenter center={center} zoom={zoom} />
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        {sortedWorks.map((work) => {
          const isSelected = work.work_id === selectedWorkId;
          const markerColor = getColor(work.risk_level);
          const radius = isSelected
            ? 11
            : work.risk_level === "CRITICAL"
            ? 7.5
            : work.risk_level === "HIGH"
            ? 6
            : work.risk_level === "MEDIUM"
            ? 5
            : 4.5;

          return (
            <CircleMarker
              key={work.work_id}
              center={[work.latitude!, work.longitude!]}
              radius={radius}
              pathOptions={{
                color: isSelected
                  ? "#0F172A"
                  : work.risk_level === "CRITICAL"
                  ? "#7F1D1D"
                  : "#FFFFFF",
                fillColor: markerColor,
                fillOpacity: isSelected ? 1.0 : work.risk_level === "CRITICAL" ? 0.95 : 0.85,
                weight: isSelected ? 3.5 : work.risk_level === "CRITICAL" ? 2 : 1.2,
              }}
            >
              <Popup>
                <div className="text-xs p-2 max-w-xs font-sans">
                  <div className="flex items-center justify-between gap-2 border-b border-[#E2E8F0] pb-2 mb-2">
                    <span className="font-mono font-extrabold text-[#625BE8]">{work.work_id}</span>
                    <RiskBadge level={work.risk_level} size="sm" />
                  </div>
                  <div className="mb-1.5">
                    <span className="inline-block px-2 py-0.5 rounded-md bg-[#F1F5F9] text-[#475569] text-[10px] font-bold">
                      {work.work_type}
                    </span>
                  </div>
                  <p className="font-bold text-[#1E293B] line-clamp-2 mb-2">
                    {work.work_description}
                  </p>
                  <div className="grid grid-cols-2 gap-1 text-[11px] text-[#475569] mb-3">
                    <div>
                      <span className="text-[#94A3B8]">Sanctioned:</span>{" "}
                      <strong className="text-[#1E293B]">{formatINR(work.sanctioned_amount)}</strong>
                    </div>
                    <div>
                      <span className="text-[#94A3B8]">Status:</span> {work.work_status}
                    </div>
                    <div>
                      <span className="text-[#94A3B8]">District:</span> {work.district}
                    </div>
                    <div>
                      <span className="text-[#94A3B8]">Score:</span>{" "}
                      <strong className="text-[#E11D48]">{work.risk_score?.toFixed(0)}/100</strong>
                    </div>
                  </div>
                  <button
                    onClick={() => onSelectWork(work.work_id)}
                    className="w-full flex items-center justify-center gap-1.5 bg-[#16A66A] hover:bg-[#138A58] text-white py-2 px-3 rounded-xl text-xs font-bold transition shadow-xs cursor-pointer"
                  >
                    <span>Investigate Work</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </Popup>
            </CircleMarker>
          );
        })}
      </MapContainer>
    </div>
  );
};
