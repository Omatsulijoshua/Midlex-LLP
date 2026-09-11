"use client";
import React, { useState, useEffect } from 'react';
import { apiFetch } from '@/lib/api';
import { useAuth } from '@/context/AuthContext';
import { motion, AnimatePresence } from 'framer-motion';

interface TimelineEvent {
  id: string;
  title: string;
  description?: string;
  status?: string;
  date: string;
  createdByName?: string;
}

interface CaseTimelineWidgetProps {
  caseId: string;
  caseStatus: string;
}

export default function CaseTimelineWidget({ caseId, caseStatus }: CaseTimelineWidgetProps) {
  const { user } = useAuth();
  const [timeline, setTimeline] = useState<TimelineEvent[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Form State
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [status, setStatus] = useState('IN_PROGRESS');
  const [eventDate, setEventDate] = useState('');

  const fetchTimeline = async () => {
    try {
      const data = await apiFetch(`/cases/${caseId}/timeline`);
      if (Array.isArray(data)) {
        setTimeline(data);
      }
    } catch (err) {
      console.error('Failed to load timeline:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchTimeline();
  }, [caseId]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    setIsSubmitting(true);
    try {
      await apiFetch(`/cases/${caseId}/timeline`, {
        method: 'POST',
        body: JSON.stringify({
          title,
          description,
          status,
          date: eventDate ? new Date(eventDate).toISOString() : new Date().toISOString(),
        }),
      });

      setTitle('');
      setDescription('');
      setStatus('IN_PROGRESS');
      setEventDate('');
      setIsModalOpen(false);
      fetchTimeline();
    } catch (err) {
      console.error('Failed to add timeline event:', err);
      alert('Failed to add timeline entry. Please check server connection.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (timelineId: string) => {
    if (!confirm('Are you sure you want to delete this timeline update?')) return;
    try {
      await apiFetch(`/cases/${caseId}/timeline/${timelineId}`, {
        method: 'DELETE',
      });
      fetchTimeline();
    } catch (err) {
      console.error('Failed to delete timeline event:', err);
    }
  };

  const getStatusBadgeClass = (st?: string) => {
    switch (st) {
      case 'OPEN':
        return 'bg-emerald-50 text-emerald-700 border-emerald-200';
      case 'IN_PROGRESS':
        return 'bg-blue-50 text-blue-700 border-blue-200';
      case 'HEARING':
      case 'IN_COURT':
        return 'bg-amber-50 text-amber-700 border-amber-200';
      case 'COMPLETED':
      case 'CLOSED':
      case 'RESOLVED':
        return 'bg-purple-50 text-purple-700 border-purple-200';
      default:
        return 'bg-gray-50 text-gray-700 border-gray-200';
    }
  };

  const canEdit = user?.role === 'ADMIN' || user?.role === 'LAWYER';

  return (
    <div className="bg-white rounded-[40px] border border-gray-100 p-8 space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h3 className="text-xl font-bold text-primary flex items-center gap-2">
            <span>⏱️</span> Case Timeline & Milestones
          </h3>
          <p className="text-xs text-gray-500 mt-1">
            Chronological progress track from initial filing to resolution.
          </p>
        </div>

        {canEdit && (
          <button
            onClick={() => setIsModalOpen(true)}
            className="inline-flex items-center justify-center gap-2 px-5 py-2.5 bg-primary hover:bg-primary/90 text-white font-bold text-xs rounded-2xl shadow-lg shadow-primary/20 transition-all"
          >
            <span>+</span> Add Progress Update
          </button>
        )}
      </div>

      {isLoading ? (
        <div className="py-8 text-center text-gray-400 text-sm animate-pulse">
          Loading case timeline...
        </div>
      ) : timeline.length === 0 ? (
        <div className="py-8 text-center text-gray-400 text-sm italic">
          No timeline events recorded yet.
        </div>
      ) : (
        <div className="relative pl-6 space-y-6 before:absolute before:left-2.5 before:top-3 before:bottom-3 before:w-0.5 before:bg-gray-200">
          {timeline.map((event, idx) => (
            <motion.div
              key={event.id || idx}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: idx * 0.05 }}
              className="relative group"
            >
              {/* Dot */}
              <div className="absolute -left-[30px] top-1 w-4 h-4 rounded-full border-2 border-white bg-secondary shadow-md" />

              <div className="bg-gray-50/70 hover:bg-gray-50 border border-gray-100 p-4 rounded-2xl transition-all">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <h4 className="font-bold text-primary text-sm sm:text-base">{event.title}</h4>
                    {event.status && (
                      <span
                        className={`text-[10px] uppercase tracking-wider font-extrabold px-2.5 py-0.5 rounded-full border ${getStatusBadgeClass(
                          event.status
                        )}`}
                      >
                        {event.status.replace('_', ' ')}
                      </span>
                    )}
                  </div>

                  <div className="flex items-center gap-3">
                    <span className="text-xs text-gray-400 font-medium">
                      📅 {new Date(event.date).toLocaleDateString(undefined, {
                        year: 'numeric',
                        month: 'short',
                        day: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit',
                      })}
                    </span>
                    {canEdit && (
                      <button
                        onClick={() => handleDelete(event.id)}
                        className="text-gray-300 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-opacity text-xs"
                        title="Delete event"
                      >
                        🗑️
                      </button>
                    )}
                  </div>
                </div>

                {event.description && (
                  <p className="text-xs sm:text-sm text-gray-600 mt-2 leading-relaxed whitespace-pre-wrap">
                    {event.description}
                  </p>
                )}

                {event.createdByName && (
                  <p className="text-[11px] text-gray-400 mt-3 flex items-center gap-1 font-medium">
                    <span>👤 Updated by {event.createdByName}</span>
                  </p>
                )}
              </div>
            </motion.div>
          ))}
        </div>
      )}

      {/* Add Event Modal */}
      <AnimatePresence>
        {isModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-white rounded-[32px] p-6 sm:p-8 max-w-lg w-full shadow-2xl border border-gray-100 space-y-6"
            >
              <div className="flex items-center justify-between border-b border-gray-100 pb-4">
                <div>
                  <h3 className="text-lg font-bold text-primary">Post Case Timeline Update</h3>
                  <p className="text-xs text-gray-400">Record a milestone or legal progress update for this case.</p>
                </div>
                <button
                  onClick={() => setIsModalOpen(false)}
                  className="w-8 h-8 rounded-full bg-gray-100 text-gray-500 flex items-center justify-center font-bold text-sm hover:bg-gray-200"
                >
                  ✕
                </button>
              </div>

              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-xs font-bold text-gray-600 uppercase mb-1">
                    Update Title *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Defense Motion Filed in High Court"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-secondary/30"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-600 uppercase mb-1">
                    Status Milestone
                  </label>
                  <select
                    value={status}
                    onChange={(e) => setStatus(e.target.value)}
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-secondary/30"
                  >
                    <option value="OPEN">Open (Filing)</option>
                    <option value="IN_PROGRESS">In Progress (Active Discovery/Pleadings)</option>
                    <option value="HEARING">Court Hearing / Trial</option>
                    <option value="PENDING">Pending Action / Review</option>
                    <option value="COMPLETED">Completed / Concluded</option>
                    <option value="CLOSED">Closed & Resolved</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-600 uppercase mb-1">
                    Event Date & Time (Optional)
                  </label>
                  <input
                    type="datetime-local"
                    value={eventDate}
                    onChange={(e) => setEventDate(e.target.value)}
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-secondary/30"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-600 uppercase mb-1">
                    Description & Summary
                  </label>
                  <textarea
                    rows={3}
                    placeholder="Provide details about what transpired during this milestone..."
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-secondary/30"
                  />
                </div>

                <div className="flex justify-end gap-3 pt-4 border-t border-gray-100">
                  <button
                    type="button"
                    onClick={() => setIsModalOpen(false)}
                    className="px-5 py-2.5 rounded-xl font-bold text-xs text-gray-500 hover:bg-gray-100"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="px-6 py-2.5 rounded-xl font-bold text-xs bg-secondary text-white hover:bg-secondary/90 shadow-lg shadow-secondary/20 disabled:opacity-50"
                  >
                    {isSubmitting ? 'Posting...' : 'Post Update'}
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
