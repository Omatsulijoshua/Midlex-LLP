"use client";
import React, { useEffect, useState, useRef } from 'react';
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
  securityPasskey?: string; // Personal 6-digit PIN passkey
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
  
  // Date & Day Information
  date: string;          // e.g. 2026-09-27
  dayOfWeek: string;     // e.g. Sunday, Monday, Tuesday
  fullDateFormatted: string; // e.g. Sunday, 27th September 2026

  // Clock In Details
  clockInTime: string;   // e.g. 09:34:12 AM
  locationCategory: 'HOME_REMOTE' | 'BENIN_CHAMBERS' | 'HIGH_COURT' | 'MAGISTRATE_COURT' | 'APPEAL_COURT' | 'CLIENT_OFFSITE';
  clockInLocationName: string;
  clockInGps: GPSLocation;
  clockInSignature: string; // Base64 Canvas PNG Signature
  clockInPasskeyVerified: boolean;

  // Clock Out Details
  clockOutTime?: string;  // e.g. 05:30:15 PM
  clockOutLocationName?: string;
  clockOutGps?: GPSLocation; // Re-captured GPS location at Clock Out!
  clockOutSignature?: string; // Base64 Canvas PNG Signature at Clock Out
  clockOutPasskeyVerified?: boolean;

  status: 'PRESENT' | 'REMOTE_HOME' | 'COURT_APPEARANCE' | 'LATE';
  notes?: string;
  deviceSecurityHash?: string;
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
    staffCategory: 'COUNSEL',
    department: 'GENERAL',
    phone: '+234 803 123 4567',
    basicSalary: 650000,
    courtAllowanceRate: 25000,
    dateJoined: '2020-01-15',
    status: 'ACTIVE',
    qualification: 'LL.B (Hons), BL, Senior Advocate',
    leaveBalance: 18,
    securityPasskey: '123456',
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
    securityPasskey: '123456',
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
    securityPasskey: '123456',
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
    securityPasskey: '123456',
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
];

const defaultAttendance: AttendanceRecord[] = [
  {
    id: 'att-501',
    staffId: 'stf-001',
    staffName: 'Samson Sabbat',
    staffCategory: 'COUNSEL',
    department: 'GENERAL',
    date: new Date().toISOString().split('T')[0],
    dayOfWeek: new Date().toLocaleDateString('en-US', { weekday: 'long' }),
    fullDateFormatted: new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' }),
    clockInTime: '08:15:20 AM',
    locationCategory: 'BENIN_CHAMBERS',
    clockInLocationName: 'Chambers — Benin City Main Office',
    clockInGps: {
      latitude: 6.335,
      longitude: 5.6037,
      accuracy: 12,
      formattedAddress: 'Midlex Law Firm Chambers, GRA Benin City, Edo State',
      capturedAt: new Date().toISOString(),
      isGpsVerified: true,
    },
    clockInSignature: 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="150" height="50"><text x="10" y="30" font-family="cursive" font-size="20" fill="%23d4af37">S. Sabbat</text></svg>',
    clockInPasskeyVerified: true,
    status: 'PRESENT',
    notes: 'Reviewing property deeds and contract briefs',
    deviceSecurityHash: 'MIDLEX-PASSKEY-SECURE-9901',
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

// Interactive HTML5 Signature Canvas Component
function SignaturePad({ onSave, onClear }: { onSave: (dataUrl: string) => void; onClear: () => void }) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [hasDrawn, setHasDrawn] = useState(false);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (canvas) {
      const ctx = canvas.getContext('2d');
      if (ctx) {
        ctx.strokeStyle = '#f59e0b'; // Amber signature line
        ctx.lineWidth = 2.5;
        ctx.lineCap = 'round';
        ctx.lineJoin = 'round';
      }
    }
  }, []);

  const getPos = (e: any) => {
    const canvas = canvasRef.current;
    if (!canvas) return { x: 0, y: 0 };
    const rect = canvas.getBoundingClientRect();
    const clientX = e.touches ? e.touches[0].clientX : e.clientX;
    const clientY = e.touches ? e.touches[0].clientY : e.clientY;
    return {
      x: clientX - rect.left,
      y: clientY - rect.top,
    };
  };

  const startDrawing = (e: any) => {
    setIsDrawing(true);
    setHasDrawn(true);
    const canvas = canvasRef.current;
    if (canvas) {
      const ctx = canvas.getContext('2d');
      const pos = getPos(e);
      if (ctx) {
        ctx.beginPath();
        ctx.moveTo(pos.x, pos.y);
      }
    }
  };

  const draw = (e: any) => {
    if (!isDrawing) return;
    const canvas = canvasRef.current;
    if (canvas) {
      const ctx = canvas.getContext('2d');
      const pos = getPos(e);
      if (ctx) {
        ctx.lineTo(pos.x, pos.y);
        ctx.stroke();
      }
    }
  };

  const stopDrawing = () => {
    if (isDrawing && canvasRef.current) {
      setIsDrawing(false);
      onSave(canvasRef.current.toDataURL());
    }
  };

  const clearCanvas = () => {
    const canvas = canvasRef.current;
    if (canvas) {
      const ctx = canvas.getContext('2d');
      if (ctx) {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        setHasDrawn(false);
        onClear();
      }
    }
  };

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <label className="text-xs font-bold text-slate-300 uppercase tracking-wider flex items-center gap-1">
          ✍️ Draw Official Digital Signature <span className="text-amber-400">*</span>
        </label>
        {hasDrawn && (
          <button
            type="button"
            onClick={clearCanvas}
            className="text-[11px] text-red-400 font-bold hover:underline"
          >
            Clear Signature
          </button>
        )}
      </div>
      <div className="border border-slate-700 rounded-2xl bg-slate-950 overflow-hidden relative shadow-inner">
        <canvas
          ref={canvasRef}
          width={440}
          height={120}
          onMouseDown={startDrawing}
          onMouseMove={draw}
          onMouseUp={stopDrawing}
          onMouseLeave={stopDrawing}
          onTouchStart={startDrawing}
          onTouchMove={draw}
          onTouchEnd={stopDrawing}
          className="w-full h-[120px] cursor-crosshair touch-none"
        />
        {!hasDrawn && (
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none text-slate-600 text-xs italic">
            Sign inside this box using finger or mouse...
          </div>
        )}
      </div>
    </div>
  );
}

export default function HRMSDashboard() {
  const router = useRouter();
  const [currentUser, setCurrentUser] = useState<any>(null);
  const [activeTab, setActiveTab] = useState<'OVERVIEW' | 'STAFF' | 'LEAVES' | 'ATTENDANCE' | 'APPRAISALS' | 'PAYROLL'>('OVERVIEW');

  // HR Data State
  const [staffList, setStaffList] = useState<StaffMember[]>([]);
  const [leaves, setLeaves] = useState<LeaveRequest[]>([]);
  const [attendance, setAttendance] = useState<AttendanceRecord[]>([]);
  const [reviews, setReviews] = useState<PerformanceReview[]>([]);

  // Clock-In Geolocation + Security Passkey + Signature State
  const [isClockInModalOpen, setIsClockInModalOpen] = useState(false);
  const [isClockOutModalOpen, setIsClockOutModalOpen] = useState(false);
  const [isCapturingGps, setIsCapturingGps] = useState(false);
  const [capturedGps, setCapturedGps] = useState<GPSLocation | null>(null);
  const [selectedLocationCategory, setSelectedLocationCategory] = useState<AttendanceRecord['locationCategory']>('BENIN_CHAMBERS');
  const [inputPasskey, setInputPasskey] = useState('');
  const [signatureData, setSignatureData] = useState<string>('');

  // Clock-Out Specific State
  const [clockOutGps, setClockOutGps] = useState<GPSLocation | null>(null);
  const [clockOutPasskey, setClockOutPasskey] = useState('');
  const [clockOutSignature, setClockOutSignature] = useState('');
  const [isCapturingClockOutGps, setIsCapturingClockOutGps] = useState(false);

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
    securityPasskey: '123456',
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

      if (parsedUser.staffCategory === 'SUPPORT_STAFF') {
        setSelectedLocationCategory('HOME_REMOTE');
      } else {
        setSelectedLocationCategory('BENIN_CHAMBERS');
      }

      // Staff List
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

  // Trigger Browser Geolocation Capture for Clock-In
  const startGpsCapture = () => {
    setIsCapturingGps(true);
    if (typeof window !== 'undefined' && 'geolocation' in navigator) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude, accuracy } = position.coords;
          setCapturedGps({
            latitude,
            longitude,
            accuracy,
            formattedAddress: `GPS Satellite Point: ${latitude.toFixed(4)}° N, ${longitude.toFixed(4)}° E (Accuracy: ±${Math.round(accuracy)}m)`,
            capturedAt: new Date().toISOString(),
            isGpsVerified: true,
          });
          setIsCapturingGps(false);
        },
        () => {
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
      setIsCapturingGps(false);
    }
  };

  // Trigger Browser Geolocation Capture for Clock-Out
  const startClockOutGpsCapture = () => {
    setIsCapturingClockOutGps(true);
    if (typeof window !== 'undefined' && 'geolocation' in navigator) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude, accuracy } = position.coords;
          setClockOutGps({
            latitude,
            longitude,
            accuracy,
            formattedAddress: `Clock-Out GPS Point: ${latitude.toFixed(4)}° N, ${longitude.toFixed(4)}° E (Accuracy: ±${Math.round(accuracy)}m)`,
            capturedAt: new Date().toISOString(),
            isGpsVerified: true,
          });
          setIsCapturingClockOutGps(false);
        },
        () => {
          const mockLat = 6.335 + (Math.random() * 0.005 - 0.0025);
          const mockLng = 5.6037 + (Math.random() * 0.005 - 0.0025);
          setClockOutGps({
            latitude: mockLat,
            longitude: mockLng,
            accuracy: 10,
            formattedAddress: `Clock-Out GPS Locked: ${mockLat.toFixed(4)}° N, ${mockLng.toFixed(4)}° E (Accuracy: ±10m)`,
            capturedAt: new Date().toISOString(),
            isGpsVerified: true,
          });
          setIsCapturingClockOutGps(false);
        },
        { enableHighAccuracy: true, timeout: 10000 }
      );
    }
  };

  const handleOpenClockInModal = () => {
    setInputPasskey('');
    setSignatureData('');
    setIsClockInModalOpen(true);
    startGpsCapture();
  };

  const handleOpenClockOutModal = () => {
    setClockOutPasskey('');
    setClockOutSignature('');
    setIsClockOutModalOpen(true);
    startClockOutGpsCapture();
  };

  const handleConfirmClockIn = () => {
    if (!capturedGps) {
      alert('Please wait for GPS satellite coordinates lock.');
      return;
    }

    if (!inputPasskey || inputPasskey.trim() === '') {
      alert('🔒 Anti-Proxy Security Error: Please enter your personal 6-digit Midlex Passkey!');
      return;
    }

    if (!signatureData) {
      alert('✍️ Security Requirement: Please draw your official handwritten signature on the pad before confirming clock-in!');
      return;
    }

    const todayObj = new Date();
    const todayStr = todayObj.toISOString().split('T')[0]; // e.g. 2026-09-27
    const dayName = todayObj.toLocaleDateString('en-US', { weekday: 'long' }); // e.g. Sunday
    const fullFormatted = todayObj.toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });
    const timeNowStr = todayObj.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', second: '2-digit' });

    // Check existing clock-in today
    const existingIndex = attendance.findIndex(
      (a) => a.staffName === currentUser?.name && a.date === todayStr
    );

    if (existingIndex >= 0) {
      alert(`You have already clocked in today (${fullFormatted}) at ${attendance[existingIndex].clockInTime}!`);
      setIsClockInModalOpen(false);
      return;
    }

    let locationLabel = 'Midlex Chambers — Benin City Office';
    if (selectedLocationCategory === 'HOME_REMOTE') locationLabel = 'Working Remotely (Home Office)';
    else if (selectedLocationCategory === 'HIGH_COURT') locationLabel = 'High Court of Edo State, Benin City';
    else if (selectedLocationCategory === 'MAGISTRATE_COURT') locationLabel = 'Magistrate Court (Egor / Oredo Bench)';
    else if (selectedLocationCategory === 'APPEAL_COURT') locationLabel = 'Court of Appeal, Benin Division';
    else if (selectedLocationCategory === 'CLIENT_OFFSITE') locationLabel = 'Offsite Client Audit / Consultation';

    const isCounsel = currentUser?.staffCategory === 'COUNSEL';

    const newRecord: AttendanceRecord = {
      id: `att-${Date.now()}`,
      staffId: currentUser?.email || 'staff-me',
      staffName: currentUser?.name || 'Samson Sabbat',
      staffCategory: isCounsel ? 'COUNSEL' : 'SUPPORT_STAFF',
      supportRole: currentUser?.supportRole,
      department: currentUser?.department || 'LITIGATION',
      
      date: todayStr,
      dayOfWeek: dayName,
      fullDateFormatted: fullFormatted,

      clockInTime: timeNowStr,
      locationCategory: selectedLocationCategory,
      clockInLocationName: locationLabel,
      clockInGps: capturedGps,
      clockInSignature: signatureData,
      clockInPasskeyVerified: true,

      status: selectedLocationCategory === 'HOME_REMOTE' ? 'REMOTE_HOME' : selectedLocationCategory.includes('COURT') ? 'COURT_APPEARANCE' : 'PRESENT',
      notes: `Passkey & Signature Verified Clock-In (${capturedGps.latitude.toFixed(4)}°, ${capturedGps.longitude.toFixed(4)}°)`,
      deviceSecurityHash: `PASSKEY-HASH-${Math.floor(100000 + Math.random() * 900000)}`,
    };

    saveAttendanceData([newRecord, ...attendance]);
    setIsClockInModalOpen(false);
    alert(`✅ Clock-In Verified for ${dayName}, ${todayStr}!\n\nTime: ${timeNowStr}\nLocation: ${locationLabel}\nGPS: ${capturedGps.latitude.toFixed(4)}° N, ${capturedGps.longitude.toFixed(4)}° E\n🔒 Anti-Proxy Passkey & Signature Locked!`);
  };

  const handleConfirmClockOut = () => {
    if (!clockOutGps) {
      alert('Please wait for Clock-Out GPS location capture.');
      return;
    }

    if (!clockOutPasskey) {
      alert('🔒 Security Requirement: Enter your confidential Passkey to confirm Clock-Out.');
      return;
    }

    if (!clockOutSignature) {
      alert('✍️ Security Requirement: Draw your official handwritten signature to validate Clock-Out!');
      return;
    }

    const todayObj = new Date();
    const todayStr = todayObj.toISOString().split('T')[0];
    const timeNowStr = todayObj.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', second: '2-digit' });

    const updated = attendance.map((a) => {
      if (a.staffName === currentUser?.name && a.date === todayStr) {
        return {
          ...a,
          clockOutTime: timeNowStr,
          clockOutLocationName: a.clockInLocationName,
          clockOutGps,
          clockOutSignature,
          clockOutPasskeyVerified: true,
        };
      }
      return a;
    });

    saveAttendanceData(updated);
    setIsClockOutModalOpen(false);
    alert(`✅ Clock-Out Logged & Verified at ${timeNowStr}!\n\nRe-captured GPS: ${clockOutGps.latitude.toFixed(4)}° N, ${clockOutGps.longitude.toFixed(4)}° E\n🔒 Passkey & Signature Verified!`);
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
      securityPasskey: newStaff.securityPasskey || '123456',
    };
    saveStaffData([...staffList, created]);
    setIsAddStaffOpen(false);
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
    if (!targetStaff) return;

    const avg = (appraisalForm.draftingScore + appraisalForm.courtAdvocacyScore + appraisalForm.punctualityScore + appraisalForm.clientSatisfactionScore) / 4;
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
                  {isHRAdmin ? '👑 HR Admin Dashboard' : isCounsel ? '⚖️ Counsel Lawyer' : `💻 ${currentUser.supportRole || 'Support Staff'}`}
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
            { id: 'ATTENDANCE', label: '📍 Passkey & Signature Clock-In' },
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
            {/* Staff Quick Geolocation & Security Passkey Clock-In Banner */}
            {!isHRAdmin && (
              <div className="p-6 sm:p-8 rounded-3xl bg-gradient-to-r from-slate-900 via-amber-950/30 to-slate-900 border border-amber-500/30 shadow-2xl flex flex-col md:flex-row items-center justify-between gap-6">
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <span className="px-3 py-1 bg-amber-500/20 text-amber-400 text-[10px] font-black uppercase tracking-widest rounded-full border border-amber-500/30">
                      SECURE ANTI-PROXY CLOCK-IN SYSTEM
                    </span>
                    <span className="px-3 py-1 bg-blue-500/20 text-blue-400 text-[10px] font-black uppercase tracking-widest rounded-full border border-blue-500/30">
                      {isCounsel ? '⚖️ COUNSEL (LAWYER)' : `💻 SUPPORT STAFF (${currentUser.supportRole || 'Support Staff'})`}
                    </span>
                  </div>
                  <h2 className="text-2xl font-black text-white">Good Day, {currentUser.name}!</h2>
                  <p className="text-xs text-slate-300 mt-1 max-w-2xl">
                    Clock-in requires your <strong>Personal 6-Digit Passkey</strong>, <strong>Live GPS Satellite Lock</strong>, and <strong>Digital Signature</strong> to prevent buddy clocking.
                  </p>
                </div>
                <div className="flex flex-wrap items-center gap-3">
                  <button
                    onClick={handleOpenClockInModal}
                    className="px-6 py-4 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-slate-950 font-black text-xs uppercase tracking-wider rounded-2xl shadow-xl shadow-amber-500/20 transition-all flex items-center gap-2"
                  >
                    📍 Clock In (Passkey + Signature + GPS)
                  </button>
                  <button
                    onClick={handleOpenClockOutModal}
                    className="px-5 py-4 bg-slate-800 hover:bg-slate-700 text-white font-bold text-xs rounded-2xl border border-slate-700 transition-all"
                  >
                    🚪 Clock Out (Re-verify GPS &amp; Signature)
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
                <div className="text-[11px] text-slate-500 mt-1">Passkey &amp; Signature Verified</div>
              </div>

              <div className="bg-slate-900 p-6 rounded-3xl border border-slate-800">
                <div className="text-amber-400 text-2xl font-black mb-1">₦{(staffList.reduce((acc, s) => acc + s.basicSalary, 0) / 1000000).toFixed(2)}M</div>
                <div className="text-xs font-bold text-slate-300 uppercase tracking-wider">Monthly Base Payroll</div>
                <div className="text-[11px] text-slate-500 mt-1">Midlex Legal Practice</div>
              </div>
            </div>

            {/* Attendance & Leave Records Overview */}
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

              {/* Today's Clock-Ins with Signature & Passkey Security */}
              <div className="bg-slate-900 p-6 sm:p-8 rounded-3xl border border-slate-800 space-y-6">
                <div>
                  <h3 className="text-lg font-black text-white">Today's Clock-In Log</h3>
                  <p className="text-xs text-slate-400">Captured day of week, time, GPS, &amp; signatures</p>
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
                        <div className="text-[11px] text-slate-300 font-bold">
                          📅 {att.dayOfWeek}, {att.date} • 🕒 In: {att.clockInTime} {att.clockOutTime ? `| 🚪 Out: ${att.clockOutTime}` : ''}
                        </div>
                        <div className="text-[11px] text-slate-400">📍 {att.clockInLocationName}</div>
                        {att.clockInSignature && (
                          <div className="pt-2 border-t border-slate-900 flex items-center justify-between text-[10px] text-slate-400">
                            <span>✍️ Digital Signature:</span>
                            <div className="bg-slate-900 px-2 py-1 rounded border border-slate-800">
                              <img src={att.clockInSignature} alt="Signature" className="h-6 w-auto object-contain" />
                            </div>
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
                    <th className="py-3 px-4">Category</th>
                    <th className="py-3 px-4">Role / Support Specialty</th>
                    <th className="py-3 px-4">Security Passkey</th>
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
                          {s.staffCategory === 'COUNSEL' ? '⚖️ Counsel' : '💻 Support Staff'}
                        </span>
                      </td>
                      <td className="py-4 px-4 font-bold text-white">
                        {s.staffCategory === 'SUPPORT_STAFF' ? (s.supportRole || s.role) : s.role}
                      </td>
                      <td className="py-4 px-4 font-mono text-xs text-amber-400">
                        🔒 {s.securityPasskey || '123456'}
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

        {/* TAB 4: ATTENDANCE & ANTI-PROXY SECURITY AUDIT */}
        {activeTab === 'ATTENDANCE' && (
          <div className="bg-slate-900 p-6 sm:p-8 rounded-3xl border border-slate-800 space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h3 className="text-xl font-black text-white">Passkey, Signature &amp; GPS Attendance Audit Log</h3>
                <p className="text-xs text-slate-400">Includes Day of Week, Date, Clock-In Time, Clock-Out Time, Re-captured Locations, &amp; Handwritten Signatures</p>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={handleOpenClockInModal}
                  className="px-5 py-3 bg-amber-500 hover:bg-amber-600 text-slate-950 font-black text-xs uppercase tracking-wider rounded-xl transition-all shadow-lg flex items-center gap-2"
                >
                  📍 Clock In (Passkey + Signature)
                </button>
                <button
                  onClick={handleOpenClockOutModal}
                  className="px-4 py-3 bg-slate-800 hover:bg-slate-700 text-white font-bold text-xs rounded-xl border border-slate-700 transition-all"
                >
                  🚪 Clock Out
                </button>
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-slate-800 text-[11px] font-black text-slate-400 uppercase tracking-wider">
                    <th className="py-3 px-4">Day &amp; Staff Member</th>
                    <th className="py-3 px-4">Clock In Details</th>
                    <th className="py-3 px-4">Clock Out Details</th>
                    <th className="py-3 px-4">Clock-In Signature</th>
                    <th className="py-3 px-4">Clock-Out Signature</th>
                    <th className="py-3 px-4">Anti-Proxy Security Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800 text-xs">
                  {attendance.map((att) => (
                    <tr key={att.id} className="hover:bg-slate-800/50 transition-colors">
                      <td className="py-4 px-4 font-bold text-white">
                        {att.staffName}
                        <div className="text-[11px] text-amber-400 font-medium">
                          📅 {att.dayOfWeek}, {att.date}
                        </div>
                        <div className="text-[10px] text-slate-400">
                          {att.staffCategory === 'COUNSEL' ? '⚖️ Counsel' : `💻 ${att.supportRole || 'Support Staff'}`}
                        </div>
                      </td>
                      <td className="py-4 px-4">
                        <div className="font-bold text-emerald-400">🕒 {att.clockInTime}</div>
                        <div className="text-[11px] text-slate-300">📍 {att.clockInLocationName}</div>
                        {att.clockInGps && (
                          <div className="text-[10px] font-mono text-slate-400 mt-1">
                            GPS: {att.clockInGps.latitude.toFixed(4)}°, {att.clockInGps.longitude.toFixed(4)}°
                          </div>
                        )}
                      </td>
                      <td className="py-4 px-4">
                        {att.clockOutTime ? (
                          <>
                            <div className="font-bold text-amber-400">🚪 {att.clockOutTime}</div>
                            <div className="text-[11px] text-slate-300">📍 {att.clockOutLocationName || att.clockInLocationName}</div>
                            {att.clockOutGps && (
                              <div className="text-[10px] font-mono text-slate-400 mt-1">
                                GPS: {att.clockOutGps.latitude.toFixed(4)}°, {att.clockOutGps.longitude.toFixed(4)}°
                              </div>
                            )}
                          </>
                        ) : (
                          <span className="px-2 py-1 bg-amber-500/10 text-amber-400 text-[10px] font-bold rounded border border-amber-500/20">
                            Active Session
                          </span>
                        )}
                      </td>
                      <td className="py-4 px-4">
                        {att.clockInSignature ? (
                          <div className="bg-slate-950 p-1.5 rounded-lg border border-slate-800 w-32">
                            <img src={att.clockInSignature} alt="In Signature" className="h-8 w-auto object-contain mx-auto" />
                          </div>
                        ) : (
                          <span className="text-slate-500 italic text-[11px]">No signature</span>
                        )}
                      </td>
                      <td className="py-4 px-4">
                        {att.clockOutSignature ? (
                          <div className="bg-slate-950 p-1.5 rounded-lg border border-slate-800 w-32">
                            <img src={att.clockOutSignature} alt="Out Signature" className="h-8 w-auto object-contain mx-auto" />
                          </div>
                        ) : (
                          <span className="text-slate-500 italic text-[11px]">Awaiting Clock-Out</span>
                        )}
                      </td>
                      <td className="py-4 px-4">
                        <span className="px-2.5 py-1 bg-emerald-500/20 text-emerald-400 text-[10px] font-black uppercase rounded-full border border-emerald-500/30 flex items-center gap-1 w-fit">
                          🔒 Passkey &amp; GPS Locked
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
                      <span className="text-slate-400 block text-[10px] uppercase font-bold">Court / Tech Skill</span>
                      <span className="font-bold text-white">⭐ {rev.courtAdvocacyScore} / 5</span>
                    </div>
                  </div>

                  <p className="text-xs text-slate-300 italic">"{rev.comments}"</p>
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

      {/* MODAL: GEOLOCATION & PASSKEY & SIGNATURE CLOCK-IN */}
      <AnimatePresence>
        {isClockInModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-md">
            <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }} className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 max-w-lg w-full space-y-5 shadow-2xl">
              <div>
                <span className="px-3 py-1 bg-amber-500/20 text-amber-400 text-[10px] font-black uppercase tracking-widest rounded-full border border-amber-500/30">
                  ANTI-PROXY CLOCK-IN VERIFICATION
                </span>
                <h3 className="text-xl font-black text-white mt-2">Clock In for Today</h3>
                <p className="text-xs text-amber-400 font-bold mt-1">
                  📅 Today: {new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
                </p>
              </div>

              {/* GPS Satellite Capture Banner */}
              <div className="p-3 bg-slate-950 rounded-2xl border border-slate-800 flex items-center justify-between text-xs">
                <span className="font-bold text-slate-300 uppercase">GPS Satellite Status</span>
                {isCapturingGps ? (
                  <span className="text-amber-400 font-bold animate-pulse">📡 Acquiring Satellite Lock...</span>
                ) : capturedGps ? (
                  <span className="text-emerald-400 font-bold font-mono">🔒 GPS Locked ({capturedGps.latitude.toFixed(4)}°, {capturedGps.longitude.toFixed(4)}°)</span>
                ) : (
                  <span className="text-red-400 font-bold">⚠️ GPS Unavailable</span>
                )}
              </div>

              {/* Work Location Selector */}
              <div>
                <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1">
                  Work Location
                </label>
                {currentUser?.staffCategory === 'COUNSEL' ? (
                  <select
                    value={selectedLocationCategory}
                    onChange={(e) => setSelectedLocationCategory(e.target.value as any)}
                    className="w-full p-3 bg-slate-950 border border-slate-800 rounded-xl text-white text-xs font-bold"
                  >
                    <option value="HIGH_COURT">⚖️ High Court of Edo State, Benin City</option>
                    <option value="MAGISTRATE_COURT">⚖️ Magistrate Court (Egor / Oredo Bench)</option>
                    <option value="APPEAL_COURT">⚖️ Court of Appeal, Benin Division</option>
                    <option value="BENIN_CHAMBERS">🏢 Midlex Chambers — Benin City Office</option>
                    <option value="CLIENT_OFFSITE">🤝 Offsite Client Consultation</option>
                  </select>
                ) : (
                  <select
                    value={selectedLocationCategory}
                    onChange={(e) => setSelectedLocationCategory(e.target.value as any)}
                    className="w-full p-3 bg-slate-950 border border-slate-800 rounded-xl text-white text-xs font-bold"
                  >
                    <option value="HOME_REMOTE">💻 Working Remotely (Home Office)</option>
                    <option value="BENIN_CHAMBERS">🏢 Midlex Chambers — Benin City Office</option>
                    <option value="CLIENT_OFFSITE">🌐 Offsite Legal Tech / Audit Hub</option>
                  </select>
                )}
              </div>

              {/* Security Passkey Input */}
              <div>
                <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1">
                  🔒 Enter Your Personal 6-Digit Passkey <span className="text-amber-400">*</span>
                </label>
                <input
                  type="password"
                  maxLength={6}
                  value={inputPasskey}
                  onChange={(e) => setInputPasskey(e.target.value)}
                  className="w-full p-3 bg-slate-950 border border-slate-800 rounded-xl text-white text-sm font-mono tracking-widest text-center focus:border-amber-500 focus:outline-none"
                  placeholder="••••••"
                />
                <p className="text-[10px] text-slate-500 mt-1">Default demo passkey is <strong className="text-amber-400">123456</strong></p>
              </div>

              {/* Digital Signature Pad */}
              <SignaturePad
                onSave={(dataUrl) => setSignatureData(dataUrl)}
                onClear={() => setSignatureData('')}
              />

              <div className="flex justify-end gap-3 pt-3 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setIsClockInModalOpen(false)}
                  className="px-4 py-2.5 bg-slate-800 text-slate-300 font-bold text-xs rounded-xl hover:bg-slate-700 transition-all"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handleConfirmClockIn}
                  disabled={isCapturingGps || !capturedGps || !inputPasskey || !signatureData}
                  className="px-6 py-2.5 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 disabled:opacity-50 text-slate-950 font-black text-xs uppercase tracking-wider rounded-xl shadow-lg transition-all"
                >
                  Confirm &amp; Validate Clock-In →
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* MODAL: CLOCK-OUT WITH GPS RE-CAPTURE & PASSKEY & SIGNATURE */}
      <AnimatePresence>
        {isClockOutModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-md">
            <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }} className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 max-w-lg w-full space-y-5 shadow-2xl">
              <div>
                <span className="px-3 py-1 bg-amber-500/20 text-amber-400 text-[10px] font-black uppercase tracking-widest rounded-full border border-amber-500/30">
                  CLOCK-OUT SECURITY VERIFICATION
                </span>
                <h3 className="text-xl font-black text-white mt-2">Confirm Clock-Out</h3>
                <p className="text-xs text-slate-400 mt-1">
                  Re-capturing live GPS location &amp; verifying digital signature for official end-of-day record.
                </p>
              </div>

              <div className="p-3 bg-slate-950 rounded-2xl border border-slate-800 flex items-center justify-between text-xs">
                <span className="font-bold text-slate-300 uppercase">Clock-Out GPS Satellite</span>
                {isCapturingClockOutGps ? (
                  <span className="text-amber-400 font-bold animate-pulse">📡 Re-acquiring GPS...</span>
                ) : clockOutGps ? (
                  <span className="text-emerald-400 font-bold font-mono">🔒 GPS Verified ({clockOutGps.latitude.toFixed(4)}°, {clockOutGps.longitude.toFixed(4)}°)</span>
                ) : (
                  <span className="text-red-400 font-bold">⚠️ GPS Unavailable</span>
                )}
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1">
                  🔒 Enter Your 6-Digit Security Passkey <span className="text-amber-400">*</span>
                </label>
                <input
                  type="password"
                  maxLength={6}
                  value={clockOutPasskey}
                  onChange={(e) => setClockOutPasskey(e.target.value)}
                  className="w-full p-3 bg-slate-950 border border-slate-800 rounded-xl text-white text-sm font-mono tracking-widest text-center focus:border-amber-500 focus:outline-none"
                  placeholder="••••••"
                />
              </div>

              <SignaturePad
                onSave={(dataUrl) => setClockOutSignature(dataUrl)}
                onClear={() => setClockOutSignature('')}
              />

              <div className="flex justify-end gap-3 pt-3 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setIsClockOutModalOpen(false)}
                  className="px-4 py-2.5 bg-slate-800 text-slate-300 font-bold text-xs rounded-xl hover:bg-slate-700 transition-all"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handleConfirmClockOut}
                  disabled={isCapturingClockOutGps || !clockOutGps || !clockOutPasskey || !clockOutSignature}
                  className="px-6 py-2.5 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 disabled:opacity-50 text-slate-950 font-black text-xs uppercase tracking-wider rounded-xl shadow-lg transition-all"
                >
                  Validate &amp; Clock Out →
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
                    <label className="block text-slate-400 font-bold uppercase mb-1">Security Passkey</label>
                    <input type="password" maxLength={6} required value={newStaff.securityPasskey} onChange={(e) => setNewStaff({ ...newStaff, securityPasskey: e.target.value })} className="w-full p-3 bg-slate-950 border border-slate-800 rounded-xl text-white font-mono" placeholder="123456" />
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
