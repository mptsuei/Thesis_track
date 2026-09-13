import React, { useState, useEffect, useRef } from 'react';
import { 
  PHASE_1_STEPS, 
  PHASE_2_STEPS, 
  ALL_THESIS_STEPS,
  ensurePrecedingStepsCompleted 
} from '../data/thesisStepsData';
import { ThesisStep, StudentProgressRecord } from '../types';
import { 
  db, 
  handleFirestoreError, 
  OperationType 
} from '../lib/firebase';
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
  Lock,
  KeyRound,
  Eye,
  EyeOff,
  UserPlus,
  X,
  AlertCircle
} from 'lucide-react';

interface Props {
  onSwitchToOverview?: () => void;
}

export const ThesisNumberLineProgress: React.FC<Props> = ({ 
  onSwitchToOverview 
}) => {
  // Active student account session (stored in localStorage)
  const [activeStudent, setActiveStudent] = useState<StudentProgressRecord | null>(() => {
    try {
      const saved = localStorage.getItem('thesis_current_student');
      return saved ? JSON.parse(saved) : null;
    } catch {
      return null;
    }
  });

  const [cloudSyncStatus, setCloudSyncStatus] = useState<'synced' | 'saving' | 'local' | 'error'>('local');
  const [syncMessage, setSyncMessage] = useState<string>('未登入學生帳號');

  // Active view: Phase 1 (11 steps), Phase 2 (16 steps), or All (27 steps)
  const [activePhaseTab, setActivePhaseTab] = useState<'phase1' | 'phase2' | 'all'>('phase1');
  const [selectedStepId, setSelectedStepId] = useState<string>('p1-1');

  // Student progress state
  const [studentName, setStudentName] = useState<string>('研究生同學');
  const [completedSteps, setCompletedSteps] = useState<string[]>([]);
  const [stepDates, setStepDates] = useState<Record<string, string>>({});
  const [stepNotes, setStepNotes] = useState<Record<string, string>>({});
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Student Login Modal State
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [showPasswordText, setShowPasswordText] = useState(false);
  const [loginError, setLoginError] = useState<string | null>(null);
  const [isSubmittingAuth, setIsSubmittingAuth] = useState(false);

  // First-time Password Setup State (when teacher created student without password)
  const [isFirstTimeSetup, setIsFirstTimeSetup] = useState(false);
  const [pendingStudentDoc, setPendingStudentDoc] = useState<StudentProgressRecord | null>(null);
  const [newSetupPassword, setNewSetupPassword] = useState('');
  const [confirmSetupPassword, setConfirmSetupPassword] = useState('');

  // Self-registration State (when student email not yet created by teacher)
  const [isSelfRegister, setIsSelfRegister] = useState(false);
  const [registerStudentName, setRegisterStudentName] = useState('');

  // Change Password Modal State (when logged in)
  const [showChangePasswordModal, setShowChangePasswordModal] = useState(false);
  const [currentPwdInput, setCurrentPwdInput] = useState('');
  const [newPwdInput, setNewPwdInput] = useState('');
  const [confirmNewPwdInput, setConfirmNewPwdInput] = useState('');
  const [changePwdError, setChangePwdError] = useState<string | null>(null);

  const numberLineScrollRef = useRef<HTMLDivElement>(null);

  // Helper to apply login
  const applyStudentLogin = (student: StudentProgressRecord) => {
    setActiveStudent(student);
    localStorage.setItem('thesis_current_student', JSON.stringify(student));
    setStudentName(student.studentName || '研究生同學');
    if (student.completedSteps) {
      setCompletedSteps(ensurePrecedingStepsCompleted(student.completedSteps, student.currentStepNumber));
    }
    if (student.stepDates) setStepDates(student.stepDates);
    if (student.stepNotes) setStepNotes(student.stepNotes);
    setCloudSyncStatus('synced');
    setSyncMessage(`已連線 Firebase (${student.studentEmail || ''})`);
  };

  // Real-time Firestore document sync
  useEffect(() => {
    if (!activeStudent) {
      // Logged out: keep state completely empty
      setStudentName('未登入學生');
      setCompletedSteps([]);
      setStepDates({});
      setStepNotes({});
      setCloudSyncStatus('local');
      setSyncMessage('未登入學生帳號，數線保持空白');
      return;
    }

    setCloudSyncStatus('saving');
    const docRef = doc(db, 'student_progress', activeStudent.studentId);

    const unsubscribe = onSnapshot(docRef, (snapshot) => {
      if (snapshot.exists()) {
        const data = snapshot.data() as StudentProgressRecord;
        if (data.completedSteps) {
          setCompletedSteps(ensurePrecedingStepsCompleted(data.completedSteps, data.currentStepNumber));
        } else {
          setCompletedSteps([]);
        }
        if (data.stepDates) setStepDates(data.stepDates);
        if (data.stepNotes) setStepNotes(data.stepNotes);
        if (data.studentName) setStudentName(data.studentName);

        // Update cached active student in case teacher adjusted password or name
        setActiveStudent(prev => prev ? { ...prev, ...data, studentId: snapshot.id } : null);
        localStorage.setItem('thesis_current_student', JSON.stringify({ ...data, studentId: snapshot.id }));

        setCloudSyncStatus('synced');
        setSyncMessage(`Firebase 雲端已即時同步 (${data.studentEmail || ''})`);
      }
    }, (error) => {
      console.warn('Firestore onSnapshot error:', error);
      setCloudSyncStatus('error');
      setSyncMessage('雲端同步暫停，請檢查網路');
    });

    return () => unsubscribe();
  }, [activeStudent?.studentId]);

  // Persist progression changes to Firestore
  const persistChanges = async (
    newCompleted: string[],
    newDates: Record<string, string>,
    newNotes: Record<string, string>
  ) => {
    if (!activeStudent) {
      setToastMessage('⚠️ 請先登入學生帳號（Email + 6 位數密碼）！');
      setShowLoginModal(true);
      return;
    }

    const completedStepObjs = ALL_THESIS_STEPS.filter(s => newCompleted.includes(s.id));
    const highestStep = completedStepObjs.reduce<ThesisStep | null>((prev, curr) => {
      if (!prev) return curr;
      return curr.globalIndex > prev.globalIndex ? curr : prev;
    }, null);

    const currentStepNumber = highestStep ? highestStep.globalIndex : (newCompleted.length > 0 ? newCompleted.length : 1);
    const currentStepTitle = highestStep ? highestStep.title : '閱讀文獻找題目';

    const payload: Partial<StudentProgressRecord> = {
      studentId: activeStudent.studentId,
      studentName: studentName || activeStudent.studentName,
      studentEmail: activeStudent.studentEmail || '',
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
      const docRef = doc(db, 'student_progress', activeStudent.studentId);
      await setDoc(docRef, {
        ...payload,
        lastUpdatedServer: serverTimestamp()
      }, { merge: true });
      setCloudSyncStatus('synced');
      setSyncMessage(`已同步至 Firebase 雲端 (${new Date().toLocaleTimeString()})`);
    } catch (error) {
      console.error('Save error:', error);
      setCloudSyncStatus('error');
      setSyncMessage('雲端寫入失敗，請檢查權限與連線');
    }
  };

  // Student Login Handler
  const handleStudentLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    const email = loginEmail.trim().toLowerCase();
    const pwd = loginPassword.trim();

    if (!email || !email.includes('@')) {
      setLoginError('請填寫正確格式的 Email 帳號！');
      return;
    }

    setIsSubmittingAuth(true);
    setLoginError(null);

    try {
      // Find student record in Firestore matching email
      const querySnapshot = await getDocs(collection(db, 'student_progress'));
      let found: StudentProgressRecord | null = null;
      let docId = '';

      querySnapshot.forEach((d) => {
        const data = d.data() as StudentProgressRecord;
        if (data.studentEmail?.trim().toLowerCase() === email) {
          found = data;
          docId = d.id;
        }
      });

      if (!found) {
        // Email not found: prompt self-registration
        setIsSelfRegister(true);
        setLoginError('系統名冊中尚未有此 Email。若您是崔老師實驗室研究生，可直接輸入您的姓名與 6 位數密碼開通專屬數線！');
        setIsSubmittingAuth(false);
        return;
      }

      const studentRecord: StudentProgressRecord = { ...found, studentId: docId };

      // Check if student has set a password yet
      if (!studentRecord.password) {
        // First-time setup: teacher created account with empty password
        setPendingStudentDoc(studentRecord);
        setIsFirstTimeSetup(true);
        setIsSubmittingAuth(false);
        return;
      }

      // Verify password
      if (studentRecord.password !== pwd) {
        setLoginError('6 位數密碼不正確！若忘記密碼，請聯繫崔老師在全體看板管理後台查詢或重設。');
        setIsSubmittingAuth(false);
        return;
      }

      // Success! Log in student
      applyStudentLogin(studentRecord);
      setShowLoginModal(false);
      setLoginEmail('');
      setLoginPassword('');
      setLoginError(null);
      setToastMessage(`✓ 歡迎 ${studentRecord.studentName} 同學！已成功登入並載入個人論文進度數線。`);
    } catch (err) {
      console.error('Login error:', err);
      setLoginError(`連線登入失敗：${err}`);
    } finally {
      setIsSubmittingAuth(false);
    }
  };

  // Complete First-Time Password Setup
  const handleCompleteFirstTimeSetup = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!pendingStudentDoc) return;

    const p1 = newSetupPassword.trim();
    const p2 = confirmSetupPassword.trim();

    if (p1.length !== 6) {
      setLoginError('密碼請設定剛好 6 位數！');
      return;
    }
    if (p1 !== p2) {
      setLoginError('兩次輸入的 6 位數密碼不一致，請重新確認！');
      return;
    }

    setIsSubmittingAuth(true);
    try {
      const docRef = doc(db, 'student_progress', pendingStudentDoc.studentId);
      await setDoc(docRef, {
        password: p1,
        lastUpdated: new Date().toISOString()
      }, { merge: true });

      const updated = { ...pendingStudentDoc, password: p1 };
      applyStudentLogin(updated);
      setShowLoginModal(false);
      setIsFirstTimeSetup(false);
      setPendingStudentDoc(null);
      setNewSetupPassword('');
      setConfirmSetupPassword('');
      setToastMessage(`✓ 6 位數密碼自訂成功！已為您登入並載入論文進度數線。`);
    } catch (err) {
      setLoginError(`設定密碼失敗：${err}`);
    } finally {
      setIsSubmittingAuth(false);
    }
  };

  // Self-Register New Student
  const handleSelfRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    const name = registerStudentName.trim();
    const email = loginEmail.trim().toLowerCase();
    const pwd = newSetupPassword.trim();
    const confirmPwd = confirmSetupPassword.trim();

    if (!name) {
      setLoginError('請輸入學生姓名！');
      return;
    }
    if (pwd.length !== 6) {
      setLoginError('密碼請設定剛好 6 位數！');
      return;
    }
    if (pwd !== confirmPwd) {
      setLoginError('兩次輸入的密碼不一致！');
      return;
    }

    setIsSubmittingAuth(true);
    try {
      const newId = `std_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;
      const today = new Date().toISOString().split('T')[0];
      const newRecord: StudentProgressRecord = {
        studentId: newId,
        studentName: name,
        studentEmail: email,
        thesisTopic: '',
        currentPhase: 1,
        currentStepNumber: 1,
        currentStepTitle: '閱讀文獻找題目',
        completedSteps: ['p1-1'],
        stepDates: { 'p1-1': today },
        stepNotes: {},
        password: pwd,
        lastUpdated: new Date().toISOString()
      };

      const docRef = doc(db, 'student_progress', newId);
      await setDoc(docRef, newRecord);

      applyStudentLogin(newRecord);
      setShowLoginModal(false);
      setIsSelfRegister(false);
      setRegisterStudentName('');
      setLoginEmail('');
      setNewSetupPassword('');
      setConfirmSetupPassword('');
      setToastMessage(`✓ 歡迎 ${name} 同學！帳號已開通，已為您記錄第 1 步起步。`);
    } catch (err) {
      setLoginError(`開通失敗：${err}`);
    } finally {
      setIsSubmittingAuth(false);
    }
  };

  // Student Logout
  const handleStudentLogout = () => {
    localStorage.removeItem('thesis_current_student');
    setActiveStudent(null);
    setStudentName('未登入學生');
    setCompletedSteps([]);
    setStepDates({});
    setStepNotes({});
    setSelectedStepId('p1-1');
    setCloudSyncStatus('local');
    setSyncMessage('已登出。數線已清空歸零（0%），請登入學生帳號記錄個人進度。');
    setToastMessage('✓ 已成功登出。個人數線已清空歸零（0%）。');
  };

  // Student Change Password
  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!activeStudent) return;

    if (activeStudent.password && currentPwdInput.trim() !== activeStudent.password) {
      setChangePwdError('原 6 位數密碼輸入錯誤！');
      return;
    }
    if (newPwdInput.trim().length !== 6) {
      setChangePwdError('新密碼必須剛好 6 位數！');
      return;
    }
    if (newPwdInput.trim() !== confirmNewPwdInput.trim()) {
      setChangePwdError('兩次新密碼不一致！');
      return;
    }

    try {
      const docRef = doc(db, 'student_progress', activeStudent.studentId);
      await setDoc(docRef, {
        password: newPwdInput.trim(),
        lastUpdated: new Date().toISOString()
      }, { merge: true });

      const updated = { ...activeStudent, password: newPwdInput.trim() };
      setActiveStudent(updated);
      localStorage.setItem('thesis_current_student', JSON.stringify(updated));

      setShowChangePasswordModal(false);
      setCurrentPwdInput('');
      setNewPwdInput('');
      setConfirmNewPwdInput('');
      setChangePwdError(null);
      setToastMessage('✓ 6 位數密碼修改成功！下次請使用新密碼登入。');
    } catch (err) {
      setChangePwdError(`修改失敗：${err}`);
    }
  };

  // Strictly forward-only step registration
  const handleToggleStep = (stepId: string) => {
    if (!activeStudent) {
      setToastMessage('⚠️ 請先登入學生帳號（Email + 6 位數密碼）！登入後方可登錄進度。');
      setShowLoginModal(true);
      return;
    }

    // 1. If step is already completed, cannot undo
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

    // Auto record system date (抓系統的時間, 不必讓學生寫)
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

  const activeNumberLineIndex = currentStepList.findIndex(s => s.id === selectedStepId);

  return (
    <div className="space-y-6">
      {/* 1. Header Banner & Firebase Cloud Status (Soft Light Blue Gradient) */}
      <div className="bg-gradient-to-r from-blue-100/90 via-sky-100/80 to-blue-200/90 rounded-3xl p-6 sm:p-8 text-blue-950 border border-blue-300/80 shadow-xs relative overflow-hidden">
        <div className="absolute right-0 top-0 text-blue-900/10 pointer-events-none translate-x-8 -translate-y-8">
          <GraduationCap className="w-80 h-80" />
        </div>

        <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div className="max-w-3xl space-y-3">
            <div className="flex flex-wrap items-center gap-2">
              <span className="px-3 py-1 rounded-full text-xs font-semibold bg-blue-700 text-white shadow-2xs">
                崔老師指導論文專用數線
              </span>
              <span className="px-3 py-1 rounded-full text-xs font-semibold bg-white/90 text-blue-900 border border-blue-200 shadow-2xs flex items-center gap-1.5">
                {cloudSyncStatus === 'synced' ? (
                  <>
                    <CloudCheck className="w-3.5 h-3.5 text-blue-600" />
                    <span className="text-blue-900 font-bold">Firebase 雲端已即時同步</span>
                  </>
                ) : cloudSyncStatus === 'saving' ? (
                  <>
                    <Cloud className="w-3.5 h-3.5 text-amber-600 animate-pulse" />
                    <span className="text-amber-800">資料儲存同步中...</span>
                  </>
                ) : (
                  <>
                    <Cloud className="w-3.5 h-3.5 text-stone-500" />
                    <span className="text-stone-600">{syncMessage}</span>
                  </>
                )}
              </span>
            </div>

            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-blue-950 flex items-center gap-2">
              <span>碩博士學位論文兩階段進度數線登錄系統</span>
              {totalPercent === 100 && (
                <span className="text-xs bg-amber-500 text-white font-bold px-2.5 py-0.5 rounded-full shadow-xs">
                  🎓 恭喜榮獲學位！
                </span>
              )}
            </h1>

            <p className="text-xs sm:text-sm text-blue-900/85 leading-relaxed">
              依據崔老師指導規範建立之完整學位歷程（第一階段計畫口試 11 步、第二階段資料蒐集與學位口試 16 步）。
              學生請以EMAIL帳號 (請在全體進度看版查看)及 6 位數密碼登入填寫，<strong className="text-blue-950 font-bold">步驟只能持續往前推進，不可刪除已經登錄過之進度</strong>。
            </p>

            <div className="flex flex-wrap items-center gap-2 text-xs pt-1">
              <div className="inline-flex items-center space-x-1.5 px-3 py-1.5 rounded-xl bg-amber-100/80 border border-amber-300 text-amber-950 font-semibold shadow-2xs">
                <Lock className="w-3.5 h-3.5 text-amber-700 shrink-0" />
                <span>核心原則：單向推進，已登錄步驟自動鎖定不可撤銷</span>
              </div>

              {onSwitchToOverview && (
                <button
                  onClick={onSwitchToOverview}
                  className="inline-flex items-center space-x-1.5 px-3.5 py-1.5 rounded-xl bg-blue-700 hover:bg-blue-800 text-white font-semibold shadow-xs transition-all cursor-pointer"
                >
                  <Users className="w-3.5 h-3.5" />
                  <span>整理出現每一位學生的進度看板 ➔</span>
                </button>
              )}
            </div>
          </div>

          {/* Student Profile Controls */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 bg-white/95 p-3.5 rounded-2xl border border-blue-200 shadow-sm shrink-0">
            {activeStudent ? (
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 rounded-full bg-blue-700 text-white flex items-center justify-center font-bold text-sm shadow-xs">
                  {studentName.charAt(0)}
                </div>
                <div>
                  <div className="text-xs font-bold text-stone-900 flex items-center gap-1.5">
                    <span>{studentName}</span>
                    <span className="text-[10px] font-medium text-blue-800 bg-blue-50 px-1.5 py-0.5 rounded border border-blue-200">
                      6 位密碼保護
                    </span>
                  </div>
                  <div className="text-[11px] text-stone-500 truncate max-w-[180px]">
                    {activeStudent.studentEmail}
                  </div>
                </div>
                <div className="flex items-center space-x-1 pl-1">
                  <button
                    onClick={() => {
                      setChangePwdError(null);
                      setShowChangePasswordModal(true);
                    }}
                    title="修改 6 位數登入密碼"
                    className="p-1.5 rounded-lg text-stone-500 hover:text-blue-700 hover:bg-blue-50 transition-colors cursor-pointer"
                  >
                    <KeyRound className="w-4 h-4" />
                  </button>
                  <button
                    onClick={handleStudentLogout}
                    title="登出學生帳號（數線將重設為空白）"
                    className="p-1.5 rounded-lg text-stone-500 hover:text-red-700 hover:bg-red-50 transition-colors cursor-pointer"
                  >
                    <LogOut className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ) : (
              <div className="flex flex-col items-start gap-2">
                <div className="text-xs text-stone-600 font-medium">
                  個人數線空白中（未登入）：
                </div>
                <button
                  onClick={() => {
                    setLoginError(null);
                    setIsFirstTimeSetup(false);
                    setIsSelfRegister(false);
                    setShowLoginModal(true);
                  }}
                  className="inline-flex items-center justify-center space-x-2 px-4 py-2 rounded-xl bg-blue-700 hover:bg-blue-800 text-white text-xs font-bold shadow-xs transition-all cursor-pointer"
                >
                  <KeyRound className="w-3.5 h-3.5" />
                  <span>登入學生帳號 / 自訂 6 位密碼</span>
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Unauthenticated Notice Banner */}
      {!activeStudent && (
        <div className="bg-white border border-stone-200 rounded-2xl p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-stone-800 shadow-xs">
          <div className="flex items-start space-x-3">
            <div className="w-9 h-9 rounded-xl bg-amber-100 text-amber-800 flex items-center justify-center shrink-0 border border-amber-200 mt-0.5">
              <Lock className="w-4 h-4" />
            </div>
            <div>
              <div className="font-bold text-sm text-stone-900 flex items-center gap-2">
                <span>目前為未登入狀態（個人數線保持空白）</span>
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-stone-100 text-stone-700 font-bold border border-stone-200">
                  進度 0%
                </span>
              </div>
              <p className="text-xs text-stone-600 mt-1 leading-relaxed">
                依指導規定，未登入時個人數線保持空白。請以學生 Email 與 6 位數密碼登入；初次使用若崔老師已建檔可立即自訂密碼，若忘記密碼請洽崔老師在後台查詢。
              </p>
            </div>
          </div>
          <button
            onClick={() => {
              setLoginError(null);
              setIsFirstTimeSetup(false);
              setIsSelfRegister(false);
              setShowLoginModal(true);
            }}
            className="shrink-0 px-4 py-2 rounded-xl bg-blue-700 hover:bg-blue-800 text-white font-bold text-xs flex items-center space-x-1.5 shadow-xs transition-all cursor-pointer"
          >
            <LogIn className="w-4 h-4" />
            <span>學生登入 / 建立密碼</span>
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
          <div className="mt-2 w-full bg-stone-100 rounded-full h-2 overflow-hidden">
            <div 
              className="bg-blue-600 h-2 rounded-full transition-all duration-500" 
              style={{ width: `${phase1Percent}%` }}
            />
          </div>
          <div className="mt-2 text-[11px] text-stone-500 flex justify-between">
            <span>第 1 ~ 11 步</span>
            <span>{phase1Percent === 100 ? '✓ 計畫口試通過' : '進行中'}</span>
          </div>
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
            <span className="text-xs font-bold px-2 py-0.5 rounded bg-indigo-50 text-indigo-800 border border-indigo-200">
              {phase2CompletedCount} / {phase2Total} 步
            </span>
          </div>
          <div className="mt-2 flex items-baseline justify-between">
            <h3 className="font-bold text-stone-900 text-sm">資料蒐集與學位口試</h3>
            <span className="text-lg font-extrabold text-indigo-800">{phase2Percent}%</span>
          </div>
          <div className="mt-2 w-full bg-stone-100 rounded-full h-2 overflow-hidden">
            <div 
              className="bg-indigo-600 h-2 rounded-full transition-all duration-500" 
              style={{ width: `${phase2Percent}%` }}
            />
          </div>
          <div className="mt-2 text-[11px] text-stone-500 flex justify-between">
            <span>第 12 ~ 27 步</span>
            <span>{phase2Percent === 100 ? '🎓 順利畢業' : '進行中'}</span>
          </div>
        </div>

        {/* Total Overall Summary */}
        <div 
          onClick={() => setActivePhaseTab('all')}
          className={`cursor-pointer p-4 rounded-xl border transition-all ${
            activePhaseTab === 'all'
              ? 'bg-white border-blue-600 ring-2 ring-blue-600/20 shadow-xs'
              : 'bg-white/80 border-stone-200 hover:border-stone-300'
          }`}
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-stone-500 uppercase tracking-wider">整體歷程</span>
            <span className="text-xs font-bold px-2 py-0.5 rounded bg-stone-100 text-stone-800 border border-stone-200">
              {totalCompletedCount} / {totalStepsCount} 步
            </span>
          </div>
          <div className="mt-2 flex items-baseline justify-between">
            <h3 className="font-bold text-stone-900 text-sm">碩士學位總體進度</h3>
            <span className="text-lg font-extrabold text-blue-900">{totalPercent}%</span>
          </div>
          <div className="mt-2 w-full bg-stone-100 rounded-full h-2 overflow-hidden">
            <div 
              className="bg-gradient-to-r from-blue-600 to-indigo-600 h-2 rounded-full transition-all duration-500" 
              style={{ width: `${totalPercent}%` }}
            />
          </div>
          <div className="mt-2 text-[11px] text-stone-500 flex justify-between">
            <span>全程 27 關鍵步</span>
            <span className="font-semibold text-blue-800">
              {totalPercent === 100 ? '恭喜榮獲碩士學位！' : `尚餘 ${totalStepsCount - totalCompletedCount} 步`}
            </span>
          </div>
        </div>
      </div>

      {/* Toast Feedback */}
      {toastMessage && (
        <div className="p-3 bg-blue-50 border border-blue-200 text-blue-900 rounded-xl text-xs font-semibold flex items-center justify-between animate-in fade-in">
          <div className="flex items-center space-x-2">
            <Sparkles className="w-4 h-4 text-blue-600 shrink-0" />
            <span>{toastMessage}</span>
          </div>
          <button 
            onClick={() => setToastMessage(null)}
            className="text-blue-500 hover:text-blue-800 text-xs ml-2 cursor-pointer"
          >
            ✕
          </button>
        </div>
      )}

      {/* 3. Number Line Visualizer Box */}
      <div className="bg-white rounded-2xl border border-stone-200 p-6 shadow-xs space-y-6">
        {/* Phase selector tabs */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-stone-200/80 pb-4">
          <div>
            <div className="flex items-center space-x-2">
              <h2 className="text-base font-bold text-stone-900">
                學位論文推進數線 (Number Line)
              </h2>
              <span className="text-[11px] px-2 py-0.5 rounded-full bg-stone-100 text-stone-600 border border-stone-200">
                點擊節點檢視檢核重點
              </span>
            </div>
            <p className="text-xs text-stone-500 mt-0.5">
              依崔老師指導規範：步驟僅能往前推進，不可撤銷。登錄較大步驟時，前方步驟全數自動視為完成並抓取今日時間。
            </p>
          </div>

          <div className="flex bg-stone-100 p-1 rounded-xl shrink-0 self-start sm:self-auto">
            <button
              onClick={() => setActivePhaseTab('phase1')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                activePhaseTab === 'phase1'
                  ? 'bg-white text-blue-900 shadow-xs'
                  : 'text-stone-600 hover:text-stone-900'
              }`}
            >
              第一階段 (1-11)
            </button>
            <button
              onClick={() => setActivePhaseTab('phase2')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                activePhaseTab === 'phase2'
                  ? 'bg-white text-indigo-900 shadow-xs'
                  : 'text-stone-600 hover:text-stone-900'
              }`}
            >
              第二階段 (12-27)
            </button>
            <button
              onClick={() => setActivePhaseTab('all')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                activePhaseTab === 'all'
                  ? 'bg-white text-stone-900 shadow-xs'
                  : 'text-stone-600 hover:text-stone-900'
              }`}
            >
              全程 27 步
            </button>
          </div>
        </div>

        {/* Scrollable Horizontal Number Line Track */}
        <div 
          ref={numberLineScrollRef}
          className="overflow-x-auto pb-6 pt-3 px-2 scrollbar-thin scrollbar-thumb-stone-300"
        >
          <div className="relative min-w-max flex items-center justify-between space-x-1 sm:space-x-2 px-4 py-8">
            
            {/* Horizontal Axis Background Line */}
            <div className="absolute left-6 right-6 top-1/2 -translate-y-1/2 h-1.5 bg-stone-200 rounded-full z-0">
              {/* Highlighted Progress Track */}
              <div 
                className="h-full bg-gradient-to-r from-blue-600 via-sky-500 to-indigo-600 rounded-full transition-all duration-500"
                style={{
                  width: `${
                    currentStepList.length > 1
                      ? Math.min(
                          100,
                          (currentStepList.filter(s => completedSteps.includes(s.id)).length / currentStepList.length) * 100
                        )
                      : 0
                  }%`
                }}
              />
            </div>

            {/* Step Nodes on the Number Line */}
            {currentStepList.map((step, idx) => {
              const isCompleted = completedSteps.includes(step.id);
              const isSelected = selectedStepId === step.id;
              const dateRecorded = stepDates[step.id];

              return (
                <div 
                  key={step.id} 
                  onClick={() => setSelectedStepId(step.id)}
                  className="relative z-10 flex flex-col items-center group cursor-pointer"
                  style={{ width: currentStepList.length > 20 ? '48px' : '72px' }}
                >
                  {/* Top Step Number & Category Pill */}
                  <div className={`mb-2 text-[10px] font-bold px-1.5 py-0.5 rounded transition-all whitespace-nowrap ${
                    isSelected
                      ? 'bg-blue-900 text-white shadow-xs'
                      : isCompleted
                      ? 'bg-blue-100 text-blue-900'
                      : 'bg-stone-100 text-stone-500 group-hover:text-stone-800'
                  }`}>
                    #{step.globalIndex}
                  </div>

                  {/* Circular Node on the Line */}
                  <div className={`w-8 h-8 sm:w-9 sm:h-9 rounded-full flex items-center justify-center font-bold text-xs transition-all duration-200 border-2 ${
                    isCompleted
                      ? 'bg-blue-600 border-blue-700 text-white shadow-xs scale-105'
                      : isSelected
                      ? 'bg-white border-blue-600 text-blue-600 ring-4 ring-blue-100 scale-110'
                      : 'bg-white border-stone-300 text-stone-500 group-hover:border-stone-400 group-hover:scale-105'
                  }`}>
                    {isCompleted ? (
                      <Check className="w-4 h-4 stroke-[3]" />
                    ) : (
                      <span>{step.globalIndex}</span>
                    )}
                  </div>

                  {/* Bottom Date or Title Truncated */}
                  <div className="mt-2 text-center max-w-[65px] truncate">
                    {dateRecorded ? (
                      <span className="text-[10px] font-semibold text-blue-800 bg-blue-50 px-1 py-0.5 rounded block truncate">
                        {dateRecorded.slice(5)}
                      </span>
                    ) : (
                      <span className={`text-[10px] block truncate transition-colors ${
                        isSelected ? 'font-bold text-stone-900' : 'text-stone-500'
                      }`}>
                        {step.title}
                      </span>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Quick Prev / Next Step Buttons */}
        <div className="flex items-center justify-between pt-2 text-xs border-t border-stone-100">
          <button
            onClick={() => {
              if (activeNumberLineIndex > 0) {
                setSelectedStepId(currentStepList[activeNumberLineIndex - 1].id);
              }
            }}
            disabled={activeNumberLineIndex <= 0}
            className="px-3 py-1.5 rounded-lg border border-stone-200 text-stone-600 hover:bg-stone-50 font-semibold disabled:opacity-40 disabled:cursor-not-allowed flex items-center space-x-1 cursor-pointer"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>上一個步驟</span>
          </button>

          <span className="text-stone-500 font-medium text-xs">
            目前檢視：第 {selectedStep.globalIndex} 步（共 27 步）
          </span>

          <button
            onClick={() => {
              if (activeNumberLineIndex < currentStepList.length - 1) {
                setSelectedStepId(currentStepList[activeNumberLineIndex + 1].id);
              }
            }}
            disabled={activeNumberLineIndex >= currentStepList.length - 1}
            className="px-3 py-1.5 rounded-lg border border-stone-200 text-stone-600 hover:bg-stone-50 font-semibold disabled:opacity-40 disabled:cursor-not-allowed flex items-center space-x-1 cursor-pointer"
          >
            <span>下一個步驟</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* 4. Active Selected Step Detail & Forward Progression Panel */}
      <div className="bg-white rounded-2xl border border-stone-200 p-6 shadow-xs space-y-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-stone-200/80 pb-5">
          <div className="space-y-1">
            <div className="flex flex-wrap items-center gap-2">
              <span className="px-2.5 py-0.5 rounded-md text-xs font-bold bg-blue-100 text-blue-900 border border-blue-300">
                階段 {selectedStep.phase}
              </span>
              <span className="px-2.5 py-0.5 rounded-md text-xs font-bold bg-stone-100 text-stone-700 border border-stone-200">
                第 {selectedStep.globalIndex} 步（階段內第 {selectedStep.stepNumber} 步）
              </span>
              <span className="text-xs font-semibold text-stone-500">
                {selectedStep.categoryLabel}
              </span>
            </div>
            <h3 className="text-xl font-bold text-stone-900 mt-1">
              {selectedStep.title}
            </h3>
            <div className="flex items-center space-x-4 text-xs text-stone-500 pt-0.5">
              <span className="flex items-center space-x-1">
                <Clock className="w-3.5 h-3.5 text-stone-400" />
                <span>建議週期：{selectedStep.recommendedDuration || '依指導進度推進'}</span>
              </span>
              {stepDates[selectedStep.id] && (
                <span className="flex items-center space-x-1 text-blue-800 font-semibold">
                  <Calendar className="w-3.5 h-3.5 text-blue-600" />
                  <span>系統登錄日期：{stepDates[selectedStep.id]}</span>
                </span>
              )}
            </div>
          </div>

          {/* Step Completion Registration Button */}
          {(() => {
            if (!activeStudent) {
              return (
                <div className="flex flex-col sm:items-end">
                  <button
                    onClick={() => {
                      setLoginError(null);
                      setIsFirstTimeSetup(false);
                      setIsSelfRegister(false);
                      setShowLoginModal(true);
                    }}
                    className="flex-shrink-0 px-4 py-2.5 rounded-xl font-bold text-xs sm:text-sm flex items-center space-x-2 transition-all bg-blue-700 hover:bg-blue-800 active:scale-95 text-white shadow-md cursor-pointer"
                  >
                    <KeyRound className="w-4 h-4 text-white" />
                    <span>登入學生帳號後登錄此步驟</span>
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

        {/* Special Highlight Reminder Box */}
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

      {/* STUDENT LOGIN / ACCOUNT MODAL */}
      {showLoginModal && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-6 sm:p-7 max-w-md w-full shadow-2xl border border-stone-200 space-y-5 animate-in fade-in zoom-in-95">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2.5">
                <div className="w-10 h-10 rounded-xl bg-blue-100 text-blue-800 flex items-center justify-center">
                  <KeyRound className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-bold text-base text-stone-900">
                    {isFirstTimeSetup 
                      ? '初次登入：自訂 6 位數密碼'
                      : isSelfRegister
                      ? '新研究生開通論文數線'
                      : '研究生登入個人論文數線'}
                  </h3>
                  <p className="text-xs text-stone-500">
                    {isFirstTimeSetup 
                      ? `歡迎 ${pendingStudentDoc?.studentName} 同學！`
                      : '輸入 Email 與 6 位數密碼登入'}
                  </p>
                </div>
              </div>
              <button 
                onClick={() => {
                  setShowLoginModal(false);
                  setIsFirstTimeSetup(false);
                  setIsSelfRegister(false);
                }}
                className="p-1.5 rounded-lg text-stone-400 hover:text-stone-700 hover:bg-stone-100 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Case 1: First-Time Password Setup */}
            {isFirstTimeSetup && pendingStudentDoc ? (
              <form onSubmit={handleCompleteFirstTimeSetup} className="space-y-4">
                <div className="p-3.5 bg-blue-50 border border-blue-200 rounded-xl text-xs text-blue-900 leading-relaxed">
                  崔老師已為您建立帳號「<strong>{pendingStudentDoc.studentName}</strong>」（{pendingStudentDoc.studentEmail}）。
                  請為自己設定專屬的 <strong>6 位數密碼</strong>，日後即可憑此密碼登入數線記錄論文進度。
                </div>

                <div>
                  <label className="block text-xs font-bold text-stone-700 mb-1">
                    設定 6 位數密碼
                  </label>
                  <input
                    type="password"
                    required
                    maxLength={6}
                    placeholder="請輸入 6 位數字或字母"
                    value={newSetupPassword}
                    onChange={(e) => setNewSetupPassword(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl text-sm border border-stone-200 focus:outline-none focus:ring-2 focus:ring-blue-600 bg-stone-50 font-mono tracking-widest font-bold"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-stone-700 mb-1">
                    再次確認 6 位數密碼
                  </label>
                  <input
                    type="password"
                    required
                    maxLength={6}
                    placeholder="請再次輸入相同的 6 位數密碼"
                    value={confirmSetupPassword}
                    onChange={(e) => setConfirmSetupPassword(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl text-sm border border-stone-200 focus:outline-none focus:ring-2 focus:ring-blue-600 bg-stone-50 font-mono tracking-widest font-bold"
                  />
                </div>

                {loginError && (
                  <div className="p-3 rounded-xl bg-red-50 border border-red-200 text-xs text-red-700 flex items-center space-x-2">
                    <AlertCircle className="w-4 h-4 shrink-0" />
                    <span>{loginError}</span>
                  </div>
                )}

                <div className="flex items-center justify-end space-x-2 pt-2">
                  <button
                    type="button"
                    onClick={() => setIsFirstTimeSetup(false)}
                    className="px-4 py-2 rounded-xl text-xs font-bold text-stone-600 hover:bg-stone-100 cursor-pointer"
                  >
                    返回
                  </button>
                  <button
                    type="submit"
                    disabled={isSubmittingAuth}
                    className="px-5 py-2 rounded-xl text-xs font-bold bg-blue-700 hover:bg-blue-800 text-white shadow-xs cursor-pointer disabled:opacity-50"
                  >
                    {isSubmittingAuth ? '儲存中...' : '確認儲存並登入'}
                  </button>
                </div>
              </form>
            ) : isSelfRegister ? (
              /* Case 2: Self-Registration if student email not in DB */
              <form onSubmit={handleSelfRegister} className="space-y-4">
                <div className="p-3 bg-amber-50 border border-amber-200 rounded-xl text-xs text-amber-900 leading-relaxed">
                  系統尚未登錄此 Email（{loginEmail}）。若您是崔老師指導之研究生，請在此輸入您的姓名與自訂 6 位數密碼，即可立即開通！
                </div>

                <div>
                  <label className="block text-xs font-bold text-stone-700 mb-1">
                    學生真實姓名
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="例如：林小華"
                    value={registerStudentName}
                    onChange={(e) => setRegisterStudentName(e.target.value)}
                    className="w-full px-3.5 py-2 rounded-xl text-sm border border-stone-200 focus:outline-none focus:ring-2 focus:ring-blue-600 bg-stone-50 font-bold"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-stone-700 mb-1">
                    設定 6 位數登入密碼
                  </label>
                  <input
                    type="password"
                    required
                    maxLength={6}
                    placeholder="請設定 6 位數密碼"
                    value={newSetupPassword}
                    onChange={(e) => setNewSetupPassword(e.target.value)}
                    className="w-full px-3.5 py-2 rounded-xl text-sm border border-stone-200 focus:outline-none focus:ring-2 focus:ring-blue-600 bg-stone-50 font-mono tracking-widest font-bold"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-stone-700 mb-1">
                    確認 6 位數密碼
                  </label>
                  <input
                    type="password"
                    required
                    maxLength={6}
                    placeholder="再次輸入 6 位數密碼"
                    value={confirmSetupPassword}
                    onChange={(e) => setConfirmSetupPassword(e.target.value)}
                    className="w-full px-3.5 py-2 rounded-xl text-sm border border-stone-200 focus:outline-none focus:ring-2 focus:ring-blue-600 bg-stone-50 font-mono tracking-widest font-bold"
                  />
                </div>

                {loginError && (
                  <div className="p-3 rounded-xl bg-red-50 border border-red-200 text-xs text-red-700 flex items-center space-x-2">
                    <AlertCircle className="w-4 h-4 shrink-0" />
                    <span>{loginError}</span>
                  </div>
                )}

                <div className="flex items-center justify-end space-x-2 pt-2">
                  <button
                    type="button"
                    onClick={() => setIsSelfRegister(false)}
                    className="px-4 py-2 rounded-xl text-xs font-bold text-stone-600 hover:bg-stone-100 cursor-pointer"
                  >
                    返回
                  </button>
                  <button
                    type="submit"
                    disabled={isSubmittingAuth}
                    className="px-5 py-2 rounded-xl text-xs font-bold bg-blue-700 hover:bg-blue-800 text-white shadow-xs cursor-pointer disabled:opacity-50"
                  >
                    {isSubmittingAuth ? '開通中...' : '開通並登入數線'}
                  </button>
                </div>
              </form>
            ) : (
              /* Case 3: Standard Email + 6-digit Password Login */
              <form onSubmit={handleStudentLogin} className="space-y-4">
                <div>
                  <label className="block text-xs font-bold text-stone-700 mb-1">
                    學生 Email 帳號
                  </label>
                  <input
                    type="email"
                    required
                    placeholder="請輸入Email信箱 (在全體進度看板查詢)"
                    value={loginEmail}
                    onChange={(e) => setLoginEmail(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl text-sm border border-stone-200 focus:outline-none focus:ring-2 focus:ring-blue-600 bg-stone-50 font-mono"
                  />
                </div>

                <div>
                  <div className="flex items-center justify-between mb-1">
                    <label className="text-xs font-bold text-stone-700">
                      6 位數登入密碼
                    </label>
                    <button
                      type="button"
                      onClick={() => setShowPasswordText(!showPasswordText)}
                      className="text-[11px] text-stone-500 hover:text-stone-800 font-medium flex items-center space-x-1 cursor-pointer"
                    >
                      {showPasswordText ? <EyeOff className="w-3 h-3" /> : <Eye className="w-3 h-3" />}
                      <span>{showPasswordText ? '隱藏密碼' : '顯示明碼'}</span>
                    </button>
                  </div>
                  <input
                    type={showPasswordText ? "text" : "password"}
                    required
                    maxLength={6}
                    placeholder="請輸入 6 位數密碼"
                    value={loginPassword}
                    onChange={(e) => setLoginPassword(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl text-sm border border-stone-200 focus:outline-none focus:ring-2 focus:ring-blue-600 bg-stone-50 font-mono tracking-widest font-bold"
                  />
                </div>

                <div className="p-3 bg-stone-50 rounded-xl border border-stone-200 text-[11px] text-stone-600 space-y-1">
                  <div className="font-semibold text-stone-800">💡 登入小提示：</div>
                  <p>• 若崔老師已為您開立帳號但尚未設密碼，輸入 Email 後系統將引導您<strong>自訂 6 位數密碼</strong>。</p>
                  <p>• 若忘記密碼，可請崔老師於「全體看板」管理後台查看或重新指定密碼。</p>
                </div>

                {loginError && (
                  <div className="p-3 rounded-xl bg-red-50 border border-red-200 text-xs text-red-700 flex items-center space-x-2">
                    <AlertCircle className="w-4 h-4 shrink-0" />
                    <span>{loginError}</span>
                  </div>
                )}

                <div className="flex items-center justify-end space-x-2.5 pt-2">
                  <button
                    type="button"
                    onClick={() => setShowLoginModal(false)}
                    className="px-4 py-2 rounded-xl text-xs font-bold text-stone-600 hover:bg-stone-100 cursor-pointer"
                  >
                    取消
                  </button>
                  <button
                    type="submit"
                    disabled={isSubmittingAuth}
                    className="px-5 py-2 rounded-xl text-xs font-bold bg-blue-700 hover:bg-blue-800 text-white shadow-xs flex items-center space-x-1.5 cursor-pointer disabled:opacity-50"
                  >
                    <LogIn className="w-4 h-4" />
                    <span>{isSubmittingAuth ? '驗證中...' : '登入數線'}</span>
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}

      {/* CHANGE PASSWORD MODAL */}
      {showChangePasswordModal && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-6 sm:p-7 max-w-md w-full shadow-2xl border border-stone-200 space-y-5 animate-in fade-in zoom-in-95">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2.5">
                <div className="w-10 h-10 rounded-xl bg-blue-100 text-blue-800 flex items-center justify-center">
                  <KeyRound className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-bold text-base text-stone-900">變更 6 位數密碼</h3>
                  <p className="text-xs text-stone-500">學生：{studentName}</p>
                </div>
              </div>
              <button 
                onClick={() => setShowChangePasswordModal(false)}
                className="p-1.5 rounded-lg text-stone-400 hover:text-stone-700 hover:bg-stone-100 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleChangePassword} className="space-y-4">
              {activeStudent?.password && (
                <div>
                  <label className="block text-xs font-bold text-stone-700 mb-1">
                    目前 6 位數密碼
                  </label>
                  <input
                    type="password"
                    required
                    maxLength={6}
                    placeholder="輸入目前密碼"
                    value={currentPwdInput}
                    onChange={(e) => setCurrentPwdInput(e.target.value)}
                    className="w-full px-3.5 py-2 rounded-xl text-sm border border-stone-200 focus:outline-none focus:ring-2 focus:ring-blue-600 bg-stone-50 font-mono tracking-widest font-bold"
                  />
                </div>
              )}

              <div>
                <label className="block text-xs font-bold text-stone-700 mb-1">
                  新 6 位數密碼
                </label>
                <input
                  type="password"
                  required
                  maxLength={6}
                  placeholder="輸入新 6 位數密碼"
                  value={newPwdInput}
                  onChange={(e) => setNewPwdInput(e.target.value)}
                  className="w-full px-3.5 py-2 rounded-xl text-sm border border-stone-200 focus:outline-none focus:ring-2 focus:ring-blue-600 bg-stone-50 font-mono tracking-widest font-bold"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-stone-700 mb-1">
                  再次確認新 6 位數密碼
                </label>
                <input
                  type="password"
                  required
                  maxLength={6}
                  placeholder="再次輸入新 6 位數密碼"
                  value={confirmNewPwdInput}
                  onChange={(e) => setConfirmNewPwdInput(e.target.value)}
                  className="w-full px-3.5 py-2 rounded-xl text-sm border border-stone-200 focus:outline-none focus:ring-2 focus:ring-blue-600 bg-stone-50 font-mono tracking-widest font-bold"
                />
              </div>

              {changePwdError && (
                <div className="p-3 rounded-xl bg-red-50 border border-red-200 text-xs text-red-700 flex items-center space-x-2">
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  <span>{changePwdError}</span>
                </div>
              )}

              <div className="flex items-center justify-end space-x-2.5 pt-2">
                <button
                  type="button"
                  onClick={() => setShowChangePasswordModal(false)}
                  className="px-4 py-2 rounded-xl text-xs font-bold text-stone-600 hover:bg-stone-100 cursor-pointer"
                >
                  取消
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl text-xs font-bold bg-blue-700 hover:bg-blue-800 text-white shadow-xs cursor-pointer"
                >
                  確認修改密碼
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
