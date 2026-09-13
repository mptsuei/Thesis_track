import React from 'react';
import { 
  GraduationCap, 
  Milestone, 
  Users, 
  BookmarkCheck,
  CheckCircle2
} from 'lucide-react';

export type ActiveTab = 
  | 'mustread'
  | 'numberline'
  | 'overview';

interface NavbarProps {
  activeTab: ActiveTab;
  setActiveTab: (tab: ActiveTab) => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  activeTab,
  setActiveTab,
}) => {
  const navItems: { id: ActiveTab; label: string; icon: React.ReactNode; badge?: string }[] = [
    { id: 'mustread', label: '第一：研究生必讀', icon: <BookmarkCheck className="w-4 h-4" />, badge: '崔老師指導規範' },
    { id: 'numberline', label: '第二：論文進度數線', icon: <Milestone className="w-4 h-4" />, badge: '個人登錄・不可刪除' },
    { id: 'overview', label: '全體進度看板', icon: <Users className="w-4 h-4" />, badge: '論文進度控管' },
  ];

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-stone-200 text-stone-800 shadow-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          
          {/* Logo & Title */}
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-xl bg-blue-700 flex items-center justify-center shadow-sm text-white font-bold text-lg">
              <GraduationCap className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <span className="font-bold text-base sm:text-lg tracking-tight text-stone-900">
                  崔老師指導論文寫作平台
                </span>
                <span className="hidden md:inline-block text-[11px] px-2 py-0.5 rounded-md bg-blue-50 text-blue-800 border border-blue-200 font-medium">
                  Prof. Tsuei Thesis Mentor
                </span>
              </div>
              <p className="text-xs text-stone-500 hidden sm:block">
                系統聚焦兩大目的：第一、研究生必讀；第二、論文進度控管（二十七步數線與全體看板）
              </p>
            </div>
          </div>

          {/* Right Core Purpose Badges */}
          <div className="flex items-center space-x-2">
            <div className="hidden sm:flex items-center space-x-1.5 px-3 py-1.5 rounded-lg bg-blue-50 border border-blue-200 text-xs text-blue-900 font-medium">
              <CheckCircle2 className="w-3.5 h-3.5 text-blue-700 shrink-0" />
              <span>核心：研究生必讀 ＆ 論文進度控管</span>
            </div>
          </div>
        </div>

        {/* Tab Navigation */}
        <nav className="flex space-x-1 overflow-x-auto py-2 scrollbar-none border-t border-stone-200/80">
          {navItems.map((item) => {
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                id={`nav-tab-${item.id}`}
                onClick={() => setActiveTab(item.id)}
                className={`flex items-center space-x-1.5 px-3.5 py-2 rounded-lg text-xs md:text-sm font-semibold whitespace-nowrap transition-all ${
                  isActive
                    ? 'bg-blue-700 text-white shadow-xs'
                    : 'text-stone-600 hover:bg-stone-100 hover:text-stone-900'
                }`}
              >
                {item.icon}
                <span>{item.label}</span>
                {item.badge && (
                  <span className={`text-[10px] px-1.5 py-0.2 rounded-full font-bold ${
                    isActive 
                      ? 'bg-blue-900/80 text-blue-100' 
                      : 'bg-amber-100 text-amber-900 border border-amber-200/60'
                  }`}>
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}
        </nav>
      </div>
    </header>
  );
};
