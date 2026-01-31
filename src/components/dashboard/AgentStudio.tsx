'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    ChevronRight,
    Info,
    CheckCircle2,
    User,
    Cpu,
    Library,
    ShieldCheck,
    Rocket,
    Globe,
    Zap,
    Search,
    HardDrive,
    Terminal as TerminalIcon,
    Database,
    UploadCloud,
    FileJson,
    FileCode,
    Key,
    Lock,
    Send,
    Activity,
    Plus,
    Fingerprint,
    Settings
} from 'lucide-react';
import { CustomSelect } from './CustomSelect';

export const AgentStudio = ({ name, onClose }: { name: string, onClose: () => void }) => {
    const [view, setView] = useState<'create' | 'deploying' | 'interaction'>('create');
    const [creationStep, setCreationStep] = useState(0);
    const [skills, setSkills] = useState<string[]>([]);
    const [agentData, setAgentData] = useState({
        name: name,
        description: 'Autonomous research and development agent.',
        model: 'DeepSeek-V3 (HuggingFace)',
        prompt: 'You are an autonomous research assistant. Your goal is to navigate the sandbox environment, analyze files, and provide structured insights. You must always act within the security boundaries defined in your manifest.',
        memory: 'Long-term Vector Memory',
        sandboxIsolation: 'Kernel-Level',
    });

    const toggleSkill = (s: string) => setSkills(prev => prev.includes(s) ? prev.filter(x => x !== s) : [...prev, s]);

    const handleNext = () => {
        if (creationStep < 4) {
            setCreationStep(creationStep + 1);
        } else {
            handleDeploy();
        }
    };

    const handleBack = () => {
        if (creationStep > 0) {
            setCreationStep(creationStep - 1);
        }
    };

    const handleDeploy = () => {
        setView('deploying');
        setTimeout(() => setView('interaction'), 2500);
    };

    const steps = [
        { title: 'Identity', sub: 'Profile', icon: User },
        { title: 'Intelligence', sub: 'Engine', icon: Cpu },
        { title: 'Capabilities', sub: 'Skills', icon: Library },
        { title: 'Environment', sub: 'Security', icon: ShieldCheck },
        { title: 'Review', sub: 'Finalize', icon: Rocket },
    ];

    return (
        <motion.div
            layoutId={`card-${name}`}
            className="fixed inset-0 bg-white z-50 flex flex-col overflow-hidden light-theme"
        >
            {/* Header */}
            <div className="h-16 border-b border-slate-200 px-8 flex items-center justify-between shrink-0 bg-white">
                <div className="flex items-center gap-4">
                    <button onClick={onClose} className="p-2 hover:bg-slate-100 rounded-lg text-slate-500">
                        <ChevronRight size={20} className="rotate-180" />
                    </button>
                    <div className="flex items-center gap-2">
                        <h2 className="font-bold text-slate-900">{name}</h2>
                        <span className="text-slate-300">/</span>
                        <span className="text-slate-500 text-sm">Agent Studio</span>
                    </div>
                </div>
                <div className="flex items-center gap-6">
                    <div className="hidden md:flex gap-1 items-center px-3 py-1 bg-blue-50 text-momin-blue rounded-full text-[10px] font-bold uppercase tracking-wider">
                        <Info size={12} />
                        Step {creationStep + 1} of 5
                    </div>
                    <button className="px-4 py-1.5 bg-slate-900 text-white rounded-lg text-sm font-medium hover:bg-slate-800 transition-all">
                        Save Draft
                    </button>
                </div>
            </div>

            <div className="flex-1 flex overflow-hidden">
                {view === 'create' && (
                    <>
                        {/* Stepper Sidebar */}
                        <div className="w-72 border-r border-slate-100 bg-slate-50/50 p-8 hidden lg:flex flex-col">
                            <div className="mb-10">
                                <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-4">Creation Pipeline</h3>
                                <div className="space-y-6">
                                    {steps.map((s, i) => (
                                        <div key={i} className="flex gap-4 items-start relative">
                                            {i !== steps.length - 1 && (
                                                <div className={`absolute left-4 top-8 w-0.5 h-10 ${i < creationStep ? 'bg-momin-blue' : 'bg-slate-200'}`} />
                                            )}
                                            <div className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 z-10 transition-colors ${i <= creationStep ? 'bg-momin-blue text-white shadow-lg shadow-blue-200' : 'bg-white border border-slate-200 text-slate-300'
                                                }`}>
                                                {i < creationStep ? <CheckCircle2 size={16} /> : <s.icon size={16} />}
                                            </div>
                                            <div>
                                                <p className={`text-sm font-bold ${i <= creationStep ? 'text-slate-900' : 'text-slate-400'}`}>{s.title}</p>
                                                <p className="text-[10px] text-slate-500 font-medium">{s.sub}</p>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            <div className="mt-auto p-4 bg-blue-50/50 rounded-xl border border-blue-100">
                                <p className="text-[10px] font-bold text-momin-blue uppercase tracking-widest mb-2 flex items-center gap-2">
                                    <Globe size={12} /> Agent Insights
                                </p>
                                <p className="text-[11px] text-slate-600 leading-relaxed">
                                    {creationStep === 0 && "Agents are autonomous entities that use LLMs to reason and execute tasks in a loop."}
                                    {creationStep === 1 && "The system prompt defines the soul of your agent. It controls how it processes instructions."}
                                    {creationStep === 2 && "Tools (Skills) are JSON-schema defined functions that agents can call to interact with the world."}
                                    {creationStep === 3 && "Sandboxing ensures that even if an agent is compromised, it cannot escape the virtual disk."}
                                    {creationStep === 4 && "Review the final manifest before committing the agent to the runtime kernel."}
                                </p>
                            </div>
                        </div>

                        {/* Step Content */}
                        <div className="flex-1 overflow-y-auto bg-white p-8 md:p-12 lg:p-16">
                            <div className="max-w-2xl mx-auto space-y-10">
                                <AnimatePresence mode="wait">
                                    <motion.div
                                        key={creationStep}
                                        initial={{ opacity: 0, x: 20 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        exit={{ opacity: 0, x: -20 }}
                                        transition={{ duration: 0.3 }}
                                        className="space-y-8"
                                    >
                                        {/* STEP 0: IDENTITY */}
                                        {creationStep === 0 && (
                                            <>
                                                <div className="flex flex-col gap-2">
                                                    <h3 className="text-3xl font-bold text-slate-900 tracking-tight">Identify Your Agent</h3>
                                                    <p className="text-slate-500 leading-relaxed text-lg">Every agent needs a clear identity and purpose within the sandbox.</p>
                                                </div>

                                                <div className="space-y-6">
                                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                                        <div className="space-y-3">
                                                            <label className="text-xs font-bold text-slate-400 uppercase tracking-widest">Agent Alias</label>
                                                            <input
                                                                type="text"
                                                                value={agentData.name}
                                                                onChange={(e) => setAgentData({ ...agentData, name: e.target.value })}
                                                                className="w-full p-4 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-momin-blue/20 outline-none transition-all font-medium text-slate-900"
                                                                placeholder="e.g. Research_Bot_01"
                                                            />
                                                        </div>
                                                        <div className="space-y-3">
                                                            <label className="text-xs font-bold text-slate-400 uppercase tracking-widest">Visual Marker</label>
                                                            <div className="flex gap-3">
                                                                {[Cpu, Globe, ShieldCheck, Zap, Search].map((Icon, idx) => (
                                                                    <button key={idx} className="w-12 h-12 bg-slate-50 border border-slate-200 rounded-xl flex items-center justify-center hover:bg-white hover:border-momin-blue group transition-all">
                                                                        <Icon size={20} className="text-slate-400 group-hover:text-momin-blue transition-colors" />
                                                                    </button>
                                                                ))}
                                                            </div>
                                                        </div>
                                                    </div>

                                                    <div className="space-y-3">
                                                        <label className="text-xs font-bold text-slate-400 uppercase tracking-widest">Operational Role</label>
                                                        <textarea
                                                            value={agentData.description}
                                                            onChange={(e) => setAgentData({ ...agentData, description: e.target.value })}
                                                            rows={3}
                                                            className="w-full p-4 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-momin-blue/20 outline-none transition-all resize-none font-medium text-slate-900"
                                                            placeholder="What is this agent's primary objective?"
                                                        />
                                                    </div>
                                                </div>
                                            </>
                                        )}

                                        {/* STEP 1: INTELLIGENCE */}
                                        {creationStep === 1 && (
                                            <>
                                                <div className="flex flex-col gap-2">
                                                    <h3 className="text-3xl font-bold text-slate-900 tracking-tight">Define Intelligence</h3>
                                                    <p className="text-slate-500 leading-relaxed text-lg">Select the cognitive baseline and persona for your agent.</p>
                                                </div>

                                                <div className="space-y-8">
                                                    <CustomSelect
                                                        label="Cognitive Engine (LLM)"
                                                        options={[
                                                            'HuggingFace (DeepSeek-V3)',
                                                            'Ollama (Local: Llama3)',
                                                            'OpenAI (Enterprise Cloud)',
                                                            'Anthropic (Claude-3.5-Sonnet)'
                                                        ]}
                                                    />

                                                    <div className="space-y-3">
                                                        <label className="text-xs font-bold text-slate-400 uppercase tracking-widest">System Architecture (Prompt)</label>
                                                        <textarea
                                                            value={agentData.prompt}
                                                            onChange={(e) => setAgentData({ ...agentData, prompt: e.target.value })}
                                                            rows={6}
                                                            className="w-full p-4 bg-slate-50 text-slate-900 border border-slate-200 rounded-xl text-sm font-mono focus:ring-2 focus:ring-momin-blue/20 outline-none transition-all resize-none leading-relaxed"
                                                        />
                                                        <p className="text-[11px] text-slate-400">This prompt is injected at the kernel level and cannot be overridden by user input.</p>
                                                    </div>
                                                </div>
                                            </>
                                        )}

                                        {/* STEP 2: CAPABILITIES */}
                                        {creationStep === 2 && (
                                            <>
                                                <div className="flex flex-col gap-2">
                                                    <h3 className="text-3xl font-bold text-slate-900 tracking-tight">Equip with Capabilities</h3>
                                                    <p className="text-slate-500 leading-relaxed text-lg">Define the tools your agent can use or import an existing manifest.</p>
                                                </div>

                                                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                                    <div className="space-y-6">
                                                        <label className="text-xs font-bold text-slate-400 uppercase tracking-widest">Available Tools (JSON-Schema)</label>
                                                        <div className="grid grid-cols-1 gap-3">
                                                            {[
                                                                { id: 'Network', icon: Globe, desc: 'External web access' },
                                                                { id: 'FileSystem', icon: HardDrive, desc: 'Read/Write to sandbox' },
                                                                { id: 'Shell', icon: TerminalIcon, desc: 'Execute system commands' },
                                                                { id: 'Memory', icon: Database, desc: 'Vector storage access' }
                                                            ].map(tool => (
                                                                <button
                                                                    key={tool.id}
                                                                    onClick={() => toggleSkill(tool.id)}
                                                                    className={`flex items-center gap-4 p-4 rounded-2xl border transition-all text-left ${skills.includes(tool.id)
                                                                        ? 'bg-blue-50 border-momin-blue shadow-sm'
                                                                        : 'bg-white border-slate-100 hover:border-slate-200'
                                                                        }`}
                                                                >
                                                                    <div className={`p-2 rounded-lg ${skills.includes(tool.id) ? 'bg-momin-blue text-white' : 'bg-slate-100 text-slate-400'}`}>
                                                                        <tool.icon size={18} />
                                                                    </div>
                                                                    <div>
                                                                        <p className={`text-sm font-bold ${skills.includes(tool.id) ? 'text-momin-blue' : 'text-slate-900'}`}>{tool.id}</p>
                                                                        <p className="text-[10px] text-slate-500 font-medium">{tool.desc}</p>
                                                                    </div>
                                                                    {skills.includes(tool.id) && <CheckCircle2 size={16} className="ml-auto text-momin-blue" />}
                                                                </button>
                                                            ))}
                                                        </div>
                                                    </div>

                                                    <div className="space-y-6">
                                                        <label className="text-xs font-bold text-slate-400 uppercase tracking-widest">Universal Import</label>
                                                        <div className="border-2 border-dashed border-slate-200 rounded-3xl p-8 bg-slate-50/50 flex flex-col items-center justify-center gap-4 group hover:border-momin-blue/30 transition-all cursor-pointer">
                                                            <div className="w-16 h-16 bg-white rounded-2xl shadow-xl flex items-center justify-center text-slate-300 group-hover:text-momin-blue group-hover:scale-110 transition-all">
                                                                <UploadCloud size={32} />
                                                            </div>
                                                            <div className="text-center">
                                                                <p className="text-sm font-bold text-slate-900">Import .af / .json</p>
                                                                <p className="text-[10px] text-slate-400 mt-1 uppercase tracking-wider font-bold">Leta / OpenAI / Custom</p>
                                                            </div>
                                                            <div className="mt-2 flex gap-2">
                                                                <FileJson size={14} className="text-slate-300" />
                                                                <FileCode size={14} className="text-slate-300" />
                                                            </div>
                                                        </div>
                                                        <div className="p-4 bg-amber-50 rounded-xl border border-amber-100 flex gap-3">
                                                            <ShieldCheck size={20} className="text-amber-600 shrink-0" />
                                                            <p className="text-[10px] text-amber-800 leading-normal">
                                                                <span className="font-bold">Security Note:</span> Imported tools will be automatically wrapped in a safety Shim to prevent escape.
                                                            </p>
                                                        </div>
                                                    </div>
                                                </div>
                                            </>
                                        )}

                                        {/* STEP 3: ENVIRONMENT */}
                                        {creationStep === 3 && (
                                            <>
                                                <div className="flex flex-col gap-2">
                                                    <h3 className="text-3xl font-bold text-slate-900 tracking-tight">Secure Environment</h3>
                                                    <p className="text-slate-500 leading-relaxed text-lg">Configure the sandbox isolation and vault credentials.</p>
                                                </div>

                                                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                                    <div className="space-y-6">
                                                        <div className="space-y-3">
                                                            <label className="text-xs font-bold text-slate-400 uppercase tracking-widest">Sandbox Isolation</label>
                                                            <div className="space-y-2">
                                                                {['Kernel-Level Isolation'].map(mode => (
                                                                    <button
                                                                        key={mode}
                                                                        onClick={() => setAgentData({ ...agentData, sandboxIsolation: mode })}
                                                                        className={`w-full p-4 rounded-xl border text-left flex items-center justify-between transition-all ${agentData.sandboxIsolation === mode ? 'border-momin-blue bg-blue-50' : 'border-slate-100'}`}
                                                                    >
                                                                        <span className={`text-sm font-medium ${agentData.sandboxIsolation === mode ? 'text-momin-blue' : 'text-slate-600'}`}>{mode}</span>
                                                                        {agentData.sandboxIsolation === mode && <CheckCircle2 size={16} className="text-momin-blue" />}
                                                                    </button>
                                                                ))}
                                                                <p className="text-[10px] text-slate-400 font-medium px-1 italic">
                                                                    Only Kernel-Level isolation is enabled for the MominAI Pro environment.
                                                                </p>
                                                            </div>
                                                        </div>
                                                    </div>

                                                    <div className="space-y-6">
                                                        <div className="space-y-3">
                                                            <label className="text-xs font-bold text-slate-400 uppercase tracking-widest">Credential Vault</label>
                                                            <div className="p-4 bg-slate-900 rounded-2xl space-y-4">
                                                                <div className="flex items-center justify-between">
                                                                    <div className="flex items-center gap-2">
                                                                        <Key size={14} className="text-slate-400" />
                                                                        <span className="text-[10px] font-bold text-slate-300 uppercase tracking-widest">Secrets</span>
                                                                    </div>
                                                                    <div className="w-2 h-2 rounded-full bg-green-500" />
                                                                </div>
                                                                <div className="space-y-2">
                                                                    <div className="flex items-center justify-between px-3 py-2 bg-slate-800 rounded-lg">
                                                                        <span className="text-[10px] text-slate-400 font-mono italic">OPENAI_API_KEY</span>
                                                                        <Lock size={12} className="text-slate-500" />
                                                                    </div>
                                                                    <div className="flex items-center justify-between px-3 py-2 bg-slate-800 rounded-lg">
                                                                        <span className="text-[10px] text-slate-400 font-mono italic">TAVILY_API_KEY</span>
                                                                        <Plus size={12} className="text-momin-blue cursor-pointer" />
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </>
                                        )}

                                        {/* STEP 4: REVIEW */}
                                        {creationStep === 4 && (
                                            <>
                                                <div className="flex flex-col gap-2 text-center pb-4">
                                                    <div className="w-20 h-20 bg-blue-50 text-momin-blue rounded-3xl flex items-center justify-center mx-auto mb-4">
                                                        <Fingerprint size={40} />
                                                    </div>
                                                    <h3 className="text-3xl font-bold text-slate-900 tracking-tight">Genesis Block Ready</h3>
                                                    <p className="text-slate-500 leading-relaxed text-lg">Review the agent manifest before spawning the runtime.</p>
                                                </div>

                                                <div className="bg-slate-50 border border-slate-200 rounded-3xl overflow-hidden divide-y divide-slate-100">
                                                    <div className="p-6 flex justify-between items-center">
                                                        <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">Manifest URI</span>
                                                        <span className="text-xs font-mono text-momin-blue">agt://{agentData.name.toLowerCase()}.manifest</span>
                                                    </div>
                                                    <div className="p-6 grid grid-cols-2 gap-8">
                                                        <div>
                                                            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2">Cognitive Layer</p>
                                                            <p className="text-sm font-bold text-slate-900">{agentData.model}</p>
                                                            <p className="text-[11px] text-slate-500 mt-1">Temperature: 0.7 (Standard)</p>
                                                        </div>
                                                        <div>
                                                            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2">Security Context</p>
                                                            <p className="text-sm font-bold text-slate-900">{agentData.sandboxIsolation}</p>
                                                            <p className="text-[11px] text-slate-500 mt-1">Status: Sealed</p>
                                                        </div>
                                                    </div>
                                                    <div className="p-6">
                                                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-4">Equipped Tools</p>
                                                        <div className="flex flex-wrap gap-2">
                                                            {skills.map(s => (
                                                                <span key={s} className="px-3 py-1 bg-white border border-slate-200 rounded-full text-[10px] font-bold text-slate-600">
                                                                    {s}
                                                                </span>
                                                            ))}
                                                            {skills.length === 0 && <span className="text-xs text-slate-400 italic">No tools selected</span>}
                                                        </div>
                                                    </div>
                                                </div>
                                            </>
                                        )}
                                    </motion.div>
                                </AnimatePresence>

                                {/* Navigation */}
                                <div className="pt-10 flex items-center justify-between border-t border-slate-100 mt-auto">
                                    <button
                                        onClick={handleBack}
                                        disabled={creationStep === 0}
                                        className={`flex items-center gap-2 px-6 py-3 rounded-xl font-bold text-sm transition-all ${creationStep === 0 ? 'text-slate-300' : 'text-slate-600 hover:bg-slate-50'}`}
                                    >
                                        <ChevronRight size={18} className="rotate-180" />
                                        Back
                                    </button>

                                    <button
                                        onClick={handleNext}
                                        className="flex items-center gap-2 px-8 py-3 bg-momin-blue text-white rounded-xl font-bold text-sm shadow-xl shadow-blue-200 hover:scale-[1.02] active:scale-95 transition-all"
                                    >
                                        {creationStep === 4 ? (
                                            <>
                                                <Rocket size={18} />
                                                Provision Agent
                                            </>
                                        ) : (
                                            <>
                                                Continue
                                                <ChevronRight size={18} />
                                            </>
                                        )}
                                    </button>
                                </div>
                            </div>
                        </div>
                    </>
                )}

                {view === 'deploying' && (
                    <div className="flex-1 flex flex-col items-center justify-center bg-slate-50">
                        <motion.div
                            initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}
                            className="flex flex-col items-center"
                        >
                            <div className="relative">
                                <div className="w-24 h-24 border-4 border-slate-200 rounded-3xl" />
                                <motion.div
                                    initial={{ height: 0 }} animate={{ height: '100%' }} transition={{ duration: 2 }}
                                    className="absolute bottom-0 left-0 w-full bg-momin-blue rounded-3xl opacity-20"
                                />
                                <motion.div
                                    className="absolute inset-0 flex items-center justify-center text-momin-blue"
                                    animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 2, ease: "linear" }}
                                >
                                    <Settings size={32} />
                                </motion.div>
                            </div>
                            <p className="mt-8 font-bold text-slate-900 text-xl tracking-tight">Provisioning System Resources...</p>
                            <p className="text-slate-400 mt-2 font-mono text-xs">Allocating virtual disk {"->"} {agentData.name.toLowerCase()}.vhd</p>
                        </motion.div>
                    </div>
                )}

                {view === 'interaction' && (
                    <div className="flex-1 flex flex-col md:flex-row divide-x divide-slate-200 relative">
                        {/* Left: Chat */}
                        <div className="flex-1 flex flex-col">
                            <div className="flex-1 p-8 space-y-6 overflow-y-auto">
                                <div className="flex gap-4 items-start">
                                    <div className="w-8 h-8 rounded bg-slate-100 flex items-center justify-center text-slate-400 font-bold shrink-0">U</div>
                                    <div className="bg-slate-100 p-4 rounded-2xl text-sm text-slate-700 max-w-[80%] leading-relaxed">
                                        Scan the local directory and summarize the project.
                                    </div>
                                </div>

                                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex gap-4 items-start">
                                    <div className="w-8 h-8 rounded bg-blue-100 flex items-center justify-center text-momin-blue font-bold shrink-0">A</div>
                                    <div className="space-y-4 max-w-[80%]">
                                        <div className="p-4 rounded-2xl border border-slate-200 text-sm text-slate-700 leading-relaxed shadow-sm">
                                            Understood. Accessing restricted namespace /mnt/workspace...
                                        </div>
                                        <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl flex items-center gap-3">
                                            <div className="p-2 bg-white rounded-lg shadow-sm">
                                                <FileCode size={16} className="text-momin-blue" />
                                            </div>
                                            <div>
                                                <p className="text-[11px] font-bold text-slate-900">summary.md</p>
                                                <p className="text-[9px] text-slate-400 uppercase font-bold tracking-tight">File Created Successfully</p>
                                            </div>
                                        </div>
                                    </div>
                                </motion.div>
                            </div>

                            <div className="p-6 border-t border-slate-200">
                                <div className="relative group">
                                    <input
                                        type="text"
                                        placeholder="Send system directive..."
                                        className="w-full bg-slate-100 border-none rounded-2xl p-4 pr-12 text-sm focus:ring-2 focus:ring-momin-blue/20 transition-all outline-none text-slate-900"
                                    />
                                    <button className="absolute right-3 top-1/2 -translate-y-1/2 p-2 bg-momin-blue text-white rounded-xl shadow-lg shadow-blue-200 hover:scale-105 transition-all">
                                        <Send size={18} />
                                    </button>
                                </div>
                            </div>
                        </div>

                        {/* Right: System Observer */}
                        <div className="w-80 bg-slate-50 flex flex-col">
                            <div className="p-6 border-b border-slate-200 bg-white">
                                <div className="flex items-center justify-between mb-4">
                                    <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest">Kernel Logs</h3>
                                    <span className="text-[9px] font-bold text-green-500 flex items-center gap-1">
                                        <Activity size={10} /> LIVE
                                    </span>
                                </div>
                                <div className="space-y-3 font-mono text-[10px]">
                                    {[
                                        { type: 'SYS', msg: `INIT: ${agentData.name} -> starting loop`, color: 'text-slate-600' },
                                        { type: 'SYS', msg: 'ACCESS_GRANTED: /mnt/workspace', color: 'text-green-600' },
                                        { type: 'SYS', msg: 'FILE_WRITE: summary.md created.', color: 'text-blue-600' },
                                        { type: 'SEC', msg: 'MEM_GUARD: prevented heap escape', color: 'text-amber-600' },
                                    ].map((log, i) => (
                                        <div key={i} className="flex gap-2 leading-tight">
                                            <span className="font-bold shrink-0">[{log.type}]</span>
                                            <span className={log.color}>{log.msg}</span>
                                        </div>
                                    ))}
                                    <motion.div animate={{ opacity: [0, 1] }} transition={{ repeat: Infinity }} className="w-1.5 h-3 bg-momin-blue" />
                                </div>
                            </div>

                            <div className="flex-1 p-6">
                                <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-4">Mounted Volumes</h3>
                                <div className="space-y-2">
                                    <div className="p-3 bg-white border border-slate-200 rounded-lg flex items-center justify-between group cursor-pointer hover:border-momin-blue transition-colors shadow-sm">
                                        <div className="flex items-center gap-2">
                                            <Database size={14} className="text-slate-400" />
                                            <span className="text-[11px] font-bold text-slate-700">workspace_vol_01</span>
                                        </div>
                                        <span className="text-[9px] text-green-500 font-bold tracking-tight">MOUNTED</span>
                                    </div>
                                    <div className="p-3 bg-white border border-slate-100 rounded-lg flex items-center justify-between opacity-50">
                                        <div className="flex items-center gap-2">
                                            <Globe size={14} className="text-slate-400" />
                                            <span className="text-[11px] font-bold text-slate-700">public_assets</span>
                                        </div>
                                        <span className="text-[9px] text-slate-300 font-bold uppercase tracking-tight">RO</span>
                                    </div>
                                </div>

                                <div className="mt-8">
                                    <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-4">Agent DNA</h3>
                                    <div className="space-y-3">
                                        <div className="flex justify-between items-center text-[10px]">
                                            <span className="text-slate-500">Logical Clock</span>
                                            <span className="text-slate-900 font-bold">1.2s avg</span>
                                        </div>
                                        <div className="h-1.5 w-full bg-slate-200 rounded-full overflow-hidden">
                                            <motion.div
                                                initial={{ width: 0 }}
                                                animate={{ width: '65%' }}
                                                className="h-full bg-momin-blue"
                                            />
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </motion.div>
    );
};
