'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { ChevronRight, Box, Plus, Fingerprint, History } from 'lucide-react';

export const SandboxDetails = ({ name, onClose, onCreateAgent }: { name: string, onClose: () => void, onCreateAgent: () => void }) => {
    const mockAgents = [
        { name: 'Research_Core_v1', engine: 'DeepSeek-V3', status: 'Running', uptime: '14h 22m' },
        { name: 'Data_Harvester', engine: 'Llama3-70B', status: 'Dormant', uptime: '0s' },
        { name: 'Security_Guard', engine: 'Custom-RE', status: 'Restricted', uptime: '122d' },
    ];

    return (
        <motion.div
            layoutId={`card-${name}`}
            className="fixed inset-0 bg-slate-50 z-50 flex flex-col overflow-hidden light-theme"
        >
            <div className="h-16 border-b border-slate-200 px-8 flex items-center justify-between bg-white shrink-0">
                <div className="flex items-center gap-4">
                    <button onClick={onClose} className="p-2 hover:bg-slate-100 rounded-lg text-slate-500">
                        <ChevronRight size={20} className="rotate-180" />
                    </button>
                    <div className="flex items-center gap-2">
                        <Box size={18} className="text-momin-blue" />
                        <h2 className="font-bold text-slate-900">{name}</h2>
                        <span className="text-slate-300">/</span>
                        <span className="text-slate-500 text-sm">Container View</span>
                    </div>
                </div>
                <button
                    onClick={onCreateAgent}
                    className="flex items-center gap-2 px-4 py-1.5 bg-momin-blue text-white rounded-lg text-sm font-bold shadow-lg shadow-blue-100 hover:scale-105 active:scale-95 transition-all"
                >
                    <Plus size={16} /> Create Agent
                </button>
            </div>

            <div className="flex-1 p-12 overflow-y-auto">
                <div className="max-w-6xl mx-auto space-y-12">
                    <header className="flex justify-between items-end">
                        <div>
                            <p className="text-xs font-bold text-momin-blue uppercase tracking-widest mb-2">Workspace Dashboard</p>
                            <h3 className="text-3xl font-extrabold text-slate-900 tracking-tight">Active Agents</h3>
                        </div>
                        <div className="flex gap-4">
                            <div className="bg-white border border-slate-200 p-4 rounded-2xl shadow-sm text-center min-w-[120px]">
                                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Active Threads</p>
                                <p className="text-xl font-black text-slate-900">12</p>
                            </div>
                            <div className="bg-white border border-slate-200 p-4 rounded-2xl shadow-sm text-center min-w-[120px]">
                                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Memory Load</p>
                                <p className="text-xl font-black text-slate-900">4.2 GB</p>
                            </div>
                        </div>
                    </header>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {mockAgents.map((agent, i) => (
                            <motion.div
                                key={i}
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: i * 0.1 }}
                                className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm hover:border-momin-blue transition-all cursor-pointer group"
                            >
                                <div className="flex justify-between items-start mb-4">
                                    <div className="w-10 h-10 bg-blue-50 text-momin-blue rounded-xl flex items-center justify-center">
                                        <Fingerprint size={20} />
                                    </div>
                                    <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${agent.status === 'Running' ? 'bg-green-50 text-green-600' : 'bg-slate-50 text-slate-400'
                                        }`}>
                                        {agent.status}
                                    </span>
                                </div>
                                <h4 className="font-bold text-slate-900 group-hover:text-momin-blue transition-colors">{agent.name}</h4>
                                <p className="text-xs text-slate-400 font-medium mt-1">{agent.engine}</p>
                                <div className="mt-6 pt-4 border-t border-slate-50 flex justify-between items-center text-[10px] font-bold text-slate-500">
                                    <div className="flex items-center gap-1">
                                        <History size={12} /> {agent.uptime}
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <span className="w-1.5 h-1.5 rounded-full bg-blue-500" />
                                        PRO_V3
                                    </div>
                                </div>
                            </motion.div>
                        ))}
                        <div
                            onClick={onCreateAgent}
                            className="border-2 border-dashed border-slate-200 rounded-2xl p-6 flex flex-col items-center justify-center text-slate-400 hover:border-momin-blue hover:text-momin-blue transition-all cursor-pointer bg-slate-50/50"
                        >
                            <Plus size={24} className="mb-2" />
                            <p className="text-xs font-bold uppercase tracking-widest">New Agent</p>
                        </div>
                    </div>
                </div>
            </div>
        </motion.div>
    );
};
