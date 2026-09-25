"use client";
import React, { useState } from 'react';
import { apiFetch } from '@/lib/api';
import { motion, AnimatePresence } from 'framer-motion';

export default function CourtDateModal({ 
  caseId, 
  isOpen, 
  onClose, 
  onScheduled 
}: { 
  caseId: string; 
  isOpen: boolean; 
  onClose: () => void;
  onScheduled: () => void;
}) {
  const [formData, setFormData] = useState({ date: '', location: '', description: '' });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      await apiFetch('/court-dates', {
        method: 'POST',
        body: JSON.stringify({
          caseId,
          date: new Date(formData.date).toISOString(),
          location: formData.location,
          description: formData.description,
        }),
      });
      onScheduled();
      onClose();
    } catch (error) {
      console.error('Error scheduling court date:', error);
      alert('Failed to schedule court date');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-primary/60 backdrop-blur-sm"
          />
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            className="relative w-full max-w-lg bg-white rounded-[40px] shadow-2xl p-10 overflow-hidden"
          >
            <h3 className="text-2xl font-bold text-primary mb-2">Schedule Court Date</h3>
            <p className="text-gray-500 mb-8">Set the date and location for the next hearing.</p>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label className="block text-sm font-bold text-primary mb-2">Date & Time</label>
                <input
                  type="datetime-local"
                  value={formData.date}
                  onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                  className="w-full px-6 py-4 bg-gray-50 border border-gray-100 rounded-2xl focus:outline-none focus:ring-2 focus:ring-secondary/20 transition-all"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-bold text-primary mb-2">Court Location</label>
                <input
                  type="text"
                  value={formData.location}
                  onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                  className="w-full px-6 py-4 bg-gray-50 border border-gray-100 rounded-2xl focus:outline-none focus:ring-2 focus:ring-secondary/20 transition-all"
                  placeholder="e.g., High Court 1, Benin City"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-bold text-primary mb-2">Notes</label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="w-full px-6 py-4 bg-gray-50 border border-gray-100 rounded-2xl focus:outline-none focus:ring-2 focus:ring-secondary/20 transition-all"
                  placeholder="e.g., Initial hearing for motion"
                />
              </div>

              <div className="flex gap-4 pt-4">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-8 py-4 text-gray-400 font-bold hover:text-primary transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="flex-1 py-4 bg-secondary text-white font-bold rounded-2xl shadow-lg shadow-secondary/20 hover:bg-secondary/90 transition-all disabled:opacity-50"
                >
                  {isSubmitting ? 'Scheduling...' : 'Confirm Date'}
                </button>
              </div>
            </form>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
