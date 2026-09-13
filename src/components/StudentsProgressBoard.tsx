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
  Check,
  UserPlus,
  Eye,
  EyeOff,
  Copy,
  ClipboardList
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

  // Teacher mode authentication
  const [isTeacher, setIsTeacher] = useState<boolean>(() => {
    return localStorage.getItem('thesis_is_teacher') === 'true' || sessionStorage.getItem('thesis_is_teacher') === 'true';
  });
  const [showTeacherLoginModal, setShowTeacherLoginModal] = useState(false);
  const [teacherUsername, setTeacherUsername] = useState('');
  const [teacherPassword, setTeacherPassword] = useState('');
  const [showTeacherPasswordText, setShowTeacherPasswordText] = useState(false);
  const [teacherLoginError, setTeacherLoginError] = useState<string | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Teacher Create Student Account State
  const [showCreateStudentModal, setShowCreateStudentModal] = useState(false);
  const [newStudentName, setNewStudentName] = useState('');
  const [newStudentEmail, setNewStudentEmail] = useState('');
  const [newStudentTopic, setNewStudentTopic] = useState('');
  const [newStudentPassword, setNewStudentPassword] = useState('');
  const [isCreatingStudent, setIsCreatingStudent] = useState(false);
  const [createStudentError, setCreateStudentError] = useState<string | null>(null);

  // Teacher Account Roster State
  const [showRosterModal, setShowRosterModal] = useState(false);
  const [rosterSearch, setRosterSearch] = useState('');

  // Password visibility map (per studentId)
  const [showPasswordMap, setShowPasswordMap] = useState<Record<string, boolean>>({});

  // Teacher Action Modals State
  const [editingStudent, setEditingStudent] = useState<StudentProgressRecord | null>(null);
  const [editStepNumber, setEditStepNumber] = useState<number>(1);
  const [editStudentName, setEditStudentName] = useState<string>('');
  const [editStudentPassword, setEditStudentPassword] = useState<string>('');
  const [showEditPasswordText, setShowEditPasswordText] = useState(false);
  const [isSavingEdit, setIsSavingEdit] = useState<boolean>(false);

  const [deletingStudent, setDeletingStudent] = useState<StudentProgressRecord | null>(null);
  const [isDeleting, setIsDeleting] = useState<boolean>(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);

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

  // Teacher Login Handler (Confidential, credentials strictly checked)
  const handleTeacherLogin = (e: React.FormEvent) => {
    e.preventDefault();
    const u = teacherUsername.trim().toLowerCase();
    const p = teacherPassword.trim();

    // Accepted teacher admin usernames & passwords
    const validUsers = ['teacher', 'tsuei', 'mptsuei', 'mptsuei@gmail.com', 'admin'];
    const validPasswords = ['tsuei888', 'tsuei'];

    if (validUsers.includes(u) && validPasswords.includes(p)) {
      setIsTeacher(true);
      localStorage.setItem('thesis_is_teacher', 'true');
      sessionStorage.setItem('thesis_is_teacher', 'true');
      setShowTeacherLoginModal(false);
      setTeacherUsername('');
      setTeacherPassword('');
      setTeacherLoginError(null);
      setToastMessage('✓ 崔老師管理模式已啟動！您現具備新增學生、查閱/重設密碼與調整進度之最高權限。');
    } else {
      setTeacherLoginError('帳號或密碼輸入錯誤，請確認後重新輸入。');
    }
  };

  const handleTeacherLogout = () => {
    setIsTeacher(false);
    localStorage.removeItem('thesis_is_teacher');
    sessionStorage.removeItem('thesis_is_teacher');
    setToastMessage('✓ 已結束崔老師管理模式。');
  };

  // Teacher Create Student Account Handler
  const handleCreateStudent = async (e: React.FormEvent) => {
    e.preventDefault();
    const name = newStudentName.trim();
    const email = newStudentEmail.trim().toLowerCase();
    const topic = newStudentTopic.trim();
    const pwd = newStudentPassword.trim();

    if (!name) {
      setCreateStudentError('請填寫學生姓名！');
      return;
    }
    if (!email || !email.includes('@')) {
      setCreateStudentError('請填寫正確格式的學生 Email 帳號！');
      return;
    }
    if (pwd && pwd.length !== 6) {
      setCreateStudentError('若欲指定密碼，請輸入剛好 6 位數密碼（亦可留空讓學生初次登入時自行建立）！');
      return;
    }

    // Check duplicate email
    const exists = students.some(s => s.studentEmail?.toLowerCase() === email);
    if (exists) {
      setCreateStudentError(`此 Email「${email}」已存在於學生名冊中，請勿重複建立！`);
      return;
    }

    setIsCreatingStudent(true);
    setCreateStudentError(null);

    try {
      const newStudentId = `std_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;
      const today = new Date().toISOString().split('T')[0];
      const newRecord: StudentProgressRecord = {
        studentId: newStudentId,
        studentName: name,
        studentEmail: email,
        thesisTopic: topic,
        currentPhase: 1,
        currentStepNumber: 1,
        currentStepTitle: '閱讀文獻找題目',
        completedSteps: ['p1-1'],
        stepDates: { 'p1-1': today },
        stepNotes: {},
        password: pwd || '',
        lastUpdated: new Date().toISOString()
      };

      const docRef = doc(db, 'student_progress', newStudentId);
      await setDoc(docRef, newRecord);

      setStudents(prev => [newRecord, ...prev]);
      setToastMessage(`✓ 已成功為「${name}」建立專屬學生帳號（${email}）！${pwd ? `已預設 6 位數密碼：${pwd}` : '學生初次登入時將引導其自行建立 6 位數密碼。'}`);
      setShowCreateStudentModal(false);
      setNewStudentName('');
      setNewStudentEmail('');
      setNewStudentTopic('');
      setNewStudentPassword('');
    } catch (err) {
      console.error('Create student error:', err);
      setCreateStudentError(`建立學生帳號失敗：${err}`);
    } finally {
      setIsCreatingStudent(false);
    }
  };

  // Copy password helper
  const handleCopyPassword = (studentId: string, pwd: string) => {
    if (!pwd) return;
    navigator.clipboard.writeText(pwd);
    setCopiedId(studentId);
    setTimeout(() => setCopiedId(null), 2000);
    setToastMessage(`✓ 已複製密碼「${pwd}」至剪貼簿，可直接提供給學生！`);
  };

  // Open Edit Modal for a Student
  const handleOpenEdit = (student: StudentProgressRecord) => {
    setEditingStudent(student);
    setEditStepNumber(student.currentStepNumber || student.completedSteps.length || 1);
    setEditStudentName(student.studentName || '');
    setEditStudentPassword(student.password || '');
    setShowEditPasswordText(false);
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
        password: editStudentPassword.trim(),
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

      setToastMessage(`✓ 已成功儲存學生「${editStudentName || editingStudent.studentName}」的進度與密碼設定！`);
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
      <div className="bg-gradient-to-r from-blue-100/90 via-sky-100/80 to-blue-200/90 rounded-3xl p-6 sm:p-8 text-blue-950 border border-blue-300/80 shadow-xs relative overflow-hidden">
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
            本看板開放公開檢視，彙整全體研究生之 27 步論文數線進度。由崔老師統一為同學建立 Email 帳號，學生初次登入自訂 6 位數密碼，若忘記密碼可隨時請崔老師查詢或重設。遵循崔老師嚴格規範：<strong className="text-blue-950 font-bold">學生操作時僅能向前推進，不可撤銷</strong>。崔老師可啟用管理模式開立學生帳號、查閱密碼或調整進度。
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
              <div className="flex items-center gap-2 flex-wrap">
                <button
                  onClick={() => {
                    setCreateStudentError(null);
                    setShowCreateStudentModal(true);
                  }}
                  className="px-4 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-600 text-stone-950 font-bold text-xs flex items-center space-x-1.5 shadow-xs transition-all cursor-pointer"
                >
                  <UserPlus className="w-4 h-4 text-stone-950" />
                  <span>+ 建立新學生帳號</span>
                </button>
                <button
                  onClick={() => setShowRosterModal(true)}
                  className="px-4 py-2.5 rounded-xl bg-white hover:bg-amber-100 text-amber-950 border border-amber-300 font-bold text-xs flex items-center space-x-1.5 shadow-2xs transition-all cursor-pointer"
                >
                  <KeyRound className="w-3.5 h-3.5 text-amber-700" />
                  <span>📋 學生帳密總覽名冊</span>
                </button>
                <button
                  onClick={handleTeacherLogout}
                  className="px-4 py-2.5 rounded-xl bg-stone-100 hover:bg-stone-200 text-stone-700 font-bold text-xs flex items-center space-x-1.5 transition-all cursor-pointer"
                >
                  <LogOut className="w-3.5 h-3.5 text-stone-600" />
                  <span>結束老師管理模式</span>
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Teacher Mode Active Notice Bar */}
      {isTeacher && (
        <div className="bg-amber-50 border-2 border-amber-300 rounded-2xl p-4 sm:p-5 flex flex-col md:flex-row items-start md:items-center justify-between gap-3 text-amber-950 shadow-xs">
          <div className="flex items-start space-x-3">
            <div className="w-9 h-9 rounded-xl bg-amber-200 text-amber-900 flex items-center justify-center shrink-0 mt-0.5">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <div className="font-bold text-sm text-amber-900 flex items-center gap-2">
                <span>崔老師管理模式已啟動（具備最高管理權限）</span>
              </div>
              <p className="text-xs text-amber-800 mt-0.5 leading-relaxed">
                您現在可以<strong>「+ 建立新學生帳號」</strong>、<strong>「📋 查看全體學生 6 位數密碼」</strong>、對學生卡片執行<strong>「✏️ 修改進度/密碼」</strong>或於畢業後<strong>「🗑️ 刪除學生 (畢業)」</strong>。
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2 flex-wrap shrink-0">
            <button
              onClick={() => {
                setCreateStudentError(null);
                setShowCreateStudentModal(true);
              }}
              className="px-3.5 py-2 rounded-xl bg-blue-700 hover:bg-blue-800 text-white font-bold text-xs flex items-center space-x-1.5 shadow-xs transition-all cursor-pointer"
            >
              <UserPlus className="w-3.5 h-3.5" />
              <span>+ 建立學生帳號</span>
            </button>
            <button
              onClick={() => setShowRosterModal(true)}
              className="px-3.5 py-2 rounded-xl bg-white hover:bg-amber-100 text-amber-950 border border-amber-300 font-bold text-xs flex items-center space-x-1.5 shadow-2xs transition-all cursor-pointer"
            >
              <KeyRound className="w-3.5 h-3.5 text-amber-700" />
              <span>查看學生帳密名冊</span>
            </button>
            <button
              onClick={handleTeacherLogout}
              className="px-3.5 py-2 rounded-xl bg-amber-200 hover:bg-amber-300 text-amber-950 font-bold text-xs flex items-center space-x-1.5 border border-amber-300 transition-all cursor-pointer"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span>結束模式</span>
            </button>
          </div>
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
            placeholder="搜尋學生姓名或 Email 帳號..."
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
                本系統已改為由崔老師統一為同學建立 Email 專屬帳號。崔老師可於管理模式點擊下方「建立新學生帳號」直接開立；學生初次登入即可自訂 6 位數密碼並開始登錄 27 步論文進度！
              </p>
            </div>
            <div className="pt-2 flex flex-wrap items-center justify-center gap-2.5">
              {isTeacher ? (
                <button
                  onClick={() => {
                    setCreateStudentError(null);
                    setShowCreateStudentModal(true);
                  }}
                  className="inline-flex items-center space-x-2 px-5 py-2.5 rounded-xl bg-blue-700 hover:bg-blue-800 text-white text-xs font-bold shadow-xs transition-all cursor-pointer"
                >
                  <UserPlus className="w-4 h-4" />
                  <span>立即建立第一位學生帳號</span>
                </button>
              ) : (
                <button
                  onClick={onGoToMyNumberLine}
                  className="inline-flex items-center space-x-2 px-5 py-2.5 rounded-xl bg-blue-700 hover:bg-blue-800 text-white text-xs font-bold shadow-xs transition-all cursor-pointer"
                >
                  <span>前往學生登入與數線登錄</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              )}
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
                            {student.studentEmail || '未設定 Email'}
                          </span>
                        </div>

                        {/* Teacher View: Student Password & Account Controls */}
                        {isTeacher && (
                          <div className="mt-1 flex flex-wrap items-center gap-1.5 text-xs">
                            <span className="inline-flex items-center space-x-1 px-2 py-0.5 rounded-md bg-amber-100/90 text-amber-950 font-medium text-[11px] border border-amber-200">
                              <KeyRound className="w-3 h-3 text-amber-700 shrink-0" />
                              <span className="font-bold">6 位數密碼：</span>
                              {student.password ? (
                                <span className="font-mono font-bold tracking-wider text-amber-950">
                                  {showPasswordMap[student.studentId] ? student.password : '••••••'}
                                </span>
                              ) : (
                                <span className="text-amber-800 italic">尚未設定（初次登入由學生自訂）</span>
                              )}
                            </span>
                            {student.password ? (
                              <>
                                <button
                                  onClick={() => setShowPasswordMap(prev => ({ ...prev, [student.studentId]: !prev[student.studentId] }))}
                                  className="p-1 hover:bg-stone-100 rounded text-stone-500 hover:text-stone-700 cursor-pointer"
                                  title={showPasswordMap[student.studentId] ? '隱藏密碼' : '顯示密碼明碼'}
                                >
                                  {showPasswordMap[student.studentId] ? <EyeOff className="w-3.5 h-3.5 text-stone-600" /> : <Eye className="w-3.5 h-3.5 text-stone-600" />}
                                </button>
                                <button
                                  onClick={() => handleCopyPassword(student.studentId, student.password!)}
                                  className="px-1.5 py-0.5 hover:bg-amber-100 rounded text-amber-800 border border-amber-300 cursor-pointer flex items-center space-x-0.5 text-[10px] font-bold"
                                  title="複製密碼以提供給忘記密碼之學生"
                                >
                                  <Copy className="w-3 h-3" />
                                  <span>{copiedId === student.studentId ? '已複製！' : '複製密碼'}</span>
                                </button>
                              </>
                            ) : (
                              <button
                                onClick={() => handleOpenEdit(student)}
                                className="text-[11px] text-blue-700 hover:underline font-bold bg-blue-50 px-1.5 py-0.5 rounded border border-blue-200"
                              >
                                由老師代設密碼
                              </button>
                            )}
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Step Highlight Badge & Teacher Operations */}
                    <div className="flex flex-wrap items-center gap-2 sm:self-end">
                      {/* Teacher Actions Bar */}
                      {isTeacher && (
                        <div className="flex items-center space-x-1.5 bg-amber-50 p-1.5 rounded-xl border border-amber-200">
                          <button
                            onClick={() => handleOpenEdit(student)}
                            title="老師修改學生進度或 6 位數密碼"
                            className="px-2.5 py-1.5 rounded-lg bg-white hover:bg-stone-50 text-stone-800 border border-stone-200 text-xs font-bold flex items-center space-x-1 shadow-2xs transition-all cursor-pointer"
                          >
                            <Edit3 className="w-3.5 h-3.5 text-blue-600" />
                            <span>修改進度 / 密碼</span>
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
                  placeholder="請輸入崔老師管理帳號"
                  value={teacherUsername}
                  onChange={(e) => setTeacherUsername(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl text-sm border border-stone-200 focus:outline-none focus:ring-2 focus:ring-blue-600 bg-stone-50 font-mono"
                  autoComplete="username"
                />
              </div>

              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="block text-xs font-bold text-stone-700">
                    管理員密碼
                  </label>
                  <button
                    type="button"
                    onClick={() => setShowTeacherPasswordText(!showTeacherPasswordText)}
                    className="text-[11px] text-stone-500 hover:text-stone-800 flex items-center space-x-1 cursor-pointer"
                  >
                    {showTeacherPasswordText ? (
                      <>
                        <EyeOff className="w-3.5 h-3.5" />
                        <span>隱藏密碼</span>
                      </>
                    ) : (
                      <>
                        <Eye className="w-3.5 h-3.5" />
                        <span>顯示密碼</span>
                      </>
                    )}
                  </button>
                </div>
                <input
                  type={showTeacherPasswordText ? 'text' : 'password'}
                  required
                  placeholder="請輸入管理密碼"
                  value={teacherPassword}
                  onChange={(e) => setTeacherPassword(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl text-sm border border-stone-200 focus:outline-none focus:ring-2 focus:ring-blue-600 bg-stone-50 font-mono"
                  autoComplete="current-password"
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
                  className="px-5 py-2.5 rounded-xl text-xs font-bold bg-blue-700 hover:bg-blue-800 text-white shadow-xs flex items-center space-x-1.5 cursor-pointer"
                >
                  <ShieldCheck className="w-4 h-4 text-blue-200" />
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
                    修改學生進度與密碼（老師管理權限）
                  </h3>
                  <p className="text-xs text-stone-500">
                    學生：{editingStudent.studentName} ({editingStudent.studentEmail || '未設定 Email'})
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

              {/* Student Password Management (Teacher View & Reset) */}
              <div className="p-3.5 rounded-xl bg-amber-50/80 border border-amber-200">
                <div className="flex items-center justify-between mb-1.5">
                  <label className="text-xs font-bold text-amber-950 flex items-center space-x-1">
                    <KeyRound className="w-3.5 h-3.5 text-amber-700" />
                    <span>學生 6 位數登入密碼（老師可查看或重設）</span>
                  </label>
                  <button
                    type="button"
                    onClick={() => setShowEditPasswordText(!showEditPasswordText)}
                    className="text-[11px] text-amber-850 hover:text-amber-950 font-bold flex items-center space-x-1 cursor-pointer"
                  >
                    {showEditPasswordText ? <EyeOff className="w-3 h-3" /> : <Eye className="w-3 h-3" />}
                    <span>{showEditPasswordText ? '隱藏密碼' : '顯示明碼'}</span>
                  </button>
                </div>
                <input
                  type={showEditPasswordText ? "text" : "password"}
                  maxLength={6}
                  value={editStudentPassword}
                  onChange={(e) => setEditStudentPassword(e.target.value)}
                  placeholder="可輸入 6 位數新密碼（若留空學生初次登入時自訂）"
                  className="w-full px-3.5 py-2 rounded-xl text-sm border border-amber-200 focus:outline-none focus:ring-2 focus:ring-amber-500 bg-white font-mono font-bold tracking-widest text-stone-900"
                />
                <p className="text-[11px] text-amber-800 mt-1.5 leading-relaxed">
                  💡 若學生忘記密碼，崔老師可直接在此查看其密碼告知學生；或直接在此輸入新的 6 位密碼並儲存，再告知學生新密碼即可。
                </p>
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

      {/* MODAL 4: Teacher Create Student Account Dialog */}
      {showCreateStudentModal && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-6 sm:p-7 max-w-md w-full shadow-2xl border border-stone-200 space-y-5 animate-in fade-in zoom-in-95">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2.5">
                <div className="w-10 h-10 rounded-xl bg-blue-100 text-blue-800 flex items-center justify-center">
                  <UserPlus className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-bold text-base text-stone-900">
                    建立新研究生帳號
                  </h3>
                  <p className="text-xs text-stone-500">崔老師專屬指導學生開立</p>
                </div>
              </div>
              <button 
                onClick={() => setShowCreateStudentModal(false)}
                className="p-1.5 rounded-lg text-stone-400 hover:text-stone-700 hover:bg-stone-100 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateStudent} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-stone-700 mb-1">
                  學生姓名 <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  placeholder="例如：王小明"
                  value={newStudentName}
                  onChange={(e) => setNewStudentName(e.target.value)}
                  className="w-full px-3.5 py-2 rounded-xl text-sm border border-stone-200 focus:outline-none focus:ring-2 focus:ring-blue-600 bg-stone-50 font-medium text-stone-900"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-stone-700 mb-1">
                  學生 Email 帳號 <span className="text-red-500">*</span>
                </label>
                <input
                  type="email"
                  required
                  placeholder="例如：student@school.edu.tw 或其常用 Email"
                  value={newStudentEmail}
                  onChange={(e) => setNewStudentEmail(e.target.value)}
                  className="w-full px-3.5 py-2 rounded-xl text-sm border border-stone-200 focus:outline-none focus:ring-2 focus:ring-blue-600 bg-stone-50 font-mono text-stone-900"
                />
                <p className="text-[11px] text-stone-400 mt-1">
                  學生登入時將以此 Email 作為帳號驗證。
                </p>
              </div>

              <div>
                <label className="block text-xs font-bold text-stone-700 mb-1">
                  論文題目 / 研究方向（選填）
                </label>
                <input
                  type="text"
                  placeholder="例如：生成式 AI 融入教學設計之研究"
                  value={newStudentTopic}
                  onChange={(e) => setNewStudentTopic(e.target.value)}
                  className="w-full px-3.5 py-2 rounded-xl text-sm border border-stone-200 focus:outline-none focus:ring-2 focus:ring-blue-600 bg-stone-50 text-stone-900"
                />
              </div>

              <div className="p-3.5 rounded-xl bg-amber-50/80 border border-amber-200">
                <label className="block text-xs font-bold text-amber-950 mb-1 flex items-center space-x-1">
                  <KeyRound className="w-3.5 h-3.5 text-amber-700" />
                  <span>初始 6 位數密碼（選填，可留空）</span>
                </label>
                <input
                  type="text"
                  maxLength={6}
                  placeholder="留空 = 學生初次登入時自行建立 6 位密碼"
                  value={newStudentPassword}
                  onChange={(e) => setNewStudentPassword(e.target.value)}
                  className="w-full px-3 py-1.5 rounded-lg text-xs border border-amber-200 focus:outline-none focus:ring-2 focus:ring-amber-500 bg-white font-mono tracking-wider font-bold"
                />
                <p className="text-[11px] text-amber-800 mt-1">
                  💡 若此處留空，學生初次使用其 Email 登入時系統會自動引導學生自訂 6 位數密碼；若老師預先指定亦可直接輸入 6 碼。
                </p>
              </div>

              {createStudentError && (
                <div className="p-3 rounded-xl bg-red-50 border border-red-200 text-xs text-red-700 flex items-center space-x-2">
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  <span>{createStudentError}</span>
                </div>
              )}

              <div className="flex items-center justify-end space-x-2.5 pt-2 border-t border-stone-100">
                <button
                  type="button"
                  onClick={() => setShowCreateStudentModal(false)}
                  className="px-4 py-2 rounded-xl text-xs font-bold text-stone-600 hover:bg-stone-100 cursor-pointer"
                >
                  取消
                </button>
                <button
                  type="submit"
                  disabled={isCreatingStudent}
                  className="px-5 py-2 rounded-xl text-xs font-bold bg-blue-700 hover:bg-blue-800 text-white shadow-sm flex items-center space-x-1.5 cursor-pointer disabled:opacity-50"
                >
                  <Check className="w-4 h-4" />
                  <span>{isCreatingStudent ? '建立中...' : '確認建立學生帳號'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL 5: Student Account & Password Roster */}
      {showRosterModal && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-6 sm:p-7 max-w-3xl w-full shadow-2xl border border-stone-200 space-y-5 animate-in fade-in zoom-in-95 max-h-[90vh] flex flex-col">
            <div className="flex items-center justify-between border-b border-stone-200 pb-4">
              <div className="flex items-center space-x-2.5">
                <div className="w-10 h-10 rounded-xl bg-amber-100 text-amber-800 flex items-center justify-center">
                  <KeyRound className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-bold text-base text-stone-900">
                    全體研究生帳號密碼總覽名冊
                  </h3>
                  <p className="text-xs text-stone-500">崔老師專屬查閱 • 學生忘記密碼時可隨時在此核對或複製</p>
                </div>
              </div>
              <button 
                onClick={() => setShowRosterModal(false)}
                className="p-1.5 rounded-lg text-stone-400 hover:text-stone-700 hover:bg-stone-100 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Quick Filter */}
            <div className="flex items-center justify-between gap-3">
              <div className="relative flex-1">
                <Search className="w-4 h-4 text-stone-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  placeholder="搜尋姓名或 Email..."
                  value={rosterSearch}
                  onChange={(e) => setRosterSearch(e.target.value)}
                  className="w-full pl-9 pr-3 py-1.5 rounded-xl text-xs border border-stone-200 bg-stone-50 focus:outline-none focus:ring-2 focus:ring-blue-600"
                />
              </div>
              <button
                onClick={() => {
                  setShowRosterModal(false);
                  setCreateStudentError(null);
                  setShowCreateStudentModal(true);
                }}
                className="px-3 py-1.5 rounded-xl bg-blue-700 hover:bg-blue-800 text-white font-bold text-xs flex items-center space-x-1 cursor-pointer shrink-0"
              >
                <UserPlus className="w-3.5 h-3.5" />
                <span>+ 建立新學生</span>
              </button>
            </div>

            {/* Roster Table */}
            <div className="flex-1 overflow-y-auto border border-stone-200 rounded-2xl">
              {(() => {
                const filtered = students.filter(s => 
                  (s.studentName || '').toLowerCase().includes(rosterSearch.toLowerCase()) ||
                  (s.studentEmail || '').toLowerCase().includes(rosterSearch.toLowerCase())
                );

                if (filtered.length === 0) {
                  return (
                    <div className="p-8 text-center text-xs text-stone-500">
                      尚未建立任何學生帳號，或無符合搜尋條件之學生。
                    </div>
                  );
                }

                return (
                  <table className="w-full text-left text-xs border-collapse">
                    <thead className="bg-stone-50 text-stone-600 font-bold border-b border-stone-200 sticky top-0">
                      <tr>
                        <th className="p-3">姓名</th>
                        <th className="p-3">Email 帳號</th>
                        <th className="p-3">6 位數密碼</th>
                        <th className="p-3">當前進度</th>
                        <th className="p-3 text-right">操作</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-stone-100">
                      {filtered.map(s => (
                        <tr key={s.studentId} className="hover:bg-blue-50/40 transition-colors">
                          <td className="p-3 font-bold text-stone-900">
                            {s.studentName}
                          </td>
                          <td className="p-3 font-mono text-stone-600">
                            {s.studentEmail}
                          </td>
                          <td className="p-3">
                            {s.password ? (
                              <div className="flex items-center space-x-1.5">
                                <span className="font-mono font-extrabold text-blue-950 bg-amber-100 px-2 py-0.5 rounded border border-amber-300">
                                  {s.password}
                                </span>
                                <button
                                  onClick={() => handleCopyPassword(s.studentId, s.password!)}
                                  title="複製密碼提供給學生"
                                  className="p-1 hover:bg-stone-200 rounded text-stone-500 cursor-pointer"
                                >
                                  <Copy className="w-3.5 h-3.5" />
                                </button>
                                {copiedId === s.studentId && (
                                  <span className="text-[10px] text-blue-700 font-bold">已複製</span>
                                )}
                              </div>
                            ) : (
                              <span className="text-amber-700 bg-amber-50 px-2 py-0.5 rounded text-[11px]">
                                初次登入待自訂
                              </span>
                            )}
                          </td>
                          <td className="p-3 font-semibold text-stone-700">
                            第 {s.currentStepNumber || 1} 步 / 27 步
                          </td>
                          <td className="p-3 text-right">
                            <button
                              onClick={() => {
                                setShowRosterModal(false);
                                handleOpenEdit(s);
                              }}
                              className="px-2 py-1 rounded bg-stone-100 hover:bg-stone-200 text-stone-800 font-bold text-[11px] cursor-pointer"
                            >
                              修改 / 重設
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                );
              })()}
            </div>

            <div className="flex items-center justify-between text-xs text-stone-500 pt-2 border-t border-stone-100">
              <span>共計 {students.length} 位研究生名冊</span>
              <button
                type="button"
                onClick={() => setShowRosterModal(false)}
                className="px-4 py-2 rounded-xl text-xs font-bold bg-stone-900 text-white hover:bg-black cursor-pointer"
              >
                關閉名冊
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
