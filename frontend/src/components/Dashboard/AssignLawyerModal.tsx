"use client";
import React, { useEffect, useState } from 'react';
import { apiFetch } from '@/lib/api';
import { motion, AnimatePresence } from 'framer-motion';

interface Lawyer {
  id: string;
  name: string;
  email: string;
  _count: { casesAsLawyer: number };
}

export default function AssignLawyerModal({ 
  caseId, 
  isOpen, 
  onClose, 
  onAssigned 
}: { 
  caseId: string; 
  isOpen: boolean; 
  onClose: () => void;
  onAssigned: () => void;
}) {
  const [lawyers, setLawyers] = useState<Lawyer[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (isOpen) {
      apiFetch('/users/lawyers').then(setLawyers).catch(console.error);
    }
  }, [isOpen]);

  const handleAssign = async (lawyerId: string) => {
    setIsSubmitting(true);
    try {
      await apiFetch(`/cases/${caseId}/assign`, {
        method: 'PATCH',
        body: JSON.stringify({ lawyerId }),
      });
      onAssigned();
      onClose();
    } catch (error) {
      console.error('Error assigning lawyer:', error);
      alert('Failed to assign lawyer');
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
            <h3 className="text-2xl font-bold text-primary mb-2">Assign Legal Counsel</h3>
            <p className="text-gray-500 mb-8">Select a lawyer to lead this case.</p>

            <div className="space-y-4 max-h-[400px] overflow-y-auto pr-2">
              {lawyers.map((lawyer) => (
                <button
                  key={lawyer.id}
                  onClick={() => handleAssign(lawyer.id)}
                  disabled={isSubmitting}
                  className="w-full flex items-center justify-between p-6 bg-gray-50 hover:bg-secondary/5 border border-transparent hover:border-secondary/20 rounded-3xl transition-all group"
                >
                  <div className="text-left">
                    <p className="font-bold text-primary group-hover:text-secondary transition-colors">{lawyer.name}</p>
                    <p className="text-sm text-gray-400">{lawyer.email}</p>
                    <p className="text-[10px] font-bold text-secondary uppercase mt-1">
                      {lawyer._count.casesAsLawyer} Active Cases
                    </p>
                  </div>
                  <div className="flex items-center gap-4">
                     <span className={`w-3 h-3 rounded-full ${lawyer._count.casesAsLawyer > 5 ? 'bg-red-500' : 'bg-green-500'}`} title={lawyer._count.casesAsLawyer > 5 ? 'High Workload' : 'Available'} />
                     <div className="w-10 h-10 rounded-full bg-white border border-gray-100 flex items-center justify-center text-secondary opacity-0 group-hover:opacity-100 transition-all">
                       <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                         <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" />
                       </svg>
                     </div>
                  </div>
                </button>
              ))}
            </div>

            <button
              onClick={onClose}
              className="mt-8 w-full py-4 text-gray-400 font-bold hover:text-primary transition-colors"
            >
              Cancel
            </button>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
