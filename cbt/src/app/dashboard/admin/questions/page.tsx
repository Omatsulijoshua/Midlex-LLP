"use client";
import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  getCbtExams,
  getCbtQuestions,
  saveCbtQuestion,
  updateCbtExamResultSetting,
  updateCbtExamDuration,
  CbtExam,
  CbtQuestion,
  QuestionType,
  QuestionOption,
} from '@/lib/cbtStore';

export default function AdminQuestionsBuilderPage() {
  const [exams, setExams] = useState<CbtExam[]>([]);
  const [questions, setQuestions] = useState<CbtQuestion[]>([]);

  // New Question Form State
  const [selectedExamId, setSelectedExamId] = useState<string>('');
  const [type, setType] = useState<QuestionType>('MCQ');
  const [category, setCategory] = useState('German Language & Grammar');
  const [questionText, setQuestionText] = useState('');
  const [isGerman, setIsGerman] = useState(true);
  const [caseSensitive, setCaseSensitive] = useState(false); // Default: Case-insensitive
  const [imageUrl, setImageUrl] = useState('');
  const [marks, setMarks] = useState(25);
  const [explanation, setExplanation] = useState('');

  // MCQ Options State
  const [optionA, setOptionA] = useState('');
  const [optionB, setOptionB] = useState('');
  const [optionC, setOptionC] = useState('');
  const [optionD, setOptionD] = useState('');
  const [correctOptionKey, setCorrectOptionKey] = useState<'A' | 'B' | 'C' | 'D'>('A');

  // True/False State
  const [correctTrueFalse, setCorrectTrueFalse] = useState<boolean>(true);

  useEffect(() => {
    const exList = getCbtExams();
    setExams(exList);
    if (exList.length > 0) {
      setSelectedExamId(exList[0].id);
      setQuestions(getCbtQuestions(exList[0].id));
    }
  }, []);

  const handleExamSelect = (eId: string) => {
    setSelectedExamId(eId);
    setQuestions(getCbtQuestions(eId));
  };

  const handleToggleResultVisibility = (showImmediately: boolean) => {
    if (!selectedExamId) return;
    updateCbtExamResultSetting(selectedExamId, showImmediately);
    const updatedExams = getCbtExams();
    setExams(updatedExams);
  };

  const handleUpdateDuration = (mins: number) => {
    if (!selectedExamId) return;
    updateCbtExamDuration(selectedExamId, mins);
    const updatedExams = getCbtExams();
    setExams(updatedExams);
  };

  const handleInsertGermanChar = (char: string) => {
    setQuestionText((prev) => prev + char);
  };

  const handleSaveQuestion = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedExamId) {
      alert('Please select an exam first.');
      return;
    }
    if (!questionText.trim()) {
      alert('Question text cannot be empty.');
      return;
    }

    let options: QuestionOption[] | undefined;
    if (type === 'MCQ') {
      options = [
        { key: 'A', text: optionA.trim() || 'Option A' },
        { key: 'B', text: optionB.trim() || 'Option B' },
        { key: 'C', text: optionC.trim() || 'Option C' },
        { key: 'D', text: optionD.trim() || 'Option D' },
      ];
    }

    saveCbtQuestion({
      examId: selectedExamId,
      type,
      category: category.trim() || 'General',
      questionText: questionText.trim(),
      isGerman,
      caseSensitive: isGerman ? caseSensitive : false,
      imageUrl: imageUrl.trim() || undefined,
      options,
      correctOptionKey: type === 'MCQ' ? correctOptionKey : undefined,
      correctTrueFalse: type === 'TRUE_FALSE' ? correctTrueFalse : undefined,
      explanation: explanation.trim() || undefined,
      marks: Number(marks) || 10,
    });

    alert('Question added successfully to CBT Question Bank!');
    setQuestionText('');
    setImageUrl('');
    setExplanation('');
    setOptionA('');
    setOptionB('');
    setOptionC('');
    setOptionD('');
    setQuestions(getCbtQuestions(selectedExamId));
  };

  return (
    <div className="min-h-screen bg-slate-50 pb-20">
      <header className="bg-amber-900 text-white py-4 px-6 sticky top-0 z-30 shadow-md">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Link href="/dashboard/admin" className="p-2 bg-white/10 hover:bg-white/20 rounded-xl text-white font-bold text-xs">
              ⬅️ Admin Panel
            </Link>
            <h1 className="font-bold text-base">CBT Question Bank Builder & German Authoring</h1>
          </div>
          <span className="text-xs font-bold text-amber-200">Question Authoring Tool</span>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-6 pt-10 space-y-10">
        <div>
          <h2 className="text-3xl font-black text-slate-900">CBT Question Bank & Exam Configuration</h2>
          <p className="text-slate-500 text-sm mt-1">
            Configure exam duration timers, German case sensitivity rules, result display modes, and question authoring.
          </p>
        </div>

        {/* Target Exam Switcher & Quick Timer Adjuster */}
        {(() => {
          const currentExam = exams.find((e) => e.id === selectedExamId);

          return (
            <div className="grid md:grid-cols-2 gap-6">
              {/* Exam Module Switcher */}
              <div className="bg-white p-6 rounded-[28px] border border-slate-200 shadow-sm flex flex-col justify-between space-y-4">
                <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Target Examination Module:</span>
                <select
                  value={selectedExamId}
                  onChange={(e) => handleExamSelect(e.target.value)}
                  className="w-full px-5 py-3.5 bg-slate-50 border border-slate-200 rounded-2xl font-bold text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-amber-500"
                >
                  {exams.map((ex) => (
                    <option key={ex.id} value={ex.id}>
                      {ex.title} ({ex.subject})
                    </option>
                  ))}
                </select>
                <div className="flex justify-between items-center text-xs font-bold pt-2 border-t border-slate-100">
                  <span className="text-slate-500">Bank Size: <strong className="text-slate-900">{questions.length} Items</strong></span>
                  <span className="text-amber-700 bg-amber-50 px-3 py-1 rounded-xl">Current Timer: ⏱️ {currentExam?.durationMinutes || 30} mins</span>
                </div>
              </div>

              {/* Live Exam Duration Timer Adjuster */}
              <div className="bg-white p-6 rounded-[28px] border border-slate-200 shadow-sm flex flex-col justify-between space-y-4">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="w-2 h-2 rounded-full bg-amber-500 animate-pulse" />
                    <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Exam Timer Duration Control</span>
                  </div>
                  <h4 className="text-sm font-bold text-slate-900">Change Exam Duration (in Minutes) Anytime</h4>
                </div>

                <div className="flex items-center gap-3">
                  <input
                    type="number"
                    min={1}
                    max={300}
                    value={currentExam?.durationMinutes || 30}
                    onChange={(e) => handleUpdateDuration(Number(e.target.value))}
                    className="w-28 px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl font-black text-center text-base text-primary"
                  />
                  <div className="flex flex-wrap gap-2">
                    {[15, 30, 45, 60, 90].map((mins) => (
                      <button
                        key={mins}
                        type="button"
                        onClick={() => handleUpdateDuration(mins)}
                        className={`px-3 py-2 rounded-xl text-xs font-bold transition-all ${
                          currentExam?.durationMinutes === mins
                            ? 'bg-amber-600 text-white shadow-md font-black'
                            : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                        }`}
                      >
                        {mins}m
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          );
        })()}

        {/* Post-Exam Result Release Display Setting */}
        {(() => {
          const currentExam = exams.find((e) => e.id === selectedExamId);
          const isImmediate = currentExam?.showResultsImmediately === true;

          return (
            <div className="bg-gradient-to-r from-slate-900 to-amber-950 text-white p-6 rounded-[28px] shadow-lg flex flex-wrap items-center justify-between gap-6 border border-amber-500/20">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="px-3 py-0.5 bg-amber-400/20 text-amber-300 text-[10px] font-black uppercase tracking-widest rounded-full border border-amber-400/30">
                    EXAM RESULT RELEASE SETTING
                  </span>
                </div>
                <h3 className="text-base font-bold text-white">Post-Submission Result Display Mode</h3>
                <p className="text-xs text-amber-200/80">
                  Choose what examinees see immediately after clicking &quot;Submit Examination&quot;.
                </p>
              </div>

              <div className="flex items-center gap-3 bg-white/10 p-2 rounded-2xl border border-white/10">
                <button
                  type="button"
                  onClick={() => handleToggleResultVisibility(false)}
                  className={`px-5 py-2.5 rounded-xl font-black text-xs transition-all ${
                    !isImmediate
                      ? 'bg-amber-500 text-slate-950 shadow-lg'
                      : 'text-amber-200 hover:bg-white/10'
                  }`}
                >
                  🤝 Hide Results & Display &quot;Thank you! We will get back to you with your results.&quot;
                </button>
                <button
                  type="button"
                  onClick={() => handleToggleResultVisibility(true)}
                  className={`px-5 py-2.5 rounded-xl font-black text-xs transition-all ${
                    isImmediate
                      ? 'bg-emerald-500 text-slate-950 shadow-lg'
                      : 'text-amber-200 hover:bg-white/10'
                  }`}
                >
                  📊 Show Score & Breakdown Immediately
                </button>
              </div>
            </div>
          );
        })()}

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Question Creation Form */}
          <div className="lg:col-span-2 bg-white rounded-[32px] border border-slate-200 p-8 shadow-sm space-y-6">
            <h3 className="text-xl font-bold text-slate-900 border-b border-slate-100 pb-4">Add New CBT Question</h3>

            <form onSubmit={handleSaveQuestion} className="space-y-6">
              {/* Question Type Toggle */}
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-widest mb-2">Question Type</label>
                <div className="grid grid-cols-3 gap-3">
                  <button
                    type="button"
                    onClick={() => setType('MCQ')}
                    className={`py-3 rounded-xl text-xs font-bold transition-all border ${
                      type === 'MCQ'
                        ? 'bg-primary text-white border-primary shadow-md font-black'
                        : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                    }`}
                  >
                    🔠 Multiple Choice (ABCD)
                  </button>
                  <button
                    type="button"
                    onClick={() => setType('TRUE_FALSE')}
                    className={`py-3 rounded-xl text-xs font-bold transition-all border ${
                      type === 'TRUE_FALSE'
                        ? 'bg-emerald-600 text-white border-emerald-600 shadow-md font-black'
                        : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                    }`}
                  >
                    ✔️/❌ True or False
                  </button>
                  <button
                    type="button"
                    onClick={() => setType('THEORY')}
                    className={`py-3 rounded-xl text-xs font-bold transition-all border ${
                      type === 'THEORY'
                        ? 'bg-amber-600 text-white border-amber-600 shadow-md font-black'
                        : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                    }`}
                  >
                    ✍️ Theory / Essay + Image
                  </button>
                </div>
              </div>

              {/* Category & Marks */}
              <div className="grid sm:grid-cols-3 gap-4">
                <div className="sm:col-span-2">
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-widest mb-2">Category / Topic</label>
                  <input
                    type="text"
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    placeholder="e.g. German Grammar, BGB Civil Law"
                    className="w-full px-5 py-3.5 bg-slate-50 border border-slate-200 rounded-2xl text-sm font-medium text-slate-800"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-widest mb-2">Marks / Score</label>
                  <input
                    type="number"
                    value={marks}
                    onChange={(e) => setMarks(Number(e.target.value))}
                    className="w-full px-5 py-3.5 bg-slate-50 border border-slate-200 rounded-2xl text-sm font-bold text-slate-800"
                  />
                </div>
              </div>

              {/* German Language Case Sensitivity Evaluation Rule */}
              <div className="bg-yellow-50/60 p-4 rounded-2xl border border-yellow-200/80 space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="text-base">🇩🇪</span>
                    <span className="text-xs font-bold text-yellow-950 uppercase tracking-wider">German Text Answer Case Evaluation Rule</span>
                  </div>
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={isGerman}
                      onChange={(e) => setIsGerman(e.target.checked)}
                      className="w-4 h-4 text-amber-600 rounded"
                    />
                    <span className="text-xs font-bold text-slate-700">Flag as German Question</span>
                  </label>
                </div>
                <p className="text-[11px] text-yellow-900/80">
                  Configure whether student text answers should match strictly on German Noun Upper Case (e.g., <em>&quot;Rechtsanwalt&quot;</em> vs <em>&quot;rechtsanwalt&quot;</em>) or be case-insensitive.
                </p>
                <div className="flex flex-wrap gap-3 pt-1">
                  <button
                    type="button"
                    onClick={() => setCaseSensitive(false)}
                    className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                      !caseSensitive
                        ? 'bg-amber-600 text-white shadow-md font-black'
                        : 'bg-white text-slate-700 border border-slate-200 hover:bg-slate-50'
                    }`}
                  >
                    🔤 Case-Insensitive (Normalizes Upper & Lowercase)
                  </button>
                  <button
                    type="button"
                    onClick={() => setCaseSensitive(true)}
                    className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                      caseSensitive
                        ? 'bg-yellow-700 text-white shadow-md font-black'
                        : 'bg-white text-slate-700 border border-slate-200 hover:bg-slate-50'
                    }`}
                  >
                    🔠 Strict Case-Sensitive (German Noun Rule)
                  </button>
                </div>
              </div>

              {/* German Language Special Character Toolbar */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-widest">Question Text Prompt *</label>
                  <div className="flex items-center gap-1.5">
                    <span className="text-[10px] text-slate-400 font-bold mr-1">Insert German Characters:</span>
                    {['ä', 'ö', 'ü', 'ß', 'Ä', 'Ö', 'Ü'].map((char) => (
                      <button
                        key={char}
                        type="button"
                        onClick={() => handleInsertGermanChar(char)}
                        className="px-2 py-1 bg-yellow-100 hover:bg-yellow-200 text-yellow-900 font-black text-xs rounded-lg border border-yellow-300"
                      >
                        {char}
                      </button>
                    ))}
                  </div>
                </div>
                <textarea
                  rows={4}
                  value={questionText}
                  onChange={(e) => setQuestionText(e.target.value)}
                  placeholder="Enter the complete question prompt..."
                  className="w-full p-4 bg-slate-50 border border-slate-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-amber-500 text-sm font-medium text-slate-800"
                  required
                />
              </div>

              {/* Image URL Input */}
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-widest mb-2">🖼️ Diagram / Image Prompt URL (Optional)</label>
                <input
                  type="url"
                  value={imageUrl}
                  onChange={(e) => setImageUrl(e.target.value)}
                  placeholder="https://images.unsplash.com/... or image link"
                  className="w-full px-5 py-3.5 bg-slate-50 border border-slate-200 rounded-2xl text-sm font-medium text-slate-800"
                />
              </div>

              {/* Specific Options Input for MCQ ABCD */}
              {type === 'MCQ' && (
                <div className="space-y-4 bg-slate-50 p-6 rounded-2xl border border-slate-200">
                  <label className="block text-xs font-black text-primary uppercase tracking-widest">Specify Options A, B, C, D & Correct Key:</label>
                  
                  <div className="space-y-3">
                    <div className="flex items-center gap-3">
                      <span className="w-8 h-8 bg-primary text-white font-black text-xs rounded-xl flex items-center justify-center shrink-0">A</span>
                      <input
                        type="text"
                        value={optionA}
                        onChange={(e) => setOptionA(e.target.value)}
                        placeholder="Option A text"
                        className="flex-1 px-4 py-3 bg-white border border-slate-200 rounded-xl text-sm font-medium"
                      />
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="w-8 h-8 bg-primary text-white font-black text-xs rounded-xl flex items-center justify-center shrink-0">B</span>
                      <input
                        type="text"
                        value={optionB}
                        onChange={(e) => setOptionB(e.target.value)}
                        placeholder="Option B text"
                        className="flex-1 px-4 py-3 bg-white border border-slate-200 rounded-xl text-sm font-medium"
                      />
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="w-8 h-8 bg-primary text-white font-black text-xs rounded-xl flex items-center justify-center shrink-0">C</span>
                      <input
                        type="text"
                        value={optionC}
                        onChange={(e) => setOptionC(e.target.value)}
                        placeholder="Option C text"
                        className="flex-1 px-4 py-3 bg-white border border-slate-200 rounded-xl text-sm font-medium"
                      />
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="w-8 h-8 bg-primary text-white font-black text-xs rounded-xl flex items-center justify-center shrink-0">D</span>
                      <input
                        type="text"
                        value={optionD}
                        onChange={(e) => setOptionD(e.target.value)}
                        placeholder="Option D text"
                        className="flex-1 px-4 py-3 bg-white border border-slate-200 rounded-xl text-sm font-medium"
                      />
                    </div>
                  </div>

                  <div className="pt-2">
                    <label className="block text-xs font-bold text-slate-700 uppercase tracking-widest mb-2">Correct Key Option:</label>
                    <div className="flex gap-4">
                      {(['A', 'B', 'C', 'D'] as const).map((key) => (
                        <button
                          key={key}
                          type="button"
                          onClick={() => setCorrectOptionKey(key)}
                          className={`px-6 py-2.5 rounded-xl font-black text-xs transition-all ${
                            correctOptionKey === key
                              ? 'bg-emerald-600 text-white shadow-md'
                              : 'bg-white border border-slate-200 text-slate-700 hover:bg-slate-100'
                          }`}
                        >
                          Option {key}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* Specific Input for True / False */}
              {type === 'TRUE_FALSE' && (
                <div className="bg-slate-50 p-6 rounded-2xl border border-slate-200">
                  <label className="block text-xs font-black text-primary uppercase tracking-widest mb-3">Correct Statement Key:</label>
                  <div className="flex gap-4">
                    <button
                      type="button"
                      onClick={() => setCorrectTrueFalse(true)}
                      className={`px-6 py-3 rounded-xl font-black text-xs transition-all ${
                        correctTrueFalse === true
                          ? 'bg-emerald-600 text-white shadow-md'
                          : 'bg-white border border-slate-200 text-slate-700'
                      }`}
                    >
                      ✔️ TRUE (Richtig)
                    </button>
                    <button
                      type="button"
                      onClick={() => setCorrectTrueFalse(false)}
                      className={`px-6 py-3 rounded-xl font-black text-xs transition-all ${
                        correctTrueFalse === false
                          ? 'bg-red-600 text-white shadow-md'
                          : 'bg-white border border-slate-200 text-slate-700'
                      }`}
                    >
                      ❌ FALSE (Falsch)
                    </button>
                  </div>
                </div>
              )}

              {/* Explanation Field */}
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-widest mb-2">💡 Examiner Explanation / Hint</label>
                <textarea
                  rows={2}
                  value={explanation}
                  onChange={(e) => setExplanation(e.target.value)}
                  placeholder="Explain why this answer is correct..."
                  className="w-full p-4 bg-slate-50 border border-slate-200 rounded-2xl text-xs font-medium text-slate-800"
                />
              </div>

              <button
                type="submit"
                className="w-full py-4 bg-primary hover:bg-primary/90 text-white font-black rounded-2xl text-sm shadow-xl shadow-primary/20 transition-all uppercase tracking-wider"
              >
                ➕ Add Question to CBT Exam Bank
              </button>
            </form>
          </div>

          {/* Current Question List Preview */}
          <div className="bg-white rounded-[32px] border border-slate-200 p-6 shadow-sm flex flex-col justify-between">
            <div>
              <h3 className="font-bold text-slate-900 text-sm uppercase tracking-widest mb-4">Exam Questions ({questions.length})</h3>
              <div className="space-y-4 max-h-[600px] overflow-y-auto">
                {questions.map((q, idx) => (
                  <div key={q.id} className="p-4 bg-slate-50 rounded-2xl border border-slate-100 text-xs space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="font-black text-primary">Q{idx + 1} ({q.type})</span>
                      <span className="px-2 py-0.5 bg-emerald-100 text-emerald-800 rounded-full font-bold text-[9px]">
                        {q.marks} Marks
                      </span>
                    </div>
                    <p className="font-bold text-slate-800 line-clamp-2">{q.questionText}</p>
                    {q.type === 'MCQ' && (
                      <p className="text-[10px] text-slate-500">Correct Key: <strong>{q.correctOptionKey}</strong></p>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
