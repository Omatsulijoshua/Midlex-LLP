"use client";
import React, { useEffect, useState } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';

// Types & Data Schemas
export interface StaffMember {
  id: string;
  name: string;
  email: string;
  role: string;
  department: 'LITIGATION' | 'GENERAL' | 'FINANCE' | 'ADMIN';
  phone: string;
  basicSalary: number;
  courtAllowanceRate: number;
  dateJoined: string;
  status: 'ACTIVE' | 'ON_LEAVE' | 'INACTIVE';
  qualification: string;
  leaveBalance: number;
}

export interface LeaveRequest {
  id: string;
  staffId: string;
  staffName: string;
  department: string;
  leaveType: 'ANNUAL' | 'SICK' | 'MATERNITY' | 'EXAM' | 'COMPASSIONATE';
  startDate: string;
  endDate: string;
  daysCount: number;
  reason: string;
  handoverStaff: string;
  status: 'PENDING' | 'APPROVED' | 'REJECTED';
  appliedDate: string;
  hrComment?: string;
}

export interface AttendanceRecord {
  id: string;
  staffId: string;
  staffName: string;
  department: string;
  date: string;
  clockInTime: string;
  clockOutTime?: string;
  location: 'BENIN_CHAMBERS' | 'HIGH_COURT' | 'MAGISTRATE_COURT' | 'CLIENT_OFFICE' | 'REMOTE';
  status: 'PRESENT' | 'LATE' | 'COURT_APPEARANCE' | 'REMOTE';
  notes?: string;
}

export interface PerformanceReview {
  id: string;
  staffId: string;
  staffName: string;
  reviewPeriod: string;
  draftingScore: number; // 1-5
  courtAdvocacyScore: number; // 1-5
  punctualityScore: number; // 1-5
  clientSatisfactionScore: number; // 1-5
  overallGrade: 'EXCELLENT' | 'VERY_GOOD' | 'GOOD' | 'NEEDS_IMPROVEMENT';
  comments: string;
  reviewer: string;
  date: string;
}

// Initial Seed Data for Midlex HRMS
const defaultStaffList: StaffMember[] = [
  {
    id: 'stf-001',
    name: 'Samson Sabbat',
    email: 'samson@midlex.com',
    role: 'Lead Senior Partner & Counsel',
    department: 'GENERAL',
    phone: '+234 803 123 4567',
    basicSalary: 650000,
    courtAllowanceRate: 25000,
    dateJoined: '2020-01-15',
    status: 'ACTIVE',
    qualification: 'LL.B (Hons), BL, Senior Advocate',
    leaveBalance: 18,
  },
  {
    id: 'stf-002',
    name: 'Omatsuli Joshua',
    email: 'joshua@midlex.com',
    role: 'Managing Partner (Litigation Lead)',
    department: 'LITIGATION',
    phone: '+234 812 987 6543',
    basicSalary: 600000,
    courtAllowanceRate: 25000,
    dateJoined: '2020-03-01',
    status: 'ACTIVE',
    qualification: 'LL.B (Hons), BL, FCIArb',
    leaveBalance: 15,
  },
  {
    id: 'stf-003',
    name: 'Osasere Ighodaro',
    email: 'osasere@midlex.com',
    role: 'Senior Associate Advocate',
    department: 'LITIGATION',
    phone: '+234 705 444 3322',
    basicSalary: 420000,
    courtAllowanceRate: 15000,
    dateJoined: '2021-06-10',
    status: 'ACTIVE',
    qualification: 'LL.B, BL (Benin Bar)',
    leaveBalance: 12,
  },
  {
    id: 'stf-004',
    name: 'Efe Grace',
    email: 'efe.grace@midlex.com',
    role: 'Head of Finance & Accounts',
    department: 'FINANCE',
    phone: '+234 802 333 1122',
    basicSalary: 380000,
    courtAllowanceRate: 0,
    dateJoined: '2021-09-01',
    status: 'ACTIVE',
    qualification: 'B.Sc Accounting, ICAN',
    leaveBalance: 20,
  },
  {
    id: 'stf-005',
    name: 'Blessing Enoma',
    email: 'blessing@midlex.com',
    role: 'HR & Administrative Officer',
    department: 'ADMIN',
    phone: '+234 814 555 7788',
    basicSalary: 320000,
    courtAllowanceRate: 0,
    dateJoined: '2022-02-14',
    status: 'ACTIVE',
    qualification: 'B.Sc Public Admin, ACIPM',
    leaveBalance: 22,
  },
];

const defaultLeaves: LeaveRequest[] = [
  {
    id: 'lve-101',
    staffId: 'stf-003',
    staffName: 'Osasere Ighodaro',
    department: 'LITIGATION',
    leaveType: 'ANNUAL',
    startDate: '2026-10-05',
    endDate: '2026-10-16',
    daysCount: 10,
    reason: 'Annual family vacation and rest period following High Court trials.',
    handoverStaff: 'Omatsuli Joshua',
    status: 'PENDING',
    appliedDate: '2026-09-24',
  },
  {
    id: 'lve-102',
    staffId: 'stf-004',
    staffName: 'Efe Grace',
    department: 'FINANCE',
    leaveType: 'SICK',
    startDate: '2026-09-20',
    endDate: '2026-09-22',
    daysCount: 2,
    reason: 'Medical checkup and treatment at Benin Specialist Clinic.',
    handoverStaff: 'Blessing Enoma',
    status: 'APPROVED',
    appliedDate: '2026-09-19',
    hrComment: 'Approved based on doctor report attached.',
  },
];

const defaultAttendance: AttendanceRecord[] = [
  {
    id: 'att-501',
    staffId: 'stf-001',
    staffName: 'Samson Sabbat',
    department: 'GENERAL',
    date: new Date().toISOString().split('T')[0],
    clockInTime: '08:15 AM',
    location: 'BENIN_CHAMBERS',
    status: 'PRESENT',
    notes: 'Reviewing realty title deeds',
  },
  {
    id: 'att-502',
    staffId: 'stf-002',
    staffName: 'Omatsuli Joshua',
    department: 'LITIGATION',
    date: new Date().toISOString().split('T')[0],
    clockInTime: '08:45 AM',
    location: 'HIGH_COURT',
    status: 'COURT_APPEARANCE',
    notes: 'High Court Benin City — Motion for Stay of Execution',
  },
];

const defaultReviews: PerformanceReview[] = [
  {
    id: 'rev-01',
    staffId: 'stf-001',
    staffName: 'Samson Sabbat',
    reviewPeriod: 'Q3 2026 Review',
    draftingScore: 5,
    courtAdvocacyScore: 5,
    punctualityScore: 5,
    clientSatisfactionScore: 5,
    overallGrade: 'EXCELLENT',
    comments: 'Exceptional leadership in commercial property & general dispute resolution.',
    reviewer: 'HR Director',
    date: '2026-09-15',
  },
  {
    id: 'rev-02',
    staffId: 'stf-003',
    staffName: 'Osasere Ighodaro',
    reviewPeriod: 'Q3 2026 Review',
    draftingScore: 4,
    courtAdvocacyScore: 5,
    punctualityScore: 4,
    clientSatisfactionScore: 4,
    overallGrade: 'VERY_GOOD',
    comments: 'Strong performance in Appellate litigation briefs.',
    reviewer: 'HR Director',
    date: '2026-09-18',
  },
];

export default function HRMSDashboard() {
  const router = useRouter();
  const [currentUser, setCurrentUser] = useState<any>(null);
  const [activeTab, setActiveTab] = useState<'OVERVIEW' | 'STAFF' | 'LEAVES' | 'ATTENDANCE' | 'APPRAISALS' | 'PAYROLL'>('OVERVIEW');

  // HR Data State
  const [staffList, setStaffList] = useState<StaffMember[]>([]);
  const [leaves, setLeaves] = useState<LeaveRequest[]>([]);
  const [attendance, setAttendance] = useState<AttendanceRecord[]>([]);
  const [reviews, setReviews] = useState<PerformanceReview[]>([]);

  // Modals
  const [isAddStaffOpen, setIsAddStaffOpen] = useState(false);
  const [isApplyLeaveOpen, setIsApplyLeaveOpen] = useState(false);
  const [isAppraisalModalOpen, setIsAppraisalModalOpen] = useState(false);

  // Form State - Add Staff
  const [newStaff, setNewStaff] = useState({
    name: '',
    email: '',
    role: 'Associate Solicitor',
    department: 'LITIGATION' as const,
    phone: '',
    basicSalary: 350000,
    courtAllowanceRate: 15000,
    qualification: 'LL.B, BL',
  });

  // Form State - Leave Application
  const [leaveForm, setLeaveForm] = useState({
    leaveType: 'ANNUAL' as const,
    startDate: '',
    endDate: '',
    reason: '',
    handoverStaff: 'Omatsuli Joshua',
  });

  // Form State - Appraisal
  const [appraisalForm, setAppraisalForm] = useState({
    staffId: '',
    draftingScore: 5,
    courtAdvocacyScore: 5,
    punctualityScore: 5,
    clientSatisfactionScore: 5,
    comments: '',
  });

  // Load User & Local Storage Data
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const savedUser = localStorage.getItem('midlex_hrms_user');
      if (!savedUser) {
        router.push('/');
        return;
      }
      setCurrentUser(JSON.parse(savedUser));

      // Staff
      const savedStaff = localStorage.getItem('midlex_hrms_staff');
      if (savedStaff) {
        try { setStaffList(JSON.parse(savedStaff)); } catch (e) { setStaffList(defaultStaffList); }
      } else {
        setStaffList(defaultStaffList);
        localStorage.setItem('midlex_hrms_staff', JSON.stringify(defaultStaffList));
      }

      // Leaves
      const savedLeaves = localStorage.getItem('midlex_hrms_leaves');
      if (savedLeaves) {
        try { setLeaves(JSON.parse(savedLeaves)); } catch (e) { setLeaves(defaultLeaves); }
      } else {
        setLeaves(defaultLeaves);
        localStorage.setItem('midlex_hrms_leaves', JSON.stringify(defaultLeaves));
      }

      // Attendance
      const savedAtt = localStorage.getItem('midlex_hrms_attendance');
      if (savedAtt) {
        try { setAttendance(JSON.parse(savedAtt)); } catch (e) { setAttendance(defaultAttendance); }
      } else {
        setAttendance(defaultAttendance);
        localStorage.setItem('midlex_hrms_attendance', JSON.stringify(defaultAttendance));
      }

      // Reviews
      const savedRev = localStorage.getItem('midlex_hrms_reviews');
      if (savedRev) {
        try { setReviews(JSON.parse(savedRev)); } catch (e) { setReviews(defaultReviews); }
      } else {
        setReviews(defaultReviews);
        localStorage.setItem('midlex_hrms_reviews', JSON.stringify(defaultReviews));
      }
    }
  }, [router]);

  const saveStaffData = (newList: StaffMember[]) => {
    setStaffList(newList);
    if (typeof window !== 'undefined') {
      localStorage.setItem('midlex_hrms_staff', JSON.stringify(newList));
    }
  };

  const saveLeaveData = (newList: LeaveRequest[]) => {
    setLeaves(newList);
    if (typeof window !== 'undefined') {
      localStorage.setItem('midlex_hrms_leaves', JSON.stringify(newList));
    }
  };

  const saveAttendanceData = (newList: AttendanceRecord[]) => {
    setAttendance(newList);
    if (typeof window !== 'undefined') {
      localStorage.setItem('midlex_hrms_attendance', JSON.stringify(newList));
    }
  };

  const saveReviewsData = (newList: PerformanceReview[]) => {
    setReviews(newList);
    if (typeof window !== 'undefined') {
      localStorage.setItem('midlex_hrms_reviews', JSON.stringify(newList));
    }
  };

  // Actions
  const handleAddStaff = (e: React.FormEvent) => {
    e.preventDefault();
    const created: StaffMember = {
      id: `stf-${Date.now()}`,
      name: newStaff.name,
      email: newStaff.email,
      role: newStaff.role,
      department: newStaff.department,
      phone: newStaff.phone || '+234 800 000 0000',
      basicSalary: Number(newStaff.basicSalary),
      courtAllowanceRate: Number(newStaff.courtAllowanceRate),
      dateJoined: new Date().toISOString().split('T')[0],
      status: 'ACTIVE',
      qualification: newStaff.qualification,
      leaveBalance: 20,
    };
    saveStaffData([...staffList, created]);
    setIsAddStaffOpen(false);
    setNewStaff({
      name: '',
      email: '',
      role: 'Associate Solicitor',
      department: 'LITIGATION',
      phone: '',
      basicSalary: 350000,
      courtAllowanceRate: 15000,
      qualification: 'LL.B, BL',
    });
  };

  const handleApplyLeave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!leaveForm.startDate || !leaveForm.endDate) {
      alert('Please select start and end dates');
      return;
    }
    const start = new Date(leaveForm.startDate);
    const end = new Date(leaveForm.endDate);
    const diffTime = Math.abs(end.getTime() - start.getTime());
    const days = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1;

    const newLeave: LeaveRequest = {
      id: `lve-${Date.now()}`,
      staffId: currentUser?.email || 'staff-me',
      staffName: currentUser?.name || 'Samson Sabbat',
      department: currentUser?.department || 'LITIGATION',
      leaveType: leaveForm.leaveType,
      startDate: leaveForm.startDate,
      endDate: leaveForm.endDate,
      daysCount: days > 0 ? days : 1,
      reason: leaveForm.reason,
      handoverStaff: leaveForm.handoverStaff,
      status: 'PENDING',
      appliedDate: new Date().toISOString().split('T')[0],
    };

    saveLeaveData([newLeave, ...leaves]);
    setIsApplyLeaveOpen(false);
    setLeaveForm({
      leaveType: 'ANNUAL',
      startDate: '',
      endDate: '',
      reason: '',
      handoverStaff: 'Omatsuli Joshua',
    });
    alert('Your leave application has been submitted for HR Approval!');
  };

  const handleUpdateLeaveStatus = (id: string, newStatus: 'APPROVED' | 'REJECTED', hrComment?: string) => {
    const updated = leaves.map((l) =>
      l.id === id ? { ...l, status: newStatus, hrComment: hrComment || (newStatus === 'APPROVED' ? 'Approved by HR' : 'Declined') } : l
    );
    saveLeaveData(updated);
  };

  const handleClockIn = (location: AttendanceRecord['location']) => {
    const todayStr = new Date().toISOString().split('T')[0];
    const timeNowStr = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

    // Check if already clocked in today
    const existingIndex = attendance.findIndex(
      (a) => a.staffName === currentUser?.name && a.date === todayStr
    );

    if (existingIndex >= 0) {
      alert(`You have already clocked in today at ${attendance[existingIndex].clockInTime}!`);
      return;
    }

    const newRecord: AttendanceRecord = {
      id: `att-${Date.now()}`,
      staffId: currentUser?.email || 'staff-me',
      staffName: currentUser?.name || 'Samson Sabbat',
      department: currentUser?.department || 'LITIGATION',
      date: todayStr,
      clockInTime: timeNowStr,
      location,
      status: location === 'HIGH_COURT' || location === 'MAGISTRATE_COURT' ? 'COURT_APPEARANCE' : 'PRESENT',
      notes: `Clocked in at ${location.replace('_', ' ')}`,
    };

    saveAttendanceData([newRecord, ...attendance]);
    alert(`Clocked In successfully at ${timeNowStr}!`);
  };

  const handleClockOut = () => {
    const todayStr = new Date().toISOString().split('T')[0];
    const timeNowStr = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

    const updated = attendance.map((a) => {
      if (a.staffName === currentUser?.name && a.date === todayStr) {
        return { ...a, clockOutTime: timeNowStr };
      }
      return a;
    });

    saveAttendanceData(updated);
    alert(`Clocked Out successfully at ${timeNowStr}!`);
  };

  const handleAddAppraisal = (e: React.FormEvent) => {
    e.preventDefault();
    const targetStaff = staffList.find((s) => s.id === appraisalForm.staffId);
    if (!targetStaff) {
      alert('Please select a staff member');
      return;
    }

    const avg =
      (appraisalForm.draftingScore +
        appraisalForm.courtAdvocacyScore +
        appraisalForm.punctualityScore +
        appraisalForm.clientSatisfactionScore) / 4;

    let grade: PerformanceReview['overallGrade'] = 'EXCELLENT';
    if (avg < 3) grade = 'NEEDS_IMPROVEMENT';
    else if (avg < 4) grade = 'GOOD';
    else if (avg < 4.8) grade = 'VERY_GOOD';

    const newReview: PerformanceReview = {
      id: `rev-${Date.now()}`,
      staffId: targetStaff.id,
      staffName: targetStaff.name,
      reviewPeriod: `Q3 ${new Date().getFullYear()} Evaluation`,
      draftingScore: appraisalForm.draftingScore,
      courtAdvocacyScore: appraisalForm.courtAdvocacyScore,
      punctualityScore: appraisalForm.punctualityScore,
      clientSatisfactionScore: appraisalForm.clientSatisfactionScore,
      overallGrade: grade,
      comments: appraisalForm.comments || 'Evaluated performance meets firm standards.',
      reviewer: currentUser?.name || 'HR Director',
      date: new Date().toISOString().split('T')[0],
    };

    saveReviewsData([newReview, ...reviews]);
    setIsAppraisalModalOpen(false);
  };

  const handleLogout = () => {
    if (typeof window !== 'undefined') {
      localStorage.removeItem('midlex_hrms_user');
      router.push('/');
    }
  };

  if (!currentUser) return null;

  const isHRAdmin = currentUser.role === 'HR_ADMIN';

  // Metrics
  const activeStaffCount = staffList.filter((s) => s.status === 'ACTIVE').length;
  const pendingLeavesCount = leaves.filter((l) => l.status === 'PENDING').length;
  const todayAttendanceCount = attendance.filter((a) => a.date === new Date().toISOString().split('T')[0]).length;
  const totalPayroll = staffList.reduce((acc, s) => acc + s.basicSalary, 0);

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans">
      {/* Top Navigation Bar */}
      <header className="bg-slate-900/90 border-b border-slate-800 sticky top-0 z-40 backdrop-blur-xl">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="p-2 rounded-xl bg-slate-800 border border-slate-700">
              <Image src="/logo.jpg" alt="Midlex" width={130} height={40} className="h-9 w-auto object-contain" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-sm font-black tracking-tight text-white">MIDLEX HRMS</span>
                <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider ${
                  isHRAdmin ? 'bg-amber-500/20 text-amber-400 border border-amber-500/30' : 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                }`}>
                  {isHRAdmin ? '👑 HR Admin Dashboard' : '⚖️ Staff Self-Service'}
                </span>
              </div>
              <p className="text-[11px] text-slate-400 font-medium">
                Logged in as <strong className="text-white">{currentUser.name}</strong> ({currentUser.email})
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => {
                const nextRole = isHRAdmin ? 'STAFF' : 'HR_ADMIN';
                const nextUser = {
                  role: nextRole,
                  email: nextRole === 'HR_ADMIN' ? 'hr@midlex.com' : 'samson@midlex.com',
                  name: nextRole === 'HR_ADMIN' ? 'Midlex HR Director' : 'Samson Sabbat',
                  department: nextRole === 'HR_ADMIN' ? 'HUMAN_RESOURCES' : 'GENERAL',
                };
                localStorage.setItem('midlex_hrms_user', JSON.stringify(nextUser));
                setCurrentUser(nextUser);
              }}
              className="hidden sm:inline-flex px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold rounded-xl border border-slate-700 transition-all"
            >
              🔄 Switch to {isHRAdmin ? 'Staff View' : 'HR Admin View'}
            </button>
            <button
              onClick={handleLogout}
              className="px-4 py-2 bg-red-500/10 hover:bg-red-500/20 text-red-400 text-xs font-bold rounded-xl border border-red-500/30 transition-all"
            >
              🚪 Exit HRMS
            </button>
          </div>
        </div>
      </header>

      {/* Main Container */}
      <main className="max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-8 flex-1 space-y-8">
        {/* Navigation Tabs */}
        <div className="flex flex-wrap items-center gap-2 border-b border-slate-800 pb-4">
          {[
            { id: 'OVERVIEW', label: '📊 HR Overview & Metrics' },
            { id: 'STAFF', label: `👥 Staff Directory (${staffList.length})` },
            { id: 'LEAVES', label: `📅 Leave Approvals (${pendingLeavesCount} Pending)` },
            { id: 'ATTENDANCE', label: '🕒 Daily Clock-In & Attendance' },
            { id: 'APPRAISALS', label: '⭐ Performance Appraisals' },
            { id: 'PAYROLL', label: '💰 Payroll & Allowances' },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`px-5 py-3 rounded-2xl text-xs font-bold uppercase tracking-wider transition-all ${
                activeTab === tab.id
                  ? 'bg-amber-500 text-slate-950 shadow-lg shadow-amber-500/20 font-black'
                  : 'bg-slate-900 text-slate-400 hover:bg-slate-800 hover:text-white border border-slate-800'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* TAB 1: OVERVIEW & METRICS */}
        {activeTab === 'OVERVIEW' && (
          <div className="space-y-8">
            {/* Staff Quick Clock In Card (For Staff View) */}
            {!isHRAdmin && (
              <div className="p-6 sm:p-8 rounded-3xl bg-gradient-to-r from-slate-900 via-amber-950/30 to-slate-900 border border-amber-500/30 shadow-2xl flex flex-col md:flex-row items-center justify-between gap-6">
                <div>
                  <span className="px-3 py-1 bg-amber-500/20 text-amber-400 text-[10px] font-black uppercase tracking-widest rounded-full border border-amber-500/30">
                    DAILY WORKPLACE CLOCK-IN
                  </span>
                  <h2 className="text-2xl font-black text-white mt-2">Good Day, {currentUser.name}!</h2>
                  <p className="text-xs text-slate-300 mt-1">
                    Record your attendance check-in for court proceedings, chamber duties, or remote legal work.
                  </p>
                </div>
                <div className="flex flex-wrap items-center gap-3">
                  <button
                    onClick={() => handleClockIn('BENIN_CHAMBERS')}
                    className="px-5 py-3 bg-amber-500 hover:bg-amber-600 text-slate-950 font-black text-xs rounded-xl shadow-lg transition-all"
                  >
                    🏢 Clock In (Chambers)
                  </button>
                  <button
                    onClick={() => handleClockIn('HIGH_COURT')}
                    className="px-5 py-3 bg-emerald-500 hover:bg-emerald-600 text-slate-950 font-black text-xs rounded-xl shadow-lg transition-all"
                  >
                    ⚖️ Clock In (High Court)
                  </button>
                  <button
                    onClick={handleClockOut}
                    className="px-5 py-3 bg-slate-800 hover:bg-slate-700 text-white font-bold text-xs rounded-xl border border-slate-700 transition-all"
                  >
                    🚪 Clock Out
                  </button>
                </div>
              </div>
            )}

            {/* Metrics Grid */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6">
              <div className="bg-slate-900 p-6 rounded-3xl border border-slate-800">
                <div className="text-amber-400 text-2xl font-black mb-1">{activeStaffCount}</div>
                <div className="text-xs font-bold text-slate-300 uppercase tracking-wider">Active Staff Members</div>
                <div className="text-[11px] text-slate-500 mt-1">Lawyers &amp; Administrative</div>
              </div>

              <div className="bg-slate-900 p-6 rounded-3xl border border-slate-800">
                <div className="text-amber-400 text-2xl font-black mb-1">{pendingLeavesCount}</div>
                <div className="text-xs font-bold text-slate-300 uppercase tracking-wider">Pending Leave Applications</div>
                <div className="text-[11px] text-slate-500 mt-1">Awaiting HR Review</div>
              </div>

              <div className="bg-slate-900 p-6 rounded-3xl border border-slate-800">
                <div className="text-emerald-400 text-2xl font-black mb-1">{todayAttendanceCount} / {staffList.length}</div>
                <div className="text-xs font-bold text-slate-300 uppercase tracking-wider">Clocked In Today</div>
                <div className="text-[11px] text-slate-500 mt-1">Daily Attendance Tracker</div>
              </div>

              <div className="bg-slate-900 p-6 rounded-3xl border border-slate-800">
                <div className="text-amber-400 text-2xl font-black mb-1">₦{(totalPayroll / 1000000).toFixed(2)}M</div>
                <div className="text-xs font-bold text-slate-300 uppercase tracking-wider">Monthly Base Payroll</div>
                <div className="text-[11px] text-slate-500 mt-1">Midlex Legal Practice</div>
              </div>
            </div>

            {/* Quick Actions & Recent Leaves */}
            <div className="grid lg:grid-cols-3 gap-8">
              <div className="lg:col-span-2 bg-slate-900 p-6 sm:p-8 rounded-3xl border border-slate-800 space-y-6">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-lg font-black text-white">Recent Leave Requests</h3>
                    <p className="text-xs text-slate-400">Track and manage employee leave approvals</p>
                  </div>
                  <button
                    onClick={() => setIsApplyLeaveOpen(true)}
                    className="px-4 py-2.5 bg-amber-500 hover:bg-amber-600 text-slate-950 font-black text-xs rounded-xl transition-all shadow-md"
                  >
                    + Apply for Leave
                  </button>
                </div>

                <div className="space-y-4">
                  {leaves.length > 0 ? (
                    leaves.slice(0, 4).map((l) => (
                      <div key={l.id} className="p-4 bg-slate-950 rounded-2xl border border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                        <div>
                          <div className="flex items-center gap-2 mb-1">
                            <span className="font-bold text-white text-sm">{l.staffName}</span>
                            <span className="px-2 py-0.5 bg-slate-800 text-slate-300 text-[10px] font-bold rounded-md">
                              {l.leaveType} LEAVE ({l.daysCount} Days)
                            </span>
                          </div>
                          <p className="text-xs text-slate-400">{l.reason}</p>
                          <p className="text-[11px] text-slate-500 mt-1">
                            📅 {l.startDate} to {l.endDate} • Handover: <strong>{l.handoverStaff}</strong>
                          </p>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className={`px-3 py-1 rounded-full text-xs font-black uppercase ${
                            l.status === 'APPROVED' ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30' :
                            l.status === 'REJECTED' ? 'bg-red-500/20 text-red-400 border border-red-500/30' :
                            'bg-amber-500/20 text-amber-400 border border-amber-500/30'
                          }`}>
                            {l.status}
                          </span>
                          {isHRAdmin && l.status === 'PENDING' && (
                            <div className="flex items-center gap-1">
                              <button
                                onClick={() => handleUpdateLeaveStatus(l.id, 'APPROVED')}
                                className="px-3 py-1 bg-emerald-500 hover:bg-emerald-600 text-slate-950 font-bold text-xs rounded-lg transition-all"
                              >
                                Approve
                              </button>
                              <button
                                onClick={() => handleUpdateLeaveStatus(l.id, 'REJECTED')}
                                className="px-3 py-1 bg-red-500 hover:bg-red-600 text-white font-bold text-xs rounded-lg transition-all"
                              >
                                Reject
                              </button>
                            </div>
                          )}
                        </div>
                      </div>
                    ))
                  ) : (
                    <p className="text-xs text-slate-500 italic py-6 text-center">No leave applications recorded yet.</p>
                  )}
                </div>
              </div>

              {/* Today's Attendance Overview */}
              <div className="bg-slate-900 p-6 sm:p-8 rounded-3xl border border-slate-800 space-y-6">
                <div>
                  <h3 className="text-lg font-black text-white">Today's Clock-Ins</h3>
                  <p className="text-xs text-slate-400">Live attendance log</p>
                </div>

                <div className="space-y-3">
                  {attendance.length > 0 ? (
                    attendance.map((att) => (
                      <div key={att.id} className="p-3.5 bg-slate-950 rounded-xl border border-slate-800 flex items-center justify-between">
                        <div>
                          <div className="text-xs font-bold text-white">{att.staffName}</div>
                          <div className="text-[11px] text-slate-400">
                            {att.clockInTime} • {att.location.replace('_', ' ')}
                          </div>
                        </div>
                        <span className="px-2.5 py-1 bg-emerald-500/10 text-emerald-400 text-[10px] font-black uppercase rounded-md border border-emerald-500/20">
                          {att.status}
                        </span>
                      </div>
                    ))
                  ) : (
                    <p className="text-xs text-slate-500 italic py-8 text-center">No clock-in records for today yet.</p>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* TAB 2: STAFF DIRECTORY */}
        {activeTab === 'STAFF' && (
          <div className="bg-slate-900 p-6 sm:p-8 rounded-3xl border border-slate-800 space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h3 className="text-xl font-black text-white">Midlex Staff Directory</h3>
                <p className="text-xs text-slate-400">Legal advocates, partners, solicitors, finance &amp; administration</p>
              </div>
              {isHRAdmin && (
                <button
                  onClick={() => setIsAddStaffOpen(true)}
                  className="px-5 py-3 bg-amber-500 hover:bg-amber-600 text-slate-950 font-black text-xs uppercase tracking-wider rounded-xl transition-all shadow-lg shadow-amber-500/20"
                >
                  + Add New Staff Member
                </button>
              )}
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-slate-800 text-[11px] font-black text-slate-400 uppercase tracking-wider">
                    <th className="py-3 px-4">Staff Name &amp; Role</th>
                    <th className="py-3 px-4">Department</th>
                    <th className="py-3 px-4">Qualification</th>
                    <th className="py-3 px-4">Phone &amp; Email</th>
                    <th className="py-3 px-4">Basic Salary</th>
                    <th className="py-3 px-4">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800 text-xs">
                  {staffList.map((s) => (
                    <tr key={s.id} className="hover:bg-slate-800/50 transition-colors">
                      <td className="py-4 px-4 font-bold text-white">
                        {s.name}
                        <div className="text-[11px] text-amber-400 font-medium">{s.role}</div>
                      </td>
                      <td className="py-4 px-4">
                        <span className="px-2.5 py-1 bg-slate-800 text-slate-300 font-bold text-[10px] rounded-md">
                          {s.department}
                        </span>
                      </td>
                      <td className="py-4 px-4 text-slate-300">{s.qualification}</td>
                      <td className="py-4 px-4 text-slate-400">
                        {s.email}
                        <div className="text-[11px] text-slate-500">{s.phone}</div>
                      </td>
                      <td className="py-4 px-4 font-bold text-emerald-400">
                        ₦{s.basicSalary.toLocaleString()} / mo
                      </td>
                      <td className="py-4 px-4">
                        <span className="px-2.5 py-1 bg-emerald-500/20 text-emerald-400 text-[10px] font-black uppercase rounded-full border border-emerald-500/30">
                          {s.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* TAB 3: LEAVE APPROVALS */}
        {activeTab === 'LEAVES' && (
          <div className="bg-slate-900 p-6 sm:p-8 rounded-3xl border border-slate-800 space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h3 className="text-xl font-black text-white">Leave Approvals &amp; Applications</h3>
                <p className="text-xs text-slate-400">Annual, Sick, Examination, &amp; Maternity Leaves</p>
              </div>
              <button
                onClick={() => setIsApplyLeaveOpen(true)}
                className="px-5 py-3 bg-amber-500 hover:bg-amber-600 text-slate-950 font-black text-xs uppercase tracking-wider rounded-xl transition-all shadow-lg"
              >
                + Apply for Leave
              </button>
            </div>

            <div className="space-y-4">
              {leaves.map((l) => (
                <div key={l.id} className="p-6 bg-slate-950 rounded-2xl border border-slate-800 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
                  <div className="space-y-1">
                    <div className="flex items-center gap-3">
                      <h4 className="text-base font-black text-white">{l.staffName}</h4>
                      <span className="px-3 py-0.5 bg-amber-500/10 text-amber-400 text-[10px] font-black uppercase rounded-full border border-amber-500/20">
                        {l.leaveType} LEAVE
                      </span>
                    </div>
                    <p className="text-xs text-slate-300 leading-relaxed max-w-2xl">{l.reason}</p>
                    <div className="flex flex-wrap items-center gap-4 text-[11px] text-slate-400 pt-1">
                      <span>📅 Dates: <strong>{l.startDate}</strong> to <strong>{l.endDate}</strong> ({l.daysCount} Days)</span>
                      <span>🤝 Handover Partner: <strong>{l.handoverStaff}</strong></span>
                      <span>Department: <strong>{l.department}</strong></span>
                    </div>
                  </div>

                  <div className="flex flex-col items-end gap-3">
                    <span className={`px-4 py-1.5 rounded-full text-xs font-black uppercase tracking-wider ${
                      l.status === 'APPROVED' ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30' :
                      l.status === 'REJECTED' ? 'bg-red-500/20 text-red-400 border border-red-500/30' :
                      'bg-amber-500/20 text-amber-400 border border-amber-500/30'
                    }`}>
                      {l.status}
                    </span>
                    {isHRAdmin && l.status === 'PENDING' && (
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => handleUpdateLeaveStatus(l.id, 'APPROVED')}
                          className="px-4 py-2 bg-emerald-500 hover:bg-emerald-600 text-slate-950 font-black text-xs rounded-xl shadow-md transition-all"
                        >
                          Approve Application
                        </button>
                        <button
                          onClick={() => handleUpdateLeaveStatus(l.id, 'REJECTED')}
                          className="px-4 py-2 bg-red-500 hover:bg-red-600 text-white font-bold text-xs rounded-xl transition-all"
                        >
                          Decline
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 4: ATTENDANCE */}
        {activeTab === 'ATTENDANCE' && (
          <div className="bg-slate-900 p-6 sm:p-8 rounded-3xl border border-slate-800 space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h3 className="text-xl font-black text-white">Daily Attendance &amp; Timesheets</h3>
                <p className="text-xs text-slate-400">Track court appearances and chamber check-ins</p>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => handleClockIn('BENIN_CHAMBERS')}
                  className="px-4 py-2.5 bg-amber-500 hover:bg-amber-600 text-slate-950 font-black text-xs rounded-xl shadow-md transition-all"
                >
                  Clock In (Chambers)
                </button>
                <button
                  onClick={() => handleClockIn('HIGH_COURT')}
                  className="px-4 py-2.5 bg-emerald-500 hover:bg-emerald-600 text-slate-950 font-black text-xs rounded-xl shadow-md transition-all"
                >
                  Clock In (Court)
                </button>
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-slate-800 text-[11px] font-black text-slate-400 uppercase tracking-wider">
                    <th className="py-3 px-4">Date &amp; Staff Member</th>
                    <th className="py-3 px-4">Department</th>
                    <th className="py-3 px-4">Clock In Time</th>
                    <th className="py-3 px-4">Clock Out Time</th>
                    <th className="py-3 px-4">Location</th>
                    <th className="py-3 px-4">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800 text-xs">
                  {attendance.map((att) => (
                    <tr key={att.id} className="hover:bg-slate-800/50 transition-colors">
                      <td className="py-4 px-4 font-bold text-white">
                        {att.staffName}
                        <div className="text-[11px] text-slate-500">{att.date}</div>
                      </td>
                      <td className="py-4 px-4 text-slate-300">{att.department}</td>
                      <td className="py-4 px-4 text-emerald-400 font-bold">{att.clockInTime}</td>
                      <td className="py-4 px-4 text-amber-400 font-bold">{att.clockOutTime || 'Active Session'}</td>
                      <td className="py-4 px-4 text-slate-300">{att.location.replace('_', ' ')}</td>
                      <td className="py-4 px-4">
                        <span className="px-2.5 py-1 bg-emerald-500/20 text-emerald-400 text-[10px] font-black uppercase rounded-full border border-emerald-500/30">
                          {att.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* TAB 5: APPRAISALS */}
        {activeTab === 'APPRAISALS' && (
          <div className="bg-slate-900 p-6 sm:p-8 rounded-3xl border border-slate-800 space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h3 className="text-xl font-black text-white">Staff Performance Appraisals</h3>
                <p className="text-xs text-slate-400">Legal advocacy ratings, drafting quality &amp; client care reviews</p>
              </div>
              {isHRAdmin && (
                <button
                  onClick={() => setIsAppraisalModalOpen(true)}
                  className="px-5 py-3 bg-amber-500 hover:bg-amber-600 text-slate-950 font-black text-xs uppercase tracking-wider rounded-xl transition-all shadow-lg"
                >
                  + Create Performance Appraisal
                </button>
              )}
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              {reviews.map((rev) => (
                <div key={rev.id} className="p-6 bg-slate-950 rounded-2xl border border-slate-800 space-y-4">
                  <div className="flex justify-between items-start">
                    <div>
                      <h4 className="text-lg font-black text-white">{rev.staffName}</h4>
                      <p className="text-xs text-amber-400 font-bold">{rev.reviewPeriod}</p>
                    </div>
                    <span className="px-3 py-1 bg-amber-500/20 text-amber-300 text-xs font-black uppercase rounded-full border border-amber-500/30">
                      {rev.overallGrade}
                    </span>
                  </div>

                  <div className="grid grid-cols-2 gap-3 text-xs bg-slate-900/60 p-3 rounded-xl border border-slate-800/80">
                    <div>
                      <span className="text-slate-400 block text-[10px] uppercase font-bold">Legal Drafting</span>
                      <span className="font-bold text-white">⭐ {rev.draftingScore} / 5</span>
                    </div>
                    <div>
                      <span className="text-slate-400 block text-[10px] uppercase font-bold">Court Advocacy</span>
                      <span className="font-bold text-white">⭐ {rev.courtAdvocacyScore} / 5</span>
                    </div>
                    <div>
                      <span className="text-slate-400 block text-[10px] uppercase font-bold">Punctuality</span>
                      <span className="font-bold text-white">⭐ {rev.punctualityScore} / 5</span>
                    </div>
                    <div>
                      <span className="text-slate-400 block text-[10px] uppercase font-bold">Client Care</span>
                      <span className="font-bold text-white">⭐ {rev.clientSatisfactionScore} / 5</span>
                    </div>
                  </div>

                  <p className="text-xs text-slate-300 italic">"{rev.comments}"</p>
                  <p className="text-[11px] text-slate-500 border-t border-slate-900 pt-2">
                    Evaluated by {rev.reviewer} on {rev.date}
                  </p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 6: PAYROLL */}
        {activeTab === 'PAYROLL' && (
          <div className="bg-slate-900 p-6 sm:p-8 rounded-3xl border border-slate-800 space-y-6">
            <div>
              <h3 className="text-xl font-black text-white">Midlex Monthly Payroll Summary</h3>
              <p className="text-xs text-slate-400">Basic salaries, court appearance allowances, and net payouts</p>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-slate-800 text-[11px] font-black text-slate-400 uppercase tracking-wider">
                    <th className="py-3 px-4">Staff Member</th>
                    <th className="py-3 px-4">Department</th>
                    <th className="py-3 px-4">Basic Salary</th>
                    <th className="py-3 px-4">Court Allowance Rate</th>
                    <th className="py-3 px-4">Estimated Monthly Net</th>
                    <th className="py-3 px-4">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800 text-xs">
                  {staffList.map((s) => (
                    <tr key={s.id} className="hover:bg-slate-800/50 transition-colors">
                      <td className="py-4 px-4 font-bold text-white">
                        {s.name}
                        <div className="text-[11px] text-slate-500">{s.role}</div>
                      </td>
                      <td className="py-4 px-4 text-slate-300">{s.department}</td>
                      <td className="py-4 px-4 font-bold text-amber-400">₦{s.basicSalary.toLocaleString()}</td>
                      <td className="py-4 px-4 text-slate-300">₦{s.courtAllowanceRate.toLocaleString()} / appearance</td>
                      <td className="py-4 px-4 font-bold text-emerald-400">₦{(s.basicSalary + s.courtAllowanceRate * 4).toLocaleString()}</td>
                      <td className="py-4 px-4">
                        <button
                          onClick={() => alert(`Generating official Midlex Payslip for ${s.name}...`)}
                          className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold rounded-lg border border-slate-700 transition-all"
                        >
                          📄 Export Payslip
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </main>

      {/* MODAL: Add Staff Member */}
      <AnimatePresence>
        {isAddStaffOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md">
            <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }} className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 max-w-lg w-full space-y-4 shadow-2xl">
              <h3 className="text-xl font-black text-white">Add New Staff Member</h3>
              <form onSubmit={handleAddStaff} className="space-y-4 text-xs">
                <div>
                  <label className="block text-slate-400 font-bold uppercase mb-1">Full Name</label>
                  <input type="text" required value={newStaff.name} onChange={(e) => setNewStaff({ ...newStaff, name: e.target.value })} className="w-full p-3 bg-slate-950 border border-slate-800 rounded-xl text-white" placeholder="e.g. Barr. Victor Omogbae" />
                </div>
                <div>
                  <label className="block text-slate-400 font-bold uppercase mb-1">Email</label>
                  <input type="email" required value={newStaff.email} onChange={(e) => setNewStaff({ ...newStaff, email: e.target.value })} className="w-full p-3 bg-slate-950 border border-slate-800 rounded-xl text-white" placeholder="victor@midlex.com" />
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-slate-400 font-bold uppercase mb-1">Department</label>
                    <select value={newStaff.department} onChange={(e) => setNewStaff({ ...newStaff, department: e.target.value as any })} className="w-full p-3 bg-slate-950 border border-slate-800 rounded-xl text-white">
                      <option value="LITIGATION">Litigation</option>
                      <option value="GENERAL">General / Property</option>
                      <option value="FINANCE">Finance</option>
                      <option value="ADMIN">Administrative</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-slate-400 font-bold uppercase mb-1">Role Title</label>
                    <input type="text" required value={newStaff.role} onChange={(e) => setNewStaff({ ...newStaff, role: e.target.value })} className="w-full p-3 bg-slate-950 border border-slate-800 rounded-xl text-white" placeholder="Junior Associate" />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-slate-400 font-bold uppercase mb-1">Basic Monthly Salary (₦)</label>
                    <input type="number" required value={newStaff.basicSalary} onChange={(e) => setNewStaff({ ...newStaff, basicSalary: Number(e.target.value) })} className="w-full p-3 bg-slate-950 border border-slate-800 rounded-xl text-white" />
                  </div>
                  <div>
                    <label className="block text-slate-400 font-bold uppercase mb-1">Court Allowance / Day (₦)</label>
                    <input type="number" required value={newStaff.courtAllowanceRate} onChange={(e) => setNewStaff({ ...newStaff, courtAllowanceRate: Number(e.target.value) })} className="w-full p-3 bg-slate-950 border border-slate-800 rounded-xl text-white" />
                  </div>
                </div>
                <div className="flex justify-end gap-3 pt-4 border-t border-slate-800">
                  <button type="button" onClick={() => setIsAddStaffOpen(false)} className="px-4 py-2 bg-slate-800 text-slate-300 font-bold rounded-xl">Cancel</button>
                  <button type="submit" className="px-5 py-2 bg-amber-500 text-slate-950 font-black rounded-xl">Save Staff</button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* MODAL: Apply Leave */}
      <AnimatePresence>
        {isApplyLeaveOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md">
            <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }} className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 max-w-lg w-full space-y-4 shadow-2xl">
              <h3 className="text-xl font-black text-white">Apply for Staff Leave</h3>
              <form onSubmit={handleApplyLeave} className="space-y-4 text-xs">
                <div>
                  <label className="block text-slate-400 font-bold uppercase mb-1">Leave Category</label>
                  <select value={leaveForm.leaveType} onChange={(e) => setLeaveForm({ ...leaveForm, leaveType: e.target.value as any })} className="w-full p-3 bg-slate-950 border border-slate-800 rounded-xl text-white">
                    <option value="ANNUAL">Annual Leave</option>
                    <option value="SICK">Sick Leave</option>
                    <option value="MATERNITY">Maternity Leave</option>
                    <option value="EXAM">Examination Leave</option>
                    <option value="COMPASSIONATE">Compassionate Leave</option>
                  </select>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-slate-400 font-bold uppercase mb-1">Start Date</label>
                    <input type="date" required value={leaveForm.startDate} onChange={(e) => setLeaveForm({ ...leaveForm, startDate: e.target.value })} className="w-full p-3 bg-slate-950 border border-slate-800 rounded-xl text-white" />
                  </div>
                  <div>
                    <label className="block text-slate-400 font-bold uppercase mb-1">End Date</label>
                    <input type="date" required value={leaveForm.endDate} onChange={(e) => setLeaveForm({ ...leaveForm, endDate: e.target.value })} className="w-full p-3 bg-slate-950 border border-slate-800 rounded-xl text-white" />
                  </div>
                </div>
                <div>
                  <label className="block text-slate-400 font-bold uppercase mb-1">Reason for Application</label>
                  <textarea required rows={3} value={leaveForm.reason} onChange={(e) => setLeaveForm({ ...leaveForm, reason: e.target.value })} className="w-full p-3 bg-slate-950 border border-slate-800 rounded-xl text-white" placeholder="Provide details regarding your leave request..." />
                </div>
                <div>
                  <label className="block text-slate-400 font-bold uppercase mb-1">Handover Lawyer / Partner</label>
                  <input type="text" required value={leaveForm.handoverStaff} onChange={(e) => setLeaveForm({ ...leaveForm, handoverStaff: e.target.value })} className="w-full p-3 bg-slate-950 border border-slate-800 rounded-xl text-white" placeholder="Name of colleague holding brief" />
                </div>
                <div className="flex justify-end gap-3 pt-4 border-t border-slate-800">
                  <button type="button" onClick={() => setIsApplyLeaveOpen(false)} className="px-4 py-2 bg-slate-800 text-slate-300 font-bold rounded-xl">Cancel</button>
                  <button type="submit" className="px-5 py-2 bg-amber-500 text-slate-950 font-black rounded-xl">Submit Leave Request</button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* MODAL: Performance Appraisal */}
      <AnimatePresence>
        {isAppraisalModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md">
            <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }} className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 max-w-lg w-full space-y-4 shadow-2xl">
              <h3 className="text-xl font-black text-white">Create Performance Review</h3>
              <form onSubmit={handleAddAppraisal} className="space-y-4 text-xs">
                <div>
                  <label className="block text-slate-400 font-bold uppercase mb-1">Select Staff Member</label>
                  <select required value={appraisalForm.staffId} onChange={(e) => setAppraisalForm({ ...appraisalForm, staffId: e.target.value })} className="w-full p-3 bg-slate-950 border border-slate-800 rounded-xl text-white">
                    <option value="">-- Choose Staff --</option>
                    {staffList.map((s) => (
                      <option key={s.id} value={s.id}>{s.name} ({s.role})</option>
                    ))}
                  </select>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-slate-400 font-bold uppercase mb-1">Legal Drafting (1-5)</label>
                    <input type="number" min={1} max={5} value={appraisalForm.draftingScore} onChange={(e) => setAppraisalForm({ ...appraisalForm, draftingScore: Number(e.target.value) })} className="w-full p-3 bg-slate-950 border border-slate-800 rounded-xl text-white" />
                  </div>
                  <div>
                    <label className="block text-slate-400 font-bold uppercase mb-1">Court Advocacy (1-5)</label>
                    <input type="number" min={1} max={5} value={appraisalForm.courtAdvocacyScore} onChange={(e) => setAppraisalForm({ ...appraisalForm, courtAdvocacyScore: Number(e.target.value) })} className="w-full p-3 bg-slate-950 border border-slate-800 rounded-xl text-white" />
                  </div>
                </div>
                <div>
                  <label className="block text-slate-400 font-bold uppercase mb-1">HR Reviewer Notes &amp; Comments</label>
                  <textarea rows={3} value={appraisalForm.comments} onChange={(e) => setAppraisalForm({ ...appraisalForm, comments: e.target.value })} className="w-full p-3 bg-slate-950 border border-slate-800 rounded-xl text-white" placeholder="Write feedback regarding court performance..." />
                </div>
                <div className="flex justify-end gap-3 pt-4 border-t border-slate-800">
                  <button type="button" onClick={() => setIsAppraisalModalOpen(false)} className="px-4 py-2 bg-slate-800 text-slate-300 font-bold rounded-xl">Cancel</button>
                  <button type="submit" className="px-5 py-2 bg-amber-500 text-slate-950 font-black rounded-xl">Submit Review</button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
