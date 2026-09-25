"use client";
import React, { useState, useEffect } from 'react';
import { apiFetch, getApiBaseUrl } from '@/lib/api';
import { useAuth } from '@/context/AuthContext';

interface Document {
  id: string;
  name: string;
  url: string;
  type: string;
  createdAt: string;
  uploadedBy: { name: string };
}

export default function DocumentManager({ caseId, status }: { caseId: string, status: string }) {
  const [documents, setDocuments] = useState<Document[]>([]);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadName, setUploadName] = useState('');
  const fileInputRef = React.useRef<HTMLInputElement>(null);
  const { token } = useAuth();

  const fetchDocuments = async () => {
    try {
      const data = await apiFetch(`/documents/case/${caseId}`);
      setDocuments(data);
    } catch (error) {
      console.error('Error fetching documents:', error);
    }
  };

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    fetchDocuments();
  }, [caseId]);

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (!uploadName.trim()) {
      alert('Please enter a document name before uploading.');
      e.target.value = '';
      return;
    }

    setIsUploading(true);
    const formData = new FormData();
    formData.append('file', file);
    formData.append('caseId', caseId);
    formData.append('name', uploadName);

    try {
      // Note: apiFetch needs to handle FormData differently
      const response = await fetch(`${getApiBaseUrl()}/documents/upload`, {
        method: 'POST',
        headers: {
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: formData,
      });

      if (!response.ok) {
        const err = await response.json().catch(() => ({ message: 'Upload failed' }));
        throw new Error(err.message || 'Upload failed');
      }
      
      setUploadName('');
      fetchDocuments();
    } catch (error) {
      console.error('Upload error:', error);
      alert('Failed to upload document');
    } finally {
      setIsUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  return (
    <div id="case-files-section" className="bg-white rounded-[40px] border border-gray-100 p-8 sm:p-10 space-y-8 shadow-sm">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-gray-100 pb-6">
        <div>
          <div className="flex items-center gap-3">
            <h3 className="text-2xl font-bold text-primary">Case Documents</h3>
            <span className="text-xs font-bold px-3 py-1 bg-gray-100 text-gray-500 rounded-full">
              {documents.length} Files
            </span>
          </div>
          <p className="text-xs text-gray-400 mt-1">Upload and manage legal documents, evidence, and court filings for this case.</p>
        </div>

        <button
          onClick={() => {
            const link = `${window.location.origin}/share/case/${caseId}`;
            navigator.clipboard.writeText(link);
            alert(`Shareable Case Files Link copied!\n\nLink: ${link}`);
          }}
          type="button"
          className="flex items-center justify-center gap-2 px-6 py-3.5 bg-[#C5A059] hover:bg-[#b08e4b] text-white font-bold rounded-2xl shadow-lg shadow-[#C5A059]/20 transition-all text-xs shrink-0"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 100-5.368 3 3 0 000 5.368zm0 9.5a3 3 0 100-5.368 3 3 0 000 5.368z" />
          </svg>
          Share Case Files
        </button>
      </div>

      <div className="space-y-4">
        {documents.map((doc, index) => (
          <div key={doc.id} className="flex items-center justify-between p-6 bg-gray-50 rounded-3xl border border-transparent hover:border-gray-200 transition-all group">
            <div className="flex items-center gap-5">
              <div className="w-12 h-12 bg-primary/10 rounded-2xl flex items-center justify-center text-primary font-extrabold text-sm shadow-sm shrink-0">
                #{index + 1}
              </div>
              <div>
                <div className="flex items-center gap-2 flex-wrap">
                  <h4 className="font-bold text-primary text-base">{doc.name}</h4>
                  <span className="text-[10px] font-extrabold px-2.5 py-0.5 bg-primary/10 text-primary rounded-full uppercase tracking-wider">
                    {doc.type.split('/')[1] || doc.type || 'DOC'}
                  </span>
                </div>
                <p className="text-xs text-gray-400 mt-1 uppercase tracking-widest font-semibold">
                  File #{index + 1} • Uploaded by {doc.uploadedBy?.name || 'Staff'} • {new Date(doc.createdAt).toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' })}
                </p>
              </div>
            </div>
            <a 
              href={doc.url} 
              target="_blank" 
              rel="noreferrer"
              className="px-6 py-2.5 bg-white border border-gray-200 text-primary font-bold rounded-xl text-xs hover:bg-primary hover:text-white transition-all shadow-sm flex items-center gap-2 shrink-0"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
              </svg>
              View Document
            </a>
          </div>
        ))}
      </div>

      {status !== 'CLOSED' && (
        <div className="pt-8 border-t border-gray-50">
        <div className="space-y-4">
          <input
            type="text"
            value={uploadName}
            onChange={(e) => setUploadName(e.target.value)}
            className="w-full px-6 py-4 bg-gray-50 border border-gray-100 rounded-2xl focus:outline-none focus:ring-2 focus:ring-secondary/20 transition-all text-sm"
            placeholder="Document Name (e.g., Witness Statement)"
          />
          <label className={`w-full flex items-center justify-center gap-4 py-8 border-2 border-dashed border-gray-200 rounded-[32px] cursor-pointer hover:border-secondary/30 hover:bg-secondary/5 transition-all ${isUploading ? 'opacity-50 pointer-events-none' : ''}`}>
            <div className="text-center">
              <svg className="w-8 h-8 text-gray-400 mx-auto mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" />
              </svg>
              <p className="text-sm font-bold text-gray-500">
                {isUploading ? 'Uploading...' : 'Click to Upload Document'}
              </p>
            </div>
            <input
              ref={fileInputRef}
              type="file"
              className="hidden"
              onChange={handleUpload}
              disabled={isUploading}
            />
          </label>
          </div>
        </div>
      )}
    </div>
  );
}
