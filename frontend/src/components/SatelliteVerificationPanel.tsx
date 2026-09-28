import React, { useState } from "react";
import { Work } from "../types";
import { Satellite, CheckCircle, AlertTriangle, ShieldCheck } from "lucide-react";
import { WorkLocationMap } from "../maps/WorkLocationMap";

interface Props {
  work: Work;
}

export const SatelliteVerificationPanel: React.FC<Props> = ({ work }) => {
  const [viewMode, setViewMode] = useState<"map" | "satellite_comparison">("map");
  const [satelliteStage, setSatelliteStage] = useState<"pre" | "post">("post");

  const isPuneAnomaly = work.work_id === "MPLADS-2023-MH-042";
  const lat = work.latitude ?? 18.5204;
  const lng = work.longitude ?? 73.8567;

  return (
    <div className="space-y-4">
      {/* Top Controls & Telemetry */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-[#F8FAFC] p-3.5 rounded-2xl border border-[#E2E8F0]">
        <div className="flex items-center gap-2.5">
          <div className="p-2 rounded-xl bg-amber-500/10 text-amber-700 border border-amber-500/20">
            <Satellite className="w-4 h-4" />
          </div>
          <div>
            <span className="text-xs font-bold text-slate-900 block">
              Geospatial Coordinate & Satellite Audit
            </span>
            <span className="text-[11px] text-slate-500 font-mono">
              Lat: {lat.toFixed(5)}, Lng: {lng.toFixed(5)} &bull; {work.village || "Village"}, {work.district}
            </span>
          </div>
        </div>

        {/* View Switcher */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => setViewMode("map")}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition cursor-pointer ${
              viewMode === "map"
                ? "bg-slate-900 text-white shadow-xs"
                : "bg-white text-slate-700 border border-slate-200 hover:bg-slate-50"
            }`}
          >
            GIS Vector Map
          </button>
          <button
            onClick={() => setViewMode("satellite_comparison")}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition cursor-pointer flex items-center gap-1.5 ${
              viewMode === "satellite_comparison"
                ? "bg-amber-600 text-white shadow-xs"
                : "bg-white text-slate-700 border border-slate-200 hover:bg-slate-50"
            }`}
          >
            <Satellite className="w-3.5 h-3.5" />
            <span>Satellite Audit (Before/After)</span>
          </button>
        </div>
      </div>

      {viewMode === "map" ? (
        <div className="h-80 w-full rounded-2xl overflow-hidden border border-[#E2E8F0]">
          <WorkLocationMap
            works={[work]}
            selectedWorkId={work.work_id}
            onSelectWork={() => {}}
          />
        </div>
      ) : (
        /* Satellite Comparison View */
        <div className="bg-slate-950 text-white rounded-2xl p-5 border border-slate-800 space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800 pb-3">
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-amber-400 font-mono">
                Optical Ground Imagery Verification
              </span>
              <p className="text-xs text-slate-400 mt-0.5">
                Comparing high-resolution satellite imagery across project timeline milestones.
              </p>
            </div>

            {/* Stage Selector */}
            <div className="flex items-center gap-1 bg-slate-900 p-1 rounded-xl border border-slate-700 text-xs">
              <button
                onClick={() => setSatelliteStage("pre")}
                className={`px-3 py-1 rounded-lg font-bold transition cursor-pointer ${
                  satelliteStage === "pre"
                    ? "bg-amber-600 text-white"
                    : "text-slate-400 hover:text-white"
                }`}
              >
                Pre-Sanction Baseline
              </button>
              <button
                onClick={() => setSatelliteStage("post")}
                className={`px-3 py-1 rounded-lg font-bold transition cursor-pointer ${
                  satelliteStage === "post"
                    ? "bg-emerald-600 text-white"
                    : "text-slate-400 hover:text-white"
                }`}
              >
                Recorded Completion Date
              </button>
            </div>
          </div>

          {/* Interactive Simulated Satellite Frame */}
          <div className="relative h-72 rounded-xl overflow-hidden border border-slate-800 bg-slate-900 flex items-center justify-center">
            {/* Satellite Grid Canvas Overlay */}
            <div
              className="absolute inset-0 opacity-40"
              style={{
                backgroundImage:
                  "radial-gradient(#38bdf8 1px, transparent 1px), radial-gradient(#f59e0b 1px, transparent 1px)",
                backgroundSize: "20px 20px",
                backgroundPosition: "0 0, 10px 10px",
              }}
            />

            {/* Simulated Satellite Tile Imagery */}
            <div className="absolute inset-0 flex flex-col justify-between p-4 pointer-events-none">
              <div className="flex justify-between items-start text-[11px] font-mono text-amber-300 bg-black/60 backdrop-blur-xs p-2 rounded border border-amber-500/30">
                <div>
                  <span>SENSOR: Sentinel-2 Multispectral 10m &bull; NIR Ground Reflectance</span>
                  <div className="text-slate-300">
                    TARGET: {lat.toFixed(5)}°N, {lng.toFixed(5)}°E
                  </div>
                </div>
                <div className="text-right">
                  <span className="font-bold text-white">
                    {satelliteStage === "pre"
                      ? `BASELINE DATE: ${work.sanction_date || "2023-01-10"}`
                      : `VERIFICATION DATE: ${work.completion_date || "2023-10-15"}`}
                  </span>
                  <div className={satelliteStage === "pre" ? "text-amber-400" : "text-emerald-400"}>
                    STAGE: {satelliteStage === "pre" ? "UNTOUCHED GROUND" : "SURFACE BUILT RECORDED"}
                  </div>
                </div>
              </div>

              {/* Central Precision Target Reticle */}
              <div className="self-center flex flex-col items-center">
                <div className="w-16 h-16 rounded-full border-2 border-dashed border-amber-400 flex items-center justify-center animate-pulse">
                  <div className="w-2 h-2 rounded-full bg-rose-500" />
                </div>
                <span className="text-[10px] font-mono text-amber-300 bg-black/80 px-2 py-0.5 rounded mt-1">
                  Asset Footprint ({work.work_type})
                </span>
              </div>

              {/* Status footer pill */}
              <div className="flex justify-between items-center text-xs font-mono bg-black/70 p-2 rounded border border-slate-700">
                <span className="text-slate-300">
                  Surface Texture Analysis:{" "}
                  <strong className={satelliteStage === "pre" ? "text-amber-300" : "text-emerald-300"}>
                    {satelliteStage === "pre"
                      ? "Natural Ground / Bare Soil (No Built Asset)"
                      : isPuneAnomaly
                      ? "Concrete Footprint Detected (Rapid 15-Day Completion Variance)"
                      : "Paved Surface Alteration Detected"}
                  </strong>
                </span>
                <span className="text-[11px] text-slate-400">Resolution: 0.5m GSD</span>
              </div>
            </div>
          </div>

          {/* Verification Audit Checklist */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
            <div className="p-3 rounded-xl bg-slate-900 border border-slate-800">
              <span className="text-[10px] uppercase font-bold text-slate-400 block">
                GPS Boundary Accuracy
              </span>
              <div className="flex items-center gap-1.5 mt-1 text-emerald-400 font-bold">
                <CheckCircle className="w-3.5 h-3.5" />
                <span>Verified in {work.district}</span>
              </div>
              <span className="text-[10px] text-slate-500">Within India Boundary limits</span>
            </div>

            <div className="p-3 rounded-xl bg-slate-900 border border-slate-800">
              <span className="text-[10px] uppercase font-bold text-slate-400 block">
                Spatial Clustering
              </span>
              <div className="flex items-center gap-1.5 mt-1 text-amber-400 font-bold">
                <AlertTriangle className="w-3.5 h-3.5" />
                <span>Micro-Cluster Scrutiny</span>
              </div>
              <span className="text-[10px] text-slate-500">Density verified against block peers</span>
            </div>

            <div className="p-3 rounded-xl bg-slate-900 border border-slate-800">
              <span className="text-[10px] uppercase font-bold text-slate-400 block">
                Physical Inspection
              </span>
              <div className="flex items-center gap-1.5 mt-1 text-rose-400 font-bold">
                <ShieldCheck className="w-3.5 h-3.5" />
                <span>Ground Verification Advised</span>
              </div>
              <span className="text-[10px] text-slate-500">Require on-site geo-tagged photo</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
export default SatelliteVerificationPanel;
