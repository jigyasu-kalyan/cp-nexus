'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Flame, RefreshCw, Play, Terminal, Pause, Keyboard } from 'lucide-react';
import { cn } from '@/lib/utils';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import Editor, { OnChange } from '@monaco-editor/react';

const MAX_TIME = 30;

// Judge0 Language IDs
const LANGUAGES = [
    { id: 'python', name: 'Python (3.8.1)', judge0Id: 71, monacoId: 'python' },
    { id: 'javascript', name: 'JavaScript (Node.js 12.14.0)', judge0Id: 63, monacoId: 'javascript' },
    { id: 'cpp', name: 'C++ (GCC 9.2.0)', judge0Id: 54, monacoId: 'cpp' },
    { id: 'java', name: 'Java (OpenJDK 13.0.1)', judge0Id: 62, monacoId: 'java' },
];

export function HardcoreEditor() {
    const [code, setCode] = useState('');
    const [input, setInput] = useState('');
    const [timeLeft, setTimeLeft] = useState(MAX_TIME);
    const [isActive, setIsActive] = useState(false);
    const [wiped, setWiped] = useState(false);
    const [language, setLanguage] = useState(LANGUAGES[0].id);
    const [output, setOutput] = useState('');
    const [isRunning, setIsRunning] = useState(false);
    const [isPaused, setIsPaused] = useState(false);

    // Timer Logic
    useEffect(() => {
        let interval: NodeJS.Timeout;

        if (isActive && timeLeft > 0 && !isPaused) {
            interval = setInterval(() => {
                setTimeLeft((prev) => prev - 1);
            }, 1000);
        } else if (timeLeft === 0) {
            // Time's up! Wipe the code.
            setCode('');
            setIsActive(false);
            setWiped(true);
            setTimeLeft(MAX_TIME);
            setOutput('');
            setIsPaused(false);

            // Reset wiped state after animation
            setTimeout(() => setWiped(false), 2000);
        }

        return () => clearInterval(interval);
    }, [isActive, timeLeft, isPaused]);

    const handleEditorChange: OnChange = (value) => {
        const newCode = value || '';
        setCode(newCode);
        // Only reset timer if NOT paused
        if (!isPaused) {
            setTimeLeft(MAX_TIME);
        }
        if (!isActive && newCode.length > 0) {
            setIsActive(true);
        }
    };

    const handleReset = () => {
        setCode('');
        setInput('');
        setTimeLeft(MAX_TIME);
        setIsActive(false);
        setWiped(false);
        setOutput('');
        setIsPaused(false);
    };

    const togglePause = () => {
        if (!isActive && !isPaused) return; // Can't pause if not started
        setIsPaused(!isPaused);
    };

    const runCode = async () => {
        if (!code.trim()) return;

        setIsRunning(true);
        setOutput('Submitting to Judge0...');

        // Auto-pause on run so user can read output without stress
        setIsPaused(true);

        const selectedLang = LANGUAGES.find(l => l.id === language);

        try {
            // 1. Submit Code
            const submitResponse = await fetch('https://ce.judge0.com/submissions/?base64_encoded=false&wait=false', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    source_code: code,
                    language_id: selectedLang?.judge0Id,
                    stdin: input,
                }),
            });

            if (!submitResponse.ok) {
                throw new Error(`Submission failed: ${submitResponse.statusText}`);
            }

            const submitData = await submitResponse.json();
            const token = submitData.token;

            if (!token) throw new Error('No token received from Judge0');

            setOutput('Compiling & Running...');

            // 2. Poll for Results
            const pollInterval = setInterval(async () => {
                try {
                    const resultResponse = await fetch(`https://ce.judge0.com/submissions/${token}?base64_encoded=false`);
                    const resultData = await resultResponse.json();

                    // Status IDs: 1 (In Queue), 2 (Processing)
                    if (resultData.status.id > 2) {
                        clearInterval(pollInterval);
                        setIsRunning(false);

                        if (resultData.stdout) {
                            setOutput(resultData.stdout);
                        } else if (resultData.stderr) {
                            setOutput(`Error:\n${resultData.stderr}`);
                        } else if (resultData.compile_output) {
                            setOutput(`Compilation Error:\n${resultData.compile_output}`);
                        } else {
                            setOutput(`Status: ${resultData.status.description}`);
                        }
                    }
                } catch (err) {
                    clearInterval(pollInterval);
                    setIsRunning(false);
                    setOutput('Error polling results.');
                    console.error(err);
                }
            }, 1000);

        } catch (error: any) {
            console.error('Execution failed:', error);
            setOutput(`Error: ${error.message || 'Execution failed'}`);
            setIsRunning(false);
        }
    };

    // Calculate progress percentage
    const progress = (timeLeft / MAX_TIME) * 100;

    // Determine color based on time left
    let progressColor = "bg-green-500";
    if (timeLeft < 10) progressColor = "bg-red-500";
    else if (timeLeft < 20) progressColor = "bg-yellow-500";
    if (isPaused) progressColor = "bg-blue-500";

    return (
        <div className="space-y-6 max-w-6xl mx-auto h-[85vh] flex flex-col">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 shrink-0">
                <div className="space-y-2">
                    <h1 className="text-3xl font-bold text-white flex items-center gap-2">
                        <Flame className={cn("h-8 w-8 text-orange-500", isActive && !isPaused && "animate-pulse")} />
                        Hardcore Editor <span className="text-sm font-normal text-zinc-500 ml-2">(Powered by Judge0 & Monaco)</span>
                    </h1>
                    <p className="text-zinc-400">
                        Keep typing! If you stop for <span className="text-white font-bold">{MAX_TIME} seconds</span>, your code disappears.
                    </p>
                </div>
                <div className="flex items-center gap-2">
                    <Select value={language} onValueChange={setLanguage}>
                        <SelectTrigger className="w-[180px] bg-white/5 border-white/10 text-white">
                            <SelectValue placeholder="Language" />
                        </SelectTrigger>
                        <SelectContent>
                            {LANGUAGES.map((lang) => (
                                <SelectItem key={lang.id} value={lang.id}>
                                    {lang.name}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                    <Button
                        onClick={togglePause}
                        disabled={!isActive}
                        className={cn(
                            "min-w-[140px] transition-all",
                            isPaused
                                ? "bg-blue-600 hover:bg-blue-700 text-white border-none"
                                : "bg-zinc-800 hover:bg-zinc-700 text-zinc-300 border border-white/10"
                        )}
                    >
                        {isPaused ? (
                            <>
                                <Play className="mr-2 h-4 w-4 fill-current" /> RESUME
                            </>
                        ) : (
                            <>
                                <Pause className="mr-2 h-4 w-4" /> PAUSE TIMER
                            </>
                        )}
                    </Button>
                    <Button
                        onClick={runCode}
                        disabled={isRunning || !code.trim()}
                        className="bg-green-600 hover:bg-green-700 text-white min-w-[100px]"
                    >
                        <Play className="mr-2 h-4 w-4" />
                        {isRunning ? 'Running...' : 'Run'}
                    </Button>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 flex-1 min-h-0">
                <Card className={cn(
                    "lg:col-span-2 bg-black/50 border-white/10 backdrop-blur-sm transition-all duration-500 flex flex-col overflow-hidden",
                    wiped && "border-red-500 shadow-[0_0_50px_rgba(239,68,68,0.5)]",
                    timeLeft < 5 && isActive && !isPaused && "border-red-500/50 shadow-[0_0_20px_rgba(239,68,68,0.2)]",
                    isPaused && "border-blue-500/50 shadow-[0_0_20px_rgba(59,130,246,0.2)]"
                )}>
                    <CardHeader className="pb-2 shrink-0">
                        <div className="flex justify-between items-center mb-2">
                            <div className="text-sm font-mono text-zinc-400">
                                {isActive ? (isPaused ? '⏸️ PAUSED (Editing Allowed)' : '🔥 ACTIVE') : '💤 IDLE'}
                            </div>
                            <div className={cn(
                                "text-2xl font-bold font-mono",
                                timeLeft < 10 && !isPaused ? "text-red-500 animate-pulse" : "text-white",
                                isPaused && "text-blue-400"
                            )}>
                                00:{timeLeft.toString().padStart(2, '0')}
                            </div>
                        </div>
                        <div className="h-2 w-full bg-zinc-800 rounded-full overflow-hidden">
                            <div
                                className={cn("h-full transition-all duration-1000 ease-linear", progressColor)}
                                style={{ width: `${progress}%` }}
                            />
                        </div>
                    </CardHeader>
                    <CardContent className="flex-1 p-0 relative min-h-0">
                        {wiped && (
                            <div className="absolute inset-0 flex items-center justify-center bg-black/80 z-50 backdrop-blur-sm animate-in fade-in zoom-in duration-300">
                                <div className="text-center">
                                    <h3 className="text-4xl font-bold text-red-500 mb-2">WIPED!</h3>
                                    <p className="text-zinc-400">Don't stop typing next time.</p>
                                </div>
                            </div>
                        )}
                        <div className={cn("h-full w-full transition-opacity duration-300")}>
                            <Editor
                                height="100%"
                                language={LANGUAGES.find(l => l.id === language)?.monacoId}
                                value={code}
                                onChange={handleEditorChange}
                                theme="vs-dark"
                                options={{
                                    minimap: { enabled: false },
                                    fontSize: 14,
                                    padding: { top: 16 },
                                    scrollBeyondLastLine: false,
                                    automaticLayout: true,
                                    readOnly: false, // Always allow editing
                                }}
                                className="rounded-b-lg overflow-hidden"
                            />
                        </div>
                    </CardContent>
                    <div className="p-4 border-t border-white/10 flex justify-end shrink-0">
                        <Button
                            variant="outline"
                            onClick={handleReset}
                            className="border-white/10 hover:bg-white/5 text-zinc-400 hover:text-white"
                        >
                            <RefreshCw className="mr-2 h-4 w-4" />
                            Reset
                        </Button>
                    </div>
                </Card>

                <div className="flex flex-col gap-4 h-full min-h-0">
                    {/* Input Section - 30% Height */}
                    <Card className="bg-black/50 border-white/10 backdrop-blur-sm flex flex-col overflow-hidden h-[30%]">
                        <CardHeader className="shrink-0 py-3 px-4 border-b border-white/5 bg-white/5">
                            <CardTitle className="text-xs font-medium text-zinc-400 flex items-center gap-2 uppercase tracking-wider">
                                <Keyboard className="h-3 w-3" />
                                Standard Input (stdin)
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="flex-1 min-h-0 p-0">
                            <textarea
                                value={input}
                                onChange={(e) => setInput(e.target.value)}
                                placeholder="Enter input for your program here..."
                                className="w-full h-full bg-transparent p-4 font-mono text-sm text-zinc-300 resize-none focus:outline-none placeholder:text-zinc-700"
                                spellCheck={false}
                            />
                        </CardContent>
                    </Card>

                    {/* Output Section - 70% Height */}
                    <Card className="bg-black/50 border-white/10 backdrop-blur-sm flex flex-col overflow-hidden h-[70%]">
                        <CardHeader className="shrink-0 py-3 px-4 border-b border-white/5 bg-white/5">
                            <CardTitle className="text-xs font-medium text-zinc-400 flex items-center gap-2 uppercase tracking-wider">
                                <Terminal className="h-3 w-3" />
                                Console Output
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="flex-1 min-h-0 p-0">
                            <div className="w-full h-full bg-black/40 p-4 font-mono text-sm overflow-auto whitespace-pre-wrap text-zinc-300">
                                {output || <span className="text-zinc-700 italic">Run code to see output...</span>}
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    );
}
