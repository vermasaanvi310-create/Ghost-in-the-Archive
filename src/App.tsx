import React from 'react';
import { ArchiveProvider, useArchive } from './context/ArchiveContext';
import { FloatingAtmosphere } from './components/FloatingAtmosphere';
import { DemoModeBar } from './components/DemoModeBar';
import { Navbar } from './components/Navbar';
import { EntrancePage } from './components/EntrancePage';
import { VaultPage } from './components/VaultPage';
import { AskPage } from './components/AskPage';
import { GhostChamberPage } from './components/GhostChamberPage';
import { OpenAILabPage } from './components/OpenAILabPage';
import { PrivacyPage } from './components/PrivacyPage';
import { Footer } from './components/Footer';

const AppContent: React.FC = () => {
  const { activeTab } = useArchive();

  return (
    <div className="relative min-h-screen flex flex-col bg-[#0B0A0F] text-[#F0E8D8] selection:bg-[#642D3A] selection:text-[#F0E8D8]">
      {/* Background Ambience */}
      <FloatingAtmosphere />

      {/* Top Demo Hackathon Bar */}
      <DemoModeBar />

      {/* Top Bar Contract Navigation */}
      <Navbar />

      {/* Main Content Area */}
      <main className="flex-1">
        {activeTab === 'entrance' && <EntrancePage />}
        {activeTab === 'vault' && <VaultPage />}
        {activeTab === 'ask' && <AskPage />}
        {activeTab === 'ghost' && <GhostChamberPage />}
        {activeTab === 'lab' && <OpenAILabPage />}
        {activeTab === 'privacy' && <PrivacyPage />}
      </main>

      {/* Curatorial Footer */}
      <Footer />
    </div>
  );
};

export default function App() {
  return (
    <ArchiveProvider>
      <AppContent />
    </ArchiveProvider>
  );
}
