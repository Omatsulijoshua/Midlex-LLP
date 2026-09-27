"use client";
import React, { useState } from 'react';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';

export default function MidlexAnalyticsLanding() {
  const [isSubmissionModalOpen, setIsSubmissionModalOpen] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  // Form State
  const [formData, setFormData] = useState({
    authorName: '',
    email: '',
    phone: '',
    qualification: 'Senior Advocate / Barrister',
    category: 'LEGAL_TEXTBOOK',
    title: '',
    abstract: '',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.authorName || !formData.email || !formData.title) {
      alert('Please complete all required fields.');
      return;
    }
    setIsSuccess(true);
    setTimeout(() => {
      setIsSuccess(false);
      setIsSubmissionModalOpen(false);
      setFormData({
        authorName: '',
        email: '',
        phone: '',
        qualification: 'Senior Advocate / Barrister',
        category: 'LEGAL_TEXTBOOK',
        title: '',
        abstract: '',
      });
      alert('Thank you for submitting your legal manuscript proposal to Midlex Analytics & Publishing! Our editorial board will contact you shortly.');
    }, 1500);
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans selection:bg-amber-500 selection:text-slate-950">
      {/* Top Header / Navigation */}
      <header className="bg-slate-900/90 border-b border-slate-800 sticky top-0 z-40 backdrop-blur-xl">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="p-2 rounded-xl bg-slate-800 border border-slate-700">
              <Image src="/logo.jpg" alt="Midlex" width={130} height={40} className="h-9 w-auto object-contain" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-sm font-black tracking-tight text-white">MIDLEX ANALYTICS</span>
                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider bg-amber-500/20 text-amber-400 border border-amber-500/30">
                  LAW REPORTING &amp; PUBLISHING
                </span>
              </div>
              <p className="text-[11px] text-slate-400 font-medium">
                Official Legal Research, Author Book Publishing &amp; Citation Engine
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <a
              href="#services"
              className="hidden md:inline-block text-xs font-bold text-slate-300 hover:text-amber-400 transition-colors px-3 py-2"
            >
              Publishing Services
            </a>
            <a
              href="#catalogue"
              className="hidden md:inline-block text-xs font-bold text-slate-300 hover:text-amber-400 transition-colors px-3 py-2"
            >
              Featured Catalogue
            </a>
            <button
              onClick={() => setIsSubmissionModalOpen(true)}
              className="px-5 py-2.5 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-slate-950 font-black rounded-xl text-xs uppercase tracking-wider transition-all shadow-lg shadow-amber-500/20"
            >
              ✍️ Submit Manuscript / Book Proposal
            </button>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative py-20 lg:py-28 overflow-hidden bg-slate-950">
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[700px] h-[400px] bg-amber-500/10 blur-[140px] rounded-full pointer-events-none" />
        <div className="absolute bottom-0 right-10 w-[500px] h-[300px] bg-blue-500/10 blur-[120px] rounded-full pointer-events-none" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center space-y-8">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-slate-900 border border-amber-500/30 text-amber-400 text-xs font-black tracking-widest uppercase shadow-xl">
            <span>✨ Midlex Law Reporting &amp; Author Book Publishing Platform</span>
          </div>

          <h1 className="text-4xl sm:text-6xl font-black text-white tracking-tight max-w-5xl mx-auto leading-tight">
            Empowering Legal Authors, Law Reporting &amp; Judicial Analytics
          </h1>

          <p className="text-slate-300 text-base sm:text-lg max-w-3xl mx-auto leading-relaxed font-normal">
            A dedicated publishing destination for lawyers, judges, law professors, and legal researchers. Publish law reports, authoritative textbooks, case digests, and academic legal journals with full ISBN assignment, indexing, and digital analytics.
          </p>

          <div className="flex flex-wrap items-center justify-center gap-4 pt-4">
            <button
              onClick={() => setIsSubmissionModalOpen(true)}
              className="px-8 py-4 bg-amber-500 hover:bg-amber-600 text-slate-950 font-black text-sm uppercase tracking-wider rounded-2xl shadow-xl shadow-amber-500/20 transition-all"
            >
              📚 Publish Your Legal Book / Article Now →
            </button>
            <a
              href="#services"
              className="px-8 py-4 bg-slate-900 hover:bg-slate-800 text-white font-bold text-sm rounded-2xl border border-slate-800 transition-all"
            >
              🔍 Learn How Publishing Works
            </a>
          </div>

          {/* Quick Metrics Bar */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-4xl mx-auto pt-12">
            <div className="p-6 bg-slate-900/80 rounded-2xl border border-slate-800 backdrop-blur-md">
              <div className="text-3xl font-black text-amber-400">100%</div>
              <div className="text-xs font-bold text-slate-300 mt-1 uppercase tracking-wider">Peer Reviewed &amp; Indexed</div>
            </div>
            <div className="p-6 bg-slate-900/80 rounded-2xl border border-slate-800 backdrop-blur-md">
              <div className="text-3xl font-black text-amber-400">Official ISBN</div>
              <div className="text-xs font-bold text-slate-300 mt-1 uppercase tracking-wider">Legal Cataloguing</div>
            </div>
            <div className="p-6 bg-slate-900/80 rounded-2xl border border-slate-800 backdrop-blur-md">
              <div className="text-3xl font-black text-emerald-400">Digital &amp; Print</div>
              <div className="text-xs font-bold text-slate-300 mt-1 uppercase tracking-wider">Hardcover &amp; E-Book</div>
            </div>
            <div className="p-6 bg-slate-900/80 rounded-2xl border border-slate-800 backdrop-blur-md">
              <div className="text-3xl font-black text-amber-400">Judicial Precedent</div>
              <div className="text-xs font-bold text-slate-300 mt-1 uppercase tracking-wider">Citation Analytics</div>
            </div>
          </div>
        </div>
      </section>

      {/* Services Grid Section */}
      <section id="services" className="py-20 bg-slate-900/50 border-t border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
          <div className="text-center space-y-3">
            <span className="px-3 py-1 bg-amber-500/10 text-amber-400 text-xs font-black uppercase tracking-widest rounded-full border border-amber-500/20">
              OUR PUBLISHING SERVICES
            </span>
            <h2 className="text-3xl sm:text-4xl font-black text-white">What You Can Publish on Midlex Analytics</h2>
            <p className="text-slate-400 text-sm max-w-2xl mx-auto">
              Whether you are an advocate writing a legal commentary or a law faculty publishing a law review journal, Midlex Analytics handles end-to-end editorial, design, ISBN registration, and analytics distribution.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {/* Pillar 1 */}
            <div className="p-8 bg-slate-900 rounded-3xl border border-slate-800 hover:border-amber-500/50 transition-all space-y-4">
              <div className="w-14 h-14 rounded-2xl bg-amber-500/10 border border-amber-500/30 text-amber-400 text-2xl flex items-center justify-center font-bold">
                ⚖️
              </div>
              <h3 className="text-xl font-black text-white">Law Reports &amp; Case Digests</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Comprehensive reporting of Supreme Court of Nigeria, Court of Appeal, Federal High Court rulings, and specialized arbitration tribunals.
              </p>
              <ul className="text-[11px] text-slate-300 space-y-1.5 pt-2 border-t border-slate-800 font-medium">
                <li>• Subject matter indexing</li>
                <li>• Ratio decidendi extraction</li>
                <li>• Judicial bench citations</li>
              </ul>
            </div>

            {/* Pillar 2 */}
            <div className="p-8 bg-slate-900 rounded-3xl border border-slate-800 hover:border-amber-500/50 transition-all space-y-4">
              <div className="w-14 h-14 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-2xl flex items-center justify-center font-bold">
                📖
              </div>
              <h3 className="text-xl font-black text-white">Author Textbook Publishing</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Publish legal textbooks, practice handbooks, and legal treatises with official ISBN registration, hardcover printing, and worldwide distribution.
              </p>
              <ul className="text-[11px] text-slate-300 space-y-1.5 pt-2 border-t border-slate-800 font-medium">
                <li>• Editorial proofing &amp; layout</li>
                <li>• Official ISBN &amp; bar coding</li>
                <li>• Hardcover &amp; paperback print</li>
              </ul>
            </div>

            {/* Pillar 3 */}
            <div className="p-8 bg-slate-900 rounded-3xl border border-slate-800 hover:border-amber-500/50 transition-all space-y-4">
              <div className="w-14 h-14 rounded-2xl bg-blue-500/10 border border-blue-500/30 text-blue-400 text-2xl flex items-center justify-center font-bold">
                📈
              </div>
              <h3 className="text-xl font-black text-white">Judicial Analytics &amp; Trends</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Data-driven analytics tracking judicial precedent trends, judge citation counts, appellate reversal rates, and legal research metrics.
              </p>
              <ul className="text-[11px] text-slate-300 space-y-1.5 pt-2 border-t border-slate-800 font-medium">
                <li>• Case citation velocity</li>
                <li>• Court bench statistics</li>
                <li>• Appellate win metrics</li>
              </ul>
            </div>

            {/* Pillar 4 */}
            <div className="p-8 bg-slate-900 rounded-3xl border border-slate-800 hover:border-amber-500/50 transition-all space-y-4">
              <div className="w-14 h-14 rounded-2xl bg-purple-500/10 border border-purple-500/30 text-purple-400 text-2xl flex items-center justify-center font-bold">
                🎓
              </div>
              <h3 className="text-xl font-black text-white">Academic Law Journals</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Peer-reviewed academic publishing platform for university faculties of law, Nigerian Bar Association branches, and legal scholars.
              </p>
              <ul className="text-[11px] text-slate-300 space-y-1.5 pt-2 border-t border-slate-800 font-medium">
                <li>• Peer review board portal</li>
                <li>• Online journal archiving</li>
                <li>• DOI assignment</li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Publications Catalogue Section */}
      <section id="catalogue" className="py-20 bg-slate-950">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
            <div>
              <span className="px-3 py-1 bg-amber-500/10 text-amber-400 text-xs font-black uppercase tracking-widest rounded-full border border-amber-500/20">
                MIDLEX PUBLISHING CATALOGUE
              </span>
              <h2 className="text-3xl sm:text-4xl font-black text-white mt-2">Featured Legal Books &amp; Law Reports</h2>
              <p className="text-slate-400 text-sm mt-1">Explore authoritative titles published under Midlex Analytics &amp; Publishing</p>
            </div>
            <button
              onClick={() => setIsSubmissionModalOpen(true)}
              className="px-6 py-3 bg-amber-500 hover:bg-amber-600 text-slate-950 font-black text-xs uppercase tracking-wider rounded-xl transition-all shadow-md"
            >
              + Publish Your Book With Us
            </button>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {/* Book 1 */}
            <div className="bg-slate-900 rounded-3xl p-6 border border-slate-800 space-y-4 hover:border-amber-500/40 transition-all flex flex-col justify-between">
              <div className="space-y-3">
                <div className="h-44 bg-slate-950 rounded-2xl border border-slate-800 p-6 flex flex-col justify-between relative overflow-hidden">
                  <div className="absolute -right-6 -bottom-6 w-24 h-24 bg-amber-500/20 rounded-full blur-xl" />
                  <span className="text-[10px] font-black text-amber-400 uppercase tracking-widest">SUPREME COURT LAW REPORT</span>
                  <h4 className="text-lg font-black text-white">Midlex Supreme Court Reports (MSCR) Vol. 4</h4>
                  <span className="text-xs text-slate-400 font-bold">Edited by Midlex Editorial Board</span>
                </div>
                <p className="text-xs text-slate-400 leading-relaxed">
                  Comprehensive reporting of landmark 2026 Supreme Court judgments on Election Appeals, Realty, and Commercial Disputes.
                </p>
              </div>
              <div className="pt-4 border-t border-slate-800 flex items-center justify-between text-xs">
                <span className="font-mono text-amber-400">ISBN: 978-978-990-112-4</span>
                <span className="px-2.5 py-1 bg-emerald-500/10 text-emerald-400 font-bold rounded-md">Published</span>
              </div>
            </div>

            {/* Book 2 */}
            <div className="bg-slate-900 rounded-3xl p-6 border border-slate-800 space-y-4 hover:border-amber-500/40 transition-all flex flex-col justify-between">
              <div className="space-y-3">
                <div className="h-44 bg-slate-950 rounded-2xl border border-slate-800 p-6 flex flex-col justify-between relative overflow-hidden">
                  <div className="absolute -right-6 -bottom-6 w-24 h-24 bg-blue-500/20 rounded-full blur-xl" />
                  <span className="text-[10px] font-black text-blue-400 uppercase tracking-widest">LEGAL TEXTBOOK</span>
                  <h4 className="text-lg font-black text-white">Nigerian Appellate Practice &amp; Procedure</h4>
                  <span className="text-xs text-slate-400 font-bold">By Samson Sabbat, SAN</span>
                </div>
                <p className="text-xs text-slate-400 leading-relaxed">
                  Authoritative legal textbook detailing Court of Appeal rules, brief writing, oral advocacy, and stay of execution practice.
                </p>
              </div>
              <div className="pt-4 border-t border-slate-800 flex items-center justify-between text-xs">
                <span className="font-mono text-amber-400">ISBN: 978-978-884-331-0</span>
                <span className="px-2.5 py-1 bg-emerald-500/10 text-emerald-400 font-bold rounded-md">Published</span>
              </div>
            </div>

            {/* Book 3 */}
            <div className="bg-slate-900 rounded-3xl p-6 border border-slate-800 space-y-4 hover:border-amber-500/40 transition-all flex flex-col justify-between">
              <div className="space-y-3">
                <div className="h-44 bg-slate-950 rounded-2xl border border-slate-800 p-6 flex flex-col justify-between relative overflow-hidden">
                  <div className="absolute -right-6 -bottom-6 w-24 h-24 bg-purple-500/20 rounded-full blur-xl" />
                  <span className="text-[10px] font-black text-purple-400 uppercase tracking-widest">PROPERTY LAW DIGEST</span>
                  <h4 className="text-lg font-black text-white">Realty, Certificate of Occupancy &amp; Land Title Digest</h4>
                  <span className="text-xs text-slate-400 font-bold">By Midlex Property Practice Group</span>
                </div>
                <p className="text-xs text-slate-400 leading-relaxed">
                  Essential handbook on land documentation, governor's consent, C of O verification, and property dispute precedents in Nigeria.
                </p>
              </div>
              <div className="pt-4 border-t border-slate-800 flex items-center justify-between text-xs">
                <span className="font-mono text-amber-400">ISBN: 978-978-771-002-9</span>
                <span className="px-2.5 py-1 bg-emerald-500/10 text-emerald-400 font-bold rounded-md">Published</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-slate-900 border-t border-slate-800 py-12 mt-auto text-xs text-slate-400">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-4">
            <Image src="/logo.jpg" alt="Midlex" width={110} height={35} className="h-8 w-auto object-contain" />
            <p>© {new Date().getFullYear()} Midlex Legal Practice &amp; Analytics Publishing. All rights reserved.</p>
          </div>
          <div className="flex items-center gap-6 text-slate-400">
            <a href="#services" className="hover:text-amber-400 transition-colors">Publishing Services</a>
            <a href="#catalogue" className="hover:text-amber-400 transition-colors">Catalogue</a>
            <button onClick={() => setIsSubmissionModalOpen(true)} className="hover:text-amber-400 transition-colors">Submit Manuscript</button>
          </div>
        </div>
      </footer>

      {/* MANUSCRIPT SUBMISSION MODAL */}
      <AnimatePresence>
        {isSubmissionModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-md">
            <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }} className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 max-w-xl w-full space-y-6 shadow-2xl">
              <div>
                <span className="px-3 py-1 bg-amber-500/20 text-amber-400 text-[10px] font-black uppercase tracking-widest rounded-full border border-amber-500/30">
                  MIDLEX PUBLISHING PROPOSAL FORM
                </span>
                <h3 className="text-2xl font-black text-white mt-2">Publish Your Legal Work With Midlex</h3>
                <p className="text-xs text-slate-400 mt-1">
                  Submit your law report volume, legal textbook, article, or case digest proposal to our editorial board.
                </p>
              </div>

              <form onSubmit={handleSubmit} className="space-y-4 text-xs">
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-slate-300 font-bold uppercase mb-1">Author Full Name *</label>
                    <input
                      type="text"
                      required
                      value={formData.authorName}
                      onChange={(e) => setFormData({ ...formData, authorName: e.target.value })}
                      className="w-full p-3 bg-slate-950 border border-slate-800 rounded-xl text-white focus:border-amber-500 focus:outline-none"
                      placeholder="e.g. Samson Sabbat, SAN"
                    />
                  </div>
                  <div>
                    <label className="block text-slate-300 font-bold uppercase mb-1">Professional Title / Bar Qualification</label>
                    <input
                      type="text"
                      value={formData.qualification}
                      onChange={(e) => setFormData({ ...formData, qualification: e.target.value })}
                      className="w-full p-3 bg-slate-950 border border-slate-800 rounded-xl text-white focus:border-amber-500 focus:outline-none"
                      placeholder="e.g. LL.B, BL, Senior Advocate"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-slate-300 font-bold uppercase mb-1">Work Email Address *</label>
                    <input
                      type="email"
                      required
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      className="w-full p-3 bg-slate-950 border border-slate-800 rounded-xl text-white focus:border-amber-500 focus:outline-none"
                      placeholder="author@midlex.com"
                    />
                  </div>
                  <div>
                    <label className="block text-slate-300 font-bold uppercase mb-1">Phone Number</label>
                    <input
                      type="text"
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      className="w-full p-3 bg-slate-950 border border-slate-800 rounded-xl text-white focus:border-amber-500 focus:outline-none"
                      placeholder="+234 803 000 0000"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-slate-300 font-bold uppercase mb-1">Publishing Category *</label>
                  <select
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    className="w-full p-3 bg-slate-950 border border-slate-800 rounded-xl text-white focus:border-amber-500 focus:outline-none font-bold"
                  >
                    <option value="LEGAL_TEXTBOOK">📖 Legal Textbook / Treatise</option>
                    <option value="LAW_REPORT">⚖️ Law Report Volume &amp; Case Digest</option>
                    <option value="JOURNAL_ARTICLE">🎓 Academic Legal Journal Article</option>
                    <option value="PRACTICE_HANDBOOK">📑 Advocates Practice Handbook</option>
                  </select>
                </div>

                <div>
                  <label className="block text-slate-300 font-bold uppercase mb-1">Manuscript / Book Title *</label>
                  <input
                    type="text"
                    required
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    className="w-full p-3 bg-slate-950 border border-slate-800 rounded-xl text-white focus:border-amber-500 focus:outline-none"
                    placeholder="e.g. Modern Principles of Commercial Arbitration in Nigeria"
                  />
                </div>

                <div>
                  <label className="block text-slate-300 font-bold uppercase mb-1">Abstract / Overview Summary</label>
                  <textarea
                    rows={3}
                    value={formData.abstract}
                    onChange={(e) => setFormData({ ...formData, abstract: e.target.value })}
                    className="w-full p-3 bg-slate-950 border border-slate-800 rounded-xl text-white focus:border-amber-500 focus:outline-none"
                    placeholder="Provide a brief summary of your manuscript contents, chapter breakdown, or target legal audience..."
                  />
                </div>

                <div className="flex justify-end gap-3 pt-4 border-t border-slate-800">
                  <button
                    type="button"
                    onClick={() => setIsSubmissionModalOpen(false)}
                    className="px-5 py-3 bg-slate-800 text-slate-300 font-bold text-xs rounded-xl hover:bg-slate-700 transition-all"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={isSuccess}
                    className="px-7 py-3 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-slate-950 font-black text-xs uppercase tracking-wider rounded-xl shadow-lg transition-all"
                  >
                    {isSuccess ? 'Submitting...' : 'Submit Manuscript Proposal →'}
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
