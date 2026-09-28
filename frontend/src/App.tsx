import React, { useState, useEffect } from "react";
import { Header } from "./components/Header";
import { Sidebar, type NavItem } from "./components/Sidebar";
import { Dashboard } from "./pages/Dashboard";
import { InvestigationsPage } from "./pages/InvestigationsPage";
import { Investigation } from "./pages/Investigation";
import { MapPage } from "./pages/MapPage";
import { AnalyticsPage } from "./pages/AnalyticsPage";
import { DataQualityPage } from "./pages/DataQualityPage";
import { DataUpload } from "./pages/DataUpload";
import { Settings } from "./pages/Settings";
import { fetchSummary } from "./services/api";
import { CopilotDrawer } from "./components/CopilotDrawer";

export function App() {
  const [activeItem, setActiveItem] = useState<NavItem>("investigations");
  const [selectedWorkId, setSelectedWorkId] = useState<string | null>(null);
  const [refreshKey, setRefreshKey] = useState<number>(0);
  const [priorityCount, setPriorityCount] = useState<number>(0);

  // Load summary metrics for sidebar badge indicators
  useEffect(() => {
    const loadStats = async () => {
      try {
        const s = await fetchSummary();
        setPriorityCount((s.critical_risk_count || 0) + (s.high_risk_count || 0));
      } catch (e) {
        // silent fail for sidebar badges
      }
    };
    loadStats();
  }, [refreshKey]);

  const handleSelectWork = (workId: string) => {
    setSelectedWorkId(workId);
  };

  const handleBackToDashboard = () => {
    setSelectedWorkId(null);
  };

  const handleNavigate = (item: NavItem) => {
    setSelectedWorkId(null);
    setActiveItem(item);
  };

  const handleDataChanged = () => {
    setRefreshKey((k) => k + 1);
    setSelectedWorkId(null);
    setActiveItem("investigations");
  };

  return (
    <div className="h-screen w-screen bg-[#F8FAFC] text-[#1E293B] flex flex-col font-sans overflow-hidden">
      {/* Top Header: Title & Logo (Fixed 64px) */}
      <Header />

      {/* Main App Layout: Sidebar + Main Content (100% Remaining Height) */}
      <div className="flex-1 flex w-full overflow-hidden min-h-0">
        <Sidebar
          activeItem={selectedWorkId ? "investigations" : activeItem}
          onSelect={(item) => {
            setSelectedWorkId(null);
            setActiveItem(item);
          }}
          priorityCount={priorityCount}
          qualityIssueCount={5}
        />

        {/* Main Content Area: Smooth internal scroll, fluid responsive width */}
        <main className="flex-1 h-full overflow-y-auto px-4 py-5 sm:px-6 sm:py-6 lg:px-8 w-full flex flex-col justify-between min-w-0">
          <div className="w-full max-w-[1600px] mx-auto space-y-6">
            {selectedWorkId ? (
              <Investigation
                workId={selectedWorkId}
                onBack={handleBackToDashboard}
                onSelectWork={handleSelectWork}
              />
            ) : (
              <>
                {activeItem === "overview" && (
                  <Dashboard
                    key={refreshKey}
                    onSelectWork={handleSelectWork}
                    onNavigate={handleNavigate}
                  />
                )}
                {activeItem === "investigations" && (
                  <InvestigationsPage onSelectWork={handleSelectWork} />
                )}
                {activeItem === "map" && (
                  <MapPage onSelectWork={handleSelectWork} />
                )}
                {activeItem === "analytics" && (
                  <AnalyticsPage onSelectWork={handleSelectWork} />
                )}
                {activeItem === "data-quality" && (
                  <DataQualityPage onSelectWork={handleSelectWork} />
                )}
                {activeItem === "ingest" && (
                  <DataUpload onUploadSuccess={handleDataChanged} />
                )}
                {activeItem === "methodology" && (
                  <Settings onConfigSaved={handleDataChanged} />
                )}
              </>
            )}
          </div>

          {/* Clean Modern Footer inside main scroll area */}
          <footer className="mt-8 pt-4 pb-2 border-t border-[#E2E8F0] text-center text-xs text-[#64748B] font-medium no-print">
            <div className="w-full max-w-[1600px] mx-auto flex flex-col sm:flex-row items-center justify-between gap-2">
              <span>निरीक्षक (Nirikshak) &bull; राष्ट्रीय एमपीलैड्स लेखापरीक्षा एवं सतर्कता प्रणाली &bull; AI Decision-Support System</span>
              <span className="font-mono text-[#94A3B8]">Version 2.0.0 &bull; CAG & MoSPI Monitoring Prototype</span>
            </div>
          </footer>
        </main>
      </div>

      {/* Floating Nirikshak AI Auditor Copilot */}
      <CopilotDrawer onSelectWork={handleSelectWork} />
    </div>
  );
}

export default App;
