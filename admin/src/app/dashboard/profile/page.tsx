"use client";
import React, { useEffect, useState } from 'react';
import { apiFetch } from '@/lib/api';
import { motion } from 'framer-motion';

export default function ProfilePage() {
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    dateOfBirth: '',
    nationalId: '',
    address: '',
    otherInfo: ''
  });
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const data = await apiFetch('/users/profile');
        setFormData({
          name: data.name || '',
          phone: data.phone || '',
          dateOfBirth: data.dateOfBirth ? data.dateOfBirth.split('T')[0] : '',
          nationalId: data.nationalId || '',
          address: data.address || '',
          otherInfo: data.otherInfo || ''
        });
      } catch (error) {
        console.error('Error fetching profile:', error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchProfile();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setMessage(null);
    try {
      await apiFetch('/users/profile', {
        method: 'PATCH',
        body: JSON.stringify(formData),
      });
      setMessage({ type: 'success', text: 'Profile updated successfully!' });
    } catch (error: any) {
      console.error('Error updating profile:', error);
      setMessage({ type: 'error', text: `Failed to update: ${error.message}` });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) return <div className="animate-pulse space-y-4">
    <div className="h-12 bg-gray-100 rounded-2xl w-1/4 mb-10" />
    <div className="grid grid-cols-2 gap-8">
      {[1, 2, 3, 4, 5, 6].map(i => <div key={i} className="h-20 bg-gray-100 rounded-2xl" />)}
    </div>
  </div>;

  return (
    <div className="max-w-4xl mx-auto space-y-10 pb-20">
      <div>
        <h2 className="text-3xl font-bold text-primary">Client Profile</h2>
        <p className="text-gray-500 mt-2">Please keep your information up to date for legal compliance.</p>
      </div>

      {message && (
        <motion.div 
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          className={`p-4 rounded-2xl font-bold text-sm ${
            message.type === 'success' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
          }`}
        >
          {message.text}
        </motion.div>
      )}

      <form onSubmit={handleSubmit} className="bg-white p-10 rounded-[40px] border border-gray-100 shadow-sm space-y-10">
        <div className="grid md:grid-cols-2 gap-8">
          <div className="space-y-3">
            <label className="text-xs font-bold text-primary uppercase tracking-widest px-1">Full Name</label>
            <input 
              type="text"
              value={formData.name}
              onChange={(e) => setFormData({...formData, name: e.target.value})}
              className="w-full px-6 py-4 bg-gray-50 border border-gray-100 rounded-2xl focus:ring-2 focus:ring-secondary/20 transition-all"
              required
            />
          </div>
          <div className="space-y-3">
            <label className="text-xs font-bold text-primary uppercase tracking-widest px-1">Phone Number</label>
            <input 
              type="tel"
              value={formData.phone}
              onChange={(e) => setFormData({...formData, phone: e.target.value})}
              className="w-full px-6 py-4 bg-gray-50 border border-gray-100 rounded-2xl focus:ring-2 focus:ring-secondary/20 transition-all"
              placeholder="+234 ..."
            />
          </div>
          <div className="space-y-3">
            <label className="text-xs font-bold text-primary uppercase tracking-widest px-1">Date of Birth</label>
            <input 
              type="date"
              value={formData.dateOfBirth}
              onChange={(e) => setFormData({...formData, dateOfBirth: e.target.value})}
              className="w-full px-6 py-4 bg-gray-50 border border-gray-100 rounded-2xl focus:ring-2 focus:ring-secondary/20 transition-all"
            />
          </div>
          <div className="space-y-3">
            <label className="text-xs font-bold text-primary uppercase tracking-widest px-1">National ID Number</label>
            <input 
              type="text"
              value={formData.nationalId}
              onChange={(e) => setFormData({...formData, nationalId: e.target.value})}
              className="w-full px-6 py-4 bg-gray-50 border border-gray-100 rounded-2xl focus:ring-2 focus:ring-secondary/20 transition-all"
              placeholder="NIN or Passport Number"
            />
          </div>
        </div>

        <div className="space-y-3">
          <label className="text-xs font-bold text-primary uppercase tracking-widest px-1">Residential Address</label>
          <textarea 
            rows={3}
            value={formData.address}
            onChange={(e) => setFormData({...formData, address: e.target.value})}
            className="w-full px-6 py-4 bg-gray-50 border border-gray-100 rounded-2xl focus:ring-2 focus:ring-secondary/20 transition-all"
            placeholder="Full physical address"
          />
        </div>

        <div className="space-y-3">
          <label className="text-xs font-bold text-primary uppercase tracking-widest px-1">Other Helpful Information</label>
          <textarea 
            rows={4}
            value={formData.otherInfo}
            onChange={(e) => setFormData({...formData, otherInfo: e.target.value})}
            className="w-full px-6 py-4 bg-gray-50 border border-gray-100 rounded-2xl focus:ring-2 focus:ring-secondary/20 transition-all"
            placeholder="e.g. Spouse name, Occupation, or any other relevant details"
          />
        </div>

        <div className="pt-6 border-t border-gray-50">
          <button 
            type="submit"
            disabled={isSubmitting}
            className="px-12 py-5 bg-secondary text-white font-bold rounded-[24px] shadow-xl shadow-secondary/20 hover:shadow-2xl transition-all disabled:opacity-50"
          >
            {isSubmitting ? 'Saving Changes...' : 'Save Profile Details'}
          </button>
        </div>
      </form>
    </div>
  );
}
