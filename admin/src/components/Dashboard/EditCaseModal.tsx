"use client";
import React, { useState, useEffect } from 'react';
import { apiFetch } from '@/lib/api';

interface EditCaseModalProps {
  isOpen: boolean;
  onClose: () => void;
  onUpdated: () => void;
  caseItem: {
    id: string;
    title: string;
    description?: string;
  } | null;
}

export default function EditCaseModal({
  isOpen,
  onClose,
  onUpdated,
  caseItem,
}: EditCaseModalProps) {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (caseItem) {
      setTitle(caseItem.title || '');
      setDescription(caseItem.description || '');
    }
  }, [caseItem]);

  if (!isOpen || !caseItem) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) {
      alert('Case title cannot be empty.');
      return;
    }
    setIsSubmitting(true);
    try {
      await apiFetch(`/cases/${caseItem.id}`, {
        method: 'PATCH',
        body: JSON.stringify({
          title: title.trim(),
          description: description.trim(),
        }),
      });
      alert('Case title updated successfully!');
      onUpdated();
      onClose();
    } catch (error: any) {
      console.error('Failed to update case title:', error);
      alert(error.message || 'Failed to update case title.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div className="bg-white rounded-[32px] max-w-lg w-full p-8 shadow-2xl space-y-6">
        <div className="flex justify-between items-center border-b pb-4">
          <h3 className="text-xl font-bold text-primary flex items-center gap-2">
            ✏️ Edit Case Title & Details
          </h3>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 text-lg font-bold"
          >
            ✕
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-bold uppercase text-gray-400 mb-2">
              Case Title *
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full px-4 py-3 border border-gray-200 rounded-xl font-semibold text-primary focus:outline-none focus:border-secondary text-sm"
              placeholder="Enter case title"
              required
            />
          </div>

          <div>
            <label className="block text-xs font-bold uppercase text-gray-400 mb-2">
              Case Summary / Description
            </label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={4}
              className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm text-gray-700 focus:outline-none focus:border-secondary"
              placeholder="Enter case description..."
            />
          </div>

          <div className="flex justify-end gap-3 pt-4 border-t">
            <button
              type="button"
              onClick={onClose}
              className="px-5 py-3 rounded-xl text-gray-500 font-bold hover:bg-gray-100 transition-all text-xs"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-6 py-3 bg-secondary text-white font-bold rounded-xl shadow-lg shadow-secondary/20 hover:bg-secondary/90 transition-all text-xs disabled:opacity-50"
            >
              {isSubmitting ? 'Saving...' : 'Save Title Changes'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
