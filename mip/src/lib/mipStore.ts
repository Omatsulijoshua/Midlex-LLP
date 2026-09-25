export type MipRole = 'STUDENT_INTERN' | 'INTERNSHIP_ADMIN' | 'INTERNSHIP_SUPER_ADMIN';

export interface MipUser {
  id: string;
  name: string;
  email: string;
  password?: string;
  role: MipRole;
  internId?: string; // e.g. MIP-2026-001
  institution?: string; // e.g. Nigerian Law School / University Law Faculty
  assignedSupervisor?: string;
  totalHoursLogged?: number;
  startDate?: string;
  status: 'ACTIVE' | 'COMPLETED' | 'SUSPENDED';
  createdAt: string;
}

export type LogbookStatus = 'PENDING' | 'APPROVED' | 'REVISION_REQUESTED';

export interface MipLogbookEntry {
  id: string;
  internId: string;
  internName: string;
  internEmail: string;
  date: string; // YYYY-MM-DD
  hoursLogged: number;
  chamberActivity: string; // Court proceedings attended, legal research done, client interview observation
  legalLearningsText: string; // Key principles learned (e.g., Section 135 Evidence Act 2011 burden of proof)
  tasksCompleted: string;
  attachmentUrl?: string; // Scanned page or draft document attachment
  status: LogbookStatus;
  supervisorNotes?: string;
  reviewedBy?: string;
  reviewedAt?: string;
  createdAt: string;
}

export type TaskStatus = 'PENDING' | 'IN_PROGRESS' | 'SUBMITTED' | 'APPROVED';

export interface MipTask {
  id: string;
  title: string;
  description: string;
  category: string; // e.g., "Legal Research", "Drafting Affidavit", "Court Briefing Note"
  assignedToInternId: string;
  assignedToName: string;
  assignedByAdminName: string;
  dueDate: string;
  status: TaskStatus;
  submissionText?: string;
  submissionFileUrl?: string;
  adminFeedback?: string;
  createdAt: string;
}

export interface MipEvaluation {
  id: string;
  internId: string;
  internName: string;
  punctualityScore: number; // 1 - 10
  legalDraftingScore: number; // 1 - 10
  advocacyResearchScore: number; // 1 - 10
  overallScore: number; // Percentage
  remarks: string;
  evaluatedBy: string;
  evaluatedAt: string;
  certificateIssued: boolean;
}

// Default Seeded Users
const DEFAULT_USERS: MipUser[] = [
  {
    id: 'mip-superadmin-1',
    name: 'Barr. Uzoma Okonti (Managing Partner)',
    email: 'superadmin@midlex.com',
    password: 'superadmin123',
    role: 'INTERNSHIP_SUPER_ADMIN',
    status: 'ACTIVE',
    createdAt: new Date().toISOString(),
  },
  {
    id: 'mip-admin-1',
    name: 'Barr. Monday Isidahome (Internship Director)',
    email: 'admin@midlex.com',
    password: 'admin123',
    role: 'INTERNSHIP_ADMIN',
    status: 'ACTIVE',
    createdAt: new Date().toISOString(),
  },
  {
    id: 'mip-student-1',
    name: 'Amina Bello (Student Lawyer)',
    email: 'intern@midlex.com',
    password: 'user123',
    role: 'STUDENT_INTERN',
    internId: 'MIP-2026-014',
    institution: 'Nigerian Law School, Bwari - Abuja Campus',
    assignedSupervisor: 'Barr. Monday Isidahome',
    totalHoursLogged: 120,
    startDate: '2026-08-01',
    status: 'ACTIVE',
    createdAt: new Date().toISOString(),
  }
];

// Default Seeded Logbook Entries
const DEFAULT_LOGBOOKS: MipLogbookEntry[] = [
  {
    id: 'log-101',
    internId: 'mip-student-1',
    internName: 'Amina Bello (Student Lawyer)',
    internEmail: 'intern@midlex.com',
    date: new Date().toISOString().split('T')[0],
    hoursLogged: 8,
    chamberActivity: 'Attended High Court 4 in Benin City before Hon. Justice Eghobamien. Observed cross-examination of witness in land title dispute suit.',
    legalLearningsText: 'Learned the application of Section 83 Evidence Act 2011 regarding admissibility of computer-generated bank statements and foundational foundation laying.',
    tasksCompleted: 'Prepared digest of court proceedings and filed motion on notice at the court registry.',
    attachmentUrl: 'https://images.unsplash.com/photo-1450133064473-71024230f91b?auto=format&fit=crop&w=800&q=80',
    status: 'APPROVED',
    supervisorNotes: 'Excellent observations on evidence admissibility. Keep up the detailed legal analysis!',
    reviewedBy: 'Barr. Monday Isidahome',
    reviewedAt: new Date().toISOString(),
    createdAt: new Date().toISOString(),
  },
  {
    id: 'log-102',
    internId: 'mip-student-1',
    internName: 'Amina Bello (Student Lawyer)',
    internEmail: 'intern@midlex.com',
    date: new Date(Date.now() - 86400000).toISOString().split('T')[0],
    hoursLogged: 7,
    chamberActivity: 'Chamber Legal Research on Certificate of Occupancy revocation procedure under Land Use Act 1978.',
    legalLearningsText: 'Understood public purpose requirements under Section 28 and proper service of revocation notice.',
    tasksCompleted: 'Drafted 3-page research memorandum for Head of Chambers.',
    status: 'PENDING',
    createdAt: new Date(Date.now() - 86400000).toISOString(),
  }
];

// Default Seeded Tasks
const DEFAULT_TASKS: MipTask[] = [
  {
    id: 'task-mip-1',
    title: 'Research Brief: Land Use Act Section 28 Judicial Review',
    description: 'Summarize Supreme Court precedents on invalid notice of revocation of Certificate of Occupancy for commercial properties.',
    category: 'Legal Research & Case Brief',
    assignedToInternId: 'mip-student-1',
    assignedToName: 'Amina Bello (Student Lawyer)',
    assignedByAdminName: 'Barr. Monday Isidahome',
    dueDate: new Date(Date.now() + 86400000 * 3).toISOString().split('T')[0],
    status: 'IN_PROGRESS',
    createdAt: new Date().toISOString(),
  },
  {
    id: 'task-mip-2',
    title: 'Draft Affidavit in Support of Motion for Extension of Time',
    description: 'Draft 10-paragraph affidavit for civil appeal out of time in accordance with High Court Civil Procedure Rules.',
    category: 'Drafting & Chamber Practice',
    assignedToInternId: 'mip-student-1',
    assignedToName: 'Amina Bello (Student Lawyer)',
    assignedByAdminName: 'Barr. Uzoma Okonti',
    dueDate: new Date(Date.now() + 86400000 * 5).toISOString().split('T')[0],
    status: 'PENDING',
    createdAt: new Date().toISOString(),
  }
];

// Storage Getters & Setters

export function getMipUsers(): MipUser[] {
  if (typeof window === 'undefined') return DEFAULT_USERS;
  const saved = localStorage.getItem('midlex_mip_users');
  if (saved) {
    try { return JSON.parse(saved); } catch (e) {}
  }
  localStorage.setItem('midlex_mip_users', JSON.stringify(DEFAULT_USERS));
  return DEFAULT_USERS;
}

export function saveMipUser(user: Omit<MipUser, 'id' | 'createdAt'>): MipUser {
  const users = getMipUsers();
  const newUser: MipUser = {
    ...user,
    id: `mip-user-${Date.now()}`,
    createdAt: new Date().toISOString(),
  };
  const updated = [...users, newUser];
  if (typeof window !== 'undefined') {
    localStorage.setItem('midlex_mip_users', JSON.stringify(updated));
  }
  return newUser;
}

export function getMipLogbooks(internId?: string): MipLogbookEntry[] {
  let entries: MipLogbookEntry[] = DEFAULT_LOGBOOKS;
  if (typeof window !== 'undefined') {
    const saved = localStorage.getItem('midlex_mip_logbooks');
    if (saved) {
      try { entries = JSON.parse(saved); } catch (e) {}
    } else {
      localStorage.setItem('midlex_mip_logbooks', JSON.stringify(DEFAULT_LOGBOOKS));
    }
  }
  if (internId) {
    return entries.filter((l) => l.internId === internId);
  }
  return entries;
}

export function saveMipLogbookEntry(entry: Omit<MipLogbookEntry, 'id' | 'status' | 'createdAt'>): MipLogbookEntry {
  const all = getMipLogbooks();
  const newEntry: MipLogbookEntry = {
    ...entry,
    id: `log-${Date.now()}`,
    status: 'PENDING',
    createdAt: new Date().toISOString(),
  };
  const updated = [newEntry, ...all];
  if (typeof window !== 'undefined') {
    localStorage.setItem('midlex_mip_logbooks', JSON.stringify(updated));
    
    // Update total hours for intern user
    const users = getMipUsers();
    const uIdx = users.findIndex((u) => u.id === entry.internId);
    if (uIdx !== -1) {
      users[uIdx].totalHoursLogged = (users[uIdx].totalHoursLogged || 0) + Number(entry.hoursLogged);
      localStorage.setItem('midlex_mip_users', JSON.stringify(users));
    }
  }
  return newEntry;
}

export function updateLogbookStatus(logId: string, status: LogbookStatus, notes?: string, reviewerName?: string): MipLogbookEntry | null {
  const all = getMipLogbooks();
  const idx = all.findIndex((l) => l.id === logId);
  if (idx === -1) return null;

  all[idx].status = status;
  if (notes) all[idx].supervisorNotes = notes;
  if (reviewerName) all[idx].reviewedBy = reviewerName;
  all[idx].reviewedAt = new Date().toISOString();

  if (typeof window !== 'undefined') {
    localStorage.setItem('midlex_mip_logbooks', JSON.stringify(all));
  }
  return all[idx];
}

export function getMipTasks(internId?: string): MipTask[] {
  let tasks: MipTask[] = DEFAULT_TASKS;
  if (typeof window !== 'undefined') {
    const saved = localStorage.getItem('midlex_mip_tasks');
    if (saved) {
      try { tasks = JSON.parse(saved); } catch (e) {}
    } else {
      localStorage.setItem('midlex_mip_tasks', JSON.stringify(DEFAULT_TASKS));
    }
  }
  if (internId) {
    return tasks.filter((t) => t.assignedToInternId === internId);
  }
  return tasks;
}

export function saveMipTask(task: Omit<MipTask, 'id' | 'status' | 'createdAt'>): MipTask {
  const all = getMipTasks();
  const newTask: MipTask = {
    ...task,
    id: `task-${Date.now()}`,
    status: 'PENDING',
    createdAt: new Date().toISOString(),
  };
  const updated = [newTask, ...all];
  if (typeof window !== 'undefined') {
    localStorage.setItem('midlex_mip_tasks', JSON.stringify(updated));
  }
  return newTask;
}

export function updateMipTaskStatus(taskId: string, status: TaskStatus, submissionText?: string, fileUrl?: string, feedback?: string): MipTask | null {
  const all = getMipTasks();
  const idx = all.findIndex((t) => t.id === taskId);
  if (idx === -1) return null;

  all[idx].status = status;
  if (submissionText !== undefined) all[idx].submissionText = submissionText;
  if (fileUrl !== undefined) all[idx].submissionFileUrl = fileUrl;
  if (feedback !== undefined) all[idx].adminFeedback = feedback;

  if (typeof window !== 'undefined') {
    localStorage.setItem('midlex_mip_tasks', JSON.stringify(all));
  }
  return all[idx];
}
