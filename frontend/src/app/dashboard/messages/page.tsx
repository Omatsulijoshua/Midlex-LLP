"use client";
import React, { useDeferredValue, useEffect, useState } from 'react';
import { apiFetch } from '@/lib/api';
import { useAuth } from '@/context/AuthContext';
import ChatWidget from '@/components/Dashboard/ChatWidget';
import TeamChatWidget from '@/components/Dashboard/TeamChatWidget';
import DashboardSearchBar from '@/components/Dashboard/DashboardSearchBar';

const defaultTeams = ['TEAM ANCHOR', 'TEAM SAPPHIRE', 'TEAM GEMSTONE'];

export default function MessagesPage() {
  const { user } = useAuth();
  const [cases, setCases] = useState<any[]>([]);
  const [selectedCaseId, setSelectedCaseId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [query, setQuery] = useState('');
  const deferredQuery = useDeferredValue(query);

  const isStaff = user?.role === 'ADMIN' || user?.role === 'LAWYER';
  const [activeTab, setActiveTab] = useState<'CASE_CHATS' | 'TEAM_GROUP_CHAT'>('CASE_CHATS');
  const [teams, setTeams] = useState<string[]>(defaultTeams);
  const [selectedTeam, setSelectedTeam] = useState<string>(user?.litigationTeam || 'TEAM ANCHOR');

  useEffect(() => {
    const fetchCases = async () => {
      try {
        const data = await apiFetch('/cases/my-cases');
        setCases(data);
        if (data.length > 0) {
          setSelectedCaseId(data[0].id);
        }
      } catch (error) {
        console.error('Error fetching cases for messages:', error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchCases();

    if (typeof window !== 'undefined') {
      const savedTeams = localStorage.getItem('midlex_teams');
      if (savedTeams) {
        try { setTeams(JSON.parse(savedTeams)); } catch (e) {}
      }
    }
  }, []);

  useEffect(() => {
    if (user?.litigationTeam) {
      setSelectedTeam(user.litigationTeam);
    }
  }, [user]);

  if (isLoading) return <div className="h-full bg-white rounded-[40px] animate-pulse" />;

  const normalizedQuery = deferredQuery.trim().toLowerCase();
  const filteredCases = normalizedQuery
    ? cases.filter((c) =>
        [c.title, c.description, c.status, c.client?.name]
          .filter(Boolean)
          .some((value) => String(value).toLowerCase().includes(normalizedQuery)),
      )
    : cases;

  const activeSelectedCase =
    filteredCases.find((c) => c.id === selectedCaseId) ||
    cases.find((c) => c.id === selectedCaseId);

  return (
    <div className="h-full flex flex-col gap-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-3xl font-bold text-primary">Unified Communications</h2>
          <p className="text-xs text-gray-500 mt-1">Client matter discussions & litigation team collaboration</p>
        </div>

        {isStaff && (
          <div className="flex items-center gap-2 bg-gray-100 p-1.5 rounded-2xl border border-gray-200">
            <button
              onClick={() => setActiveTab('CASE_CHATS')}
              className={`px-5 py-2.5 rounded-xl text-xs font-bold transition-all ${
                activeTab === 'CASE_CHATS'
                  ? 'bg-primary text-white shadow-md'
                  : 'text-gray-600 hover:text-primary'
              }`}
            >
              💬 Client Case Chats
            </button>
            <button
              onClick={() => setActiveTab('TEAM_GROUP_CHAT')}
              className={`px-5 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
                activeTab === 'TEAM_GROUP_CHAT'
                  ? 'bg-secondary text-white shadow-md'
                  : 'text-gray-600 hover:text-secondary'
              }`}
            >
              <span>🛡️ Litigation Team Group Chat</span>
            </button>
          </div>
        )}
      </div>

      {activeTab === 'TEAM_GROUP_CHAT' && isStaff ? (
        <div className="space-y-4 flex-1">
          {/* Admin Team Switcher */}
          {user?.role === 'ADMIN' && (
            <div className="flex items-center gap-3 bg-white p-4 rounded-3xl border border-gray-100 shadow-sm">
              <span className="text-xs font-bold text-gray-500 uppercase tracking-wider">Select Litigation Team Room:</span>
              <div className="flex flex-wrap gap-2">
                {teams.map((t) => (
                  <button
                    key={t}
                    onClick={() => setSelectedTeam(t)}
                    className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                      selectedTeam === t
                        ? 'bg-secondary text-white shadow-md'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    🛡️ {t}
                  </button>
                ))}
              </div>
            </div>
          )}

          <TeamChatWidget teamName={selectedTeam} />
        </div>
      ) : (
        <div className="flex-1 grid lg:grid-cols-4 gap-8 min-h-0">
          {/* Sidebar: Case List */}
          <div className="lg:col-span-1 bg-white rounded-[40px] border border-gray-100 overflow-hidden flex flex-col">
            <div className="p-6 border-b border-gray-100 bg-gray-50/50">
              <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">Active Case Discussions</p>
            </div>
            <div className="p-4 border-b border-gray-100">
              <DashboardSearchBar
                value={query}
                onChange={setQuery}
                placeholder="Search case discussions"
                count={filteredCases.length}
                countLabel="chats"
              />
            </div>
            <div className="flex-1 overflow-y-auto p-4 space-y-2">
              {filteredCases.map((c) => (
                <button
                  key={c.id}
                  onClick={() => setSelectedCaseId(c.id)}
                  className={`w-full text-left p-4 rounded-2xl transition-all ${
                    selectedCaseId === c.id 
                      ? 'bg-secondary text-white shadow-lg shadow-secondary/20' 
                      : 'hover:bg-gray-50 text-primary'
                  }`}
                >
                  <p className="font-bold text-sm truncate">{c.title}</p>
                  <p className={`text-[10px] mt-1 uppercase tracking-widest font-bold ${selectedCaseId === c.id ? 'text-white/60' : 'text-gray-400'}`}>
                    {c.status}
                  </p>
                </button>
              ))}
              {filteredCases.length === 0 && (
                <p className="text-sm text-gray-500 italic p-4">
                  {cases.length === 0 ? 'No active case chats.' : 'No case chats matched your search.'}
                </p>
              )}
            </div>
          </div>

          {/* Chat Area */}
          <div className="lg:col-span-3 h-full">
            {selectedCaseId && activeSelectedCase ? (
              <ChatWidget
                caseId={selectedCaseId}
                status={activeSelectedCase.status || "OPEN"}
              />
            ) : (
              <div className="h-full flex flex-col items-center justify-center bg-white rounded-[40px] border border-gray-100 text-gray-400 p-10 text-center">
                <div className="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center mb-6">
                  <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
                  </svg>
                </div>
                <h3 className="text-xl font-bold text-primary mb-2">No Discussion Selected</h3>
                <p className="max-w-xs mx-auto">Select a case from the sidebar to view the conversation history and collaborate.</p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
