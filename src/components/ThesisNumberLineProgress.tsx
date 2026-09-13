import React, { useState, useEffect, useRef } from 'react';
import { 
  PHASE_1_STEPS, 
  PHASE_2_STEPS, 
  ALL_THESIS_STEPS,
  ensurePrecedingStepsCompleted 
} from '../data/thesisStepsData';
import { ThesisStep, StudentProgressRecord } from '../types';
import { 
  auth, 
  db, 
  googleProvider, 
  handleFirestoreError, 
  OperationType 
} from '../lib/firebase';
import { 
  signInWithPopup, 
  signOut, 
  onAuthStateChanged, 
  User 
} from 'firebase/auth';
import { 
  doc, 
  onSnapshot, 
  setDoc, 
  collection, 
  getDocs, 
  serverTimestamp 
} from 'firebase/firestore';
import confetti from 'canvas-confetti';
import { 
  CheckCircle2, 
  Circle, 
  Clock, 
  Calendar, 
  FileText, 
  AlertTriangle, 
  Sparkles, 
  Cloud, 
  CloudCheck, 
  LogIn, 
  LogOut, 
  UserCheck, 
  ArrowRight, 
  ArrowLeft, 
  Check, 
  Save, 
  Award, 
  GraduationCap, 
  Phone, 
  Car, 
  Mail, 
  FileCheck2, 
  ExternalLink,
  ChevronRight,
  ShieldAlert,
  Users,
  Lock
} from 'lucide-react';

interface Props {
  onSwitchToOverview?: () => void;
}

export const ThesisNumberLineProgress: React.FC<Props> = ({ 
  onSwitchToOverview 
}) => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [authLoading, setAuthLoading] = useState(true);
  const [cloudSyncStatus, setCloudSyncStatus] = useState<'synced' | 'saving' | 'local' | 'error'>('local');
  const [syncMessage, setSyncMessage] = useState<string>('使用本機快取');

  // Active view: Phase 1 (11 steps), Phase 2 (16 steps), or All (27 steps)
  const [activePhaseTab, setActivePhaseTab] = useState<'phase1' | 'phase2' | 'all'>('phase1');
  const [selectedStepId, setSelectedStepId] = useState<string>('p1-1');

  // Student progress state (Name is directly derived from Gmail, thesis topic removed)
  const [studentName, setStudentName] = useState<string>('研究生同學');
  const [completedSteps, setCompletedSteps] = useState<string[]>([]);
  const [stepDates, setStepDates] = useState<Record<string, string>>({});
  const [stepNotes, setStepNotes] = useState<Record<string, string>>({});
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const numberLineScrollRef = useRef<HTMLDivElement>(null);

  // 1. Listen to Firebase Auth state
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setCurrentUser(user);
      setAuthLoading(false);
      if (user) {
        const gmailName = user.displayName || (user.email ? user.email.split('@')[0] : '研究生同學');
        setStudentName(gmailName);
        setCloudSyncStatus('synced');
        setSyncMessage(`已連線 Firebase (${user.email})`);
      } else {
        // Logged out: clean empty state, no student data retained
        setStudentName('未登入學生');
        setCompletedSteps([]);
        setStepDates({});
        setStepNotes({});
        setCloudSyncStatus('local');
        setSyncMessage('未登入 Google，數線保持空白');
      }
    });
    return () => unsubscribe();
  }, []);

  // 2. Load and listen to Firestore document for the active student
  useEffect(() => {
    // If not authenticated, ensure number line is completely empty
    if (!currentUser) {
      setCompletedSteps([]);
      setStepDates({});
      setStepNotes({});
      return;
    }

    const activeStudentId = currentUser.uid;

    // Authenticated with Firebase: listen via onSnapshot
    setCloudSyncStatus('saving');
    const docRef = doc(db, 'student_progress', activeStudentId);
    
    const unsubscribe = onSnapshot(docRef, (snapshot) => {
      if (snapshot.exists()) {
        const data = snapshot.data();
        if (data.completedSteps) {
          setCompletedSteps(ensurePrecedingStepsCompleted(data.completedSteps, data.currentStepNumber));
        } else {
          setCompletedSteps([]);
        }
        if (data.stepDates) setStepDates(data.stepDates);
        if (data.stepNotes) setStepNotes(data.stepNotes);
        // Direct Gmail name binding prioritized
        const nameFromGmail = currentUser.displayName || (currentUser.email ? currentUser.email.split('@')[0] : data.studentName || '研究生同學');
        setStudentName(nameFromGmail);
        setCloudSyncStatus('synced');
        setSyncMessage('Firebase 雲端已即時同步');
      } else {
        // Document doesn't exist yet in Firestore, initialize it with clean state for new user
        const initialRecord: StudentProgressRecord = {
          studentId: activeStudentId,
          studentName: currentUser.displayName || (currentUser.email ? currentUser.email.split('@')[0] : '研究生同學'),
          studentEmail: currentUser.email || '',
          photoURL: currentUser.photoURL || '',
          thesisTopic: '',
          currentPhase: 1,
          currentStepNumber: 0,
          currentStepTitle: '閱讀文獻找題目',
          completedSteps: [],
          stepDates: {},
          stepNotes: {},
          lastUpdated: new Date().toISOString()
        };
        saveToFirestore(initialRecord);
      }
    }, (error) => {
      console.error('Firestore onSnapshot error:', error);
      setCloudSyncStatus('error');
      setSyncMessage('Firestore 連線失敗，請檢查網路');
    });

    return () => unsubscribe();
  }, [currentUser]);

  // Save changes to Firestore
  const persistChanges = async (
    newCompleted: string[],
    newDates: Record<string, string>,
    newNotes: Record<string, string>
  ) => {
    if (!currentUser) {
      setToastMessage('請先登入 Google 帳號再進行進度儲存！');
      handleGoogleLogin();
      return;
    }

    const effectiveName = currentUser.displayName || 
      (currentUser.email ? currentUser.email.split('@')[0] : studentName) || 
      '研究生同學';

    // Calculate highest forward step reached
    const completedStepObjs = ALL_THESIS_STEPS.filter(s => newCompleted.includes(s.id));
    const highestStep = completedStepObjs.reduce<ThesisStep | null>((prev, curr) => {
      if (!prev) return curr;
      return curr.globalIndex > prev.globalIndex ? curr : prev;
    }, null);

    const currentStepNumber = highestStep ? highestStep.globalIndex : (newCompleted.length > 0 ? newCompleted.length : 1);
    const currentStepTitle = highestStep ? highestStep.title : '閱讀文獻找題目';

    const payload: StudentProgressRecord = {
      studentId: currentUser.uid,
      studentName: effectiveName,
      studentEmail: currentUser.email || '',
      photoURL: currentUser.photoURL || '',
      thesisTopic: '',
      currentPhase: currentStepNumber <= 11 ? 1 : 2,
      currentStepNumber,
      currentStepTitle,
      completedSteps: newCompleted,
      stepDates: newDates,
      stepNotes: newNotes,
      lastUpdated: new Date().toISOString()
    };

    setCloudSyncStatus('saving');
    try {
      await saveToFirestore(payload);
      setCloudSyncStatus('synced');
      setSyncMessage(`已同步至 Firebase 雲端 (${new Date().toLocaleTimeString()})`);
    } catch (error) {
      setCloudSyncStatus('error');
      setSyncMessage('雲端寫入失敗，請檢查權限與連線');
    }
  };

  const saveToFirestore = async (record: StudentProgressRecord) => {
    const path = `student_progress/${record.studentId}`;
    try {
      const docRef = doc(db, 'student_progress', record.studentId);
      await setDoc(docRef, {
        ...record,
        lastUpdatedServer: serverTimestamp()
      }, { merge: true });
    } catch (error) {
      handleFirestoreError(error, OperationType.WRITE, path);
    }
  };

  // Handle Google Login
  const handleGoogleLogin = async () => {
    try {
      setAuthLoading(true);
      const res = await signInWithPopup(auth, googleProvider);
      const user = res.user;
      setCurrentUser(user);
      const gmailName = user.displayName || (user.email ? user.email.split('@')[0] : '研究生同學');
      setStudentName(gmailName);
      setCloudSyncStatus('synced');
      setSyncMessage(`歡迎！已連線 Firebase (${user.email})`);
      setToastMessage(`✓ 已成功登入 Google，姓名已直接帶入為「${gmailName}」(${user.email})`);
    } catch (error) {
      console.error('Login error:', error);
      setSyncMessage('登入視窗已關閉或取消');
    } finally {
      setAuthLoading(false);
    }
  };

  const handleGoogleLogout = async () => {
    try {
      await signOut(auth);
    } catch (e) {
      console.error('SignOut error:', e);
    }
    localStorage.removeItem('thesis_student_progress_record');
    setCurrentUser(null);
    setStudentName('未登入學生');
    setCompletedSteps([]);
    setStepDates({});
    setStepNotes({});
    setSelectedStepId('p1-1');
    setCloudSyncStatus('local');
    setSyncMessage('已登出。數線已清空歸零（0%），如需登記個人進度請重新登入 Google。');
    setToastMessage('✓ 已成功登出。個人數線已清空歸零（0%）。');
  };

  // Strictly forward-only step registration:
  // 步驟只能往前, 不可刪除已經登錄過的, 只能往前, 不能往後刪除
  // 依指導規範：若登錄在步驟數字較大的地方，前面就當作全數完成（例如登錄在步驟四，則第 1-3 步皆當作完成）
  // 抓系統的時間不必讓學生寫
  const handleToggleStep = (stepId: string) => {
    // If not logged in, prompt user to log in first
    if (!currentUser) {
      setToastMessage('⚠️ 請先登入 Google 帳號！登入後系統將自動為您綁定 Gmail 並記錄個人論文進度。');
      handleGoogleLogin();
      return;
    }

    // 1. If step is already completed, inform the student gently
    if (completedSteps.includes(stepId)) {
      setToastMessage(`ℹ️ 此步驟已登錄完成（崔老師指導原則：步驟僅能往前推進，不可刪除或撤銷）。`);
      return;
    }

    // 2. Find target step and its sequence number
    const targetStep = ALL_THESIS_STEPS.find(s => s.id === stepId);
    const targetGlobalIndex = targetStep ? targetStep.globalIndex : 1;

    // Collect all steps from step 1 up to targetGlobalIndex
    const allStepsUpToTarget = ALL_THESIS_STEPS
      .filter(s => s.globalIndex <= targetGlobalIndex)
      .map(s => s.id);

    // Forward progression: mark target step AND all preceding steps as completed
    const updatedCompleted = ensurePrecedingStepsCompleted([...completedSteps, stepId], targetGlobalIndex);

    // Celebrate progression
    try {
      confetti({
        particleCount: 70,
        spread: 80,
        origin: { y: 0.6 }
      });
    } catch (e) {}

    // Auto record system date (抓系統的時間, 不必讓學生寫) for target step and any newly auto-completed preceding steps
    const today = new Date().toISOString().split('T')[0];
    const updatedDates = { ...stepDates };
    allStepsUpToTarget.forEach(id => {
      if (!updatedDates[id]) {
        updatedDates[id] = today;
      }
    });

    setCompletedSteps(updatedCompleted);
    setStepDates(updatedDates);
    persistChanges(updatedCompleted, updatedDates, stepNotes);

    // Immediate feedback message
    if (targetGlobalIndex > 1) {
      setToastMessage(`✓ 已成功登錄至第 ${targetGlobalIndex} 步（${targetStep?.title}）！系統已自動記錄完成日期（${today}），第 1 ~ ${targetGlobalIndex} 步全數完成。`);
    } else {
      setToastMessage(`✓ 已成功登錄第 1 步（${targetStep?.title}）！系統已自動記錄完成日期（${today}）。`);
    }
  };

  // Active steps list based on selected view
  const currentStepList: ThesisStep[] = 
    activePhaseTab === 'phase1' 
      ? PHASE_1_STEPS 
      : activePhaseTab === 'phase2' 
      ? PHASE_2_STEPS 
      : ALL_THESIS_STEPS;

  // Selected step details
  const selectedStep = ALL_THESIS_STEPS.find(s => s.id === selectedStepId) || PHASE_1_STEPS[0];
  const isSelectedCompleted = completedSteps.includes(selectedStep.id);

  // Calculate statistics
  const phase1CompletedCount = PHASE_1_STEPS.filter(s => completedSteps.includes(s.id)).length;
  const phase1Total = PHASE_1_STEPS.length;
  const phase1Percent = Math.round((phase1CompletedCount / phase1Total) * 100);

  const phase2CompletedCount = PHASE_2_STEPS.filter(s => completedSteps.includes(s.id)).length;
  const phase2Total = PHASE_2_STEPS.length;
  const phase2Percent = Math.round((phase2CompletedCount / phase2Total) * 100);

  const totalCompletedCount = ALL_THESIS_STEPS.filter(s => completedSteps.includes(s.id)).length;
  const totalStepsCount = ALL_THESIS_STEPS.length;
  const totalPercent = Math.round((totalCompletedCount / totalStepsCount) * 100);

  // Active step index on the number line
  const activeNumberLineIndex = currentStepList.findIndex(s => s.id === selectedStepId);

  return (
    <div className="space-y-6">
      {/* 1. Header Banner & Firebase Cloud Status */}
      <div className="bg-[#F2EFE9] border border-stone-300/80 rounded-2xl p-6 text-stone-800 shadow-xs">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div>
            <div className="flex flex-wrap items-center gap-2">
              <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-blue-100 text-blue-900 border border-blue-300">
                崔老師指導論文專用數線
              </span>
              <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-stone-100 text-stone-700 border border-stone-300 flex items-center gap-1">
                {cloudSyncStatus === 'synced' ? (
                  <>
                    <CloudCheck className="w-3.5 h-3.5 text-blue-600" />
                    <span className="text-blue-800">Firebase 即時連線同步中</span>
                  </>
                ) : cloudSyncStatus === 'saving' ? (
                  <>
                    <Cloud className="w-3.5 h-3.5 text-amber-600 animate-pulse" />
                    <span className="text-amber-800">儲存資料至雲端...</span>
                  </>
                ) : (
                  <>
                    <Cloud className="w-3.5 h-3.5 text-stone-500" />
                    <span className="text-stone-600">本機暫存模式</span>
                  </>
                )}
              </span>
            </div>
            <h1 className="text-2xl font-bold mt-1.5 text-stone-900 tracking-tight flex items-center gap-2">
              <span>碩博士學位論文兩階段進度數線登錄系統</span>
              {totalPercent === 100 && (
                <span className="text-xs bg-amber-500 text-white font-bold px-2 py-0.5 rounded-full">
                  🎓 恭喜榮獲學位！
                </span>
              )}
            </h1>
            <p className="text-xs sm:text-sm text-stone-600 mt-1 max-w-3xl leading-relaxed">
              依據崔老師指導規範建立之完整學位歷程（第一階段計畫口試 11 步、第二階段資料蒐集與學位口試 16 步）。
              學生請以 Gmail 登入填寫，<strong>步驟只能持續往前推進，不可刪除已經登錄過之進度</strong>。
            </p>

            {/* Quick Link to All Students Board & Locked Rule Notice */}
            <div className="mt-3 flex flex-wrap items-center gap-2 text-xs">
              <div className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-lg bg-amber-50 border border-amber-200 text-amber-900 font-semibold">
                <Lock className="w-3.5 h-3.5 text-amber-700 shrink-0" />
                <span>核心規範：步驟只能往前推進，不可刪除已登錄過的項目</span>
              </div>

              {onSwitchToOverview && (
                <button
                  onClick={onSwitchToOverview}
                  className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-lg bg-blue-700 hover:bg-blue-800 text-white font-semibold shadow-2xs transition-all"
                >
                  <Users className="w-3.5 h-3.5" />
                  <span>整理出現每一位學生的進度看板 ➔</span>
                </button>
              )}
            </div>
          </div>

          {/* Student/Auth Profile Controls */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 bg-white/90 p-3 rounded-xl border border-stone-200">
            {currentUser ? (
              <div className="flex items-center space-x-3">
                {currentUser.photoURL ? (
                  <img 
                    src={currentUser.photoURL} 
                    alt={currentUser.displayName || ''} 
                    className="w-9 h-9 rounded-full border border-blue-300"
                  />
                ) : (
                  <div className="w-9 h-9 rounded-full bg-blue-100 text-blue-800 flex items-center justify-center font-bold text-sm">
                    {studentName.charAt(0)}
                  </div>
                )}
                <div>
                  <div className="text-xs font-bold text-stone-900 flex items-center gap-1.5">
                    <span>{studentName}</span>
                    <span className="text-[10px] font-medium text-blue-800 bg-blue-50 px-1.5 py-0.5 rounded border border-blue-200">
                      Gmail 自動帶入
                    </span>
                  </div>
                  <div className="text-[11px] text-stone-500 truncate max-w-[180px]">{currentUser.email}</div>
                </div>
                <button
                  onClick={handleGoogleLogout}
                  title="登出 Google（數線將重設為空白）"
                  className="p-1.5 rounded-lg text-stone-400 hover:text-stone-700 hover:bg-stone-100 transition-colors"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2">
                <div className="text-xs text-stone-500 font-medium">
                  個人數線空白中：
                </div>
                <button
                  onClick={handleGoogleLogin}
                  disabled={authLoading}
                  className="inline-flex items-center justify-center space-x-1.5 px-3 py-1.5 rounded-lg bg-blue-700 hover:bg-blue-800 text-white text-xs font-bold shadow-xs transition-all disabled:opacity-50"
                >
                  <LogIn className="w-3.5 h-3.5" />
                  <span>以 Google 登入載入進度</span>
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Unauthenticated / Logged-Out Notice Banner */}
      {!currentUser && (
        <div className="bg-stone-50 border border-stone-200/90 rounded-2xl p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-stone-800 shadow-2xs">
          <div className="flex items-start space-x-3">
            <div className="w-9 h-9 rounded-xl bg-amber-100 text-amber-800 flex items-center justify-center shrink-0 border border-amber-200 mt-0.5">
              <Lock className="w-4 h-4" />
            </div>
            <div>
              <div className="font-bold text-sm text-stone-900 flex items-center gap-2">
                <span>目前為未登入狀態（個人數線保持空白）</span>
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-stone-200 text-stone-700 font-bold">
                  進度 0%
                </span>
              </div>
              <p className="text-xs text-stone-600 mt-1 leading-relaxed">
                依指導規定，未登入時個人數線保持空白（不殘留前一位學生的資料）。請登入 Google 帳號，系統將自動連線雲端並載入您的 Gmail 姓名與專屬論文數線。
              </p>
            </div>
          </div>
          <button
            onClick={handleGoogleLogin}
            disabled={authLoading}
            className="shrink-0 px-4 py-2 rounded-xl bg-blue-700 hover:bg-blue-800 text-white font-bold text-xs flex items-center space-x-1.5 shadow-xs transition-all cursor-pointer"
          >
            <LogIn className="w-4 h-4" />
            <span>登入 Google 帳號</span>
          </button>
        </div>
      )}

      {/* 2. Overall Progress Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Phase 1 Summary */}
        <div 
          onClick={() => setActivePhaseTab('phase1')}
          className={`cursor-pointer p-4 rounded-xl border transition-all ${
            activePhaseTab === 'phase1'
              ? 'bg-white border-blue-600 ring-2 ring-blue-600/20 shadow-xs'
              : 'bg-white/80 border-stone-200 hover:border-stone-300'
          }`}
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-stone-500 uppercase tracking-wider">第一階段</span>
            <span className="text-xs font-bold px-2 py-0.5 rounded bg-blue-50 text-blue-800 border border-blue-200">
              {phase1CompletedCount} / {phase1Total} 步
            </span>
          </div>
          <div className="mt-2 flex items-baseline justify-between">
            <h3 className="font-bold text-stone-900 text-sm">論文計畫口試階段</h3>
            <span className="text-lg font-extrabold text-blue-800">{phase1Percent}%</span>
          </div>
          <div className="w-full bg-stone-100 h-2 rounded-full mt-2 overflow-hidden">
            <div 
              className="bg-blue-600 h-full rounded-full transition-all duration-500"
              style={{ width: `${phase1Percent}%` }}
            />
          </div>
          <p className="text-[11px] text-stone-500 mt-2">
            文獻探索 ➔ 題目審查 ➔ 撰寫1~3章 ➔ 計畫口試 ➔ 計畫修正 (共11步)
          </p>
        </div>

        {/* Phase 2 Summary */}
        <div 
          onClick={() => setActivePhaseTab('phase2')}
          className={`cursor-pointer p-4 rounded-xl border transition-all ${
            activePhaseTab === 'phase2'
              ? 'bg-white border-blue-600 ring-2 ring-blue-600/20 shadow-xs'
              : 'bg-white/80 border-stone-200 hover:border-stone-300'
          }`}
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-stone-500 uppercase tracking-wider">第二階段</span>
            <span className="text-xs font-bold px-2 py-0.5 rounded bg-amber-50 text-amber-900 border border-amber-200">
              {phase2CompletedCount} / {phase2Total} 步
            </span>
          </div>
          <div className="mt-2 flex items-baseline justify-between">
            <h3 className="font-bold text-stone-900 text-sm">資料蒐集與學位口試</h3>
            <span className="text-lg font-extrabold text-amber-800">{phase2Percent}%</span>
          </div>
          <div className="w-full bg-stone-100 h-2 rounded-full mt-2 overflow-hidden">
            <div 
              className="bg-amber-600 h-full rounded-full transition-all duration-500"
              style={{ width: `${phase2Percent}%` }}
            />
          </div>
          <p className="text-[11px] text-stone-500 mt-2">
            倫理同意書 ➔ 資料分析 ➔ 小論文審查 ➔ 論文比對 ➔ 學位口試 ➔ 恭喜畢業 (共16步)
          </p>
        </div>

        {/* Total Trajectory */}
        <div 
          onClick={() => setActivePhaseTab('all')}
          className={`cursor-pointer p-4 rounded-xl border transition-all ${
            activePhaseTab === 'all'
              ? 'bg-white border-blue-600 ring-2 ring-blue-600/20 shadow-xs'
              : 'bg-white/80 border-stone-200 hover:border-stone-300'
          }`}
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-stone-500 uppercase tracking-wider">全景學位數線</span>
            <span className="text-xs font-bold px-2 py-0.5 rounded bg-stone-100 text-stone-800 border border-stone-200">
              全體 {totalCompletedCount} / {totalStepsCount} 步
            </span>
          </div>
          <div className="mt-2 flex items-baseline justify-between">
            <h3 className="font-bold text-stone-900 text-sm">碩博士畢業全進度</h3>
            <span className="text-lg font-extrabold text-stone-900">{totalPercent}%</span>
          </div>
          <div className="w-full bg-stone-100 h-2 rounded-full mt-2 overflow-hidden">
            <div 
              className="bg-gradient-to-r from-blue-600 to-amber-600 h-full rounded-full transition-all duration-500"
              style={{ width: `${totalPercent}%` }}
            />
          </div>
          <p className="text-[11px] text-stone-500 mt-2">
            點擊展開 27 步全覽數線，總覽從入學選題至拔得碩博士學位全程軌跡
          </p>
        </div>
      </div>

      {/* 3. The Number Line Visualization (數線呈現) */}
      <div className="bg-white border border-stone-200 rounded-2xl p-5 sm:p-6 shadow-xs space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-stone-200 pb-3">
          <div>
            <div className="text-xs font-bold text-stone-500 uppercase tracking-wider">
              數線坐標軸（NUMBER LINE TIMELINE）
            </div>
            <h2 className="text-base sm:text-lg font-bold text-stone-900">
              {activePhaseTab === 'phase1' && '第一階段數線：論文計畫口試（坐標 1 ~ 11）'}
              {activePhaseTab === 'phase2' && '第二階段數線：資料蒐集與學位口試（坐標 1 ~ 16）'}
              {activePhaseTab === 'all' && '畢業全景大數線：從題目探索至恭喜畢業（坐標 1 ~ 27）'}
            </h2>
          </div>

          {/* Phase view buttons */}
          <div className="flex items-center space-x-1 bg-stone-100 p-1 rounded-xl border border-stone-200 self-start sm:self-auto">
            <button
              onClick={() => {
                setActivePhaseTab('phase1');
                setSelectedStepId('p1-1');
              }}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                activePhaseTab === 'phase1'
                  ? 'bg-white text-blue-800 shadow-xs'
                  : 'text-stone-600 hover:text-stone-900'
              }`}
            >
              第 1 階段 (11步)
            </button>
            <button
              onClick={() => {
                setActivePhaseTab('phase2');
                setSelectedStepId('p2-1');
              }}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                activePhaseTab === 'phase2'
                  ? 'bg-white text-amber-800 shadow-xs'
                  : 'text-stone-600 hover:text-stone-900'
              }`}
            >
              第 2 階段 (16步)
            </button>
            <button
              onClick={() => {
                setActivePhaseTab('all');
                setSelectedStepId('p1-1');
              }}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                activePhaseTab === 'all'
                  ? 'bg-white text-stone-900 shadow-xs'
                  : 'text-stone-600 hover:text-stone-900'
              }`}
            >
              全景 27 步大數線
            </button>
          </div>
        </div>

        {/* 數線本體 (Scrollable Horizontal Number Line Track) */}
        <div 
          ref={numberLineScrollRef}
          className="overflow-x-auto py-8 px-4 scrollbar-thin scrollbar-thumb-stone-300"
        >
          <div className="min-w-[840px] lg:min-w-full relative px-6">
            {/* Base Continuous Horizontal Axis (數線基底導軌) */}
            <div className="absolute top-1/2 left-6 right-6 h-1.5 -translate-y-1/2 bg-stone-200 rounded-full" />

            {/* Filled Active Progress Line on the Axis */}
            {(() => {
              const totalItems = currentStepList.length;
              if (totalItems <= 1) return null;
              // Calculate index of the highest completed step in current list
              let maxCompletedIdx = -1;
              currentStepList.forEach((s, idx) => {
                if (completedSteps.includes(s.id)) {
                  maxCompletedIdx = Math.max(maxCompletedIdx, idx);
                }
              });
              const fillPct = maxCompletedIdx >= 0 ? (maxCompletedIdx / (totalItems - 1)) * 100 : 0;

              return (
                <div 
                  className="absolute top-1/2 left-6 h-1.5 -translate-y-1/2 bg-blue-600 rounded-full transition-all duration-500"
                  style={{ width: `calc((100% - 48px) * ${fillPct / 100})` }}
                />
              );
            })()}

            {/* Number Line Nodes (數線刻度與點位) */}
            <div className="relative flex items-center justify-between z-10">
              {currentStepList.map((step, idx) => {
                const isCompleted = completedSteps.includes(step.id);
                const isSelected = selectedStepId === step.id;
                const isSpecialMilestone = 
                  step.id === 'p1-6' || 
                  step.id === 'p1-8' || 
                  step.id === 'p1-10' || 
                  step.id === 'p2-1' || 
                  step.id === 'p2-9' || 
                  step.id === 'p2-11' || 
                  step.id === 'p2-13' || 
                  step.id === 'p2-16';

                return (
                  <div 
                    key={step.id} 
                    className="flex flex-col items-center group cursor-pointer"
                    onClick={() => setSelectedStepId(step.id)}
                  >
                    {/* Top coordinate indicator label (刻度上方簡述) */}
                    <div className="h-6 mb-2 flex items-center justify-center">
                      {isSpecialMilestone && (
                        <span className="text-[10px] font-bold px-1.5 py-0.2 rounded bg-amber-100 text-amber-900 border border-amber-300 animate-pulse whitespace-nowrap">
                          {step.id === 'p2-16' ? '🏆 畢業' : '關鍵'}
                        </span>
                      )}
                    </div>

                    {/* Node Circle on the Number Line (數線圓形刻度點) */}
                    <button
                      className={`relative w-9 h-9 sm:w-10 sm:h-10 rounded-full flex items-center justify-center font-bold text-xs sm:text-sm transition-all duration-300 ${
                        isCompleted
                          ? 'bg-blue-700 text-white shadow-sm ring-2 ring-blue-600/30 hover:bg-blue-800'
                          : isSelected
                          ? 'bg-white border-2 border-blue-700 text-blue-800 ring-4 ring-blue-600/20'
                          : 'bg-white border-2 border-stone-300 text-stone-600 hover:border-stone-400 hover:text-stone-900'
                      }`}
                      title={`${step.stepNumber}. ${step.title}`}
                    >
                      {isCompleted ? (
                        <Check className="w-4 h-4 stroke-[3]" />
                      ) : (
                        <span>{step.stepNumber}</span>
                      )}

                      {/* Selected Node Halo Ping */}
                      {isSelected && (
                        <span className="absolute -top-1 -right-1 flex h-3 w-3">
                          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
                          <span className="relative inline-flex rounded-full h-3 w-3 bg-blue-600"></span>
                        </span>
                      )}
                    </button>

                    {/* Bottom Step Title Tick (數線刻度下方標題) */}
                    <div className="mt-2 text-center max-w-[80px] sm:max-w-[95px]">
                      <div className={`text-[11px] font-bold line-clamp-2 leading-tight transition-colors ${
                        isSelected 
                          ? 'text-blue-900 font-extrabold' 
                          : isCompleted 
                          ? 'text-stone-800' 
                          : 'text-stone-500 group-hover:text-stone-700'
                      }`}>
                        {step.title}
                      </div>

                      {/* Logged Date badge */}
                      {stepDates[step.id] && (
                        <div className="text-[10px] text-stone-400 font-mono mt-0.5 whitespace-nowrap">
                          {stepDates[step.id].substring(5)}
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Number Line Quick Navigation & Directional Stepper */}
        <div className="flex items-center justify-between pt-2 border-t border-stone-100 text-xs">
          <button
            onClick={() => {
              const currIdx = currentStepList.findIndex(s => s.id === selectedStepId);
              if (currIdx > 0) {
                setSelectedStepId(currentStepList[currIdx - 1].id);
              }
            }}
            disabled={activeNumberLineIndex <= 0}
            className="inline-flex items-center space-x-1 px-3 py-1.5 rounded-lg border border-stone-200 text-stone-700 hover:bg-stone-50 disabled:opacity-30 disabled:cursor-not-allowed"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>上一個數線刻度</span>
          </button>

          <span className="text-stone-500 font-medium">
            坐標位置：第 <strong className="text-blue-800 font-bold">{selectedStep.stepNumber}</strong> / {currentStepList.length} 步
          </span>

          <button
            onClick={() => {
              const currIdx = currentStepList.findIndex(s => s.id === selectedStepId);
              if (currIdx < currentStepList.length - 1) {
                setSelectedStepId(currentStepList[currIdx + 1].id);
              }
            }}
            disabled={activeNumberLineIndex >= currentStepList.length - 1}
            className="inline-flex items-center space-x-1 px-3 py-1.5 rounded-lg border border-stone-200 text-stone-700 hover:bg-stone-50 disabled:opacity-30 disabled:cursor-not-allowed"
          >
            <span>下一個數線刻度</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Dynamic Feedback Toast / Notification */}
      {toastMessage && (
        <div className="p-4 bg-blue-50 border border-blue-300 rounded-2xl text-xs sm:text-sm font-semibold text-blue-950 flex items-center justify-between shadow-xs">
          <div className="flex items-center space-x-2.5">
            <CheckCircle2 className="w-5 h-5 text-blue-600 shrink-0" />
            <span>{toastMessage}</span>
          </div>
          <button 
            onClick={() => setToastMessage(null)}
            className="text-blue-700 hover:text-blue-950 font-bold px-2 py-1 rounded hover:bg-blue-100/60 transition-colors"
          >
            ✕
          </button>
        </div>
      )}

      {/* 4. Selected Step Detail & Execution Guidance Card */}
      <div className="bg-white border border-stone-200 rounded-2xl p-6 sm:p-7 shadow-xs space-y-5">
        <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
          <div>
            <div className="flex items-center space-x-2">
              <span className="px-2 py-0.5 rounded text-[11px] font-bold bg-stone-100 text-stone-700 border border-stone-200">
                階段 {selectedStep.phase} • 步驟 {selectedStep.stepNumber}
              </span>
              <span className="px-2 py-0.5 rounded text-[11px] font-bold bg-blue-50 text-blue-800 border border-blue-200">
                {selectedStep.categoryLabel}
              </span>
              {selectedStep.recommendedDuration && (
                <span className="text-xs text-stone-400 flex items-center gap-1">
                  <Clock className="w-3 h-3" />
                  {selectedStep.recommendedDuration}
                </span>
              )}
            </div>
            <h3 className="text-lg sm:text-xl font-bold text-stone-900 mt-2">
              {selectedStep.stepNumber}. {selectedStep.title}
            </h3>

            {/* 此步驟完成日期 (系統自動抓取時間，不必手動填寫) */}
            <div className="mt-2.5">
              {isSelectedCompleted ? (
                <div className="inline-flex items-center space-x-2 px-3 py-1.5 rounded-lg bg-blue-50 border border-blue-200 text-xs text-blue-950 font-semibold shadow-2xs">
                  <CheckCircle2 className="w-4 h-4 text-blue-600 shrink-0" />
                  <span>此步驟完成日期：<strong className="font-mono text-blue-900">{stepDates[selectedStep.id] || new Date().toISOString().split('T')[0]}</strong></span>
                  <span className="text-[10px] font-medium text-blue-800 bg-blue-100 px-1.5 py-0.5 rounded">系統自動記錄</span>
                </div>
              ) : (
                <div className="inline-flex items-center space-x-2 px-3 py-1.5 rounded-lg bg-stone-50 border border-stone-200 text-xs text-stone-500">
                  <Clock className="w-3.5 h-3.5 text-stone-400 shrink-0" />
                  <span>此步驟完成日期：尚未登錄（點擊右側按鈕由系統自動記錄今日時間）</span>
                </div>
              )}
            </div>
          </div>

          {/* Step Completion Registration Button (Strictly forward-only, instant response) */}
          {(() => {
            if (!currentUser) {
              return (
                <div className="flex flex-col sm:items-end">
                  <button
                    onClick={handleGoogleLogin}
                    disabled={authLoading}
                    className="flex-shrink-0 px-4 py-2.5 rounded-xl font-bold text-xs sm:text-sm flex items-center space-x-2 transition-all bg-blue-700 hover:bg-blue-800 active:scale-95 text-white shadow-md cursor-pointer"
                    title="請先登入 Google 帳號以登錄此步驟並同步雲端"
                  >
                    <LogIn className="w-4 h-4 text-white" />
                    <span>以 Google 帳號登入後登錄</span>
                  </button>
                  <span className="text-[11px] text-stone-500 font-medium mt-1.5 flex items-center gap-1">
                    <Lock className="w-3 h-3 text-stone-400 shrink-0" />
                    <span>目前為未登入狀態，登入後自動連線專屬進度</span>
                  </span>
                </div>
              );
            }

            const uncompletedPrecedingCount = ALL_THESIS_STEPS.filter(
              s => s.globalIndex < selectedStep.globalIndex && !completedSteps.includes(s.id)
            ).length;

            return (
              <div className="flex flex-col sm:items-end">
                <button
                  onClick={() => handleToggleStep(selectedStep.id)}
                  className={`flex-shrink-0 px-4 py-2.5 rounded-xl font-bold text-xs sm:text-sm flex items-center space-x-2 transition-all ${
                    isSelectedCompleted
                      ? 'bg-blue-900/90 text-blue-100 border border-blue-700/60 shadow-xs cursor-default'
                      : 'bg-blue-600 hover:bg-blue-700 active:scale-95 text-white shadow-md cursor-pointer'
                  }`}
                  title={
                    isSelectedCompleted 
                      ? '依崔老師指導規定：步驟只能往前，不可撤銷或刪除已經登錄過之步驟'
                      : '點擊立即登錄此步驟（系統將自動記錄日期，前置步驟一併視為完成）'
                  }
                >
                  {isSelectedCompleted ? (
                    <>
                      <Lock className="w-4 h-4 text-blue-300" />
                      <span>✓ 已登錄完成 (已鎖定不可刪除)</span>
                    </>
                  ) : uncompletedPrecedingCount > 0 ? (
                    <>
                      <CheckCircle2 className="w-4 h-4 text-white" />
                      <span>登錄至第 {selectedStep.globalIndex} 步（第 1 ~ {selectedStep.globalIndex - 1} 步一併完成）</span>
                    </>
                  ) : (
                    <>
                      <CheckCircle2 className="w-4 h-4 text-white" />
                      <span>登錄完成此步驟 (僅能往前)</span>
                    </>
                  )}
                </button>
                {uncompletedPrecedingCount > 0 && !isSelectedCompleted && (
                  <span className="text-[11px] text-amber-700 font-medium mt-1.5 flex items-center gap-1">
                    <Sparkles className="w-3 h-3 text-amber-600 shrink-0" />
                    <span>前置第 1 ~ {selectedStep.globalIndex - 1} 步將自動一併視為完成並抓取今日時間</span>
                  </span>
                )}
              </div>
            );
          })()}
        </div>

        {/* Step Description */}
        <p className="text-sm text-stone-700 leading-relaxed bg-stone-50/70 p-4 rounded-xl border border-stone-200/80">
          {selectedStep.description}
        </p>

        {/* Special Highlight Reminder Box (e.g. 留下手機、敬請書、停車證、同意書) */}
        {selectedStep.importantReminders.length > 0 && (
          <div className="p-4 rounded-xl bg-amber-50/70 border border-amber-200/90 space-y-2">
            <div className="text-xs font-bold text-amber-900 flex items-center space-x-1.5">
              <AlertTriangle className="w-4 h-4 text-amber-700 flex-shrink-0" />
              <span>提醒與關鍵查核點：</span>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {selectedStep.importantReminders.map((rem, rIdx) => (
                <div key={rIdx} className="text-xs text-amber-900 font-medium flex items-center space-x-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-amber-600"></span>
                  <span>{rem}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Action Items List */}
        <div className="space-y-2.5 pt-2">
          <h4 className="text-xs font-bold text-stone-800 uppercase tracking-wider flex items-center space-x-1.5">
            <FileCheck2 className="w-4 h-4 text-blue-700" />
            <span>本步驟落實檢核清單：</span>
          </h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-2.5">
            {selectedStep.actionItems.map((act, aIdx) => (
              <div 
                key={aIdx} 
                className="p-3.5 bg-stone-50/70 rounded-xl border border-stone-200/80 text-xs sm:text-sm text-stone-800 flex items-start space-x-2.5"
              >
                <span className="text-blue-700 font-bold mt-0.5">•</span>
                <span className="leading-relaxed">{act}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
