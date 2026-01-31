'use client';

import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
// Removed GoogleGenerativeAI for 100% Simulation Mode
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
    Settings,
    Loader2,
    Sparkles
} from 'lucide-react';
import { CustomSelect } from './CustomSelect';

interface Message {
    role: 'user' | 'assistant';
    content: string;
    timestamp: Date;
    actions?: { iconName: string, text: string, type: string }[];
}

const IconMap: { [key: string]: any } = {
    Search: Search,
    Terminal: TerminalIcon,
    Database: Database,
    ShieldCheck: ShieldCheck
};

interface LogEntry {
    type: 'SYS' | 'LLM' | 'SEC' | 'IO';
    msg: string;
    color: string;
}

export const AgentStudio = ({ name, onClose }: { name: string, onClose: () => void }) => {
    const [view, setView] = useState<'create' | 'deploying' | 'interaction'>('create');
    const [creationStep, setCreationStep] = useState(0);
    const [skills, setSkills] = useState<string[]>([]);
    const [agentData, setAgentData] = useState({
        name: name,
        description: 'Autonomous research and development agent.',
        model: 'Gemini 2.5 Flash',
        prompt: 'You are an autonomous research assistant inside a secure MominAI sandbox. Your goal is to analyze data, navigate files, and provide structured insights. You must always act within the security boundaries and respond using Markdown. Leverage Gemini 2.5 Flash optimization for speed.',
        memory: 'Long-term Vector Memory',
        sandboxIsolation: 'Kernel-Level',
        firewall: 'Strict',
        computeQuota: 'Standard'
    });

    // Chat / AI State
    const [messages, setMessages] = useState<Message[]>([]);
    const [inputMessage, setInputMessage] = useState('');
    const [isTyping, setIsTyping] = useState(false);
    const [logs, setLogs] = useState<LogEntry[]>([]);
    const [showKeySettings, setShowKeySettings] = useState(false);
    const [tempKey, setTempKey] = useState('');
    const [isSimulating, setIsSimulating] = useState(false);
    const [simulatedActions, setSimulatedActions] = useState<{ iconName: string, text: string, type: string }[]>([]);
    const [hasInteracted, setHasInteracted] = useState(false);
    const chatEndRef = useRef<HTMLDivElement>(null);
    const logEndRef = useRef<HTMLDivElement>(null);

    // Persist and Fetch
    useEffect(() => {
        // Clear old sessions if history is corrupted or incompatible
        const sessionKey = `messages_${name}`;
        const savedMessages = localStorage.getItem(sessionKey);
        if (savedMessages) {
            try {
                const parsed = JSON.parse(savedMessages);
                // Validation: If any message has an old 'icon' property (object), clear history
                const isCorrupted = parsed.some((m: any) =>
                    m.actions?.some((a: any) => a.icon !== undefined)
                );

                if (isCorrupted) {
                    console.warn("Legacy message format detected. Purging cache for safety.");
                    localStorage.removeItem(sessionKey);
                } else {
                    setMessages(parsed.map((m: any) => ({ ...m, timestamp: new Date(m.timestamp) })));
                }
            } catch (e) {
                localStorage.removeItem(sessionKey);
            }
        }

        const savedData = localStorage.getItem(`agent_${name}`);
        if (savedData) {
            setAgentData(JSON.parse(savedData));
        }
    }, [name]);

    useEffect(() => {
        if (view === 'interaction' && messages.length <= 1 && hasInteracted && inputMessage === '') {
            const demoText = "Can you list all the files and what tools do you have active?";
            let i = 0;
            const interval = setInterval(() => {
                setInputMessage(demoText.slice(0, i + 1));
                i++;
                if (i === demoText.length) clearInterval(interval);
            }, 40);
            return () => clearInterval(interval);
        }
    }, [view, messages.length, hasInteracted]);

    useEffect(() => {
        chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages, isTyping, simulatedActions]);

    useEffect(() => {
        logEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [logs]);

    const addLog = (type: LogEntry['type'], msg: string) => {
        const colors = { SYS: 'text-slate-500', LLM: 'text-blue-500', SEC: 'text-amber-500', IO: 'text-green-500' };
        setLogs(prev => [...prev.slice(-15), { type, msg, color: colors[type] }]);
    };

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
        // Save Agent Config
        localStorage.setItem(`agent_${name}`, JSON.stringify({ ...agentData, skills }));

        setView('deploying');
        addLog('SYS', `Initializing Genesis Block for ${name}...`);

        setTimeout(() => {
            addLog('SEC', 'Kernel isolation confirmed (Namespace: 0x4F2)');
            addLog('IO', 'Mounting persistent volume /mnt/workspace');
        }, 800);

        setTimeout(() => {
            setView('interaction');
            addLog('SYS', 'Runtime environment ACTIVE');
            if (messages.length === 0) {
                const initialMsg: Message = {
                    role: 'assistant',
                    content: `Hello! I am **${agentData.name}**. I am powered by **Gemini 2.5 Flash**. \n\nMy core objective is: *${agentData.description}*\n\nHow can I assist you in this sandbox today?`,
                    timestamp: new Date()
                };
                setMessages([initialMsg]);
            }
        }, 2500);
    };

    const saveApiKey = () => {
        localStorage.setItem('GEMINI_API_KEY', tempKey);
        setShowKeySettings(false);
        addLog('SEC', 'API Key updated and secured in localStorage');
    };

    const sendMessage = async (e?: React.FormEvent) => {
        e?.preventDefault();
        if (!inputMessage.trim() || isTyping) return;

        const userMsg: Message = { role: 'user', content: inputMessage, timestamp: new Date() };
        const newMessages = [...messages, userMsg];
        setMessages(newMessages);
        setInputMessage('');
        setIsTyping(true);
        setSimulatedActions([]);
        addLog('SYS', 'Processing user directive...');

        setIsSimulating(true);

        const actions = [
            { iconName: 'Search', text: 'Scanning local directory structure...', type: 'READ' },
            { iconName: 'Terminal', text: 'Executing: ls -R /sandbox/workspace', type: 'EXEC' },
            { iconName: 'Database', text: 'Retrieving vector context (98.4% match)', type: 'MEM' },
            { iconName: 'ShieldCheck', text: 'Kernel security validation: PASS', type: 'SEC' }
        ];

        const currentActions: any[] = [];

        for (let i = 0; i < actions.length; i++) {
            // Initial thinking delay
            addLog('SYS', 'Analyzing kernel state...');
            await new Promise(r => setTimeout(r, 1200 + Math.random() * 800));

            // Add the action
            currentActions.push(actions[i]);
            setSimulatedActions([...currentActions]);
            addLog('IO', `SUCCESS: ${actions[i].text}`);

            // Delay between steps
            await new Promise(r => setTimeout(r, 1500));
        }

        // Final thinking pause before response
        addLog('LLM', 'Generating response substrate...');
        await new Promise(r => setTimeout(r, 2000));

        const simulatedText = `I have completed the system audit of your current sandbox environment. 

### 📁 Files Found
| Filename | Type | Size |
| :--- | :--- | :--- |
| \`main.py\` | Python Script | 4.2 KB |
| \`config.yaml\` | Configuration | 1.1 KB |
| \`utils.ts\` | TypeScript Core | 12.8 KB |

### 🛠 Active Capabilities
My current intelligence substrate is **Gemini 2.5 Flash**, provisioned with the following tools:
- **Network Stack**: Full outbound access enabled.
- **FileSystem**: Read/Write access to mount point \`/mnt/workspace\`.
- **Logic Engine**: Autonomous decision-making active.

How would you like to proceed with the development?`;

        const aiMsg: Message = {
            role: 'assistant',
            content: simulatedText,
            timestamp: new Date(),
            actions: [...currentActions]
        };
        const finalMessages = [...newMessages, aiMsg];
        setMessages(finalMessages);
        localStorage.setItem(`messages_${name}`, JSON.stringify(finalMessages));
        setIsTyping(false);
        setIsSimulating(false);
        setSimulatedActions([]);
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
                        <span className="text-slate-500 text-sm">{view === 'interaction' ? 'Active Directive' : 'Agent Studio'}</span>
                    </div>
                </div>
                <div className="flex items-center gap-6">
                    {/* Removed API Key Settings button */}
                    {view === 'create' && (
                        <div className="hidden md:flex gap-1 items-center px-3 py-1 bg-blue-50 text-momin-blue rounded-full text-[10px] font-bold uppercase tracking-wider">
                            <Info size={12} />
                            Step {creationStep + 1} of 5
                        </div>
                    )}
                    {view === 'interaction' && (
                        <div className="flex items-center gap-2">
                            <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                            <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Runtime: Online</span>
                        </div>
                    )}
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
                                                            'Gemini 2.5 Flash',
                                                            'Gemini 2.5 Pro (Experimental)',
                                                            'Ollama (Local: Llama3)',
                                                            'DeepSeek-V3 (HuggingFace)'
                                                        ]}
                                                        value={agentData.model}
                                                        onChange={(v) => setAgentData({ ...agentData, model: v })}
                                                    />

                                                    <div className="space-y-3">
                                                        <label className="text-xs font-bold text-slate-400 uppercase tracking-widest">System Architecture (Prompt)</label>
                                                        <textarea
                                                            value={agentData.prompt}
                                                            onChange={(e) => setAgentData({ ...agentData, prompt: e.target.value })}
                                                            rows={6}
                                                            className="w-full p-4 bg-slate-50 text-slate-900 border border-slate-200 rounded-xl text-sm font-mono focus:ring-2 focus:ring-momin-blue/20 outline-none transition-all resize-none leading-relaxed"
                                                        />
                                                        <p className="text-[11px] text-slate-400">This prompt is injected at the kernel level and defines the agent's absolute logic.</p>
                                                    </div>
                                                </div>
                                            </>
                                        )}

                                        {/* STEP 2: CAPABILITIES */}
                                        {creationStep === 2 && (
                                            <div className="space-y-10">
                                                <div className="flex flex-col gap-2">
                                                    <h3 className="text-3xl font-bold text-slate-900 tracking-tight">Equip with Capabilities</h3>
                                                    <p className="text-slate-500 leading-relaxed text-lg">Define the tools your agent can use.</p>
                                                </div>
                                                <div className="grid grid-cols-2 gap-4">
                                                    {[
                                                        { id: 'Network', icon: Globe, desc: 'External web access' },
                                                        { id: 'FileSystem', icon: HardDrive, desc: 'Read/Write to sandbox' },
                                                        { id: 'Shell', icon: TerminalIcon, desc: 'Execute system commands' },
                                                        { id: 'Memory', icon: Database, desc: 'Vector storage access' }
                                                    ].map(tool => (
                                                        <button
                                                            key={tool.id}
                                                            onClick={() => toggleSkill(tool.id)}
                                                            className={`flex items-center gap-4 p-4 rounded-2xl border transition-all text-left ${skills.includes(tool.id) ? 'bg-blue-50 border-momin-blue shadow-sm' : 'bg-white border-slate-100 hover:border-slate-200'}`}
                                                        >
                                                            <div className={`p-2 rounded-lg ${skills.includes(tool.id) ? 'bg-momin-blue text-white' : 'bg-slate-100 text-slate-400'}`}>
                                                                <tool.icon size={18} />
                                                            </div>
                                                            <div>
                                                                <p className={`text-sm font-bold ${skills.includes(tool.id) ? 'text-momin-blue' : 'text-slate-900'}`}>{tool.id}</p>
                                                                <p className="text-[10px] text-slate-500 font-medium">{tool.desc}</p>
                                                            </div>
                                                        </button>
                                                    ))}
                                                </div>
                                            </div>
                                        )}

                                        {/* STEP 3: ENVIRONMENT & SECURITY */}
                                        {creationStep === 3 && (
                                            <div className="space-y-10">
                                                <div className="flex flex-col gap-2">
                                                    <h3 className="text-3xl font-bold text-slate-900 tracking-tight">Harden Security</h3>
                                                    <p className="text-slate-500 leading-relaxed text-lg">Configure the isolation layer and security perimeter for this agent.</p>
                                                </div>

                                                <div className="space-y-8">
                                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                                        <CustomSelect
                                                            label="Isolation Layer"
                                                            options={['Kernel-Level (Sealed)', 'User-Mode (Standard)', 'Hypervisor (Air-Gapped)']}
                                                            value={agentData.sandboxIsolation}
                                                            onChange={(v) => setAgentData({ ...agentData, sandboxIsolation: v })}
                                                        />
                                                        <CustomSelect
                                                            label="Network Firewall"
                                                            options={['Strict (Local Only)', 'Outbound Only', 'Unrestricted']}
                                                            value={agentData.firewall}
                                                            onChange={(v) => setAgentData({ ...agentData, firewall: v })}
                                                        />
                                                    </div>

                                                    <div className="p-6 bg-amber-50 rounded-2xl border border-amber-100 flex gap-4">
                                                        <ShieldCheck className="text-amber-600 shrink-0" size={24} />
                                                        <div>
                                                            <p className="text-sm font-bold text-amber-900">Kernel-Level Protection Enabled</p>
                                                            <p className="text-xs text-amber-700 mt-1">This agent will run in a cryptographic sandbox. All filesystem operations are proxied through the host security manager.</p>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        )}

                                        {/* STEP 4: FINAL VERIFICATION */}
                                        {creationStep === 4 && (
                                            <div className="space-y-10">
                                                <div className="flex flex-col gap-2">
                                                    <h3 className="text-3xl font-bold text-slate-900 tracking-tight">Final Verification</h3>
                                                    <p className="text-slate-500 leading-relaxed text-lg">Review and provision the agent substrate.</p>
                                                </div>
                                                <div className="p-8 bg-slate-50 rounded-[2.5rem] border border-slate-200 shadow-sm space-y-6">
                                                    <div className="flex justify-between border-b border-slate-200 pb-4">
                                                        <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">Target Sandbox</span>
                                                        <span className="font-bold text-slate-900">{name}</span>
                                                    </div>
                                                    <div className="flex justify-between border-b border-slate-200 pb-4">
                                                        <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">Cognitive Core</span>
                                                        <span className="font-bold text-slate-900">{agentData.model}</span>
                                                    </div>
                                                    <div className="flex justify-between border-b border-slate-200 pb-4">
                                                        <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">Network Perim.</span>
                                                        <span className="font-bold text-slate-900">{agentData.firewall}</span>
                                                    </div>
                                                    <div className="flex justify-between">
                                                        <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">Isolation Layer</span>
                                                        <span className="font-bold text-slate-900">{agentData.sandboxIsolation}</span>
                                                    </div>
                                                </div>
                                            </div>
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
                                            <><Rocket size={18} /> Provision Agent</>
                                        ) : (
                                            <>Continue <ChevronRight size={18} /></>
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
                            <Loader2 className="w-12 h-12 text-momin-blue animate-spin mb-6" />
                            <p className="font-bold text-slate-900 text-xl tracking-tight">Provisioning System Resources...</p>
                            <p className="text-slate-400 mt-2 font-mono text-xs">Allocating virtual disk {"->"} {name.toLowerCase()}.vhd</p>
                        </motion.div>
                    </div>
                )}

                {view === 'interaction' && (
                    <div className="flex-1 flex flex-col md:flex-row divide-x divide-slate-200 relative bg-white">
                        {/* Left: Chat */}
                        <div className="flex-1 flex flex-col relative">
                            {/* Messages */}
                            <div className="flex-1 p-8 space-y-8 overflow-y-auto">
                                {messages.map((m, i) => (
                                    <div key={i} className={`flex gap-6 items-start ${m.role === 'user' ? 'justify-end' : ''}`}>
                                        {m.role === 'assistant' && (
                                            <div className="w-10 h-10 rounded-2xl bg-blue-50 text-momin-blue flex items-center justify-center font-black shrink-0 border border-blue-100 shadow-sm">
                                                <Sparkles size={20} />
                                            </div>
                                        )}
                                        <div className={`p-6 rounded-[2rem] text-sm leading-relaxed max-w-[85%] ${m.role === 'user'
                                            ? 'bg-slate-900 text-white shadow-xl'
                                            : 'bg-white border border-slate-200 text-slate-700 shadow-sm'
                                            }`}>
                                            {m.role === 'assistant' && m.actions && m.actions.length > 0 && (
                                                <div className="mb-6 space-y-3 pl-2 border-l-2 border-slate-100">
                                                    {m.actions.map((action, idx) => {
                                                        const IconComponent = IconMap[action.iconName] || Search;
                                                        return (
                                                            <div key={idx} className="flex items-center gap-3">
                                                                <div className="text-slate-400">
                                                                    <IconComponent size={14} />
                                                                </div>
                                                                <div className="flex items-center gap-2">
                                                                    <span className="text-[10px] font-black text-slate-300 uppercase tracking-tighter">
                                                                        {String(action.type)}
                                                                    </span>
                                                                    <span className="text-[11px] font-bold text-slate-500">
                                                                        {String(action.text)}
                                                                    </span>
                                                                </div>
                                                            </div>
                                                        );
                                                    })}
                                                </div>
                                            )}
                                            <div className="prose prose-sm max-w-none prose-slate">
                                                <ReactMarkdown
                                                    remarkPlugins={[remarkGfm]}
                                                    components={{
                                                        code({ node, className, children, ...props }: any) {
                                                            return <code className="bg-slate-100 px-1 rounded text-pink-600 font-mono" {...props}>{children}</code>;
                                                        },
                                                        pre({ node, children, ...props }: any) {
                                                            return <pre className="bg-slate-50 p-4 rounded-xl border border-slate-200 overflow-x-auto mt-2" {...props}>{children}</pre>;
                                                        },
                                                    }}
                                                >
                                                    {m.content}
                                                </ReactMarkdown>
                                            </div>
                                        </div>
                                        {m.role === 'user' && (
                                            <div className="w-10 h-10 rounded-2xl bg-slate-100 text-slate-400 flex items-center justify-center font-black shrink-0 border border-slate-200">
                                                <User size={20} />
                                            </div>
                                        )}
                                    </div>
                                ))}
                                {isTyping && (
                                    <div className="flex gap-6 items-start">
                                        <div className="w-10 h-10 rounded-2xl bg-blue-50 text-momin-blue flex items-center justify-center shrink-0 border border-blue-100">
                                            <Loader2 size={20} className="animate-spin" />
                                        </div>
                                        <div className="flex-1 space-y-4">
                                            <div className="p-6 bg-white border border-slate-200 rounded-[2rem] text-xs font-bold text-slate-400 italic">
                                                Agent is thinking...
                                            </div>

                                            {/* Simulated Action Icons */}
                                            <div className="space-y-3 pl-4">
                                                {simulatedActions.map((action, idx) => {
                                                    const IconComponent = IconMap[action.iconName] || Search;
                                                    return (
                                                        <motion.div
                                                            key={idx}
                                                            initial={{ opacity: 0, x: -10 }}
                                                            animate={{ opacity: 1, x: 0 }}
                                                            className="flex items-center gap-3"
                                                        >
                                                            <div className="text-slate-400">
                                                                <IconComponent size={14} />
                                                            </div>
                                                            <div className="flex items-center gap-2">
                                                                <span className="text-[10px] font-black text-slate-300 uppercase tracking-tighter">
                                                                    {action.type}
                                                                </span>
                                                                <span className="text-[11px] font-bold text-slate-500">
                                                                    {action.text}
                                                                </span>
                                                            </div>
                                                        </motion.div>
                                                    );
                                                })}
                                            </div>
                                        </div>
                                    </div>
                                )}
                                <div ref={chatEndRef} />
                            </div>

                            {/* Input */}
                            < div className="p-8 border-t border-slate-100" >
                                <form onSubmit={sendMessage} className="relative group max-w-4xl mx-auto">
                                    <input
                                        type="text"
                                        value={inputMessage}
                                        onChange={(e) => setInputMessage(e.target.value)}
                                        onFocus={() => setHasInteracted(true)}
                                        placeholder="Send directive to the agent..."
                                        className="w-full bg-slate-50 border border-slate-200 rounded-[2.5rem] px-8 py-5 text-sm focus:ring-4 focus:ring-momin-blue/10 focus:bg-white focus:border-momin-blue transition-all outline-none text-slate-900 shadow-sm pr-20"
                                    />
                                    <button
                                        type="submit"
                                        disabled={isTyping || !inputMessage.trim()}
                                        className="absolute right-3 top-1/2 -translate-y-1/2 p-3.5 bg-momin-blue text-white rounded-full shadow-xl shadow-blue-200 hover:scale-110 active:scale-95 transition-all disabled:opacity-50 disabled:scale-100"
                                    >
                                        <Send size={20} />
                                    </button>
                                </form>
                            </div>
                        </div>

                        {/* Right: Real-time System Observer */}
                        <div className="w-96 bg-slate-50/50 flex flex-col border-l border-slate-200">
                            <div className="p-8 bg-white border-b border-slate-200">
                                <div className="flex items-center justify-between mb-6">
                                    <h3 className="text-xs font-black text-slate-400 uppercase tracking-widest">Live Kernel Metrics</h3>
                                    <span className="px-2 py-0.5 bg-green-50 text-green-600 rounded text-[9px] font-black uppercase flex items-center gap-1">
                                        <Activity size={10} /> Syncing
                                    </span>
                                </div>

                                <div className="space-y-3 font-mono text-[11px] leading-tight overflow-y-auto max-h-[300px] custom-scrollbar p-1">
                                    {logs.map((log, i) => (
                                        <div key={i} className="flex gap-3">
                                            <span className="font-bold whitespace-nowrap opacity-50">[{log.type}]</span>
                                            <span className={`${log.color} break-all font-medium`}>{log.msg}</span>
                                        </div>
                                    ))}
                                    {isTyping && (
                                        <motion.div
                                            animate={{ opacity: [0, 1] }}
                                            transition={{ repeat: Infinity }}
                                            className="w-2 h-4 bg-momin-blue ml-12"
                                        />
                                    )}
                                    <div ref={logEndRef} />
                                </div>
                            </div>

                            <div className="flex-1 p-8 space-y-10 overflow-y-auto">
                                <div>
                                    <h3 className="text-xs font-black text-slate-400 uppercase tracking-widest mb-6">Agent DNA Context</h3>
                                    <div className="bg-white p-6 rounded-[2rem] border border-slate-200 shadow-sm space-y-4">
                                        <div className="flex justify-between items-center text-[11px] font-bold">
                                            <span className="text-slate-400">Logical Clock</span>
                                            <span className="text-slate-900">1.2s avg</span>
                                        </div>
                                        <div className="flex justify-between items-center text-[11px] font-bold">
                                            <span className="text-slate-400">Context Window</span>
                                            <span className="text-slate-900">128k Tokens</span>
                                        </div>
                                        <div className="h-1.5 w-full bg-slate-100 rounded-full overflow-hidden">
                                            <motion.div animate={{ width: isTyping ? '90%' : '65%' }} className="h-full bg-momin-blue" />
                                        </div>
                                    </div>
                                </div>

                                <div>
                                    <h3 className="text-xs font-black text-slate-400 uppercase tracking-widest mb-6">Active Tools</h3>
                                    <div className="flex flex-wrap gap-2">
                                        {skills.map(s => (
                                            <div key={s} className="px-3 py-2 bg-white border border-slate-200 rounded-xl flex items-center gap-2 shadow-sm">
                                                <Zap size={12} className="text-momin-blue" />
                                                <span className="text-[10px] font-black text-slate-600 uppercase">{s}</span>
                                            </div>
                                        ))}
                                        {skills.length === 0 && <span className="text-[10px] text-slate-400 font-bold italic uppercase tracking-widest">No tools mounted</span>}
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
