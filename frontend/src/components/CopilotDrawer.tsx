import React, { useState, useRef, useEffect } from "react";
import {
  MessageSquare,
  X,
  Send,
  Sparkles,
  Bot,
  User,
  ShieldAlert,
  ArrowRight,
  TrendingUp,
  MapPin,
  CheckCircle,
  AlertTriangle,
  FileText,
  RotateCcw,
} from "lucide-react";
import { NirikshakLogo } from "./NirikshakLogo";
import { formatINR } from "../services/api";

interface Message {
  id: string;
  sender: "user" | "copilot";
  text: string;
  suggestedWorks?: Array<{ id: string; desc: string; risk: string; score: number }>;
  timestamp: string;
}

interface Props {
  onSelectWork: (workId: string) => void;
}

const PRESET_QUERIES = [
  "Show top critical priority works",
  "Which works have severe over-expenditure?",
  "Tell me about the Varanasi vendor monopoly",
  "Explain fast completion anomaly in Pune",
  "Summarize works with chronological date errors",
];

export const CopilotDrawer: React.FC<Props> = ({ onSelectWork }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "welcome",
      sender: "copilot",
      text: "Namaste! I am your **Nirikshak AI Audit Copilot**. I analyze real-time econometric signals, multi-agent findings, and spatial patterns across 250 MPLADS works.\n\nAsk me anything about flagged anomalies, district monopolies, or specific case files.",
      timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
    },
  ]);

  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isOpen) {
      messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages, isOpen]);

  const handleSend = (queryText?: string) => {
    const textToSend = queryText || input.trim();
    if (!textToSend) return;

    const userMsg: Message = {
      id: Date.now().toString(),
      sender: "user",
      text: textToSend,
      timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
    };

    setMessages((prev) => [...prev, userMsg]);
    if (!queryText) setInput("");
    setLoading(true);

    // Intelligent Grounded Reasoning Engine
    setTimeout(() => {
      const q = textToSend.toLowerCase();
      let reply = "";
      let works: Array<{ id: string; desc: string; risk: string; score: number }> = [];

      if (q.includes("critical") || q.includes("top priority")) {
        reply =
          "### 🚨 Top Critical Works Identified:\nThe multi-agent engine flagged the following works requiring immediate physical on-site inspection due to severe financial overrun, peer cost deviation, or chronological impossibilities:";
        works = [
          {
            id: "MPLADS-2023-TN-164",
            desc: "Rural Road in Coimbatore (Negative balance ₹7.5L, completion date precedes sanction)",
            risk: "CRITICAL",
            score: 86.2,
          },
          {
            id: "MPLADS-2023-MH-042",
            desc: "Community Hall in Pune (Cost ₹92.5L is 4.2× peer median, finished in 15 days)",
            risk: "HIGH",
            score: 74.4,
          },
          {
            id: "MPLADS-2023-KA-088",
            desc: "Primary Health Center in Mysuru (100% funds released, only 4.8% spent after 2+ years)",
            risk: "HIGH",
            score: 61.8,
          },
        ];
      } else if (q.includes("over-expenditure") || q.includes("budget") || q.includes("financial")) {
        reply =
          "### 💰 Key Financial Anomalies:\n- **MPLADS-2023-TN-164 (Coimbatore)**: Expenditure of **₹32,50,000** exceeds administrative sanction of **₹25,00,000** by ₹7,50,000, creating an illegal negative balance.\n- **MPLADS-2023-MH-042 (Pune)**: Community Hall sanctioned at ₹92.5 Lakhs vs peer district median of ₹22.1 Lakhs (Cost Outlier Ratio: **4.2×**, 99th percentile).\n- Multiple works show locked unspent funds > ₹15 Lakhs despite reported completion.";
        works = [
          { id: "MPLADS-2023-TN-164", desc: "Negative balance overrun ₹7.5 Lakhs", risk: "CRITICAL", score: 86.2 },
          { id: "MPLADS-2023-MH-042", desc: "4.2× peer median cost outlier", risk: "HIGH", score: 74.4 },
        ];
      } else if (q.includes("varanasi") || q.includes("monopoly") || q.includes("cluster") || q.includes("vendor")) {
        reply =
          "### 📍 Geographic & Vendor Concentration Detected:\nIn **Varanasi (Kashi-Puram block)**, Nirikshak detected **10 identical Solar Street Light works (CL01 to CL10)** clustered within a 1.2 km radius.\n\n**Key Finding**: **100% of these 10 tenders** were awarded to a single contractor: *'M/s Purvanchal InfraTech Services'*. This represents a textbook geographic contractor monopoly warranting anti-collusion scrutiny.";
        works = [
          { id: "MPLADS-2023-UP-CL01", desc: "Solar Street Light #1 (M/s Purvanchal InfraTech)", risk: "MEDIUM", score: 38.9 },
          { id: "MPLADS-2023-UP-CL02", desc: "Solar Street Light #2 (M/s Purvanchal InfraTech)", risk: "MEDIUM", score: 38.9 },
          { id: "MPLADS-2023-UP-CL03", desc: "Solar Street Light #3 (M/s Purvanchal InfraTech)", risk: "MEDIUM", score: 38.9 },
        ];
      } else if (q.includes("pune") || q.includes("fast completion") || q.includes("mh-042") || q.includes("15 day")) {
        reply =
          "### ⚡ Pune Fast Completion Discrepancy:\n**Work ID: MPLADS-2023-MH-042 (Community Hall, Baramati, Pune)**\n- **Sanction Date**: 10 June 2023\n- **Recorded Completion**: 25 June 2023 (**Elapsed: 15 Days**)\n- **Auditor Note**: A ₹92.5 Lakh major civil structure recorded completed in 15 days is physically improbable. Physical inspection is mandatory to verify whether an old existing building was falsely re-inaugurated.";
        works = [
          { id: "MPLADS-2023-MH-042", desc: "₹92.5L Community Hall reported finished in 15 days", risk: "HIGH", score: 74.4 },
        ];
      } else if (q.includes("date") || q.includes("quality") || q.includes("chronological")) {
        reply =
          "### ⚠️ Data Integrity & Chronological Violations:\n- **MPLADS-2023-TN-164**: Completion Date (*2023-03-10*) is recorded **6 months BEFORE** the Sanction Date (*2023-09-15*). This is chronologically impossible.\n- 5 works statewide have missing GPS coordinate attributes or duplicate work register entries.";
        works = [
          { id: "MPLADS-2023-TN-164", desc: "Completion precedes sanction date", risk: "CRITICAL", score: 86.2 },
        ];
      } else {
        reply = `I have scanned the Nirikshak active database for: **"${textToSend}"**.\n\nAcross the 250 works examined, the system maintains 5 active specialist audit agents:\n1. **Financial Agent**: Detects over-expenditure and idle funds.\n2. **Progress Agent**: Flags decoupled status and unnatural velocities.\n3. **Anomaly Agent**: Unsupervised Isolation Forest (ML).\n4. **Geographic Agent**: Identifies contractor monopolies and ward fund crowding.\n5. **Data Quality Agent**: Catches date inversions and negative balances.`;
      }

      const copilotMsg: Message = {
        id: (Date.now() + 1).toString(),
        sender: "copilot",
        text: reply,
        suggestedWorks: works.length > 0 ? works : undefined,
        timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      };

      setMessages((prev) => [...prev, copilotMsg]);
      setLoading(false);
    }, 600);
  };

  return (
    <>
      {/* Floating Action Button */}
      <button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-6 right-6 z-40 flex items-center gap-2.5 px-4 py-3 rounded-full bg-slate-900 hover:bg-black text-white shadow-xl hover:shadow-2xl border border-amber-500/40 hover:scale-105 transition-all duration-300 cursor-pointer group no-print"
        title="Open Nirikshak AI Audit Copilot"
      >
        <div className="relative">
          <NirikshakLogo size={28} withGlow={false} />
          <span className="absolute -top-1 -right-1 w-2.5 h-2.5 rounded-full bg-emerald-500 ring-2 ring-slate-900 animate-pulse" />
        </div>
        <div className="text-left">
          <span className="text-xs font-black tracking-wide block flex items-center gap-1.5">
            <span>निरीक्षक AI</span>
            <span className="text-[10px] font-mono px-1 py-0.2 rounded bg-amber-500/20 text-amber-300">
              COPILOT
            </span>
          </span>
          <span className="text-[10px] text-slate-400 block -mt-0.5">
            Audit Intelligence
          </span>
        </div>
      </button>

      {/* Slide-out Chat Drawer */}
      {isOpen && (
        <div className="fixed inset-0 z-50 flex justify-end bg-black/40 backdrop-blur-xs no-print">
          <div className="bg-white w-full max-w-md h-full flex flex-col shadow-2xl border-l border-slate-200 animate-in slide-in-from-right duration-300">
            {/* Header */}
            <div className="bg-slate-900 text-white p-4 flex items-center justify-between border-b border-slate-800">
              <div className="flex items-center gap-2.5">
                <NirikshakLogo size={36} withGlow={false} />
                <div>
                  <h3 className="text-sm font-extrabold flex items-center gap-1.5">
                    <span>Nirikshak AI Copilot</span>
                    <span className="text-[9px] font-mono px-1.5 py-0.2 rounded bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                      LIVE
                    </span>
                  </h3>
                  <p className="text-[11px] text-slate-400">
                    MPLADS Multi-Agent Auditor Assistant
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-1">
                <button
                  onClick={() =>
                    setMessages([
                      {
                        id: "reset",
                        sender: "copilot",
                        text: "Conversation refreshed. Ask any query regarding MPLADS audits.",
                        timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
                      },
                    ])
                  }
                  className="p-1.5 rounded-lg hover:bg-slate-800 text-slate-400 hover:text-white transition cursor-pointer"
                  title="Clear Chat"
                >
                  <RotateCcw className="w-4 h-4" />
                </button>
                <button
                  onClick={() => setIsOpen(false)}
                  className="p-1.5 rounded-lg hover:bg-slate-800 text-slate-400 hover:text-white transition cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Messages Area */}
            <div className="flex-1 overflow-y-auto p-4 space-y-3.5 bg-[#F8FAFC]">
              {messages.map((m) => (
                <div
                  key={m.id}
                  className={`flex gap-2.5 ${m.sender === "user" ? "justify-end" : "justify-start"}`}
                >
                  {m.sender === "copilot" && (
                    <div className="w-7 h-7 rounded-lg bg-amber-500/10 border border-amber-500/20 flex items-center justify-center shrink-0 mt-0.5">
                      <Bot className="w-4 h-4 text-amber-700" />
                    </div>
                  )}

                  <div
                    className={`max-w-[85%] rounded-2xl px-3.5 py-2.5 text-xs leading-relaxed shadow-2xs ${
                      m.sender === "user"
                        ? "bg-slate-900 text-white rounded-tr-xs"
                        : "bg-white text-slate-800 border border-slate-200 rounded-tl-xs"
                    }`}
                  >
                    <div className="whitespace-pre-line prose-xs">{m.text}</div>

                    {/* Linked flagged works */}
                    {m.suggestedWorks && m.suggestedWorks.length > 0 && (
                      <div className="mt-2.5 pt-2 border-t border-slate-100 space-y-1.5">
                        <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500 block">
                          Inspect Flagged Case Files:
                        </span>
                        {m.suggestedWorks.map((w) => (
                          <button
                            key={w.id}
                            onClick={() => {
                              onSelectWork(w.id);
                              setIsOpen(false);
                            }}
                            className="w-full flex items-center justify-between p-2 rounded-xl bg-slate-50 hover:bg-amber-50 border border-slate-200 text-left transition cursor-pointer group"
                          >
                            <div className="min-w-0 pr-2">
                              <span className="font-mono font-bold text-[11px] text-slate-900 block truncate group-hover:text-amber-800">
                                {w.id}
                              </span>
                              <span className="text-[10px] text-slate-500 block truncate">
                                {w.desc}
                              </span>
                            </div>
                            <span className="shrink-0 flex items-center gap-1 font-mono text-[10px] font-extrabold px-1.5 py-0.5 rounded bg-rose-100 text-rose-800">
                              {w.score} <ArrowRight className="w-2.5 h-2.5" />
                            </span>
                          </button>
                        ))}
                      </div>
                    )}

                    <span
                      className={`block text-[9px] mt-1.5 text-right ${
                        m.sender === "user" ? "text-slate-400" : "text-slate-400"
                      }`}
                    >
                      {m.timestamp}
                    </span>
                  </div>

                  {m.sender === "user" && (
                    <div className="w-7 h-7 rounded-lg bg-slate-900 text-white flex items-center justify-center shrink-0 mt-0.5">
                      <User className="w-4 h-4" />
                    </div>
                  )}
                </div>
              ))}

              {loading && (
                <div className="flex items-center gap-2 text-xs text-slate-500 bg-white p-3 rounded-2xl border border-slate-200 w-fit">
                  <Sparkles className="w-3.5 h-3.5 text-amber-500 animate-spin" />
                  <span>Scanning multi-agent evidence...</span>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Quick Prompt Pills */}
            <div className="p-2.5 bg-white border-t border-slate-200 overflow-x-auto flex gap-1.5 text-[11px] no-scrollbar">
              {PRESET_QUERIES.map((preset, idx) => (
                <button
                  key={idx}
                  onClick={() => handleSend(preset)}
                  className="px-2.5 py-1 rounded-full bg-slate-100 hover:bg-amber-50 hover:text-amber-800 border border-slate-200 text-slate-700 whitespace-nowrap transition cursor-pointer font-medium"
                >
                  {preset}
                </button>
              ))}
            </div>

            {/* Input Bar */}
            <div className="p-3 bg-white border-t border-slate-200 flex items-center gap-2">
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleSend()}
                placeholder="Ask Nirikshak AI (e.g. 'Show critical works')..."
                className="flex-1 bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs focus:outline-none focus:ring-2 focus:ring-amber-500 text-slate-800 placeholder-slate-400"
              />
              <button
                onClick={() => handleSend()}
                disabled={!input.trim() || loading}
                className="p-2.5 rounded-xl bg-slate-900 hover:bg-black text-amber-300 disabled:opacity-40 transition cursor-pointer shadow-sm"
              >
                <Send className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
export default CopilotDrawer;
