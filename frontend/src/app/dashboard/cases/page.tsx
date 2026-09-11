"use client";
import React, { useDeferredValue, useEffect, useState } from 'react';
import { apiFetch } from '@/lib/api';
import { useAuth } from '@/context/AuthContext';
import Link from 'next/link';
import DashboardSearchBar from '@/components/Dashboard/DashboardSearchBar';

interface Case {
  id: string;
  title: string;
  description: string;
  status: string;
  client: { name: string };
  lawyer?: { name: string };
  suitNumber?: string;
  court?: string;
  litigationTeam?: string;
  createdAt: string;
}

const defaultTeams = [
  'TEAM ANCHOR',
  'TEAM SAPPHIRE',
  'TEAM GEMSTONE',
];

const defaultCourts = [
  'HIGH COURT BENIN CITY',
  'HIGH COURT OKADA',
  'HIGH COURT EKIADOLOR',
  'FEDERAL HIGH COURT',
  'HIGH COURT',
  'MAGISTRATE COURT OGBESON',
  'HIGH COURT WARRI',
  'HIGH COURT ABUDU',
  'FEDERAL HIGH COURT BENIN',
  'HIGH COURT BENIN',
  'NATIONAL INDUSTRIAL COURT BENIN CITY',
  'AREA CUSTOMARY COURT EHOR',
  'HIGH COURT EHOR',
];

export default function CasesPage() {
  const { user } = useAuth();
  const [cases, setCases] = useState<Case[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [query, setQuery] = useState('');
  const deferredQuery = useDeferredValue(query);

  const [teams, setTeams] = useState<string[]>(defaultTeams);
  const [courts, setCourts] = useState<string[]>(defaultCourts);

  const [isTeamsModalOpen, setIsTeamsModalOpen] = useState(false);
  const [isCourtsModalOpen, setIsCourtsModalOpen] = useState(false);
  const [newTeamInput, setNewTeamInput] = useState('');
  const [newCourtInput, setNewCourtInput] = useState('');

  const [overrides, setOverrides] = useState<Record<string, { suitNumber?: string; court?: string; litigationTeam?: string }>>({});

  const [editingCase, setEditingCase] = useState<Case | null>(null);
  const [editSuitNo, setEditSuitNo] = useState('');
  const [editCourt, setEditCourt] = useState('');
  const [editTeam, setEditTeam] = useState('');

  const isStaff = user?.role === 'ADMIN' || user?.role === 'LAWYER';

  useEffect(() => {
    const fetchCases = async () => {
      try {
        const endpoint = user?.role === 'ADMIN' ? '/cases' : '/cases/my-cases';
        const data = await apiFetch(endpoint);
        setCases(data);
      } catch (error) {
        console.error('Error fetching cases:', error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchCases();

    // Load saved teams & courts from localStorage if present
    if (typeof window !== 'undefined') {
      const savedTeams = localStorage.getItem('midlex_teams');
      if (savedTeams) {
        try { setTeams(JSON.parse(savedTeams)); } catch (e) {}
      }
      const savedCourts = localStorage.getItem('midlex_courts');
      if (savedCourts) {
        try { setCourts(JSON.parse(savedCourts)); } catch (e) {}
      }
    }
  }, [user]);

  const handleAddTeam = () => {
    const clean = newTeamInput.trim().toUpperCase();
    if (!clean) return;
    if (!teams.includes(clean)) {
      const updated = [...teams, clean];
      setTeams(updated);
      if (typeof window !== 'undefined') {
        localStorage.setItem('midlex_teams', JSON.stringify(updated));
      }
    }
    setNewTeamInput('');
  };

  const handleRemoveTeam = (teamName: string) => {
    const updated = teams.filter(t => t !== teamName);
    setTeams(updated);
    if (typeof window !== 'undefined') {
      localStorage.setItem('midlex_teams', JSON.stringify(updated));
    }
  };

  const handleAddCourt = () => {
    const clean = newCourtInput.trim().toUpperCase();
    if (!clean) return;
    if (!courts.includes(clean)) {
      const updated = [...courts, clean];
      setCourts(updated);
      if (typeof window !== 'undefined') {
        localStorage.setItem('midlex_courts', JSON.stringify(updated));
      }
    }
    setNewCourtInput('');
  };

  const handleRemoveCourt = (courtName: string) => {
    const updated = courts.filter(c => c !== courtName);
    setCourts(updated);
    if (typeof window !== 'undefined') {
      localStorage.setItem('midlex_courts', JSON.stringify(updated));
    }
  };

  const handleSaveCaseAssignment = () => {
    if (!editingCase) return;
    setOverrides(prev => ({
      ...prev,
      [editingCase.id]: {
        suitNumber: editSuitNo.trim(),
        court: editCourt,
        litigationTeam: editTeam,
      }
    }));
    setEditingCase(null);
  };

  if (isLoading) return <div className="animate-pulse space-y-4">
    {[1, 2, 3].map(i => <div key={i} className="h-24 bg-gray-100 rounded-3xl" />)}
  </div>;

  const normalizedQuery = deferredQuery.trim().toLowerCase();
  const filteredCases = normalizedQuery
    ? cases.filter((c) => {
        const ov = overrides[c.id] || {};
        const suit = ov.suitNumber || c.suitNumber;
        const courtName = ov.court || c.court;
        const teamName = ov.litigationTeam || c.litigationTeam;
        return [
          c.title,
          c.description,
          c.status,
          c.client?.name,
          c.lawyer?.name,
          suit,
          courtName,
          teamName,
        ]
          .filter(Boolean)
          .some((value) => String(value).toLowerCase().includes(normalizedQuery));
      })
    : cases;

  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          {isStaff && (
            <span className="px-3 py-1 bg-secondary/10 border border-secondary text-secondary rounded-full text-xs font-bold uppercase tracking-widest">
              OFFICIAL LITIGATION DIRECTORY
            </span>
          )}
          <h2 className="text-3xl font-bold text-primary mt-2">
            {isStaff ? 'MIDLEX CASE DIRECTORY' : 'My Cases'}
          </h2>
        </div>

        {isStaff ? (
          <div className="flex items-center gap-3">
            <button
              onClick={() => setIsTeamsModalOpen(true)}
              className="px-5 py-3 bg-secondary text-white font-bold rounded-2xl shadow-lg hover:bg-secondary/90 transition-all text-xs flex items-center gap-2"
            >
              <span>Litigation Teams ({teams.length})</span>
            </button>
            <button
              onClick={() => setIsCourtsModalOpen(true)}
              className="px-5 py-3 bg-primary text-white font-bold rounded-2xl shadow-lg hover:bg-primary/90 transition-all text-xs flex items-center gap-2"
            >
              <span>Courts Directory ({courts.length})</span>
            </button>
          </div>
        ) : (
          user?.role === 'CLIENT' && (
            <Link 
              href="/dashboard/cases/new"
              className="px-8 py-4 bg-secondary text-white font-bold rounded-2xl shadow-xl shadow-secondary/20 hover:bg-secondary/90 transition-all text-center"
            >
              Create New Case
            </Link>
          )
        )}
      </div>

      <DashboardSearchBar
        value={query}
        onChange={setQuery}
        placeholder={isStaff ? "Search directory by Suit No., Title, Court, Counsel..." : "Search cases by title or details..."}
        count={filteredCases.length}
        countLabel="matters"
      />

      <div className="bg-white rounded-[40px] border border-gray-100 overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-primary text-white">
                <th className="px-6 py-5 text-xs font-bold uppercase tracking-widest">S/N</th>
                <th className="px-6 py-5 text-xs font-bold uppercase tracking-widest">SUIT NO.</th>
                <th className="px-6 py-5 text-xs font-bold uppercase tracking-widest">CASE TITLE</th>
                <th className="px-6 py-5 text-xs font-bold uppercase tracking-widest">COURT</th>
                <th className="px-6 py-5 text-xs font-bold uppercase tracking-widest">LITIGATION TEAM</th>
                <th className="px-6 py-5 text-xs font-bold uppercase tracking-widest text-right">ACTION</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filteredCases.map((c, index) => {
                const ov = overrides[c.id] || {};
                const cleanId = c.id.replace(/[^a-zA-Z0-9]/g, '').toUpperCase();
                const shortId = cleanId.length > 4 ? cleanId.slice(0, 4) : (cleanId || '102');
                const suitNo = ov.suitNumber || c.suitNumber || `SUIT NO: HCB/${shortId}/2026`;
                const courtName = ov.court || c.court || 'HIGH COURT BENIN CITY';
                const teamName = ov.litigationTeam || c.litigationTeam || 'TEAM ANCHOR';

                return (
                  <tr key={c.id} className="hover:bg-gray-50/50 transition-all group">
                    <td className="px-6 py-5 font-bold text-primary">{index + 1}</td>
                    <td className="px-6 py-5">
                      <span className="px-3 py-1 bg-amber-50 text-amber-900 border border-amber-200 rounded-lg text-xs font-bold tracking-wide">
                        {suitNo}
                      </span>
                    </td>
                    <td className="px-6 py-5">
                      <div className="font-bold text-primary text-base">{c.title}</div>
                      <span className={`inline-block mt-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                        c.status === 'OPEN' ? 'bg-green-100 text-green-700' : 'bg-blue-100 text-blue-700'
                      }`}>
                        {c.status}
                      </span>
                    </td>
                    <td className="px-6 py-5 text-sm text-gray-700 font-medium">
                      <div className="flex items-center gap-2">
                        <svg className="w-4 h-4 text-secondary shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5m0 0h4m-4 0v-4m0 4h4" />
                        </svg>
                        <span>{courtName}</span>
                      </div>
                    </td>
                    <td className="px-6 py-5 text-sm text-primary font-semibold">
                      <div className="flex items-center gap-2">
                        <svg className="w-4 h-4 text-primary shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                        </svg>
                        <span className="font-bold text-primary">{teamName}</span>
                      </div>
                    </td>
                    <td className="px-6 py-5 text-right">
                      <div className="flex items-center justify-end gap-2">
                        {isStaff && (
                          <button
                            onClick={() => {
                              setEditingCase(c);
                              setEditSuitNo(suitNo);
                              setEditCourt(courtName);
                              setEditTeam(teamName);
                            }}
                            className="px-3 py-2 bg-gray-100 text-gray-700 hover:bg-secondary hover:text-white rounded-xl text-xs font-bold transition-all"
                            title="Edit Suit No., Court & Team"
                          >
                            Edit
                          </button>
                        )}
                        <Link 
                          href={`/dashboard/cases/${c.id}`}
                          className="px-4 py-2 bg-primary text-white font-bold rounded-xl text-xs hover:bg-primary/90 transition-all shadow-md shadow-primary/10 inline-flex items-center gap-1"
                        >
                          <span>View</span>
                          <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
                          </svg>
                        </Link>
                      </div>
                    </td>
                  </tr>
                );
              })}
              {filteredCases.length === 0 && (
                <tr>
                  <td colSpan={6} className="px-8 py-20 text-center text-gray-400 italic">
                    No case directory entries matched your search.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Teams Management Modal */}
      {isTeamsModalOpen && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 space-y-6 shadow-2xl">
            <div className="flex items-center justify-between border-b border-gray-100 pb-4">
              <div>
                <h3 className="text-xl font-bold text-primary">Litigation Teams Directory</h3>
                <p className="text-xs text-gray-400">Add or remove legal litigation teams</p>
              </div>
              <button onClick={() => setIsTeamsModalOpen(false)} className="text-gray-400 hover:text-gray-600 font-bold">✕</button>
            </div>

            <div className="flex gap-2">
              <input
                type="text"
                value={newTeamInput}
                onChange={(e) => setNewTeamInput(e.target.value)}
                placeholder="e.g. TEAM TITAN"
                className="flex-1 px-4 py-3 border border-gray-200 rounded-xl text-sm font-bold text-gray-800"
              />
              <button
                onClick={handleAddTeam}
                className="px-6 py-3 bg-secondary text-white font-bold rounded-xl text-xs hover:bg-secondary/90 transition-all"
              >
                Add Team
              </button>
            </div>

            <div className="max-h-60 overflow-y-auto space-y-2">
              {teams.map((team) => (
                <div key={team} className="flex items-center justify-between p-3 bg-gray-50 rounded-xl border border-gray-100">
                  <span className="font-bold text-sm text-primary">{team}</span>
                  <button
                    onClick={() => handleRemoveTeam(team)}
                    className="text-red-500 hover:text-red-700 text-xs font-bold px-2 py-1 bg-red-50 rounded-lg"
                  >
                    Remove
                  </button>
                </div>
              ))}
            </div>

            <div className="text-right">
              <button
                onClick={() => setIsTeamsModalOpen(false)}
                className="px-6 py-2.5 bg-gray-100 text-gray-700 font-bold rounded-xl text-xs"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Courts Management Modal */}
      {isCourtsModalOpen && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 space-y-6 shadow-2xl">
            <div className="flex items-center justify-between border-b border-gray-100 pb-4">
              <div>
                <h3 className="text-xl font-bold text-primary">Courts Directory</h3>
                <p className="text-xs text-gray-400">Add or remove legal jurisdiction courts</p>
              </div>
              <button onClick={() => setIsCourtsModalOpen(false)} className="text-gray-400 hover:text-gray-600 font-bold">✕</button>
            </div>

            <div className="flex gap-2">
              <input
                type="text"
                value={newCourtInput}
                onChange={(e) => setNewCourtInput(e.target.value)}
                placeholder="e.g. HIGH COURT UROMI"
                className="flex-1 px-4 py-3 border border-gray-200 rounded-xl text-sm font-bold text-gray-800"
              />
              <button
                onClick={handleAddCourt}
                className="px-6 py-3 bg-primary text-white font-bold rounded-xl text-xs hover:bg-primary/90 transition-all"
              >
                Add Court
              </button>
            </div>

            <div className="max-h-60 overflow-y-auto space-y-2">
              {courts.map((court) => (
                <div key={court} className="flex items-center justify-between p-3 bg-amber-50/50 rounded-xl border border-amber-100">
                  <span className="font-bold text-xs text-gray-800">{court}</span>
                  <button
                    onClick={() => handleRemoveCourt(court)}
                    className="text-red-500 hover:text-red-700 text-xs font-bold px-2 py-1 bg-red-50 rounded-lg"
                  >
                    Remove
                  </button>
                </div>
              ))}
            </div>

            <div className="text-right">
              <button
                onClick={() => setIsCourtsModalOpen(false)}
                className="px-6 py-2.5 bg-gray-100 text-gray-700 font-bold rounded-xl text-xs"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Case Assignment Modal */}
      {editingCase && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 space-y-5 shadow-2xl">
            <div className="flex items-center justify-between border-b border-gray-100 pb-3">
              <div>
                <h3 className="text-lg font-bold text-primary">Assign Directory Details</h3>
                <p className="text-xs text-gray-400 truncate max-w-xs">{editingCase.title}</p>
              </div>
              <button onClick={() => setEditingCase(null)} className="text-gray-400 hover:text-gray-600 font-bold">✕</button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-gray-500 mb-1">Suit Number / File Reference</label>
                <input
                  type="text"
                  value={editSuitNo}
                  onChange={(e) => setEditSuitNo(e.target.value)}
                  placeholder="SUIT NO: HCB/102/2026"
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm font-bold text-gray-800"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-500 mb-1">Assigned Court</label>
                <select
                  value={editCourt}
                  onChange={(e) => setEditCourt(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm font-bold text-gray-800 bg-white"
                >
                  {courts.map(c => (
                    <option key={c} value={c}>{c}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-500 mb-1">Assigned Litigation Team</label>
                <select
                  value={editTeam}
                  onChange={(e) => setEditTeam(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm font-bold text-gray-800 bg-white"
                >
                  {teams.map(t => (
                    <option key={t} value={t}>{t}</option>
                  ))}
                </select>
              </div>
            </div>

            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                onClick={() => setEditingCase(null)}
                className="px-5 py-2.5 bg-gray-100 text-gray-700 font-bold rounded-xl text-xs"
              >
                Cancel
              </button>
              <button
                onClick={handleSaveCaseAssignment}
                className="px-6 py-2.5 bg-primary text-white font-bold rounded-xl text-xs shadow-lg shadow-primary/20"
              >
                Save Details
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
