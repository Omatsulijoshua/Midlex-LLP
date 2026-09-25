export interface CbtUser {
  id: string;
  name: string;
  email: string;
  password?: string;
  role: 'ADMIN' | 'USER';
  candidateId: string;
  assignedExamIds: string[];
  createdAt: string;
}

export type QuestionType = 'MCQ' | 'TRUE_FALSE' | 'THEORY';

export interface QuestionOption {
  key: 'A' | 'B' | 'C' | 'D';
  text: string;
  imageUrl?: string;
}

export interface CbtQuestion {
  id: string;
  examId: string;
  type: QuestionType;
  category: string; // e.g. "German Grammar", "German Legal Terminology", "Civil Litigation"
  questionText: string;
  isGerman?: boolean;
  imageUrl?: string;
  options?: QuestionOption[]; // For MCQ (A, B, C, D)
  correctOptionKey?: 'A' | 'B' | 'C' | 'D'; // For MCQ
  correctTrueFalse?: boolean; // For True / False
  explanation?: string;
  marks: number;
}

export interface CbtExam {
  id: string;
  title: string;
  description: string;
  subject: string;
  durationMinutes: number;
  totalMarks: number;
  passingScore: number;
  questionCount: number;
  showResultsImmediately?: boolean; // If false, examinee sees "Thank you! We will get back to you with your results."
  createdAt: string;
}

export interface ExamineeAnswer {
  questionId: string;
  selectedOptionKey?: 'A' | 'B' | 'C' | 'D';
  selectedTrueFalse?: boolean;
  theoryAnswerText?: string;
  theoryAttachmentUrl?: string; // Examinee image attachment
  isFlagged?: boolean;
  scoreAwarded?: number;
  adminGradingNotes?: string;
}

export interface CbtSubmission {
  id: string;
  examId: string;
  examTitle: string;
  userId: string;
  userName: string;
  userEmail: string;
  candidateId: string;
  answers: Record<string, ExamineeAnswer>;
  score: number;
  totalMarks: number;
  percentage: number;
  isPassed: boolean;
  isGraded: boolean;
  submittedAt: string;
}

const DEFAULT_USERS: CbtUser[] = [
  {
    id: 'user-admin-1',
    name: 'Chief Examiner / Super Admin',
    email: 'admin@midlex.com',
    password: 'admin123',
    role: 'ADMIN',
    candidateId: 'ADM-001',
    assignedExamIds: ['exam-ger-101', 'exam-leg-201'],
    createdAt: new Date().toISOString(),
  },
  {
    id: 'user-examinee-1',
    name: 'Sammie Okon',
    email: 'user@midlex.com',
    password: 'user123',
    role: 'USER',
    candidateId: 'MID-CBT-8890',
    assignedExamIds: ['exam-ger-101', 'exam-leg-201'],
    createdAt: new Date().toISOString(),
  }
];

const DEFAULT_EXAMS: CbtExam[] = [
  {
    id: 'exam-ger-101',
    title: '🇩🇪 German Language & Legal Translation CBT',
    description: 'Comprehensive test covering German grammar, vocabulary, true/false legal rules (BGB), and theory translation with diagram inspection.',
    subject: 'German Philology & International Law',
    durationMinutes: 45,
    totalMarks: 100,
    passingScore: 60,
    questionCount: 4,
    showResultsImmediately: false, // Default: Hide results & show "Thank you we will get back to you"
    createdAt: new Date().toISOString(),
  },
  {
    id: 'exam-leg-201',
    title: '⚖️ Midlex Commercial Advocacy & Procedure CBT',
    description: 'Assessment on Nigerian Civil Procedure, Evidence Law, Land Title Verification, and Trial Drafting.',
    subject: 'Commercial Litigation & Practice',
    durationMinutes: 30,
    totalMarks: 50,
    passingScore: 50,
    questionCount: 3,
    showResultsImmediately: false, // Default: Hide results & show "Thank you we will get back to you"
    createdAt: new Date().toISOString(),
  }
];

const DEFAULT_QUESTIONS: CbtQuestion[] = [
  {
    id: 'q-ger-1',
    examId: 'exam-ger-101',
    type: 'MCQ',
    category: 'German Grammar (Grammatik)',
    questionText: 'Welches Wort vervollständigt den Satz korrekt? "Der Rechtsanwalt verhandelt _____ dem Gericht in Berlin."',
    isGerman: true,
    options: [
      { key: 'A', text: 'vor (before / in front of)' },
      { key: 'B', text: 'nach (after)' },
      { key: 'C', text: 'durch (through)' },
      { key: 'D', text: 'ohne (without)' },
    ],
    correctOptionKey: 'A',
    explanation: 'Im deutschen Juristendeutsch steht die Präposition "vor" bei Gerichtsterminen ("vor Gericht").',
    marks: 25,
  },
  {
    id: 'q-ger-2',
    examId: 'exam-ger-101',
    type: 'TRUE_FALSE',
    category: 'German Civil Code (BGB Legal Logic)',
    questionText: 'Richtig oder Falsch? (True or False?)\nIm deutschen Bürgerlichen Gesetzbuch (§ 433 BGB) verpflichtet der Kaufvertrag den Verkäufer zur Übergabe der Sache frei von Sach- und Rechtsmängeln.',
    isGerman: true,
    correctTrueFalse: true,
    explanation: 'Richtig (True). Gemäß § 433 Abs. 1 Satz 2 BGB muss der Verkäufer dem Käufer die Sache frei von Sach- und Rechtsmängeln verschaffen.',
    marks: 25,
  },
  {
    id: 'q-ger-3',
    examId: 'exam-ger-101',
    type: 'MCQ',
    category: 'Diagram & Document Analysis',
    questionText: 'Betrachten Sie das untenstehende Dokumenten-Symbol. Welcher juristische Begriff passt am besten zur Grundbuch-Eintragung?',
    isGerman: true,
    imageUrl: 'https://images.unsplash.com/photo-1450133064473-71024230f91b?auto=format&fit=crop&w=800&q=80',
    options: [
      { key: 'A', text: 'Auflassung (Conveyance of property title)' },
      { key: 'B', text: 'Kündigung (Termination of employment)' },
      { key: 'C', text: 'Testament (Will & Probate)' },
      { key: 'D', text: 'Scheidung (Divorce petition)' },
    ],
    correctOptionKey: 'A',
    explanation: 'Die Auflassung bezeichnet im deutschen Sachenrecht die Einigung zwischen Veräußerer und Erwerber über den Übergang des Eigentums an einem Grundstück.',
    marks: 25,
  },
  {
    id: 'q-ger-4',
    examId: 'exam-ger-101',
    type: 'THEORY',
    category: 'German Translation & Written Theory',
    questionText: '✍️ German Theory Exercise:\nÜbersetzen Sie den folgenden juristischen Satz ins Englische und erläutern Sie die Bedeutung:\n"Die Parteien vereinbaren als Gerichtsstand für alle Streitigkeiten das Landgericht Frankfurt am Main."\n\n(Optionally attach a scanned handwritten page image below)',
    isGerman: true,
    explanation: 'Sample English Translation: "The parties agree that the place of jurisdiction for all disputes shall be the Regional Court of Frankfurt am Main."',
    marks: 25,
  },
  {
    id: 'q-leg-1',
    examId: 'exam-leg-201',
    type: 'MCQ',
    category: 'Civil Procedure',
    questionText: 'Under Order 3 of High Court Rules, what document initiates a contentious land dispute lawsuit where witness cross-examination is required?',
    options: [
      { key: 'A', text: 'Writ of Summons with Statement of Claim' },
      { key: 'B', text: 'Originating Summons' },
      { key: 'C', text: 'Motion ex-parte' },
      { key: 'D', text: 'Letter of Demand' },
    ],
    correctOptionKey: 'A',
    explanation: 'Contentious matters involving disputes of facts must be initiated by Writ of Summons with Statement of Claim.',
    marks: 15,
  },
  {
    id: 'q-leg-2',
    examId: 'exam-leg-201',
    type: 'TRUE_FALSE',
    category: 'Property Law',
    questionText: 'True or False?\nUnder the Land Use Act 1978, all land comprised in the territory of each State is vested in the Governor of that State.',
    correctTrueFalse: true,
    explanation: 'True. Section 1 of the Land Use Act 1978 vests all land in each state in the Governor to hold in trust for Nigerians.',
    marks: 15,
  },
  {
    id: 'q-leg-3',
    examId: 'exam-leg-201',
    type: 'THEORY',
    category: 'Legal Drafting Theory',
    questionText: '✍️ Theory & Case Drafting:\nDraft the commencement clause of a Deed of Assignment between Chief Uzoma Okonti (Assignor) and Midlex Realty (Assignee) for property in Benin City. Upload diagram/deed image if available.',
    explanation: 'Commencement clause should accurately state date, parties, recitals, and Certificate of Occupancy registration details.',
    marks: 20,
  }
];

export function getCbtUsers(): CbtUser[] {
  if (typeof window === 'undefined') return DEFAULT_USERS;
  const saved = localStorage.getItem('midlex_cbt_users');
  if (saved) {
    try { return JSON.parse(saved); } catch (e) {}
  }
  localStorage.setItem('midlex_cbt_users', JSON.stringify(DEFAULT_USERS));
  return DEFAULT_USERS;
}

export function saveCbtUser(user: Omit<CbtUser, 'id' | 'createdAt'>): CbtUser {
  const users = getCbtUsers();
  const newUser: CbtUser = {
    ...user,
    id: `user-${Date.now()}`,
    createdAt: new Date().toISOString(),
  };
  const updated = [...users, newUser];
  if (typeof window !== 'undefined') {
    localStorage.setItem('midlex_cbt_users', JSON.stringify(updated));
  }
  return newUser;
}

export function getCbtExams(): CbtExam[] {
  if (typeof window === 'undefined') return DEFAULT_EXAMS;
  const saved = localStorage.getItem('midlex_cbt_exams');
  if (saved) {
    try { return JSON.parse(saved); } catch (e) {}
  }
  localStorage.setItem('midlex_cbt_exams', JSON.stringify(DEFAULT_EXAMS));
  return DEFAULT_EXAMS;
}

export function saveCbtExam(exam: Omit<CbtExam, 'id' | 'createdAt'>): CbtExam {
  const exams = getCbtExams();
  const newExam: CbtExam = {
    ...exam,
    id: `exam-${Date.now()}`,
    createdAt: new Date().toISOString(),
  };
  const updated = [...exams, newExam];
  if (typeof window !== 'undefined') {
    localStorage.setItem('midlex_cbt_exams', JSON.stringify(updated));
  }
  return newExam;
}

export function updateCbtExamResultSetting(examId: string, showResultsImmediately: boolean): CbtExam | null {
  const exams = getCbtExams();
  const idx = exams.findIndex((e) => e.id === examId);
  if (idx === -1) return null;
  exams[idx].showResultsImmediately = showResultsImmediately;
  if (typeof window !== 'undefined') {
    localStorage.setItem('midlex_cbt_exams', JSON.stringify(exams));
  }
  return exams[idx];
}

export function getCbtQuestions(examId?: string): CbtQuestion[] {
  let questions: CbtQuestion[] = DEFAULT_QUESTIONS;
  if (typeof window !== 'undefined') {
    const saved = localStorage.getItem('midlex_cbt_questions');
    if (saved) {
      try { questions = JSON.parse(saved); } catch (e) {}
    } else {
      localStorage.setItem('midlex_cbt_questions', JSON.stringify(DEFAULT_QUESTIONS));
    }
  }
  if (examId) {
    return questions.filter((q) => q.examId === examId);
  }
  return questions;
}

export function saveCbtQuestion(q: Omit<CbtQuestion, 'id'>): CbtQuestion {
  const all = getCbtQuestions();
  const newQ: CbtQuestion = {
    ...q,
    id: `q-${Date.now()}`,
  };
  const updated = [...all, newQ];
  if (typeof window !== 'undefined') {
    localStorage.setItem('midlex_cbt_questions', JSON.stringify(updated));
  }
  // Update questionCount in Exam
  const exams = getCbtExams();
  const target = exams.find((e) => e.id === q.examId);
  if (target) {
    target.questionCount = updated.filter((item) => item.examId === q.examId).length;
    target.totalMarks += q.marks || 10;
    if (typeof window !== 'undefined') {
      localStorage.setItem('midlex_cbt_exams', JSON.stringify(exams));
    }
  }
  return newQ;
}

export function getCbtSubmissions(): CbtSubmission[] {
  if (typeof window === 'undefined') return [];
  const saved = localStorage.getItem('midlex_cbt_submissions');
  if (saved) {
    try { return JSON.parse(saved); } catch (e) {}
  }
  return [];
}

export function saveCbtSubmission(sub: Omit<CbtSubmission, 'id' | 'submittedAt'>): CbtSubmission {
  const all = getCbtSubmissions();
  const newSub: CbtSubmission = {
    ...sub,
    id: `sub-${Date.now()}`,
    submittedAt: new Date().toISOString(),
  };
  const updated = [newSub, ...all];
  if (typeof window !== 'undefined') {
    localStorage.setItem('midlex_cbt_submissions', JSON.stringify(updated));
  }
  return newSub;
}

export function updateCbtSubmissionGrading(submissionId: string, updatedAnswers: Record<string, ExamineeAnswer>, newScore: number, isPassed: boolean): CbtSubmission | null {
  const all = getCbtSubmissions();
  const idx = all.findIndex((s) => s.id === submissionId);
  if (idx === -1) return null;

  all[idx].answers = updatedAnswers;
  all[idx].score = newScore;
  all[idx].percentage = Math.round((newScore / (all[idx].totalMarks || 100)) * 100);
  all[idx].isPassed = isPassed;
  all[idx].isGraded = true;

  if (typeof window !== 'undefined') {
    localStorage.setItem('midlex_cbt_submissions', JSON.stringify(all));
  }
  return all[idx];
}
