"use client";

import React, { useEffect, useState, use } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { FileText, Download, Share2, Shield, Check, Calendar, User, ArrowLeft, ExternalLink, Printer } from 'lucide-react';
import { getApiBaseUrl } from '@/lib/api';
const API_BASE_URL = getApiBaseUrl();

interface SharedCase {
  id: string;
  title: string;
  description: string;
  status: string;
  createdAt: string;
  clientName: string;
  lawyerName: string;
  documents: Array<{
    id: string;
    title: string;
    fileUrl: string;
    fileType: string;
    createdAt: string;
  }>;
}

export default function PublicCaseSharePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const [caseData, setCaseData] = useState<SharedCase | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    async function loadPublicCase() {
      try {
        const res = await fetch(`${API_BASE_URL}/cases/public-share/${id}`);
        if (!res.ok) {
          throw new Error('Case file not found or invalid link');
        }
        const data = await res.json();
        setCaseData(data);
      } catch (err: any) {
        setError(err.message || 'Unable to load case file');
      } finally {
        setIsLoading(false);
      }
    }
    loadPublicCase();
  }, [id]);

  const handleCopyLink = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopied(true);
    setTimeout(() => setCopied(false), 3000);
  };

  const resolveFileUrl = (url: string) => {
    if (!url) return '#';
    if (url.startsWith('http://') || url.startsWith('https://')) return url;
    return `${API_BASE_URL.replace('/api', '')}${url.startsWith('/') ? '' : '/'}${url}`;
  };

  if (isLoading) {
    return (
      <main className="min-h-screen bg-[#fafafa] flex items-center justify-center p-4">
        <div className="text-center space-y-4">
          <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto" />
          <p className="text-gray-500 font-bold">Loading Secure Shared Case File...</p>
        </div>
      </main>
    );
  }

  if (error || !caseData) {
    return (
      <main className="min-h-screen bg-[#fafafa] flex items-center justify-center p-4">
        <div className="max-w-md w-full bg-white rounded-[32px] p-8 shadow-xl border border-gray-100 text-center space-y-6">
          <div className="w-16 h-16 bg-red-50 text-red-500 rounded-full flex items-center justify-center mx-auto">
            <Shield size={32} />
          </div>
          <h1 className="text-2xl font-bold text-slate-900">Case File Unavailable</h1>
          <p className="text-gray-500 text-sm">{error || "The requested shared case file could not be found or has expired."}</p>
          <Link href="/" className="inline-block px-8 py-3 bg-primary text-white font-bold rounded-2xl shadow-lg">
            Return to Homepage
          </Link>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[#f8fafc] text-slate-900 pb-20">
      {/* Header Bar */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-3">
            <img src="/logo.jpg" alt="Midlex LLP" className="h-12 w-auto object-contain" />
            <span className="font-extrabold text-primary text-lg hidden sm:inline">Midlex LLP</span>
          </Link>
          <div className="flex items-center gap-3">
            <span className="hidden md:inline-flex items-center gap-1.5 px-3 py-1 bg-amber-50 text-amber-700 text-xs font-bold rounded-full border border-amber-200">
              <Shield size={14} /> Official Shared Legal File
            </span>
            <button
              onClick={handleCopyLink}
              className="flex items-center gap-2 px-5 py-2.5 bg-primary text-white font-bold text-sm rounded-xl hover:bg-primary/90 transition-all shadow-md"
            >
              {copied ? <Check size={16} /> : <Share2 size={16} />}
              {copied ? "Link Copied!" : "Share Link"}
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 pt-10 space-y-8">
        <Link href="/" className="inline-flex items-center gap-2 text-sm font-bold text-gray-500 hover:text-primary transition-colors">
          <ArrowLeft size={16} /> Back to Midlex LLP
        </Link>

        {/* Case Banner */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-[32px] p-8 md:p-10 shadow-xl border border-gray-100 relative overflow-hidden"
        >
          <div className="absolute top-0 right-0 w-48 h-48 bg-primary/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
          
          <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
            <div className="flex items-center gap-3">
              <span className={`px-4 py-1 rounded-full text-xs font-bold uppercase tracking-wider ${
                caseData.status === 'OPEN' ? 'bg-green-100 text-green-700' : 'bg-blue-100 text-blue-700'
              }`}>
                {caseData.status === 'OPEN' || caseData.status === 'NEW' ? 'CASE MATTER REGISTERED' : caseData.status.replace('_', ' ')}
              </span>
              <span className="text-xs font-bold text-gray-400">REF: #{caseData.id.slice(0, 8).toUpperCase()}</span>
            </div>
            <span className="text-xs font-semibold text-gray-500 flex items-center gap-1">
              <Calendar size={14} /> Created: {new Date(caseData.createdAt).toLocaleDateString()}
            </span>
          </div>

          <h1 className="text-3xl font-extrabold text-primary mb-4">{caseData.title}</h1>
          <p className="text-gray-600 text-base leading-relaxed mb-8">{caseData.description}</p>

          <div className="grid sm:grid-cols-2 gap-6 pt-6 border-t border-gray-100">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-primary/10 rounded-xl flex items-center justify-center text-primary font-bold">
                <User size={20} />
              </div>
              <div>
                <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">Client Name</p>
                <p className="font-bold text-slate-900">{caseData.clientName}</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-secondary/20 rounded-xl flex items-center justify-center text-secondary font-bold">
                <Shield size={20} />
              </div>
              <div>
                <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">Lead Counsel</p>
                <p className="font-bold text-slate-900">{caseData.lawyerName}</p>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Documents Section */}
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-bold text-slate-900 flex items-center gap-3">
              <FileText className="text-primary" size={28} />
              Case Files & Attached Documents ({caseData.documents.length})
            </h2>
            {caseData.documents.length > 0 && (
              <button
                onClick={() => window.print()}
                className="hidden sm:inline-flex items-center gap-2 text-sm font-bold text-gray-500 hover:text-primary transition-colors"
              >
                <Printer size={16} /> Print Case Index
              </button>
            )}
          </div>

          {caseData.documents.length === 0 ? (
            <div className="bg-white rounded-[24px] p-12 text-center border border-gray-100 space-y-4">
              <FileText className="w-16 h-16 text-gray-300 mx-auto" />
              <h3 className="text-lg font-bold text-slate-700">No Documents Uploaded Yet</h3>
              <p className="text-gray-400 text-sm">No public file attachments have been uploaded to this case file.</p>
            </div>
          ) : (
            <div className="grid gap-4">
              {caseData.documents.map((doc, idx) => (
                <motion.div
                  key={doc.id || idx}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: idx * 0.05 }}
                  className="bg-white rounded-[24px] p-6 border border-gray-100 shadow-md hover:shadow-lg transition-all flex flex-col md:flex-row md:items-center justify-between gap-4"
                >
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 bg-primary/10 rounded-2xl flex items-center justify-center text-primary font-extrabold text-base shrink-0">
                      #{idx + 1}
                    </div>
                    <div>
                      <div className="flex items-center gap-2 flex-wrap">
                        <h3 className="font-bold text-slate-900 text-lg">{doc.title}</h3>
                        <span className="text-[10px] font-extrabold px-2.5 py-0.5 bg-amber-100 text-amber-800 rounded-full uppercase tracking-wider">
                          {doc.fileType || 'FILE'}
                        </span>
                      </div>
                      <div className="flex flex-wrap items-center gap-3 text-xs text-gray-500 mt-1">
                        <span>Shared File #{idx + 1}</span>
                        <span>•</span>
                        <span>Uploaded: {new Date(doc.createdAt).toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' })}</span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 self-end md:self-center">
                    <a
                      href={resolveFileUrl(doc.fileUrl)}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-2 px-4 py-2.5 bg-gray-100 hover:bg-gray-200 text-slate-800 font-bold text-sm rounded-xl transition-all"
                    >
                      <ExternalLink size={16} /> Preview
                    </a>
                    <a
                      href={resolveFileUrl(doc.fileUrl)}
                      download
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-2 px-5 py-2.5 bg-primary text-white font-bold text-sm rounded-xl hover:bg-primary/90 transition-all shadow-md"
                    >
                      <Download size={16} /> Download
                    </a>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </div>
    </main>
  );
}
