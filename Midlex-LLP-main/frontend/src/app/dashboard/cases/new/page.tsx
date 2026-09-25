"use client";
import React, { useState } from 'react';
import { apiFetch } from '@/lib/api';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';

export default function NewCasePage() {
  const [formData, setFormData] = useState({ title: '', description: '' });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      const data = await apiFetch('/cases', {
        method: 'POST',
        body: JSON.stringify(formData),
      });
      router.push(`/dashboard/cases/${data.id}`);
    } catch (error: any) {
      console.error('Error creating case:', error);
      alert(`Failed to create case: ${error.message || 'Unknown error'}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-3xl">
      <div className="mb-10">
        <h2 className="text-3xl font-bold text-primary">Request Legal Counsel</h2>
        <p className="text-gray-500 mt-2">Provide details about your legal matter and our team will review it.</p>
      </div>

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white p-10 rounded-[40px] border border-gray-100 shadow-sm"
      >
        <form onSubmit={handleSubmit} className="space-y-8">
          <div>
            <label className="block text-sm font-bold text-primary mb-3">Case Title</label>
            <input
              type="text"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              className="w-full px-6 py-4 bg-gray-50 border border-gray-100 rounded-2xl focus:outline-none focus:ring-2 focus:ring-secondary/20 transition-all"
              placeholder="e.g., Corporate Contract Review"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-bold text-primary mb-3">Detailed Description</label>
            <textarea
              rows={6}
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              className="w-full px-6 py-4 bg-gray-50 border border-gray-100 rounded-2xl focus:outline-none focus:ring-2 focus:ring-secondary/20 transition-all"
              placeholder="Describe the background and specific legal needs..."
              required
            />
          </div>

          <div className="flex gap-4 pt-6">
            <button
              type="button"
              onClick={() => router.back()}
              className="px-8 py-4 bg-gray-100 text-primary font-bold rounded-2xl hover:bg-gray-200 transition-all"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="flex-1 px-8 py-4 bg-primary text-white font-bold rounded-2xl shadow-xl shadow-primary/20 hover:bg-primary/90 disabled:opacity-50 transition-all"
            >
              {isSubmitting ? 'Submitting...' : 'Submit Legal Request'}
            </button>
          </div>
        </form>
      </motion.div>
    </div>
  );
}
