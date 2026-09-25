"use client";
import React, { useState } from 'react';
import { apiFetch } from '@/lib/api';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';

export default function NewCasePage() {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: 'LITIGATION',
    subCategory: 'Commercial Litigation',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const router = useRouter();

  const handleCategoryChange = (cat: string) => {
    const defaultSub = cat === 'LITIGATION' ? 'Commercial Litigation' : 'Monthly Retainer';
    setFormData({ ...formData, category: cat, subCategory: defaultSub });
  };

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
        <h2 className="text-3xl font-bold text-primary">Request Legal Counsel / Open Matter</h2>
        <p className="text-gray-500 mt-2">Specify whether this is a Litigation issue or General Retainer / Property / Realty / Tax matter.</p>
      </div>

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white p-10 rounded-[40px] border border-gray-100 shadow-sm"
      >
        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Category Selector */}
          <div>
            <label className="block text-sm font-bold text-primary mb-3">Matter Classification Category</label>
            <div className="grid grid-cols-2 gap-4">
              <button
                type="button"
                onClick={() => handleCategoryChange('LITIGATION')}
                className={`p-5 rounded-2xl border text-left transition-all ${
                  formData.category === 'LITIGATION'
                    ? 'border-primary bg-primary/5 text-primary font-bold shadow-sm'
                    : 'border-gray-200 text-gray-600 hover:border-gray-300'
                }`}
              >
                <div className="text-lg font-bold">⚖️ Litigation Issue</div>
                <div className="text-xs text-gray-500 mt-1">Court cases, litigation matters, and trial disputes</div>
              </button>
              <button
                type="button"
                onClick={() => handleCategoryChange('GENERAL')}
                className={`p-5 rounded-2xl border text-left transition-all ${
                  formData.category === 'GENERAL'
                    ? 'border-secondary bg-secondary/10 text-primary font-bold shadow-sm'
                    : 'border-gray-200 text-gray-600 hover:border-gray-300'
                }`}
              >
                <div className="text-lg font-bold">🏛️ General / Retainer Matter</div>
                <div className="text-xs text-gray-500 mt-1">Property / Realty, monthly retainer, tax advisory, corporate advisory</div>
              </button>
            </div>
          </div>

          <div>
            <label className="block text-sm font-bold text-primary mb-3">Specific Practice Sub-type</label>
            <select
              value={formData.subCategory}
              onChange={(e) => setFormData({ ...formData, subCategory: e.target.value })}
              className="w-full px-6 py-4 bg-gray-50 border border-gray-100 rounded-2xl focus:outline-none focus:ring-2 focus:ring-secondary/20 font-medium"
            >
              {formData.category === 'LITIGATION' ? (
                <>
                  <option value="Commercial Litigation">Commercial Litigation</option>
                  <option value="Civil Dispute">Civil & Contractual Dispute</option>
                  <option value="Land & Property / Realty Dispute">Land & Property / Realty Dispute</option>
                  <option value="Criminal Defense">Criminal Defense</option>
                </>
              ) : (
                <>
                  <option value="Monthly Retainer">Monthly Corporate Retainer</option>
                  <option value="Property / Realty & Real Estate">Property / Realty & Real Estate</option>
                  <option value="Tax Advisory">Tax Advisory & Compliance</option>
                  <option value="Corporate Secretarial">Corporate Secretarial Services</option>
                  <option value="General Legal Advisory">General Legal Advisory</option>
                </>
              )}
            </select>
          </div>

          <div>
            <label className="block text-sm font-bold text-primary mb-3">Matter / Case Title</label>
            <input
              type="text"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              className="w-full px-6 py-4 bg-gray-50 border border-gray-100 rounded-2xl focus:outline-none focus:ring-2 focus:ring-secondary/20 transition-all"
              placeholder={formData.category === 'LITIGATION' ? "e.g., Commercial Land Dispute - Suit No. B/104" : "e.g., Monthly Corporate Retainer - Real Estate Tax Advisory"}
              required
            />
          </div>

          <div>
            <label className="block text-sm font-bold text-primary mb-3">Detailed Description</label>
            <textarea
              rows={5}
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              className="w-full px-6 py-4 bg-gray-50 border border-gray-100 rounded-2xl focus:outline-none focus:ring-2 focus:ring-secondary/20 transition-all"
              placeholder="Describe background, specific requirements, or monthly instructions..."
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
