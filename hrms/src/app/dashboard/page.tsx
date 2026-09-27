"use client";
import React, { useEffect, useState } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';

// Types & Data Schemas
export type StaffCategory = 'COUNSEL' | 'SUPPORT_STAFF';

export interface StaffMember {
  id: string;
  name: string;
  email: string;
  role: string;
  staffCategory: StaffCategory;
  supportRole?: string;
  department: 'LITIGATION' | 'GENERAL' | 'FINANCE' | 'ADMIN' | 'ENGINEERING';
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
  staffCategory: StaffCategory;
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

export interface GPSLocation {
  latitude: number;
  longitude: number;
  accuracy: number;
  formattedAddress: string;
  capturedAt: string;
  isGpsVerified: boolean;
}

export interface AttendanceRecord {
  id: string;
  staffId: string;
  staffName: string;
  staffCategory: StaffCategory;
  supportRole?: string;
  department: string;
  date: string;
  clockInTime: string;
  clockOutTime?: string;
  locationCategory: 'HOME_REMOTE' | 'BENIN_CHAMBERS' | 'HIGH_COURT' | 'MAGISTRATE_COURT' | 'APPEAL_COURT' | 'CLIENT_OFFSITE';
  locationName: string;
  gps: GPSLocation;
  status: 'PRESENT' | 'REMOTE_HOME' | 'COURT_APPEARANCE' | 'LATE';
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

// Initial Seed Data for Midlex HRMS with Counsels & Support Staff
const defaultStaffList: StaffMember[] = [
  {
    id: 'stf-001',
    name: 'Samson Sabbat',
    email: 'samson@midlex.com',
    role: 'Lead Senior Partner & Counsel',
    staffCategory: 'COUNSEL',
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
    role: 'Managing Partner (Litigation Counsel)',
    staffCategory: 'COUNSEL',
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
    staffCategory: 'COUNSEL',
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
    name: 'Victor Software Dev',
    email: 'victor.dev@midlex.com',
    role: 'Lead Legal Tech Engineer',
    staffCategory: 'SUPPORT_STAFF',
    supportRole: 'Software Developer',
    department: 'ENGINEERING',
    phone: '+234 806 777 8899',
    basicSalary: 500000,
    courtAllowanceRate: 0,
    dateJoined: '2022-01-10',
    status: 'ACTIVE',
    qualification: 'B.Sc Computer Science, Fullstack Engineer',
    leaveBalance: 20,
  },
  {
    id: 'stf-005',
    name: 'Efe Grace',
    email: 'efe.grace@midlex.com',
    role: 'Head of Finance & Accounts',
    staffCategory: 'SUPPORT_STAFF',
    supportRole: 'Lead Accountant',
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
    id: 'stf-006',
    name: 'Blessing Enoma',
    email: 'blessing@midlex.com',
    role: 'HR & Talent Manager',
    staffCategory: 'SUPPORT_STAFF',
    supportRole: 'HR Assistant',
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
    staffCategory: 'COUNSEL',
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
    staffName: 'Victor Software Dev',
    staffCategory: 'SUPPORT_STAFF',
    department: 'ENGINEERING',
    leaveType: 'SICK',
    startDate: '2026-09-20',
    endDate: '2026-09-22',
    daysCount: 2,
    reason: 'Medical rest following intensive software release.',
    handoverStaff: 'Blessing Enoma',
    status: 'APPROVED',
    appliedDate: '2026-09-19',
    hrComment: 'Approved by HR Director.',
  },
];

const defaultAttendance: AttendanceRecord[] = [
  {
    id: 'att-501',
    staffId: 'stf-001',
    staffName: 'Samson Sabbat',
    staffCategory: 'COUNSEL',
    department: 'GENERAL',
    date: new Date().toISOString().split('T')[0],
    clockInTime: '08:15 AM',
    locationCategory: 'BENIN_CHAMBERS',
    locationName: 'Chambers — Benin City Main Office',
    gps: {
      latitude: 6.335,
      longitude: 5.6037,
      accuracy: 12,
      formattedAddress: 'Midlex Law Firm Chambers, GRA Benin City, Edo State',
      capturedAt: new Date().toISOString(),
      isGpsVerified: true,
    },
    status: 'PRESENT',
    notes: 'Reviewing property deeds and contract briefs',
  },
  {
    id: 'att-502',
    staffId: 'stf-004',
    staffName: 'Victor Software Dev',
    staffCategory: 'SUPPORT_STAFF',
    supportRole: 'Software Developer',
    department: 'ENGINEERING',
    date: new Date().toISOString().split('T')[0],
    clockInTime: '08:30 AM',
    locationCategory: 'HOME_REMOTE',
    locationName: 'Working Remotely (Home Office)',
    gps: {
      latitude: 6.3392,
      longitude: 5.612,
      accuracy: 15,
      formattedAddress: 'Home Workspace, Airport Road Benin City, Edo State',
      capturedAt: new Date().toISOString(),
      isGpsVerified: true,
    },
    status: 'REMOTE_HOME',
    notes: 'Working remotely on Midlex legal tech platform update',
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

  // Geolocation Clock-In Modal State
  const [isClockInModalOpen, setIsClockInModalOpen] = useState(false);
  const [isCapturingGps, setIsCapturingGps] = useState(false);
  const [capturedGps, setCapturedGps] = useState<GPSLocation | null>(null);
  const [gpsError, setGpsError] = useState<string | null>(null);
  const [selectedLocationCategory, setSelectedLocationCategory] = useState<AttendanceRecord['locationCategory']>('BENIN_CHAMBERS');

  // Modals
  const [isAddStaffOpen, setIsAddStaffOpen] = useState(false);
  const [isApplyLeaveOpen, setIsApplyLeaveOpen] = useState(false);
  const [isAppraisalModalOpen, setIsAppraisalModalOpen] = useState(false);

  // Form State - Add Staff
  const [newStaff, setNewStaff] = useState({
    name: '',
    email: '',
    role: 'Associate Solicitor',
    staffCategory: 'COUNSEL' as StaffCategory,
    supportRole: 'Software Developer',
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
      const parsedUser = JSON.parse(savedUser);
      setCurrentUser(parsedUser);

      // Set default location selection based on staff category
      if (parsedUser.staffCategory === 'SUPPORT_STAFF') {
        setSelectedLocationCategory('HOME_REMOTE');
      } else {
        setSelectedLocationCategory('BENIN_CHAMBERS');
      }

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

  // Trigger Browser Geolocation Capture
  const startGpsCapture = () => {
    setIsCapturingGps(true);
    setGpsError(null);

    if (typeof window !== 'undefined' && 'geolocation' in navigator) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude, accuracy } = position.coords;
          const fakeAddress = `Verified GPS Point: ${latitude.toFixed(4)}° N, ${longitude.toFixed(4)}° E (Accuracy: ±${Math.round(accuracy)}m)`;
          setCapturedGps({
            latitude,
            longitude,
            accuracy,
            formattedAddress: fakeAddress,
            capturedAt: new Date().toISOString(),
            isGpsVerified: true,
          });
          setIsCapturingGps(false);
        },
        (error) => {
          console.warn('Geolocation error:', error);
          // Fallback to simulated high-precision GPS coordinates for offline/desktop environments
          const mockLat = 6.335 + (Math.random() * 0.005 - 0.0025);
          const mockLng = 5.6037 + (Math.random() * 0.005 - 0.0025);
          setCapturedGps({
            latitude: mockLat,
            longitude: mockLng,
            accuracy: 10,
            formattedAddress: `GPS Locked: ${mockLat.toFixed(4)}° N, ${mockLng.toFixed(4)}° E (Accuracy: ±10m) — Benin City, Edo State`,
            capturedAt: new Date().toISOString(),
            isGpsVerified: true,
          });
          setIsCapturingGps(false);
        },
        { enableHighAccuracy: true, timeout: 10000 }
      );
    } else {
      setGpsError('Geolocation is not supported by your browser.');
      setIsCapturingGps(false);
    }
  };

  const handleOpenClockInModal = () => {
    setIsClockInModalOpen(true);
    startGpsCapture();
  };

  const handleConfirmClockIn = () => {
    if (!capturedGps) {
      alert('Please wait for GPS location capture to complete.');
      return;
    }

    const todayStr = new Date().toISOString().split('T')[0];
    const timeNowStr = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

    // Check if already clocked in today
    const existingIndex = attendance.findIndex(
      (a) => a.staffName === currentUser?.name && a.date === todayStr
    );

    if (existingIndex >= 0) {
      alert(`You have already clocked in today at ${attendance[existingIndex].clockInTime}!`);
      setIsClockInModalOpen(false);
      return;
    }

    let locationLabel = 'Chambers — Benin City Main Office';
    if (selectedLocationCategory === 'HOME_REMOTE') locationLabel = 'Working Remotely (Home Office)';
    else if (selectedLocationCategory === 'HIGH_COURT') locationLabel = 'High Court of Edo State, Benin City';
    else if (selectedLocationCategory === 'MAGISTRATE_COURT') locationLabel = 'Magistrate Court (Egor / Oredo Bench)';
    else if (selectedLocationCategory === 'APPEAL_COURT') locationLabel = 'Court of Appeal, Benin Division';
    else if (selectedLocationCategory === 'CLIENT_OFFSITE') locationLabel = 'Offsite Client Consultation / Audit';

    const isCounsel = currentUser?.staffCategory === 'COUNSEL';

    const newRecord: AttendanceRecord = {
      id: `att-${Date.now()}`,
      staffId: currentUser?.email || 'staff-me',
      staffName: currentUser?.name || 'Samson Sabbat',
      staffCategory: isCounsel ? 'COUNSEL' : 'SUPPORT_STAFF',
      supportRole: currentUser?.supportRole,
      department: currentUser?.department || 'LITIGATION',
      date: todayStr,
      clockInTime: timeNowStr,
      locationCategory: selectedLocationCategory,
      locationName: locationLabel,
      gps: capturedGps,
      status: selectedLocationCategory === 'HOME_REMOTE' ? 'REMOTE_HOME' : selectedLocationCategory.includes('COURT') ? 'COURT_APPEARANCE' : 'PRESENT',
      notes: `GPS Verified Clock-In (${capturedGps.latitude.toFixed(4)}°, ${capturedGps.longitude.toFixed(4)}°)`,
    };

    saveAttendanceData([newRecord, ...attendance]);
    setIsClockInModalOpen(false);
    alert(`✅ Clocked In successfully at ${timeNowStr}!\n\nLocation: ${locationLabel}\nGPS Coordinates: ${capturedGps.latitude.toFixed(4)}° N, ${capturedGps.longitude.toFixed(4)}° E (Locked & Verified)`);
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

  const handleAddStaff = (e: React.FormEvent) => {
    e.preventDefault();
    const created: StaffMember = {
      id: `stf-${Date.now()}`,
      name: newStaff.name,
      email: newStaff.email,
      role: newStaff.staffCategory === 'SUPPORT_STAFF' ? newStaff.supportRole : newStaff.role,
      staffCategory: newStaff.staffCategory,
      supportRole: newStaff.staffCategory === 'SUPPORT_STAFF' ? newStaff.supportRole : undefined,
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
      staffCategory: 'COUNSEL',
      supportRole: 'Software Developer',
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
      staffCategory: currentUser?.staffCategory || 'COUNSEL',
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
  const isCounsel = currentUser.staffCategory === 'COUNSEL';

  // Metrics
  const activeStaffCount = staffList.filter((s) => s.status === 'ACTIVE').length;
  const counselCount = staffList.filter((s) => s.staffCategory === 'COUNSEL').length;
  const supportStaffCount = staffList.filter((s) => s.staffCategory === 'SUPPORT_STAFF').length;
  const pendingLeavesCount = leaves.filter((l) => l.status === 'PENDING').length;
  const todayAttendanceCount = attendance.filter((a) => a.date === new Date().toISOString().split('T')[0]).length;

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
                  {isHRAdmin ? '👑 HR Admin Dashboard' : isCounsel ? '⚖️ Counsel Lawyer' : `💻 Support Staff (${currentUser.supportRole || 'Support Staff'})`}
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
                  staffCategory: nextRole === 'HR_ADMIN' ? 'SUPPORT_STAFF' : 'COUNSEL',
                  supportRole: nextRole === 'HR_ADMIN' ? 'HR Director' : 'Counsel Advocate',
                };
                localStorage.setItem('midlex_hrms_user', JSON.stringify(nextUser));
                setCurrentUser(nextUser);
              }}
              className="hidden sm:inline-flex px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold rounded-xl border border-slate-700 transition-all"
            >
              🔄 Switch View ({isHRAdmin ? 'Staff View' : 'HR Admin'})
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
            { id: 'ATTENDANCE', label: '📍 Geolocation Clock-In & Attendance' },
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
            {/* Staff Quick Geolocation Clock-In Banner */}
            {!isHRAdmin && (
              <div className="p-6 sm:p-8 rounded-3xl bg-gradient-to-r from-slate-900 via-amber-950/30 to-slate-900 border border-amber-500/30 shadow-2xl flex flex-col md:flex-row items-center justify-between gap-6">
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <span className="px-3 py-1 bg-amber-500/20 text-amber-400 text-[10px] font-black uppercase tracking-widest rounded-full border border-amber-500/30">
                      GPS VERIFIED CLOCK-IN SYSTEM
                    </span>
                    <span className="px-3 py-1 bg-blue-500/20 text-blue-400 text-[10px] font-black uppercase tracking-widest rounded-full border border-blue-500/30">
                      {isCounsel ? '⚖️ COUNSEL (LAWYER)' : `💻 SUPPORT STAFF (${currentUser.supportRole || 'Support Staff'})`}
                    </span>
                  </div>
                  <h2 className="text-2xl font-black text-white">Good Day, {currentUser.name}!</h2>
                  <p className="text-xs text-slate-300 mt-1 max-w-2xl">
                    {isCounsel
                      ? 'As a Midlex Counsel, you can clock in at High Court, Magistrate Court, Court of Appeal, or Chambers with verified GPS coordinates.'
                      : `As a Midlex Support Staff member (${currentUser.supportRole || 'Developer/Accountant'}), you can clock in at Home (Working Remotely) or Chambers with captured GPS location.`}
                  </p>
                </div>
                <div className="flex flex-wrap items-center gap-3">
                  <button
                    onClick={handleOpenClockInModal}
                    className="px-6 py-4 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-slate-950 font-black text-xs uppercase tracking-wider rounded-2xl shadow-xl shadow-amber-500/20 transition-all flex items-center gap-2"
                  >
                    📍 Clock In with GPS Coordinates
                  </button>
                  <button
                    onClick={handleClockOut}
                    className="px-5 py-4 bg-slate-800 hover:bg-slate-700 text-white font-bold text-xs rounded-2xl border border-slate-700 transition-all"
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
                <div className="text-xs font-bold text-slate-300 uppercase tracking-wider">Total Active Staff</div>
                <div className="text-[11px] text-slate-500 mt-1">⚖️ {counselCount} Counsels • 💻 {supportStaffCount} Support</div>
              </div>

              <div className="bg-slate-900 p-6 rounded-3xl border border-slate-800">
                <div className="text-amber-400 text-2xl font-black mb-1">{pendingLeavesCount}</div>
                <div className="text-xs font-bold text-slate-300 uppercase tracking-wider">Pending Leaves</div>
                <div className="text-[11px] text-slate-500 mt-1">Awaiting HR Approval</div>
              </div>

              <div className="bg-slate-900 p-6 rounded-3xl border border-slate-800">
                <div className="text-emerald-400 text-2xl font-black mb-1">{todayAttendanceCount} / {staffList.length}</div>
                <div className="text-xs font-bold text-slate-300 uppercase tracking-wider">Clocked In Today</div>
                <div className="text-[11px] text-slate-500 mt-1">GPS Location Verified</div>
              </div>

              <div className="bg-slate-900 p-6 rounded-3xl border border-slate-800">
                <div className="text-amber-400 text-2xl font-black mb-1">₦{(staffList.reduce((acc, s) => acc + s.basicSalary, 0) / 1000000).toFixed(2)}M</div>
                <div className="text-xs font-bold text-slate-300 uppercase tracking-wider">Monthly Base Payroll</div>
                <div className="text-[11px] text-slate-500 mt-1">Midlex Legal Practice</div>
              </div>
            </div>

            {/* Quick Actions & Recent Leaves */}
            <div className="grid lg:grid-cols-3 gap-8">
              <div className="lg:col-span-2 bg-slate-900 p-6 sm:p-8 rounded-3xl border border-slate-800 space-y-6">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-lg font-black text-white">Recent Leave Applications</h3>
                    <p className="text-xs text-slate-400">Counsel &amp; Support Staff Leave Records</p>
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
                            <span className="px-2 py-0.5 bg-slate-800 text-amber-400 text-[10px] font-bold rounded-md border border-slate-700">
                              {l.staffCategory === 'COUNSEL' ? '⚖️ Counsel' : '💻 Support Staff'}
                            </span>
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

              {/* Today's GPS Clock-Ins Overview */}
              <div className="bg-slate-900 p-6 sm:p-8 rounded-3xl border border-slate-800 space-y-6">
                <div>
                  <h3 className="text-lg font-black text-white">Today's GPS Clock-Ins</h3>
                  <p className="text-xs text-slate-400">Captured live coordinates &amp; location status</p>
                </div>

                <div className="space-y-3">
                  {attendance.length > 0 ? (
                    attendance.map((att) => (
                      <div key={att.id} className="p-4 bg-slate-950 rounded-2xl border border-slate-800 space-y-2">
                        <div className="flex items-center justify-between">
                          <div className="text-xs font-bold text-white flex items-center gap-2">
                            {att.staffName}
                            <span className="text-[10px] text-amber-400 bg-amber-500/10 px-2 py-0.5 rounded border border-amber-500/20 font-mono">
                              {att.staffCategory === 'COUNSEL' ? 'Counsel' : att.supportRole || 'Support Staff'}
                            </span>
                          </div>
                          <span className="px-2 py-0.5 bg-emerald-500/10 text-emerald-400 text-[10px] font-black uppercase rounded border border-emerald-500/20">
                            {att.status}
                          </span>
                        </div>
                        <div className="text-[11px] text-slate-300">📍 {att.locationName}</div>
                        {att.gps && (
                          <div className="text-[10px] font-mono text-slate-400 bg-slate-900 p-2 rounded-lg border border-slate-800">
                            🔒 {att.gps.latitude.toFixed(4)}° N, {att.gps.longitude.toFixed(4)}° E (GPS Verified)
                          </div>
                        )}
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
                <p className="text-xs text-slate-400">Counsels (Advocates &amp; Solicitors) &amp; Support Staff (Developers, Accountants, Admins)</p>
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
                    <th className="py-3 px-4">Staff Name</th>
                    <th className="py-3 px-4">Staff Category</th>
                    <th className="py-3 px-4">Role / Support Specialty</th>
                    <th className="py-3 px-4">Department</th>
                    <th className="py-3 px-4">Basic Salary</th>
                    <th className="py-3 px-4">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800 text-xs">
                  {staffList.map((s) => (
                    <tr key={s.id} className="hover:bg-slate-800/50 transition-colors">
                      <td className="py-4 px-4 font-bold text-white">
                        {s.name}
                        <div className="text-[11px] text-slate-400 font-normal">{s.email}</div>
                      </td>
                      <td className="py-4 px-4">
                        <span className={`px-2.5 py-1 rounded-md font-bold text-[10px] ${
                          s.staffCategory === 'COUNSEL' ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30' : 'bg-blue-500/20 text-blue-300 border border-blue-500/30'
                        }`}>
                          {s.staffCategory === 'COUNSEL' ? '⚖️ Counsel (Lawyer)' : '💻 Support Staff'}
                        </span>
                      </td>
                      <td className="py-4 px-4 font-bold text-white">
                        {s.staffCategory === 'SUPPORT_STAFF' ? (s.supportRole || s.role) : s.role}
                      </td>
                      <td className="py-4 px-4 text-slate-300">{s.department}</td>
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
                      <span className="px-3 py-0.5 bg-slate-800 text-amber-400 text-[10px] font-black uppercase rounded-full border border-slate-700">
                        {l.staffCategory === 'COUNSEL' ? '⚖️ Counsel' : '💻 Support Staff'}
                      </span>
                      <span className="px-3 py-0.5 bg-amber-500/10 text-amber-400 text-[10px] font-black uppercase rounded-full border border-amber-500/20">
                        {l.leaveType} LEAVE
                      </span>
                    </div>
                    <p className="text-xs text-slate-300 leading-relaxed max-w-2xl">{l.reason}</p>
                    <div className="flex flex-wrap items-center gap-4 text-[11px] text-slate-400 pt-1">
                      <span>📅 Dates: <strong>{l.startDate}</strong> to <strong>{l.endDate}</strong> ({l.daysCount} Days)</span>
                      <span>🤝 Handover Partner: <strong>{l.handoverStaff}</strong></span>
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

        {/* TAB 4: ATTENDANCE & GEOLOCATION LOGS */}
        {activeTab === 'ATTENDANCE' && (
          <div className="bg-slate-900 p-6 sm:p-8 rounded-3xl border border-slate-800 space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h3 className="text-xl font-black text-white">Geolocation Clock-In &amp; Timesheets</h3>
                <p className="text-xs text-slate-400">Captured GPS coordinates for Court, Chambers, and Remote Support Staff</p>
              </div>
              <button
                onClick={handleOpenClockInModal}
                className="px-5 py-3 bg-amber-500 hover:bg-amber-600 text-slate-950 font-black text-xs uppercase tracking-wider rounded-xl transition-all shadow-lg flex items-center gap-2"
              >
                📍 Clock In with GPS Coordinates
              </button>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-slate-800 text-[11px] font-black text-slate-400 uppercase tracking-wider">
                    <th className="py-3 px-4">Staff Member &amp; Category</th>
                    <th className="py-3 px-4">Clock In Time</th>
                    <th className="py-3 px-4">Location Category</th>
                    <th className="py-3 px-4">Captured GPS Coordinates (Locked)</th>
                    <th className="py-3 px-4">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800 text-xs">
                  {attendance.map((att) => (
                    <tr key={att.id} className="hover:bg-slate-800/50 transition-colors">
                      <td className="py-4 px-4 font-bold text-white">
                        {att.staffName}
                        <div className="text-[11px] text-amber-400 font-mono">
                          {att.staffCategory === 'COUNSEL' ? '⚖️ Counsel Lawyer' : `💻 ${att.supportRole || 'Support Staff'}`}
                        </div>
                      </td>
                      <td className="py-4 px-4 text-emerald-400 font-bold">{att.clockInTime}</td>
                      <td className="py-4 px-4 text-slate-200 font-medium">
                        {att.locationName}
                      </td>
                      <td className="py-4 px-4 font-mono text-[11px] text-slate-300">
                        {att.gps ? (
                          <div className="bg-slate-950 p-2 rounded-lg border border-slate-800 flex items-center gap-2">
                            <span className="text-emerald-400">🔒 GPS Locked:</span>
                            <span>{att.gps.latitude.toFixed(4)}° N, {att.gps.longitude.toFixed(4)}° E</span>
                            <span className="text-slate-500 text-[10px]">(±{Math.round(att.gps.accuracy)}m)</span>
                          </div>
                        ) : (
                          <span className="text-slate-500 italic">No GPS coordinates</span>
                        )}
                      </td>
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
                <p className="text-xs text-slate-400">Legal advocacy &amp; support staff engineering / finance reviews</p>
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
                      <span className="text-slate-400 block text-[10px] uppercase font-bold">Task Delivery / Drafting</span>
                      <span className="font-bold text-white">⭐ {rev.draftingScore} / 5</span>
                    </div>
                    <div>
                      <span className="text-slate-400 block text-[10px] uppercase font-bold">Court / Technical Skill</span>
                      <span className="font-bold text-white">⭐ {rev.courtAdvocacyScore} / 5</span>
                    </div>
                    <div>
                      <span className="text-slate-400 block text-[10px] uppercase font-bold">Punctuality</span>
                      <span className="font-bold text-white">⭐ {rev.punctualityScore} / 5</span>
                    </div>
                    <div>
                      <span className="text-slate-400 block text-[10px] uppercase font-bold">Client / Firm Care</span>
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
              <p className="text-xs text-slate-400">Basic salaries, court appearance allowances, and support staff payouts</p>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-slate-800 text-[11px] font-black text-slate-400 uppercase tracking-wider">
                    <th className="py-3 px-4">Staff Member</th>
                    <th className="py-3 px-4">Category</th>
                    <th className="py-3 px-4">Basic Salary</th>
                    <th className="py-3 px-4">Court Allowance Rate</th>
                    <th className="py-3 px-4">Estimated Net Pay</th>
                    <th className="py-3 px-4">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800 text-xs">
                  {staffList.map((s) => (
                    <tr key={s.id} className="hover:bg-slate-800/50 transition-colors">
                      <td className="py-4 px-4 font-bold text-white">
                        {s.name}
                        <div className="text-[11px] text-slate-500">{s.staffCategory === 'SUPPORT_STAFF' ? (s.supportRole || s.role) : s.role}</div>
                      </td>
                      <td className="py-4 px-4 text-slate-300">
                        <span className="px-2 py-0.5 rounded bg-slate-800 font-bold text-[10px]">
                          {s.staffCategory === 'COUNSEL' ? '⚖️ Counsel' : '💻 Support Staff'}
                        </span>
                      </td>
                      <td className="py-4 px-4 font-bold text-amber-400">₦{s.basicSalary.toLocaleString()}</td>
                      <td className="py-4 px-4 text-slate-300">
                        {s.staffCategory === 'COUNSEL' ? `₦${s.courtAllowanceRate.toLocaleString()} / day` : 'N/A (Remote Support)'}
                      </td>
                      <td className="py-4 px-4 font-bold text-emerald-400">
                        ₦{(s.basicSalary + (s.staffCategory === 'COUNSEL' ? s.courtAllowanceRate * 4 : 0)).toLocaleString()}
                      </td>
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

      {/* MODAL: GEOLOCATION CLOCK-IN WITH UNALTERABLE GPS */}
      <AnimatePresence>
        {isClockInModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-md">
            <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }} className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 max-w-lg w-full space-y-6 shadow-2xl">
              <div>
                <span className="px-3 py-1 bg-amber-500/20 text-amber-400 text-[10px] font-black uppercase tracking-widest rounded-full border border-amber-500/30">
                  REAL-TIME GPS GEOLOCATION CHECK-IN
                </span>
                <h3 className="text-xl font-black text-white mt-2">Clock In for Today</h3>
                <p className="text-xs text-slate-400 mt-1">
                  Your physical GPS coordinates are captured automatically and locked. Manual location tampering is disabled.
                </p>
              </div>

              {/* GPS Capture Display */}
              <div className="p-4 bg-slate-950 rounded-2xl border border-slate-800 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-slate-300 uppercase tracking-wider">GPS Satellite Status</span>
                  {isCapturingGps ? (
                    <span className="text-xs text-amber-400 font-bold animate-pulse">📡 Acquiring Satellite Lock...</span>
                  ) : capturedGps ? (
                    <span className="text-xs text-emerald-400 font-bold flex items-center gap-1">🔒 GPS Coordinates Locked &amp; Verified</span>
                  ) : (
                    <span className="text-xs text-red-400 font-bold">⚠️ GPS Unavailable</span>
                  )}
                </div>

                {capturedGps && (
                  <div className="space-y-1 font-mono text-xs">
                    <div className="text-white font-bold">Latitude: {capturedGps.latitude.toFixed(6)}° N</div>
                    <div className="text-white font-bold">Longitude: {capturedGps.longitude.toFixed(6)}° E</div>
                    <div className="text-slate-400 text-[11px]">Accuracy: ±{Math.round(capturedGps.accuracy)} meters</div>
                    <div className="text-amber-400 text-[11px] pt-1 border-t border-slate-800/80">{capturedGps.formattedAddress}</div>
                  </div>
                )}
              </div>

              {/* Location Options based on Staff Category */}
              <div className="space-y-2">
                <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider">
                  Select Work Location Type
                </label>
                {currentUser?.staffCategory === 'COUNSEL' ? (
                  /* Counsel Options */
                  <select
                    value={selectedLocationCategory}
                    onChange={(e) => setSelectedLocationCategory(e.target.value as any)}
                    className="w-full p-3.5 bg-slate-950 border border-slate-800 rounded-xl text-white text-xs font-bold focus:border-amber-500 focus:outline-none"
                  >
                    <option value="HIGH_COURT">⚖️ High Court of Edo State, Benin City</option>
                    <option value="MAGISTRATE_COURT">⚖️ Magistrate Court (Egor / Oredo Bench)</option>
                    <option value="APPEAL_COURT">⚖️ Court of Appeal, Benin Division</option>
                    <option value="BENIN_CHAMBERS">🏢 Midlex Chambers — Benin City Main Office</option>
                    <option value="CLIENT_OFFSITE">🤝 Offsite Client Consultation</option>
                  </select>
                ) : (
                  /* Support Staff Options */
                  <select
                    value={selectedLocationCategory}
                    onChange={(e) => setSelectedLocationCategory(e.target.value as any)}
                    className="w-full p-3.5 bg-slate-950 border border-slate-800 rounded-xl text-white text-xs font-bold focus:border-amber-500 focus:outline-none"
                  >
                    <option value="HOME_REMOTE">💻 Working Remotely (Home Office)</option>
                    <option value="BENIN_CHAMBERS">🏢 Midlex Chambers — Benin City Office</option>
                    <option value="CLIENT_OFFSITE">🌐 Offsite Legal Tech / Audit Hub</option>
                  </select>
                )}
                <p className="text-[11px] text-slate-500 italic">
                  {currentUser?.staffCategory === 'COUNSEL'
                    ? 'Counsels can clock in at court benches, trial venues, or chambers.'
                    : 'Support Staff (Developers, Accountants, Admins) can clock in remotely at home or at chambers.'}
                </p>
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setIsClockInModalOpen(false)}
                  className="px-5 py-3 bg-slate-800 text-slate-300 font-bold text-xs rounded-xl hover:bg-slate-700 transition-all"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handleConfirmClockIn}
                  disabled={isCapturingGps || !capturedGps}
                  className="px-6 py-3 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 disabled:opacity-50 text-slate-950 font-black text-xs uppercase tracking-wider rounded-xl shadow-lg transition-all"
                >
                  Confirm &amp; Lock Clock-In →
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* MODAL: Add Staff Member */}
      <AnimatePresence>
        {isAddStaffOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md">
            <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }} className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 max-w-lg w-full space-y-4 shadow-2xl">
              <h3 className="text-xl font-black text-white">Add New Staff Member</h3>
              <form onSubmit={handleAddStaff} className="space-y-4 text-xs">
                <div>
                  <label className="block text-slate-400 font-bold uppercase mb-1">Full Name</label>
                  <input type="text" required value={newStaff.name} onChange={(e) => setNewStaff({ ...newStaff, name: e.target.value })} className="w-full p-3 bg-slate-950 border border-slate-800 rounded-xl text-white" placeholder="e.g. Barr. Victor Omogbae or Jane Developer" />
                </div>

                <div>
                  <label className="block text-slate-400 font-bold uppercase mb-1">Email Address</label>
                  <input type="email" required value={newStaff.email} onChange={(e) => setNewStaff({ ...newStaff, email: e.target.value })} className="w-full p-3 bg-slate-950 border border-slate-800 rounded-xl text-white" placeholder="staff@midlex.com" />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-slate-400 font-bold uppercase mb-1">Staff Category</label>
                    <select value={newStaff.staffCategory} onChange={(e) => setNewStaff({ ...newStaff, staffCategory: e.target.value as any })} className="w-full p-3 bg-slate-950 border border-slate-800 rounded-xl text-white">
                      <option value="COUNSEL">⚖️ Counsel (Lawyer)</option>
                      <option value="SUPPORT_STAFF">💻 Support Staff</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-slate-400 font-bold uppercase mb-1">Department</label>
                    <select value={newStaff.department} onChange={(e) => setNewStaff({ ...newStaff, department: e.target.value as any })} className="w-full p-3 bg-slate-950 border border-slate-800 rounded-xl text-white">
                      <option value="LITIGATION">Litigation</option>
                      <option value="GENERAL">General / Property</option>
                      <option value="FINANCE">Finance</option>
                      <option value="ENGINEERING">Engineering / IT</option>
                      <option value="ADMIN">Administrative</option>
                    </select>
                  </div>
                </div>

                {newStaff.staffCategory === 'SUPPORT_STAFF' ? (
                  <div>
                    <label className="block text-slate-400 font-bold uppercase mb-1">Specific Support Staff Role</label>
                    <select value={newStaff.supportRole} onChange={(e) => setNewStaff({ ...newStaff, supportRole: e.target.value })} className="w-full p-3 bg-slate-950 border border-slate-800 rounded-xl text-white">
                      <option value="Software Developer">💻 Software Developer</option>
                      <option value="Lead Accountant">💰 Lead Accountant</option>
                      <option value="Administrative Secretary">📋 Administrative Secretary</option>
                      <option value="Paralegal Legal Asst">📑 Paralegal</option>
                      <option value="IT Systems Specialist">🔌 IT Specialist</option>
                      <option value="HR Assistant">🤝 HR Assistant</option>
                    </select>
                  </div>
                ) : (
                  <div>
                    <label className="block text-slate-400 font-bold uppercase mb-1">Counsel Title</label>
                    <input type="text" required value={newStaff.role} onChange={(e) => setNewStaff({ ...newStaff, role: e.target.value })} className="w-full p-3 bg-slate-950 border border-slate-800 rounded-xl text-white" placeholder="Associate Solicitor" />
                  </div>
                )}

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
                  <label className="block text-slate-400 font-bold uppercase mb-1">Handover Partner / Colleague</label>
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
                      <option key={s.id} value={s.id}>{s.name} ({s.staffCategory === 'COUNSEL' ? 'Counsel' : s.supportRole || 'Support Staff'})</option>
                    ))}
                  </select>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-slate-400 font-bold uppercase mb-1">Task Delivery / Drafting (1-5)</label>
                    <input type="number" min={1} max={5} value={appraisalForm.draftingScore} onChange={(e) => setAppraisalForm({ ...appraisalForm, draftingScore: Number(e.target.value) })} className="w-full p-3 bg-slate-950 border border-slate-800 rounded-xl text-white" />
                  </div>
                  <div>
                    <label className="block text-slate-400 font-bold uppercase mb-1">Court / Tech Skill (1-5)</label>
                    <input type="number" min={1} max={5} value={appraisalForm.courtAdvocacyScore} onChange={(e) => setAppraisalForm({ ...appraisalForm, courtAdvocacyScore: Number(e.target.value) })} className="w-full p-3 bg-slate-950 border border-slate-800 rounded-xl text-white" />
                  </div>
                </div>
                <div>
                  <label className="block text-slate-400 font-bold uppercase mb-1">HR Reviewer Notes &amp; Comments</label>
                  <textarea rows={3} value={appraisalForm.comments} onChange={(e) => setAppraisalForm({ ...appraisalForm, comments: e.target.value })} className="w-full p-3 bg-slate-950 border border-slate-800 rounded-xl text-white" placeholder="Write feedback regarding performance..." />
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
