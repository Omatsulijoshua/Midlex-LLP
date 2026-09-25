"use client";
import React, { useState, useEffect, Suspense } from 'react';
import { apiFetch } from '@/lib/api';
import { useRouter, useSearchParams } from 'next/navigation';
import { motion } from 'framer-motion';

function NewCaseFormContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const initialCategory = searchParams.get('category') === 'GENERAL' ? 'GENERAL' : 'LITIGATION';

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: initialCategory,
    subCategory: initialCategory === 'LITIGATION' ? 'Commercial Litigation' : 'Property / Realty & Real Estate',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    const cat = searchParams.get('category');
    if (cat === 'GENERAL' || cat === 'LITIGATION') {
      setFormData((prev) => ({
        ...prev,
        category: cat,
        subCategory: cat === 'LITIGATION' ? 'Commercial Litigation' : 'Property / Realty & Real Estate',
      }));
    }
  }, [searchParams]);

  const handleCategoryChange = (cat: string) => {
    const defaultSub = cat === 'LITIGATION' ? 'Commercial Litigation' : 'Property / Realty & Real Estate';
    setFormData({ ...formData, category: cat, subCategory: defaultSub });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      // General & Property cases automatically auto-assign lawyer Samson Sabbat
      const payload = {
        ...formData,
        autoAssignedLawyerName: formData.category === 'GENERAL' ? 'Samson Sabbat' : undefined,
      };

      const data = await apiFetch('/cases', {
        method: 'POST',
        body: JSON.stringify(payload),
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
        <h2 className="text-3xl font-bold text-primary">Request Legal Counsel / Open New Matter</h2>
        <p className="text-gray-500 mt-2">Specify whether this is a Court Litigation dispute or General / Property (Realty) matter.</p>
      </div>

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white p-8 sm:p-10 rounded-[40px] border border-gray-100 shadow-sm"
      >
        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Category Selector */}
          <div>
            <label className="block text-xs font-bold text-primary uppercase tracking-widest mb-3">Matter Classification Category</label>
            <div className="grid grid-cols-2 gap-4">
              <button
                type="button"
                onClick={() => handleCategoryChange('LITIGATION')}
                className={`p-6 rounded-2xl border text-left transition-all ${
                  formData.category === 'LITIGATION'
                    ? 'border-blue-600 bg-blue-50/50 text-blue-950 font-bold shadow-sm'
                    : 'border-gray-200 text-gray-600 hover:border-gray-300'
                }`}
              >
                <div className="text-lg font-bold">⚖️ Litigation Issue</div>
                <div className="text-xs text-gray-500 mt-1">High Court cases, civil &amp; criminal litigation, and trial disputes</div>
              </button>
              <button
                type="button"
                onClick={() => handleCategoryChange('GENERAL')}
                className={`p-6 rounded-2xl border text-left transition-all ${
                  formData.category === 'GENERAL'
                    ? 'border-amber-600 bg-amber-50/50 text-amber-950 font-bold shadow-sm'
                    : 'border-gray-200 text-gray-600 hover:border-gray-300'
                }`}
              >
                <div className="text-lg font-bold">🏢 General &amp; Property Matter</div>
                <div className="text-xs text-gray-500 mt-1">Land title verification, Certificate of Occupancy, property conveyancing, corporate retainer</div>
              </button>
            </div>

            {formData.category === 'GENERAL' && (
              <div className="mt-3 p-4 bg-amber-50 border border-amber-200 rounded-2xl text-xs text-amber-900 flex items-center gap-3">
                <span className="text-xl">👨‍⚖️</span>
                <div>
                  <strong>Automatic Lawyer Allocation:</strong> Property &amp; General matters are automatically allocated to <strong>Samson Sabbat</strong>.
                </div>
              </div>
            )}
          </div>

          <div>
            <label className="block text-xs font-bold text-primary uppercase tracking-widest mb-3">Specific Practice Sub-type</label>
            <select
              value={formData.subCategory}
              onChange={(e) => setFormData({ ...formData, subCategory: e.target.value })}
              className="w-full px-6 py-4 bg-gray-50 border border-gray-100 rounded-2xl focus:outline-none focus:ring-2 focus:ring-secondary/20 font-medium text-sm text-gray-900"
            >
              {formData.category === 'LITIGATION' ? (
                <>
                  <option value="Commercial Litigation">Commercial Litigation</option>
                  <option value="Civil Dispute">Civil &amp; Contractual Dispute</option>
                  <option value="Land &amp; Property / Realty Dispute">Land &amp; Property / Realty Dispute</option>
                  <option value="Criminal Defense">Criminal Defense</option>
                </>
              ) : (
                <>
                  <option value="Property / Realty &amp; Real Estate">Property / Realty &amp; Real Estate Title Verification</option>
                  <option value="Certificate of Occupancy Search">Certificate of Occupancy (C of O) Search</option>
                  <option value="Monthly Retainer">Monthly Corporate Retainer</option>
                  <option value="Tax Advisory">Tax Advisory &amp; Compliance</option>
                  <option value="Corporate Secretarial">Corporate Secretarial Services</option>
                  <option value="General Legal Advisory">General Legal Advisory</option>
                </>
              )}
            </select>
          </div>

          <div>
            <label className="block text-xs font-bold text-primary uppercase tracking-widest mb-3">Matter / Case Title *</label>
            <input
              type="text"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              className="w-full px-6 py-4 bg-gray-50 border border-gray-100 rounded-2xl focus:outline-none focus:ring-2 focus:ring-secondary/20 transition-all text-sm font-medium text-gray-900"
              placeholder={formData.category === 'LITIGATION' ? "e.g., Commercial Land Dispute - High Court Benin" : "e.g., Land Title Verification & C of O Registration - Benin City Property"}
              required
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-primary uppercase tracking-widest mb-3">Detailed Description &amp; Instructions *</label>
            <textarea
              rows={5}
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              className="w-full px-6 py-4 bg-gray-50 border border-gray-100 rounded-2xl focus:outline-none focus:ring-2 focus:ring-secondary/20 transition-all text-sm font-medium text-gray-900"
              placeholder="Describe background facts, specific property details, or requested legal outcomes..."
              required
            />
          </div>

          <div className="flex gap-4 pt-6">
            <button
              type="button"
              onClick={() => router.back()}
              className="px-8 py-4 bg-gray-100 text-primary font-bold rounded-2xl hover:bg-gray-200 transition-all text-xs uppercase"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="flex-1 px-8 py-4 bg-primary text-white font-bold rounded-2xl shadow-xl shadow-primary/20 hover:bg-primary/90 disabled:opacity-50 transition-all text-xs uppercase tracking-wider"
            >
              {isSubmitting ? 'Submitting Case Request...' : `Submit New ${formData.category === 'LITIGATION' ? 'Litigation' : 'General / Property'} Case`}
            </button>
          </div>
        </form>
      </motion.div>
    </div>
  );
}

export default function NewCasePage() {
  return (
    <Suspense fallback={<div className="p-10 text-center animate-pulse">Loading case creation form...</div>}>
      <NewCaseFormContent />
    </Suspense>
  );
}
