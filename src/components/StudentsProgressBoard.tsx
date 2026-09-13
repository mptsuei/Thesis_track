import React, { useState, useEffect } from 'react';
import { 
  Users, 
  Search, 
  Filter, 
  CheckCircle2, 
  Clock, 
  ArrowRight, 
  Calendar, 
  GraduationCap, 
  FileText, 
  Sparkles, 
  Lock, 
  ExternalLink,
  ChevronDown,
  ChevronUp,
  Award,
  BookOpen,
  RefreshCw,
  UserCheck,
  AlertCircle,
  KeyRound,
  Shield,
  ShieldCheck,
  Trash2,
  Edit3,
  X,
  Save,
  AlertTriangle,
  LogOut,
  Check
} from 'lucide-react';
import { db, auth } from '../lib/firebase';
import { collection, onSnapshot, doc, setDoc, deleteDoc } from 'firebase/firestore';
import { StudentProgressRecord, ThesisStep } from '../types';
import { ALL_THESIS_STEPS, PHASE_1_STEPS, PHASE_2_STEPS, ensurePrecedingStepsCompleted } from '../data/thesisStepsData';

interface Props {
  onGoToMyNumberLine: () => void;
  currentStudentEmail?: string | null;
}

// Default empty students list (no mock/demo data seeded)

export const StudentsProgressBoard: React.FC<Props> = ({ 
  onGoToMyNumberLine, 
  currentStudentEmail 
}) => {
  const [students, setStudents] = useState<StudentProgressRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [phaseFilter, setPhaseFilter] = useState<'all' | 'phase1' | 'phase2' | 'graduated'>('all');
  const [expandedStudentId, setExpandedStudentId] = useState<string | null>(null);

  // Teacher mode authentication (system credentials: teacher / tsuei888, confidential)
  const [isTeacher, setIsTeacher] = useState<boolean>(() => {
    return sessionStorage.getItem('thesis_is_teacher') === 'true';
  });
  const [showTeacherLoginModal, setShowTeacherLoginModal] = useState(false);
  const [teacherUsername, setTeacherUsername] = useState('');
  const [teacherPassword, setTeacherPassword] = useState('');
  const [teacherLoginError, setTeacherLoginError] = useState<string | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Teacher Action Modals State
  const [editingStudent, setEditingStudent] = useState<StudentProgressRecord | null>(null);
  const [editStepNumber, setEditStepNumber] = useState<number>(1);
  const [editStudentName, setEditStudentName] = useState<string>('');
  const [isSavingEdit, setIsSavingEdit] = useState<boolean>(false);

  const [deletingStudent, setDeletingStudent] = useState<StudentProgressRecord | null>(null);
  const [isDeleting, setIsDeleting] = useState<boolean>(false);

  // Toast timer
  useEffect(() => {
    if (toastMessage) {
      const timer = setTimeout(() => setToastMessage(null), 4000);
      return () => clearTimeout(timer);
    }
  }, [toastMessage]);

  // Load students from Firestore in real-time (Publicly viewable by anyone without signing in)
  useEffect(() => {
    let unsubscribe = () => {};
    try {
      const colRef = collection(db, 'student_progress');
      unsubscribe = onSnapshot(colRef, (snapshot) => {
        const loaded: StudentProgressRecord[] = [];
        snapshot.forEach((d) => {
          const data = d.data() as StudentProgressRecord;
          const normalizedCompleted = ensurePrecedingStepsCompleted(
            data.completedSteps || [],
            data.currentStepNumber
          );
          const maxStepNum = Math.max(
            data.currentStepNumber || 0,
            normalizedCompleted.length || 1
          );
          loaded.push({
            ...data,
            studentId: d.id, // Ensure studentId matches Firestore document ID
            completedSteps: normalizedCompleted,
            currentStepNumber: maxStepNum
          });
        });

        if (loaded.length > 0) {
          // Sort by progress (highest step first) then by last updated
          loaded.sort((a, b) => {
            const stepA = a.currentStepNumber || a.completedSteps.length || 0;
            const stepB = b.currentStepNumber || b.completedSteps.length || 0;
            if (stepB !== stepA) return stepB - stepA;
            return new Date(b.lastUpdated || 0).getTime() - new Date(a.lastUpdated || 0).getTime();
          });
          setStudents(loaded);
        } else {
          setStudents([]);
        }
        setLoading(false);
      }, (err) => {
        console.warn('Cannot listen to student_progress:', err);
        setStudents([]);
        setLoading(false);
      });
    } catch (e) {
      console.warn('Firestore not ready:', e);
      setStudents([]);
      setLoading(false);
    }

    return () => unsubscribe();
  }, []);

  // Teacher Login Handler (Independent of Gmail, credentials confidential)
  const handleTeacherLogin = (e: React.FormEvent) => {
    e.preventDefault();
    const u = teacherUsername.trim().toLowerCase();
    const p = teacherPassword.trim();

    if ((u === 'teacher' || u === 'tsuei') && p === 'tsuei888') {
      setIsTeacher(true);
      sessionStorage.setItem('thesis_is_teacher', 'true');
      setShowTeacherLoginModal(false);
      setTeacherUsername('');
      setTeacherPassword('');
      setTeacherLoginError(null);
      setToastMessage('✓ 崔老師管理模式已啟動！您現具備刪除畢業生帳號及修改進度之權限。');
    } else {
      setTeacherLoginError('帳號或密碼輸入錯誤，請確認後重新輸入。');
    }
  };

  const handleTeacherLogout = () => {
    setIsTeacher(false);
    sessionStorage.removeItem('thesis_is_teacher');
    setToastMessage('✓ 已結束崔老師管理模式。');
  };

  // Open Edit Modal for a Student
  const handleOpenEdit = (student: StudentProgressRecord) => {
    setEditingStudent(student);
    setEditStepNumber(student.currentStepNumber || student.completedSteps.length || 1);
    setEditStudentName(student.studentName || '');
  };

  // Save Student Progress Edit (Teacher Mode)
  const handleSaveStudentEdit = async () => {
    if (!editingStudent) return;
    setIsSavingEdit(true);

    try {
      const targetStep = ALL_THESIS_STEPS.find(s => s.globalIndex === editStepNumber);
      const newCompleted = ALL_THESIS_STEPS
        .filter(s => s.globalIndex <= editStepNumber)
        .map(s => s.id);

      const today = new Date().toISOString().split('T')[0];
      const updatedDates = { ...(editingStudent.stepDates || {}) };
      newCompleted.forEach(id => {
        if (!updatedDates[id]) updatedDates[id] = today;
      });

      const docRef = doc(db, 'student_progress', editingStudent.studentId);
      const updatedRecord: Partial<StudentProgressRecord> = {
        studentName: editStudentName.trim() || editingStudent.studentName,
        currentStepNumber: editStepNumber,
        currentStepTitle: targetStep?.title || `第 ${editStepNumber} 步`,
        currentPhase: (editStepNumber <= 11 ? 1 : 2) as (1 | 2),
        completedSteps: newCompleted,
        stepDates: updatedDates,
        lastUpdated: new Date().toISOString()
      };

      await setDoc(docRef, updatedRecord, { merge: true });

      // Update local state in case Firestore listener has delay
      setStudents(prev => prev.map(s => {
        if (s.studentId === editingStudent.studentId) {
          return { ...s, ...updatedRecord } as StudentProgressRecord;
        }
        return s;
      }));

      setToastMessage(`✓ 已成功將學生「${editStudentName || editingStudent.studentName}」的進度調整為第 ${editStepNumber} 步！`);
      setEditingStudent(null);
    } catch (err) {
      console.error('Save student edit error:', err);
      setToastMessage(`修改失敗：${err}`);
    } finally {
      setIsSavingEdit(false);
    }
  };

  // Delete Student Account (Teacher Mode)
  const handleConfirmDelete = async () => {
    if (!deletingStudent) return;
    setIsDeleting(true);

    try {
      await deleteDoc(doc(db, 'student_progress', deletingStudent.studentId));
      setStudents(prev => prev.filter(s => s.studentId !== deletingStudent.studentId));
      setToastMessage(`✓ 已成功刪除學生「${deletingStudent.studentName}」之帳號與所有論文登錄紀錄！`);
      setDeletingStudent(null);
    } catch (err) {
      console.error('Delete student error:', err);
      setToastMessage(`刪除失敗：${err}`);
    } finally {
      setIsDeleting(false);
    }
  };

  // Helper to determine step title & info
  const getStepInfo = (stepNumber: number) => {
    const step = ALL_THESIS_STEPS.find(s => s.globalIndex === stepNumber);
    if (!step) {
      if (stepNumber <= 0) return { title: '尚未開始登錄', phase: 1, phaseStep: 0, category: '尚未開始' };
      return { title: '已抵達第 ' + stepNumber + ' 步', phase: 2, phaseStep: stepNumber - 11, category: '進度中' };
    }
    return {
      title: step.title,
      phase: step.phase,
      phaseStep: step.stepNumber,
      category: step.categoryLabel
    };
  };

  // Filter students
  const filteredStudents = students.filter(student => {
    const matchesSearch = 
      (student.studentName?.toLowerCase() || '').includes(searchTerm.toLowerCase()) ||
      (student.studentEmail?.toLowerCase() || '').includes(searchTerm.toLowerCase());

    const stepNum = student.currentStepNumber || student.completedSteps.length || 1;
    if (phaseFilter === 'phase1') return matchesSearch && stepNum <= 11;
    if (phaseFilter === 'phase2') return matchesSearch && stepNum > 11 && stepNum < 27;
    if (phaseFilter === 'graduated') return matchesSearch && stepNum >= 27;
    return matchesSearch;
  });

  const totalStudents = students.length;
  const phase1Count = students.filter(s => (s.currentStepNumber || s.completedSteps.length || 0) <= 11).length;
  const phase2Count = students.filter(s => {
    const n = s.currentStepNumber || s.completedSteps.length || 0;
    return n > 11 && n < 27;
  }).length;
  const graduatedCount = students.filter(s => (s.currentStepNumber || s.completedSteps.length || 0) >= 27).length;

  const currentLoggedInEmail = auth.currentUser?.email || currentStudentEmail;

  return (
    <div className="space-y-6">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed top-5 right-5 z-50 bg-stone-900 text-white px-5 py-3 rounded-2xl shadow-xl border border-stone-700 flex items-center space-x-3 text-sm animate-in fade-in slide-in-from-top-2">
          <CheckCircle2 className="w-5 h-5 text-blue-400 shrink-0" />
          <span>{toastMessage}</span>
          <button 
            onClick={() => setToastMessage(null)}
            className="ml-2 text-stone-400 hover:text-white"
          >
            ✕
          </button>
        </div>
      )}

      {/* Top Banner */}
      <div className="bg-gradient-to-r from-blue-50 via-sky-50 to-indigo-50/60 rounded-3xl p-6 sm:p-8 text-stone-900 border border-blue-200/80 shadow-xs relative overflow-hidden">
        <div className="absolute right-0 top-0 text-blue-900/10 pointer-events-none translate-x-8 -translate-y-8">
          <Users className="w-80 h-80" />
        </div>
        <div className="relative z-10 max-w-4xl space-y-4">
          <div className="flex flex-wrap items-center gap-2">
            <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-blue-100/90 border border-blue-300 text-blue-900 text-xs font-semibold">
              <GraduationCap className="w-3.5 h-3.5 text-blue-700" />
              <span>崔老師研究室 • 全體論文進度即時看板</span>
            </div>

            <div className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-full bg-white/90 border border-blue-200 text-blue-900 text-xs font-medium shadow-2xs">
              <UserCheck className="w-3.5 h-3.5 text-blue-600" />
              <span>免登入公開檢視</span>
            </div>

            {/* Teacher Mode Status Pill */}
            {isTeacher && (
              <div className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-full bg-amber-400 text-stone-950 text-xs font-bold shadow-xs">
                <ShieldCheck className="w-3.5 h-3.5 text-stone-950" />
                <span>崔老師管理模式：啟用中</span>
              </div>
            )}
          </div>

          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-blue-950">
            全體研究生論文進度看板
          </h1>
          <p className="text-sm text-blue-900/80 leading-relaxed max-w-3xl">
            本看板開放公開檢視，彙整所有研究生以 Gmail 帳號登錄之 27 步論文數線進度。遵循崔老師嚴格規範：<strong className="text-blue-950 font-bold">學生操作時僅能向前推進，不可撤銷</strong>。指導教授可使用專屬管理密碼啟用管理模式，進行進度覆核調校或於學生畢業後刪除離校帳號。
          </p>

          <div className="pt-2 flex flex-wrap items-center gap-3">
            <button
              onClick={onGoToMyNumberLine}
              className="px-4 py-2.5 rounded-xl bg-blue-700 hover:bg-blue-800 text-white font-bold text-xs flex items-center space-x-2 shadow-xs transition-all cursor-pointer"
            >
              <span>前往我的數線登錄進度</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>

            {/* Teacher Admin Mode Toggle Button */}
            {!isTeacher ? (
              <button
                onClick={() => {
                  setTeacherLoginError(null);
                  setShowTeacherLoginModal(true);
                }}
                className="px-4 py-2.5 rounded-xl bg-white hover:bg-blue-50 text-blue-900 border border-blue-300 font-bold text-xs flex items-center space-x-2 shadow-2xs transition-all cursor-pointer"
              >
                <KeyRound className="w-3.5 h-3.5 text-amber-600" />
                <span>崔老師管理模式登入</span>
              </button>
            ) : (
              <button
                onClick={handleTeacherLogout}
                className="px-4 py-2.5 rounded-xl bg-amber-100 hover:bg-amber-200 text-amber-950 border border-amber-300 font-bold text-xs flex items-center space-x-1.5 shadow-2xs transition-all cursor-pointer"
              >
                <LogOut className="w-3.5 h-3.5 text-amber-800" />
                <span>結束老師管理模式</span>
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Teacher Mode Active Notice Bar */}
      {isTeacher && (
        <div className="bg-amber-50 border-2 border-amber-300 rounded-2xl p-4 sm:p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-amber-950 shadow-xs">
          <div className="flex items-start space-x-3">
            <div className="w-9 h-9 rounded-xl bg-amber-200 text-amber-900 flex items-center justify-center shrink-0 mt-0.5">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <div className="font-bold text-sm text-amber-900 flex items-center gap-2">
                <span>崔老師管理模式已啟動（具備最高管理權限）</span>
              </div>
              <p className="text-xs text-amber-800 mt-0.5 leading-relaxed">
                您現在可以對任一學生卡片執行<strong>「✏️ 修改進度」</strong>（任意調整 1~27 步驟）或於學生畢業後執行<strong>「🗑️ 刪除學生 (畢業)」</strong>（自雲端資料庫永久清除離校生紀錄）。
              </p>
            </div>
          </div>
          <button
            onClick={handleTeacherLogout}
            className="shrink-0 px-3.5 py-1.5 rounded-lg bg-amber-200 hover:bg-amber-300 text-amber-950 font-bold text-xs flex items-center space-x-1.5 border border-amber-300 transition-all cursor-pointer"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span>結束管理模式</span>
          </button>
        </div>
      )}

      {/* Summary Stat Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white rounded-2xl p-5 border border-stone-200 shadow-xs flex items-center space-x-4">
          <div className="w-12 h-12 rounded-xl bg-stone-100 text-stone-700 flex items-center justify-center font-bold">
            <Users className="w-6 h-6 text-stone-800" />
          </div>
          <div>
            <div className="text-2xl font-bold text-stone-900">{totalStudents}</div>
            <div className="text-xs text-stone-500 font-medium">全體研究生人數</div>
          </div>
        </div>

        <div className="bg-white rounded-2xl p-5 border border-stone-200 shadow-xs flex items-center space-x-4">
          <div className="w-12 h-12 rounded-xl bg-amber-50 text-amber-700 flex items-center justify-center font-bold">
            <BookOpen className="w-6 h-6" />
          </div>
          <div>
            <div className="text-2xl font-bold text-amber-800">{phase1Count}</div>
            <div className="text-xs text-stone-500 font-medium">第一階段（計畫口試）</div>
          </div>
        </div>

        <div className="bg-white rounded-2xl p-5 border border-stone-200 shadow-xs flex items-center space-x-4">
          <div className="w-12 h-12 rounded-xl bg-indigo-50 text-indigo-700 flex items-center justify-center font-bold">
            <Sparkles className="w-6 h-6" />
          </div>
          <div>
            <div className="text-2xl font-bold text-indigo-800">{phase2Count}</div>
            <div className="text-xs text-stone-500 font-medium">第二階段（學位口試）</div>
          </div>
        </div>

        <div className="bg-white rounded-2xl p-5 border border-stone-200 shadow-xs flex items-center space-x-4">
          <div className="w-12 h-12 rounded-xl bg-blue-50 text-blue-700 flex items-center justify-center font-bold">
            <Award className="w-6 h-6" />
          </div>
          <div>
            <div className="text-2xl font-bold text-blue-800">{graduatedCount}</div>
            <div className="text-xs text-stone-500 font-medium">恭喜畢業（完成 27 步）</div>
          </div>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white rounded-2xl p-4 border border-stone-200 shadow-xs flex flex-col md:flex-row gap-3 items-center justify-between">
        <div className="relative w-full md:w-80">
          <Search className="w-4 h-4 text-stone-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="搜尋學生姓名或 Gmail 帳號..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-4 py-2 rounded-xl text-xs border border-stone-200 focus:outline-none focus:ring-2 focus:ring-blue-600 bg-stone-50"
          />
        </div>

        {/* Phase Filter Buttons */}
        <div className="flex flex-wrap gap-1.5 w-full md:w-auto">
          <button
            onClick={() => setPhaseFilter('all')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              phaseFilter === 'all' 
                ? 'bg-stone-900 text-white' 
                : 'bg-stone-100 text-stone-600 hover:bg-stone-200'
            }`}
          >
            全部研究生 ({totalStudents})
          </button>
          <button
            onClick={() => setPhaseFilter('phase1')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              phaseFilter === 'phase1' 
                ? 'bg-amber-700 text-white' 
                : 'bg-stone-100 text-stone-600 hover:bg-stone-200'
            }`}
          >
            第一階段 ({phase1Count})
          </button>
          <button
            onClick={() => setPhaseFilter('phase2')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              phaseFilter === 'phase2' 
                ? 'bg-indigo-700 text-white' 
                : 'bg-stone-100 text-stone-600 hover:bg-stone-200'
            }`}
          >
            第二階段 ({phase2Count})
          </button>
          <button
            onClick={() => setPhaseFilter('graduated')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              phaseFilter === 'graduated' 
                ? 'bg-blue-700 text-white' 
                : 'bg-stone-100 text-stone-600 hover:bg-stone-200'
            }`}
          >
            已畢業 ({graduatedCount})
          </button>
        </div>
      </div>

      {/* Student List */}
      <div className="space-y-4">
        {students.length === 0 ? (
          <div className="bg-white rounded-3xl p-10 sm:p-12 text-center border border-blue-100 shadow-xs space-y-4">
            <div className="w-16 h-16 rounded-full bg-blue-50 border border-blue-200 text-blue-700 flex items-center justify-center mx-auto">
              <Users className="w-8 h-8" />
            </div>
            <div className="space-y-1.5 max-w-md mx-auto">
              <h3 className="text-base font-bold text-stone-900">目前尚無研究生論文進度登錄資料</h3>
              <p className="text-xs text-stone-500 leading-relaxed">
                系統資料已完全清空重置。研究生同學可點擊下方按鈕前往「數線登錄進度」，以個人 Gmail 登入並開始登錄 27 步論文進度！
              </p>
            </div>
            <div className="pt-2">
              <button
                onClick={onGoToMyNumberLine}
                className="inline-flex items-center space-x-2 px-5 py-2.5 rounded-xl bg-blue-700 hover:bg-blue-800 text-white text-xs font-bold shadow-xs transition-all cursor-pointer"
              >
                <span>前往我的數線登錄進度</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        ) : filteredStudents.length === 0 ? (
          <div className="bg-white rounded-2xl p-12 text-center border border-stone-200 space-y-3">
            <Users className="w-12 h-12 text-stone-300 mx-auto" />
            <p className="text-sm font-semibold text-stone-700">查無符合條件之研究生記錄</p>
            <p className="text-xs text-stone-400">請嘗試調整搜尋關鍵字或清除篩選條件。</p>
          </div>
        ) : (
          filteredStudents.map((student) => {
            const stepNumber = student.currentStepNumber || student.completedSteps.length || 1;
            const stepInfo = getStepInfo(stepNumber);
            const totalSteps = 27;
            const completedCount = student.completedSteps.length;
            const progressPercent = Math.min(100, Math.round((completedCount / totalSteps) * 100));
            const isExpanded = expandedStudentId === student.studentId;
            const isCurrentMe = Boolean(currentLoggedInEmail && student.studentEmail === currentLoggedInEmail);

            return (
              <div 
                key={student.studentId}
                className={`bg-white rounded-2xl border transition-all shadow-xs overflow-hidden ${
                  isCurrentMe 
                    ? 'border-blue-500 ring-2 ring-blue-500/20' 
                    : isTeacher
                    ? 'border-amber-200/80 hover:border-amber-300'
                    : 'border-stone-200 hover:border-stone-300'
                }`}
              >
                {/* Main Card Summary */}
                <div className="p-5 sm:p-6 space-y-4">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                    {/* Student Info & Account */}
                    <div className="flex items-center space-x-3">
                      {student.photoURL ? (
                        <img 
                          src={student.photoURL} 
                          alt={student.studentName} 
                          className="w-12 h-12 rounded-full border border-stone-200 object-cover"
                          referrerPolicy="no-referrer"
                        />
                      ) : (
                        <div className="w-12 h-12 rounded-full bg-blue-100 text-blue-800 font-bold text-base flex items-center justify-center border border-blue-200">
                          {student.studentName?.slice(0, 1) || '學'}
                        </div>
                      )}

                      <div>
                        <div className="flex flex-wrap items-center gap-2">
                          <span className="font-bold text-base text-stone-900">
                            {student.studentName || '未命名同學'}
                          </span>
                          {isCurrentMe && (
                            <span className="px-2 py-0.5 rounded-md bg-blue-100 text-blue-800 text-[10px] font-bold">
                              我的帳號
                            </span>
                          )}
                          <span className="text-xs px-2 py-0.5 rounded-md bg-stone-100 text-stone-600 font-mono">
                            {student.studentEmail || '未綁定 Gmail'}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Step Highlight Badge & Teacher Operations */}
                    <div className="flex flex-wrap items-center gap-2 sm:self-end">
                      {/* Teacher Actions Bar */}
                      {isTeacher && (
                        <div className="flex items-center space-x-1.5 bg-amber-50 p-1.5 rounded-xl border border-amber-200">
                          <button
                            onClick={() => handleOpenEdit(student)}
                            title="老師修改學生進度步驟"
                            className="px-2.5 py-1.5 rounded-lg bg-white hover:bg-stone-50 text-stone-800 border border-stone-200 text-xs font-bold flex items-center space-x-1 shadow-2xs transition-all cursor-pointer"
                          >
                            <Edit3 className="w-3.5 h-3.5 text-blue-600" />
                            <span>修改進度</span>
                          </button>
                          <button
                            onClick={() => setDeletingStudent(student)}
                            title="學生畢業離校後刪除帳號"
                            className="px-2.5 py-1.5 rounded-lg bg-red-50 hover:bg-red-100 text-red-700 border border-red-200 text-xs font-bold flex items-center space-x-1 shadow-2xs transition-all cursor-pointer"
                          >
                            <Trash2 className="w-3.5 h-3.5 text-red-600" />
                            <span>刪除學生 (畢業)</span>
                          </button>
                        </div>
                      )}

                      <div className="text-right">
                        <div className="text-[11px] text-stone-400 font-medium">當前推進步驟</div>
                        <div className="text-sm font-bold text-blue-800 flex items-center justify-end space-x-1">
                          <span>第 {stepNumber} 步 / 27 步</span>
                          {stepNumber >= 27 ? (
                            <Award className="w-4 h-4 text-blue-600" />
                          ) : (
                            <Lock className="w-3.5 h-3.5 text-amber-600" />
                          )}
                        </div>
                      </div>

                      <button
                        onClick={() => setExpandedStudentId(isExpanded ? null : student.studentId)}
                        className="px-3 py-2 rounded-xl text-xs font-semibold bg-stone-100 hover:bg-stone-200 text-stone-700 transition-all flex items-center space-x-1 cursor-pointer"
                      >
                        <span>{isExpanded ? '收合' : '詳細'}</span>
                        {isExpanded ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
                      </button>
                    </div>
                  </div>

                  {/* Prominent Current Step Callout Banner */}
                  <div className="p-3.5 rounded-xl bg-stone-50 border border-stone-200/90 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs">
                    <div className="flex items-center space-x-2">
                      <span className={`px-2 py-0.5 rounded-md text-[11px] font-bold ${
                        stepInfo.phase === 1 
                          ? 'bg-amber-100 text-amber-900 border border-amber-200' 
                          : 'bg-indigo-100 text-indigo-900 border border-indigo-200'
                      }`}>
                        第 {stepInfo.phase} 階段（第 {stepInfo.phaseStep} 步）
                      </span>
                      <span className="font-bold text-stone-900 text-sm">
                        {stepInfo.title}
                      </span>
                    </div>

                    <div className="flex items-center space-x-3 text-stone-500">
                      <span className="flex items-center space-x-1">
                        <CheckCircle2 className="w-3.5 h-3.5 text-blue-600" />
                        <span>已完成 {completedCount} 步</span>
                      </span>
                      {student.lastUpdated && (
                        <span className="flex items-center space-x-1">
                          <Clock className="w-3.5 h-3.5 text-stone-400" />
                          <span>更新於 {new Date(student.lastUpdated).toLocaleDateString()}</span>
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Visual 27-Step Mini Number Line */}
                  <div className="space-y-1.5">
                    <div className="flex justify-between text-[10px] text-stone-400">
                      <span>坐標 1 (題目開題)</span>
                      <span>坐標 11 (計畫口試修正)</span>
                      <span>坐標 27 (恭喜畢業)</span>
                    </div>

                    <div className="relative pt-1 pb-1">
                      {/* Background Bar */}
                      <div className="w-full bg-stone-100 h-2 rounded-full overflow-hidden">
                        <div 
                          className="bg-blue-600 h-2 rounded-full transition-all duration-500"
                          style={{ width: `${(stepNumber / 27) * 100}%` }}
                        />
                      </div>

                      {/* 27 Points Representation */}
                      <div className="flex justify-between items-center -mt-2 px-0.5">
                        {Array.from({ length: 27 }, (_, i) => {
                          const idx = i + 1;
                          const isPast = idx < stepNumber;
                          const isCurrent = idx === stepNumber;
                          return (
                            <div 
                              key={idx}
                              title={`第 ${idx} 步`}
                              className={`w-2 h-2 rounded-full transition-all ${
                                isCurrent 
                                  ? 'w-3.5 h-3.5 -mt-0.5 bg-blue-600 ring-4 ring-blue-200' 
                                  : isPast 
                                    ? 'bg-blue-600' 
                                    : 'bg-stone-300'
                              }`}
                            />
                          );
                        })}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Collapsible Detail Drawer: Completed Steps, Dates & Notes */}
                {isExpanded && (
                  <div className="bg-stone-50/70 p-5 sm:p-6 border-t border-stone-200 text-xs space-y-4">
                    <div className="flex items-center justify-between">
                      <h4 className="font-bold text-stone-900 flex items-center space-x-2">
                        <FileText className="w-4 h-4 text-blue-700" />
                        <span>該同學已登錄之里程碑紀錄與日期</span>
                      </h4>
                      <span className="text-[11px] text-stone-500">
                        依據 Firestore 雲端資料庫即時呈現
                      </span>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-2.5">
                      {ALL_THESIS_STEPS.filter(step => student.completedSteps.includes(step.id)).map(step => (
                        <div key={step.id} className="p-3 bg-white rounded-xl border border-stone-200/90 space-y-1">
                          <div className="flex items-center justify-between">
                            <span className="font-bold text-stone-800 flex items-center space-x-1.5">
                              <CheckCircle2 className="w-3.5 h-3.5 text-blue-600 shrink-0" />
                              <span>第 {step.globalIndex} 步：{step.title}</span>
                            </span>
                            {student.stepDates && student.stepDates[step.id] && (
                              <span className="text-[10px] text-stone-500 font-mono bg-stone-100 px-1.5 py-0.5 rounded">
                                {student.stepDates[step.id]}
                              </span>
                            )}
                          </div>
                          {student.stepNotes && student.stepNotes[step.id] && (
                            <p className="text-stone-600 bg-stone-50 p-2 rounded-lg text-[11px] mt-1 border border-stone-100">
                              備忘：{student.stepNotes[step.id]}
                            </p>
                          )}
                        </div>
                      ))}
                    </div>

                    {student.completedSteps.length === 0 && (
                      <p className="text-stone-400 text-center py-2">尚未登錄任何已完成步驟。</p>
                    )}
                  </div>
                )}
              </div>
            );
          })
        )}
      </div>

      {/* MODAL 1: Teacher Login Dialog (Credentials Confidential - Not displayed on UI) */}
      {showTeacherLoginModal && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-6 sm:p-7 max-w-md w-full shadow-2xl border border-stone-200 space-y-5 animate-in fade-in zoom-in-95">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2.5">
                <div className="w-10 h-10 rounded-xl bg-amber-100 text-amber-800 flex items-center justify-center">
                  <KeyRound className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-bold text-base text-stone-900">崔老師論文進度管理專區</h3>
                  <p className="text-xs text-stone-500">指導教授專屬管理權限登入</p>
                </div>
              </div>
              <button 
                onClick={() => setShowTeacherLoginModal(false)}
                className="p-1.5 rounded-lg text-stone-400 hover:text-stone-700 hover:bg-stone-100 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleTeacherLogin} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-stone-700 mb-1">
                  管理員帳號
                </label>
                <input
                  type="text"
                  required
                  placeholder="請輸入管理帳號"
                  value={teacherUsername}
                  onChange={(e) => setTeacherUsername(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl text-sm border border-stone-200 focus:outline-none focus:ring-2 focus:ring-blue-600 bg-stone-50 font-mono"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-stone-700 mb-1">
                  管理員密碼
                </label>
                <input
                  type="password"
                  required
                  placeholder="請輸入管理密碼"
                  value={teacherPassword}
                  onChange={(e) => setTeacherPassword(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl text-sm border border-stone-200 focus:outline-none focus:ring-2 focus:ring-blue-600 bg-stone-50 font-mono"
                />
              </div>

              {teacherLoginError && (
                <div className="p-3 rounded-xl bg-red-50 border border-red-200 text-xs text-red-700 flex items-center space-x-2">
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  <span>{teacherLoginError}</span>
                </div>
              )}

              <div className="flex items-center justify-end space-x-2.5 pt-2">
                <button
                  type="button"
                  onClick={() => setShowTeacherLoginModal(false)}
                  className="px-4 py-2 rounded-xl text-xs font-bold text-stone-600 hover:bg-stone-100 cursor-pointer"
                >
                  取消
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl text-xs font-bold bg-stone-900 hover:bg-black text-white shadow-sm flex items-center space-x-1.5 cursor-pointer"
                >
                  <ShieldCheck className="w-4 h-4 text-blue-400" />
                  <span>登入老師管理模式</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL 2: Teacher Edit Student Progress Dialog */}
      {editingStudent && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-6 sm:p-7 max-w-lg w-full shadow-2xl border border-stone-200 space-y-5 animate-in fade-in zoom-in-95 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2.5">
                <div className="w-10 h-10 rounded-xl bg-blue-100 text-blue-800 flex items-center justify-center">
                  <Edit3 className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-bold text-base text-stone-900">
                    修改學生進度（老師管理權限）
                  </h3>
                  <p className="text-xs text-stone-500">
                    學生：{editingStudent.studentName} ({editingStudent.studentEmail || '未綁定 Gmail'})
                  </p>
                </div>
              </div>
              <button 
                onClick={() => setEditingStudent(null)}
                className="p-1.5 rounded-lg text-stone-400 hover:text-stone-700 hover:bg-stone-100 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-stone-700 mb-1">
                  學生姓名
                </label>
                <input
                  type="text"
                  value={editStudentName}
                  onChange={(e) => setEditStudentName(e.target.value)}
                  className="w-full px-3.5 py-2 rounded-xl text-sm border border-stone-200 focus:outline-none focus:ring-2 focus:ring-blue-600 bg-stone-50 font-bold text-stone-900"
                />
              </div>

              {/* Step Selector */}
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="text-xs font-bold text-stone-700">
                    調整推進步驟（1 ~ 27 步）
                  </label>
                  <span className="text-sm font-extrabold text-blue-800 bg-blue-50 px-2.5 py-0.5 rounded-lg border border-blue-200">
                    第 {editStepNumber} 步
                  </span>
                </div>

                <input
                  type="range"
                  min="1"
                  max="27"
                  value={editStepNumber}
                  onChange={(e) => setEditStepNumber(Number(e.target.value))}
                  className="w-full accent-blue-600 cursor-pointer"
                />

                {/* Step Detail Callout */}
                {(() => {
                  const stepDetail = ALL_THESIS_STEPS.find(s => s.globalIndex === editStepNumber);
                  return (
                    <div className="mt-2 p-3 rounded-xl bg-stone-50 border border-stone-200 text-xs">
                      <div className="flex items-center space-x-2">
                        <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-stone-200 text-stone-800">
                          階段 {stepDetail?.phase || (editStepNumber <= 11 ? 1 : 2)}
                        </span>
                        <span className="font-bold text-stone-900">
                          {stepDetail?.title}
                        </span>
                      </div>
                      <p className="text-stone-500 mt-1 text-[11px]">
                        {stepDetail?.categoryLabel} • {stepDetail?.description}
                      </p>
                    </div>
                  );
                })()}

                {/* Quick Presets */}
                <div className="mt-3">
                  <div className="text-[11px] font-semibold text-stone-500 mb-1.5">快速跳轉預設：</div>
                  <div className="flex flex-wrap gap-1.5">
                    <button
                      type="button"
                      onClick={() => setEditStepNumber(1)}
                      className="px-2.5 py-1 rounded-lg bg-stone-100 hover:bg-stone-200 text-stone-700 text-xs font-semibold cursor-pointer"
                    >
                      第 1 步 (起步)
                    </button>
                    <button
                      type="button"
                      onClick={() => setEditStepNumber(11)}
                      className="px-2.5 py-1 rounded-lg bg-amber-50 hover:bg-amber-100 text-amber-800 border border-amber-200 text-xs font-semibold cursor-pointer"
                    >
                      第 11 步 (計畫口試通過)
                    </button>
                    <button
                      type="button"
                      onClick={() => setEditStepNumber(18)}
                      className="px-2.5 py-1 rounded-lg bg-indigo-50 hover:bg-indigo-100 text-indigo-800 border border-indigo-200 text-xs font-semibold cursor-pointer"
                    >
                      第 18 步 (小論文審查)
                    </button>
                    <button
                      type="button"
                      onClick={() => setEditStepNumber(27)}
                      className="px-2.5 py-1 rounded-lg bg-blue-50 hover:bg-blue-100 text-blue-900 border border-blue-300 text-xs font-bold cursor-pointer"
                    >
                      第 27 步 (恭喜畢業！)
                    </button>
                  </div>
                </div>
              </div>
            </div>

            <div className="flex items-center justify-end space-x-2.5 pt-3 border-t border-stone-200">
              <button
                type="button"
                onClick={() => setEditingStudent(null)}
                className="px-4 py-2 rounded-xl text-xs font-bold text-stone-600 hover:bg-stone-100 cursor-pointer"
              >
                取消
              </button>
              <button
                type="button"
                onClick={handleSaveStudentEdit}
                disabled={isSavingEdit}
                className="px-5 py-2 rounded-xl text-xs font-bold bg-blue-700 hover:bg-blue-800 text-white shadow-sm flex items-center space-x-1.5 cursor-pointer disabled:opacity-50"
              >
                <Save className="w-4 h-4" />
                <span>{isSavingEdit ? '儲存中...' : '確認更新進度'}</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL 3: Teacher Delete Student Account Dialog (For graduated or departing students) */}
      {deletingStudent && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-6 sm:p-7 max-w-md w-full shadow-2xl border border-stone-200 space-y-5 animate-in fade-in zoom-in-95">
            <div className="flex items-center space-x-3">
              <div className="w-11 h-11 rounded-2xl bg-red-100 text-red-700 flex items-center justify-center shrink-0">
                <AlertTriangle className="w-6 h-6" />
              </div>
              <div>
                <h3 className="font-bold text-base text-stone-900">
                  確認刪除學生帳號與進度？
                </h3>
                <p className="text-xs text-stone-500">崔老師畢業離校管理權限</p>
              </div>
            </div>

            <div className="p-4 rounded-xl bg-red-50 border border-red-200 text-xs text-red-900 space-y-2">
              <p className="font-bold">
                您即將永久刪除學生「{deletingStudent.studentName}」({deletingStudent.studentEmail || '未綁定 Gmail'}) 的所有進度紀錄。
              </p>
              <p className="text-red-700 leading-relaxed">
                此操作適用於學生已順利畢業完成學位離校手續、封存歸檔，或清理不再使用的測試帳號。確認後將自 Firestore 雲端資料庫直接移除，且無法復原。
              </p>
            </div>

            <div className="flex items-center justify-end space-x-2.5 pt-2">
              <button
                type="button"
                onClick={() => setDeletingStudent(null)}
                className="px-4 py-2 rounded-xl text-xs font-bold text-stone-600 hover:bg-stone-100 cursor-pointer"
              >
                取消
              </button>
              <button
                type="button"
                onClick={handleConfirmDelete}
                disabled={isDeleting}
                className="px-5 py-2 rounded-xl text-xs font-bold bg-red-600 hover:bg-red-700 text-white shadow-sm flex items-center space-x-1.5 cursor-pointer disabled:opacity-50"
              >
                <Trash2 className="w-4 h-4" />
                <span>{isDeleting ? '刪除中...' : '確認永久刪除此帳號'}</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
