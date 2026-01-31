'use client';

import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Terminal, Cpu, HardDrive, Box, CheckCircle2, ChevronRight, AlertCircle } from 'lucide-react';

interface ProgressBarProps {
  label: string;
  targetPercentage: number;
  duration: number;
  onComplete?: () => void;
}

const ProgressBar: React.FC<ProgressBarProps> = ({ label, targetPercentage, duration, onComplete }) => {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= targetPercentage) {
          clearInterval(interval);
          onComplete?.();
          return targetPercentage;
        }
        return prev + Math.random() * 5;
      });
    }, duration / 20);

    return () => clearInterval(interval);
  }, [targetPercentage, duration, onComplete]);

  return (
    <div className="mb-4 font-mono">
      <div className="flex justify-between mb-1">
        <span className="text-sm text-gray-400">{label}</span>
        <span className="text-sm text-accent">{Math.round(progress)}%</span>
      </div>
      <div className="w-full bg-neutral-900 h-1.5 rounded-full overflow-hidden">
        <motion.div
          className="h-full bg-accent"
          initial={{ width: 0 }}
          animate={{ width: `${progress}%` }}
          transition={{ ease: "linear" }}
        />
      </div>
    </div>
  );
};

const TypewriterText = ({ text, delay = 50, onComplete }: { text: string; delay?: number; onComplete?: () => void }) => {
  const [displayedText, setDisplayedText] = useState('');
  const [isDone, setIsDone] = useState(false);

  useEffect(() => {
    let i = 0;
    const interval = setInterval(() => {
      setDisplayedText(text.slice(0, i + 1));
      i++;
      if (i >= text.length) {
        clearInterval(interval);
        setTimeout(() => {
          setIsDone(true);
          setTimeout(onComplete || (() => { }), 800);
        }, 500);
      }
    }, delay);
    return () => clearInterval(interval);
  }, [text, delay, onComplete]);

  return (
    <div className="flex items-center gap-2">
      <span className="text-white">{displayedText}</span>
      {!isDone && <motion.span animate={{ opacity: [0, 1] }} transition={{ repeat: Infinity, duration: 0.8 }} className="w-2 h-5 bg-accent" />}
      {isDone && (
        <motion.span
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-[10px] bg-neutral-800 px-1 rounded text-neutral-400 font-sans uppercase"
        >
          Enter
        </motion.span>
      )}
    </div>
  );
};

export default function TerminalUI({ onFinish }: { onFinish: () => void }) {
  const [phase, setPhase] = useState<'typing' | 'loading' | 'naming' | 'confirming' | 'finished'>('typing');
  const [logs, setLogs] = useState<string[]>([]);
  const [inputName, setInputName] = useState('');
  const [isZooming, setIsZooming] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [logs, phase]);

  const addLog = (log: string) => {
    setLogs((prev) => [...prev, log]);
  };

  const startLoading = () => {
    setPhase('loading');
    addLog('✔ Verifying credentials...');
    setTimeout(() => addLog('✔ Remote connection established.'), 400);
    setTimeout(() => addLog('✔ Environment compatibility check: OK'), 800);
    setTimeout(() => addLog('✔ Fetching remote substrate manifest...'), 1200);
    setTimeout(() => addLog('✔ Syncing local cache with master namespace...'), 1600);
  };

  const handleProgressComplete = () => {
    // Only move to next phase if all progress bars are done (logic simplified here)
    // For this demo, we'll just wait a bit and move to naming
    setTimeout(() => {
      setPhase('naming');
    }, 1000);
  };

  const handleNamingSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (inputName.trim()) {
      setPhase('confirming');
      setTimeout(() => {
        setIsZooming(true);
        setTimeout(onFinish, 1000);
      }, 2000);
    }
  };

  return (
    <div className="fixed inset-0 bg-background flex items-center justify-center p-4">
      <div className="scanline" />

      <AnimatePresence>
        {!isZooming && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 1.1, filter: 'blur(20px)' }}
            className="w-full max-w-2xl bg-neutral-950 border border-neutral-800 rounded-lg overflow-hidden shadow-2xl terminal-glow flex flex-col h-[500px]"
          >
            {/* Terminal Header */}
            <div className="bg-neutral-900 border-b border-neutral-800 px-4 py-2 flex items-center justify-between">
              <div className="flex gap-2">
                <div className="w-3 h-3 rounded-full bg-red-500/50" />
                <div className="w-3 h-3 rounded-full bg-yellow-500/50" />
                <div className="w-3 h-3 rounded-full bg-green-500/50" />
              </div>
              <div className="flex items-center gap-2 text-neutral-500 text-xs font-mono">
                <Terminal size={12} />
                <span>mominai-terminal — bash — 80x24</span>
              </div>
              <div />
            </div>

            {/* Terminal Content */}
            <div
              ref={scrollRef}
              className="p-6 flex-1 overflow-y-auto font-mono text-sm space-y-2 selection:bg-accent selection:text-black"
            >
              <div className="text-neutral-500 mb-4">
                MominAI Native Runtime v0.1.0-alpha<br />
                Substrate: Kernel-level isolated namespace<br />
                Resource Limit: OOM Killer Active | CPU Quota: 200%
              </div>

              <div className="flex gap-2 items-start">
                <span className="text-accent mt-[1px]">$</span>
                <div className="flex-1">
                  {phase === 'typing' ? (
                    <TypewriterText text="mominai create --recommended" onComplete={startLoading} />
                  ) : (
                    <span className="text-white">mominai create --recommended</span>
                  )}
                </div>
              </div>

              {(phase === 'loading' || phase === 'naming' || phase === 'confirming') && (
                <div className="mt-4 space-y-2">
                  {logs.map((log, i) => (
                    <div key={i} className="text-gray-300">{log}</div>
                  ))}

                  {phase === 'loading' && (
                    <div className="mt-6">
                      <ProgressBar label="⠋ Allocating CPU Cores (2 Cores)" targetPercentage={100} duration={2000} />
                      <ProgressBar label="⠙ Provisioning RAM (4.0GB)" targetPercentage={100} duration={3000} />
                      <ProgressBar label="⠹ Initializing GPU Partition (v1)" targetPercentage={100} duration={2500} onComplete={handleProgressComplete} />
                    </div>
                  )}
                </div>
              )}

              {phase === 'naming' && (
                <div className="mt-6">
                  <form onSubmit={handleNamingSubmit} className="flex flex-col gap-2">
                    <div className="flex gap-2 items-center">
                      <span className="text-blue-400">?</span>
                      <span className="font-bold">Enter Sandbox Name:</span>
                      <span className="text-neutral-500">›</span>
                      <input
                        autoFocus
                        type="text"
                        value={inputName}
                        onChange={(e) => setInputName(e.target.value)}
                        className="bg-transparent border-none outline-none !text-accent flex-1"
                        style={{ color: '#22c55e' }}
                        spellCheck={false}
                      />
                    </div>
                    {inputName && (
                      <div className="text-neutral-500 text-xs ml-6 mt-1">
                        Press Enter to provision sandbox
                      </div>
                    )}
                  </form>
                </div>
              )}

              {phase === 'confirming' && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="mt-8 p-4 border border-accent/30 bg-accent/5 rounded-lg"
                >
                  <div className="flex items-center gap-3 text-accent mb-2">
                    <CheckCircle2 size={18} />
                    <span className="font-bold uppercase tracking-wider">Success</span>
                  </div>
                  <div className="text-gray-300 space-y-1">
                    <div className="flex justify-between">
                      <span>Sandbox '{inputName}' is now ACTIVE</span>
                    </div>
                    <div className="flex justify-between text-xs text-neutral-500">
                      <span>Status: Isolated | Priority: High</span>
                      <span>Target: US-EAST-1</span>
                    </div>
                  </div>
                  <div className="mt-4 h-1 w-full bg-accent/20 overflow-hidden">
                    <motion.div
                      className="h-full bg-accent"
                      initial={{ width: '0%' }}
                      animate={{ width: '100%' }}
                      transition={{ duration: 1.5 }}
                    />
                  </div>
                </motion.div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
