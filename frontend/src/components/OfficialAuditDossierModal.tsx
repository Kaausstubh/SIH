import React, { useEffect, useCallback } from "react";
import { X, Printer, ArrowLeft } from "lucide-react";
import type { WorkInvestigationResult } from "../types";
import { formatINR } from "../services/api";
import { NirikshakLogo } from "./NirikshakLogo";

interface Props {
  isOpen: boolean;
  onClose: () => void;
  result: WorkInvestigationResult;
  mode: "dossier" | "notice";
}

export const OfficialAuditDossierModal: React.FC<Props> = ({
  isOpen,
  onClose,
  result,
  mode,
}) => {
  const handleClose = useCallback(() => {
    if (window.history.state?.modal === "dossier") {
      window.history.back();
    } else {
      onClose();
    }
  }, [onClose]);

  // Sync with browser history and handle Escape key
  useEffect(() => {
    if (!isOpen) return;

    // Push state so browser's native back button closes the modal
    window.history.pushState({ modal: "dossier" }, "");

    const handlePopState = () => {
      onClose();
    };

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        handleClose();
      }
    };

    window.addEventListener("popstate", handlePopState);
    window.addEventListener("keydown", handleKeyDown);

    return () => {
      window.removeEventListener("popstate", handlePopState);
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen, onClose, handleClose]);

  if (!isOpen) return null;

  const { work, report } = result;
  const today = new Date().toLocaleDateString("en-IN", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
  const refNo = `CAG-MoSPI/MPLADS/VIG/2026/${work.work_id}`;

  const handlePrint = () => {
    window.print();
  };

  const latStr = work.latitude !== undefined ? work.latitude.toFixed(4) : "N/A";
  const lngStr = work.longitude !== undefined ? work.longitude.toFixed(4) : "N/A";

  return (
    <div
      className="fixed inset-0 z-50 overflow-y-auto bg-black/70 backdrop-blur-sm p-2 sm:p-4 md:p-6 flex justify-center items-start print:p-0 print:bg-white print:static print:overflow-visible"
      onClick={(e) => {
        if (e.target === e.currentTarget) handleClose();
      }}
    >
      {/* Guaranteed viewport-fixed floating back button (never scrolls off-screen) */}
      <button
        onClick={handleClose}
        className="fixed top-4 right-4 z-[60] flex items-center gap-2 px-4 py-2 rounded-full bg-slate-900 hover:bg-black text-white text-xs font-bold shadow-2xl backdrop-blur-md border border-slate-700 hover:border-slate-500 hover:scale-105 transition cursor-pointer no-print"
        title="Close & Return to Case"
      >
        <ArrowLeft className="w-4 h-4 text-amber-400" />
        <span>Back to Case</span>
        <X className="w-3.5 h-3.5 text-slate-400" />
      </button>

      <div className="bg-white rounded-2xl shadow-2xl max-w-4xl w-full my-4 sm:my-8 overflow-hidden border border-slate-200 print:shadow-none print:border-none print:m-0 print:w-full print:max-w-none relative animate-in fade-in zoom-in-95 duration-150">
        {/* Top Modal Action Bar (Sticky, Hidden in Print) */}
        <div className="sticky top-0 z-30 bg-slate-900 text-white px-4 sm:px-6 py-3 flex items-center justify-between no-print select-none shadow-md border-b border-slate-800">
          <div className="flex items-center gap-2 sm:gap-3 min-w-0">
            <button
              onClick={handleClose}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-white text-xs font-bold transition cursor-pointer border border-slate-700 hover:border-slate-600 shadow-xs"
              title="Go back to case file"
            >
              <ArrowLeft className="w-4 h-4 text-amber-400" />
              <span>Back</span>
            </button>
            <span className="text-xs font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-amber-500/20 text-amber-300 border border-amber-500/40 truncate">
              {mode === "dossier" ? "Official Audit Dossier" : "Physical Inspection Order"}
            </span>
            <span className="text-[11px] text-slate-400 font-mono hidden md:inline truncate">Ref: {refNo}</span>
          </div>

          <div className="flex items-center gap-2 sm:gap-3">
            <button
              onClick={handlePrint}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold transition cursor-pointer shadow-sm"
            >
              <Printer className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Print / Download PDF</span>
              <span className="sm:hidden">Print</span>
            </button>
            <button
              onClick={handleClose}
              className="p-1.5 rounded-lg hover:bg-slate-800 text-slate-400 hover:text-white transition cursor-pointer"
              title="Close modal"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Printable Official Document Body */}
        <div className="p-8 sm:p-12 space-y-6 text-[#1E293B] font-serif bg-white" id="printable-dossier">
          {/* Official Letterhead Header */}
          <div className="border-b-2 border-slate-900 pb-5 text-center relative">
            <div className="flex justify-center mb-2">
              <NirikshakLogo size={64} withGlow={false} />
            </div>
            <h1 className="text-lg font-black tracking-wider uppercase text-slate-900 font-sans">
              भारत सरकार &bull; GOVERNMENT OF INDIA
            </h1>
            <h2 className="text-sm font-bold text-slate-800 font-sans mt-0.5">
              सांख्यिकी एवं कार्यक्रम कार्यान्वयन मंत्रालय (MoSPI)
            </h2>
            <h3 className="text-xs font-semibold text-slate-600 font-sans">
              निरीक्षक राष्ट्रीय एमपीलैड्स लेखापरीक्षा एवं सतर्कता प्रकोष्ठ
            </h3>
            <p className="text-[11px] text-slate-500 font-mono mt-1">
              NIRIKSHAK — AI-Powered MPLADS Audit & Prioritization Directorate
            </p>

            {/* Reference & Date strip */}
            <div className="flex justify-between items-center text-xs font-mono text-slate-600 border-t border-slate-200 mt-4 pt-2 font-sans">
              <span><strong>File Ref:</strong> {refNo}</span>
              <span><strong>Date of Issue:</strong> {today}</span>
            </div>
          </div>

          {mode === "notice" ? (
            /* ========================================================================= */
            /* MODE: STATUTORY PHYSICAL INSPECTION ORDER / SHOW-CAUSE NOTICE             */
            /* ========================================================================= */
            <div className="space-y-5 text-sm leading-relaxed font-sans">
              <div className="bg-rose-50 border-l-4 border-rose-600 p-4 rounded-r-lg">
                <span className="text-xs font-bold uppercase tracking-wider text-rose-800 block mb-0.5">
                  Statutory Directive &bull; Confidential Audit Proceeding
                </span>
                <p className="text-xs text-rose-950 font-medium">
                  Issued under Para 4.1 & 8.3 of MPLADS Scheme Operational Guidelines for Urgent Ground Verification.
                </p>
              </div>

              {/* Recipient Block */}
              <div className="text-xs space-y-0.5 font-medium">
                <p><strong>To,</strong></p>
                <p>The District Magistrate / District Collector,</p>
                <p>Nodal District Authority — {work.district}, {work.state}.</p>
                <p><strong>Implementing Agency:</strong> {work.implementing_agency}</p>
              </div>

              {/* Subject */}
              <div className="bg-slate-100 p-3 rounded-lg border border-slate-200 text-xs font-bold text-slate-900">
                SUBJECT: ORDER FOR MANDATORY ON-SITE PHYSICAL INSPECTION OF WORK ID: <span className="font-mono text-rose-700">{work.work_id}</span>
              </div>

              {/* Notice Preamble */}
              <p className="text-xs text-slate-700">
                Sir/Madam, <br />
                The Nirikshak AI Audit Surveillance Engine, pursuant to automated econometric and multi-agent scrutiny of MPLADS works records, has flagged Work ID <strong className="font-mono">{work.work_id}</strong> with an aggregate <strong>Risk Priority Score of {report.risk_score.toFixed(1)}/100 ({report.overall_risk} TIER)</strong> with an Evidence Confidence rating of <strong>{report.confidence.toFixed(1)}%</strong>.
              </p>

              {/* Case Particulars Table */}
              <div className="border border-slate-300 rounded-lg overflow-hidden text-xs">
                <table className="w-full text-left">
                  <tbody>
                    <tr className="border-b border-slate-200 bg-slate-50">
                      <td className="p-2 font-bold w-1/3">Work Description:</td>
                      <td className="p-2 font-medium">{work.work_description}</td>
                    </tr>
                    <tr className="border-b border-slate-200">
                      <td className="p-2 font-bold">Constituency / MP:</td>
                      <td className="p-2 font-medium">{work.constituency} ({work.mp_name})</td>
                    </tr>
                    <tr className="border-b border-slate-200 bg-slate-50">
                      <td className="p-2 font-bold">Location Coordinates:</td>
                      <td className="p-2 font-mono text-slate-700">
                        {work.village || "N/A"}, Block: {work.block || "N/A"} (Lat: {latStr}, Lng: {lngStr})
                      </td>
                    </tr>
                    <tr className="border-b border-slate-200">
                      <td className="p-2 font-bold">Financial Sanction / Expended:</td>
                      <td className="p-2 font-semibold">
                        Sanctioned: {formatINR(work.sanctioned_amount)} | Disbursed: {formatINR(work.expenditure)}
                      </td>
                    </tr>
                    <tr className="bg-slate-50">
                      <td className="p-2 font-bold">Recorded Execution Stage:</td>
                      <td className="p-2 font-bold text-rose-700">{work.work_status}</td>
                    </tr>
                  </tbody>
                </table>
              </div>

              {/* Critical Findings Checklist */}
              <div>
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-900 mb-2">
                  Key Statistical Anomalies Requiring Immediate Field Verification:
                </h4>
                <ul className="space-y-1.5 text-xs text-slate-800 list-disc list-inside">
                  {report.key_findings.map((f: string, idx: number) => (
                    <li key={idx} className="bg-slate-50 p-2 rounded border border-slate-200">
                      {f}
                    </li>
                  ))}
                </ul>
              </div>

              {/* Inspection Mandate Directives */}
              <div className="bg-amber-50/70 border border-amber-200 p-3.5 rounded-lg text-xs space-y-1.5 text-amber-950">
                <span className="font-bold block uppercase tracking-wider text-[11px] text-amber-900">
                  Field Inspection Protocol Directive:
                </span>
                <p>1. Depute a Gazetted Technical Officer (Executive Engineer or equivalent) for physical site inspection within <strong>7 working days</strong>.</p>
                <p>2. Verify physical asset existence against recorded GPS coordinates ({latStr}, {lngStr}).</p>
                <p>3. Reconcile entries in the primary <strong>Measurement Book (MB)</strong> and verify voucher muster-rolls against disbursed amounts.</p>
                <p>4. Upload high-resolution geo-tagged, time-stamped photographs of the completed structure to the portal.</p>
              </div>

              {/* Signatures & Seal */}
              <div className="pt-10 flex justify-between items-end text-xs text-slate-700">
                <div className="space-y-1">
                  <div className="w-24 h-24 border border-dashed border-slate-300 rounded flex items-center justify-center text-[10px] text-slate-400 font-mono">
                    [OFFICIAL SEAL]
                  </div>
                  <p className="font-bold text-slate-900">District Audit Directorate</p>
                </div>
                <div className="text-right space-y-1">
                  <p className="font-serif italic text-slate-500 font-bold text-sm">Verified by Nirikshak AI</p>
                  <p className="font-bold text-slate-900">Director of Vigilance & Audits</p>
                  <p className="text-[11px] text-slate-500 font-mono">MoSPI & CAG Monitoring Cell</p>
                </div>
              </div>
            </div>
          ) : (
            /* ========================================================================= */
            /* MODE: OFFICIAL COMPREHENSIVE AUDIT DOSSIER                                */
            /* ========================================================================= */
            <div className="space-y-5 text-sm font-sans leading-relaxed">
              <div className="flex justify-between items-center bg-slate-50 p-3.5 rounded-lg border border-slate-200 text-xs">
                <div>
                  <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">CASE FILE</span>
                  <span className="font-bold font-mono text-sm text-slate-900">{work.work_id}</span>
                </div>
                <div>
                  <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">RISK SCORE</span>
                  <span className="font-bold text-sm text-rose-700 font-mono">{report.risk_score.toFixed(1)} / 100 ({report.overall_risk})</span>
                </div>
                <div>
                  <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">CONFIDENCE</span>
                  <span className="font-bold text-sm text-emerald-700 font-mono">{report.confidence.toFixed(1)}%</span>
                </div>
              </div>

              {/* Section 1: Work Profile */}
              <div>
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-900 mb-2 border-b border-slate-200 pb-1">
                  1. Project Profile & Administrative Details
                </h4>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
                  <div className="bg-slate-50 p-2.5 rounded border border-slate-200">
                    <span className="text-[10px] text-slate-500 uppercase block font-bold">State / District</span>
                    <span className="font-semibold text-slate-800">{work.state} &bull; {work.district}</span>
                  </div>
                  <div className="bg-slate-50 p-2.5 rounded border border-slate-200">
                    <span className="text-[10px] text-slate-500 uppercase block font-bold">Constituency & MP</span>
                    <span className="font-semibold text-slate-800">{work.constituency} ({work.mp_name})</span>
                  </div>
                  <div className="bg-slate-50 p-2.5 rounded border border-slate-200">
                    <span className="text-[10px] text-slate-500 uppercase block font-bold">Sanction Date</span>
                    <span className="font-semibold text-slate-800 font-mono">{work.sanction_date || "N/A"}</span>
                  </div>
                  <div className="bg-slate-50 p-2.5 rounded border border-slate-200">
                    <span className="text-[10px] text-slate-500 uppercase block font-bold">Completion Date</span>
                    <span className="font-semibold text-slate-800 font-mono">{work.completion_date || "Under Execution"}</span>
                  </div>
                </div>
              </div>

              {/* Section 2: Financial Audit */}
              <div>
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-900 mb-2 border-b border-slate-200 pb-1">
                  2. Financial & Milestone Balance Analysis
                </h4>
                <div className="grid grid-cols-3 gap-3 text-xs">
                  <div className="p-2.5 bg-slate-50 rounded border border-slate-200">
                    <span className="text-[10px] text-slate-500 font-bold uppercase block">Sanctioned Outlay</span>
                    <span className="text-sm font-extrabold text-slate-900 font-mono">{formatINR(work.sanctioned_amount)}</span>
                  </div>
                  <div className="p-2.5 bg-slate-50 rounded border border-slate-200">
                    <span className="text-[10px] text-slate-500 font-bold uppercase block">Disbursed Expenditure</span>
                    <span className="text-sm font-extrabold text-slate-900 font-mono">{formatINR(work.expenditure)}</span>
                  </div>
                  <div className="p-2.5 bg-slate-50 rounded border border-slate-200">
                    <span className="text-[10px] text-slate-500 font-bold uppercase block">Fund Utilization</span>
                    <span className="text-sm font-extrabold text-emerald-700 font-mono">{work.utilization_percentage.toFixed(1)}%</span>
                  </div>
                </div>
              </div>

              {/* Section 3: Multi-Agent Findings */}
              <div>
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-900 mb-2 border-b border-slate-200 pb-1">
                  3. Multi-Agent Econometric & Statistical Findings
                </h4>
                <div className="space-y-2 text-xs">
                  {report.key_findings.map((finding: string, idx: number) => (
                    <div key={idx} className="flex items-start gap-2 bg-slate-50 p-2.5 rounded border border-slate-200">
                      <span className="font-bold text-rose-600 font-mono">[{idx + 1}]</span>
                      <span className="text-slate-800 font-medium">{finding}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Section 4: Recommendation */}
              <div className="bg-emerald-50 border border-emerald-200 p-3.5 rounded-lg text-xs">
                <span className="font-bold text-emerald-900 uppercase tracking-wider text-[11px] block mb-1">
                  Lead Investigator AI Directive & Recommendation:
                </span>
                <p className="text-emerald-950 font-medium leading-relaxed">
                  {report.recommendation}
                </p>
              </div>

              {/* Signature Block */}
              <div className="pt-8 flex justify-between items-end text-xs text-slate-700">
                <div className="text-left space-y-1">
                  <p className="font-mono text-[10px] text-slate-500">Certified by NIRIKSHAK AI Audit Subsystem</p>
                  <p className="font-bold text-slate-900">National MPLADS Vigilance Framework</p>
                </div>
                <div className="text-right space-y-1">
                  <p className="font-bold text-slate-900">Authorized Signatory</p>
                  <p className="text-[11px] text-slate-500">Comptroller & Auditor General Audit Cell</p>
                </div>
              </div>
            </div>
          )}

          {/* Institutional Statutory Footer */}
          <div className="border-t border-slate-200 pt-3 text-[10px] text-slate-400 font-sans text-center">
            CONFIDENTIAL AUDIT MATERIAL &bull; FOR OFFICIAL ADMINISTRATIVE USE ONLY &bull; NIRIKSHAN VIGILANCE CELL
          </div>
        </div>

        {/* Bottom Modal Actions Bar (Sticky/Pinned at bottom of modal card, Hidden in Print) */}
        <div className="no-print bg-slate-100 border-t border-slate-200 px-6 py-4 flex flex-wrap items-center justify-between gap-3">
          <button
            onClick={handleClose}
            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-white border border-slate-300 hover:bg-slate-50 text-slate-700 text-xs font-bold transition cursor-pointer shadow-2xs"
          >
            <ArrowLeft className="w-4 h-4 text-slate-600" />
            <span>Back to Case File</span>
          </button>

          <div className="flex items-center gap-3">
            <button
              onClick={handlePrint}
              className="flex items-center gap-2 px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold transition cursor-pointer shadow-xs"
            >
              <Printer className="w-4 h-4" />
              <span>Print / Download PDF</span>
            </button>
            <button
              onClick={handleClose}
              className="px-4 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold transition cursor-pointer shadow-xs"
            >
              Close Dossier
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
export default OfficialAuditDossierModal;
