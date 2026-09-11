"use client";
import React, { useEffect, useState } from 'react';
import { apiFetch } from '@/lib/api';
import { motion, AnimatePresence } from 'framer-motion';

interface Lawyer {
  id: string;
  name: string;
  email: string;
  litigationTeam?: string;
  _count: { casesAsLawyer: number };
}

const DEFAULT_TEAMS = [
  'TEAM ANCHOR',
  'TEAM ALPHA',
  'TITAN LITIGATION',
  'MARITIME PRACTICE GROUP',
  'CORPORATE DISPUTE TEAM',
];

export default function AssignLawyerModal({
  caseId,
  isOpen,
  onClose,
  onAssigned,
}: {
  caseId: string;
  isOpen: boolean;
  onClose: () => void;
  onAssigned: () => void;
}) {
  const [lawyers, setLawyers] = useState<Lawyer[]>([]);
  const [selectedTeam, setSelectedTeam] = useState('TEAM ANCHOR');
  const [customTeam, setCustomTeam] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [backendTeams, setBackendTeams] = useState<string[]>([]);

  useEffect(() => {
    if (isOpen) {
      apiFetch('/users/lawyers').then(setLawyers).catch(console.error);
      apiFetch<string[]>('/directory/teams')
        .then((t) => {
          if (Array.isArray(t) && t.length > 0) setBackendTeams(t);
        })
        .catch(() => {});
    }
  }, [isOpen]);

  const handleAssignTeam = async (teamToAssign: string) => {
    if (!teamToAssign.trim()) return;
    setIsSubmitting(true);
    try {
      await apiFetch(`/cases/${caseId}/assign`, {
        method: 'PATCH',
        body: JSON.stringify({ litigationTeam: teamToAssign.trim() }),
      });
      onAssigned();
      onClose();
    } catch (error) {
      console.error('Error assigning litigation team:', error);
      alert('Failed to assign litigation team.');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Group lawyers by team
  const availableTeams = Array.from(
    new Set([
      ...backendTeams,
      ...DEFAULT_TEAMS,
      ...lawyers.map((l) => (l.litigationTeam || '').trim().toUpperCase()).filter(Boolean),
    ])
  );

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
            className="relative w-full max-w-xl bg-white rounded-[40px] shadow-2xl p-8 sm:p-10 overflow-hidden space-y-6"
          >
            <div>
              <h3 className="text-2xl font-bold text-primary mb-1">
                ⚖️ Assign Litigation Team
              </h3>
              <p className="text-xs text-gray-500">
                Select a Midlex Litigation Team to assume lead jurisdiction and representation for this case.
              </p>
            </div>

            <div className="space-y-4">
              <label className="block text-xs font-bold text-gray-600 uppercase">
                Select Midlex Litigation Team
              </label>

              <div className="grid sm:grid-cols-2 gap-3 max-h-[260px] overflow-y-auto pr-1">
                {availableTeams.map((teamName) => {
                  const teamLawyers = lawyers.filter(
                    (l) => (l.litigationTeam || 'TEAM ANCHOR').toUpperCase() === teamName.toUpperCase()
                  );
                  const isSelected = selectedTeam === teamName;

                  return (
                    <button
                      key={teamName}
                      type="button"
                      onClick={() => {
                        setSelectedTeam(teamName);
                        setCustomTeam('');
                      }}
                      className={`p-4 rounded-2xl border text-left transition-all flex flex-col justify-between ${
                        isSelected
                          ? 'border-secondary bg-secondary/10 shadow-md ring-2 ring-secondary/20'
                          : 'border-gray-200 hover:border-gray-300 bg-gray-50/50'
                      }`}
                    >
                      <div>
                        <div className="flex items-center justify-between">
                          <span className="font-bold text-sm text-primary">{teamName}</span>
                          {isSelected && <span className="text-secondary font-bold text-xs">✓ Selected</span>}
                        </div>
                        <p className="text-[11px] text-gray-500 mt-1">
                          {teamLawyers.length} Barrister{teamLawyers.length === 1 ? '' : 's'} assigned
                        </p>
                      </div>

                      {teamLawyers.length > 0 && (
                        <div className="mt-3 pt-2 border-t border-gray-100/60 text-[10px] text-gray-400">
                          {teamLawyers.map((l) => l.name).join(', ')}
                        </div>
                      )}
                    </button>
                  );
                })}
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-600 uppercase mb-1">
                  Or Specify Custom Team Name
                </label>
                <input
                  type="text"
                  placeholder="e.g. SPECIAL LITIGATION PANEL"
                  value={customTeam}
                  onChange={(e) => {
                    setCustomTeam(e.target.value);
                    if (e.target.value.trim()) setSelectedTeam('');
                  }}
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-secondary/30"
                />
              </div>
            </div>

            <div className="flex justify-end gap-3 pt-4 border-t border-gray-100">
              <button
                type="button"
                onClick={onClose}
                disabled={isSubmitting}
                className="px-6 py-3 rounded-2xl font-bold text-xs text-gray-400 hover:text-primary transition-colors"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={() => handleAssignTeam(customTeam.trim() || selectedTeam)}
                disabled={isSubmitting || (!selectedTeam && !customTeam.trim())}
                className="px-8 py-3 rounded-2xl font-bold text-xs bg-primary hover:bg-primary/90 text-white shadow-xl shadow-primary/20 transition-all disabled:opacity-50"
              >
                {isSubmitting ? 'Assigning...' : 'Assign Litigation Team'}
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
