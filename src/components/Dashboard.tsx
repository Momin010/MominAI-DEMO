'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Box,
    Plus,
    Search as SearchIcon,
} from 'lucide-react';

// --- Sub-Components (Modularized) ---
import { Sidebar } from './dashboard/Sidebar';
import { SandboxCard } from './dashboard/SandboxCard';
import { LibraryView } from './dashboard/LibraryView';
import { InfrastructureView } from './dashboard/InfrastructureView';
import { VaultView } from './dashboard/VaultView';
import { AgentStudio } from './dashboard/AgentStudio';
import { SandboxDetails } from './dashboard/SandboxDetails';

// --- Main Dashboard ---

export default function Dashboard() {
    const [activeView, setActiveView] = useState<'sandboxes' | 'library' | 'infrastructure' | 'vault'>('sandboxes');
    const [selectedSandbox, setSelectedSandbox] = useState<string | null>(null);
    const [isCreatingAgent, setIsCreatingAgent] = useState(false);

    const sandboxes = [
        { name: 'alpha-lab-01', status: 'Active', cpu: '12.4%', ram: '1.2GB' },
        { name: 'beta-node-02', status: 'Standby', cpu: '0.1%', ram: '256MB' },
        { name: 'omega-runtime', status: 'Restricted', cpu: '0.0%', ram: '0MB' },
    ];

    return (
        <div className="flex min-h-screen bg-white light-theme">
            <Sidebar activeView={activeView} onViewChange={(v) => {
                setActiveView(v);
                setSelectedSandbox(null);
                setIsCreatingAgent(false);
            }} />

            <main className="flex-1 flex flex-col overflow-hidden relative pl-72">
                <AnimatePresence mode="wait">
                    {activeView === 'sandboxes' && !selectedSandbox && (
                        <motion.div
                            key="sandboxes"
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: -20 }}
                            className="flex-1 p-12 overflow-y-auto"
                        >
                            <header className="flex justify-between items-end mb-12">
                                <div>
                                    <div className="flex items-center gap-2 text-momin-blue mb-2">
                                        <Box size={16} />
                                        <span className="text-[10px] font-black uppercase tracking-[0.2em] leading-none">Console</span>
                                    </div>
                                    <h1 className="text-4xl font-extrabold text-slate-900 tracking-tight">Sandbox Management</h1>
                                </div>
                                <div className="flex gap-4">
                                    <div className="relative">
                                        <SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                                        <input
                                            type="text"
                                            placeholder="Search resources..."
                                            className="bg-slate-50 border border-slate-200 rounded-xl pl-10 pr-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-momin-blue/10 w-64 transition-all text-slate-900"
                                        />
                                    </div>
                                    <button
                                        onClick={() => setSelectedSandbox('new-agent-' + Math.floor(Math.random() * 1000))}
                                        className="p-2 bg-momin-blue text-white rounded-xl shadow-lg shadow-blue-100 hover:scale-110 active:scale-95 transition-all"
                                    >
                                        <Plus size={24} />
                                    </button>
                                </div>
                            </header>

                            <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                                {sandboxes.map((s, i) => (
                                    <SandboxCard
                                        key={i}
                                        name={s.name}
                                        status={s.status}
                                        cpu={s.cpu}
                                        ram={s.ram}
                                        onOpen={() => setSelectedSandbox(s.name)}
                                    />
                                ))}

                                <div
                                    onClick={() => setSelectedSandbox('nexus-node-' + Math.floor(Math.random() * 1000))}
                                    className="border-2 border-dashed border-slate-100 rounded-xl flex flex-col items-center justify-center p-12 text-slate-300 hover:border-slate-200 hover:text-slate-400 transition-all cursor-pointer"
                                >
                                    <Plus size={32} />
                                    <span className="text-xs font-bold uppercase tracking-widest mt-4">New Sandbox</span>
                                </div>
                            </section>
                        </motion.div>
                    )}

                    {activeView === 'library' && (
                        <motion.div key="library" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="flex-1 overflow-hidden">
                            <LibraryView />
                        </motion.div>
                    )}

                    {activeView === 'infrastructure' && (
                        <motion.div key="infra" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="flex-1 overflow-hidden">
                            <InfrastructureView />
                        </motion.div>
                    )}

                    {activeView === 'vault' && (
                        <motion.div key="vault" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="flex-1 overflow-hidden">
                            <VaultView />
                        </motion.div>
                    )}
                </AnimatePresence>

                {/* Sub-Views */}
                <AnimatePresence>
                    {selectedSandbox && !isCreatingAgent && (
                        <SandboxDetails
                            name={selectedSandbox}
                            onClose={() => setSelectedSandbox(null)}
                            onCreateAgent={() => setIsCreatingAgent(true)}
                        />
                    )}
                    {selectedSandbox && isCreatingAgent && (
                        <AgentStudio
                            name={selectedSandbox}
                            onClose={() => setIsCreatingAgent(false)}
                        />
                    )}
                </AnimatePresence>
            </main>
        </div>
    );
}
