import React, { useState } from 'react';
import { Navbar, ActiveTab } from './components/Navbar';
import { GraduateStudentMustRead } from './components/GraduateStudentMustRead';
import { ThesisNumberLineProgress } from './components/ThesisNumberLineProgress';
import { StudentsProgressBoard } from './components/StudentsProgressBoard';

export function App() {
  const [activeTab, setActiveTab] = useState<ActiveTab>('mustread');

  return (
    <div className="min-h-screen bg-[#F7F5F2] text-stone-800 flex flex-col font-sans selection:bg-blue-200 selection:text-blue-900">
      {/* Top Navigation */}
      <Navbar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
      />

      {/* Main App Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {/* Core Purpose 1: 研究生必讀 */}
        {activeTab === 'mustread' && (
          <GraduateStudentMustRead
            onGoToNumberLine={() => setActiveTab('numberline')}
          />
        )}

        {/* Core Purpose 2: 論文進度控管 - 個人數線登錄 */}
        {activeTab === 'numberline' && (
          <ThesisNumberLineProgress
            onSwitchToOverview={() => setActiveTab('overview')}
          />
        )}

        {/* Core Purpose 2: 論文進度控管 - 全體學生進度看板 */}
        {activeTab === 'overview' && (
          <StudentsProgressBoard
            onGoToMyNumberLine={() => setActiveTab('numberline')}
          />
        )}
      </main>

      {/* Footer */}
      <footer className="bg-white/80 backdrop-blur-sm border-t border-stone-200 text-stone-500 py-6 text-xs mt-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center space-x-2">
            <span className="font-semibold text-stone-700">
              崔老師指導論文寫作平台
            </span>
            <span>•</span>
            <span>核心聚焦：第一、研究生必讀；第二、論文進度控管</span>
          </div>
          <div className="flex items-center space-x-4 text-stone-400">
            <span>Firebase 雲端即時同步</span>
            <span>•</span>
            <span>學生 Gmail 驗證</span>
            <span>•</span>
            <span>單向推進不可刪除原則</span>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default App;
