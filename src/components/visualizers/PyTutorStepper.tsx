"use client";

import { useState, useCallback, useMemo, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import CodeBlock from "../CodeBlock";

export interface Variable {
    name: string;
    value: string | number | boolean | null;
    type: string;
    address: string;
}

export interface StepState {
    lineNumber: number;
    variables: Variable[];
    output: string[];
    description?: string;
    waitingForInput?: {
        varName: string;
        prompt: string;
        wrapperType?: 'int' | 'float' | 'str';
    };
}

interface PyTutorStepperProps {
    code: string;
    steps?: StepState[];
    title?: string;
    onStepChange?: (step: StepState, stepIndex: number) => void;
}

// Generate a fake memory address
function generateAddress(index: number): string {
    return `0x${(0x4F00 + index).toString(16).toUpperCase()}`;
}

// Interactive Python interpreter
class InteractiveInterpreter {
    private lines: string[];
    private variables: Map<string, { value: string | number | boolean | null; type: string }>;
    private output: string[];
    private currentLineIndex: number;
    private userInputs: Map<string, string | number>;

    constructor(code: string) {
        this.lines = code.split('\n');
        this.variables = new Map();
        this.output = [];
        this.currentLineIndex = 0;
        this.userInputs = new Map();
    }

    setUserInput(varName: string, value: string | number) {
        this.userInputs.set(varName, value);
    }

    reset() {
        this.variables.clear();
        this.output = [];
        this.currentLineIndex = 0;
    }

    getNextStep(): StepState | null {
        while (this.currentLineIndex < this.lines.length) {
            const line = this.lines[this.currentLineIndex].trim();
            const lineNum = this.currentLineIndex + 1;
            this.currentLineIndex++;

            // Skip empty lines and comments
            if (!line || line.startsWith('#')) {
                continue;
            }

            let description = '';
            let waitingForInput: StepState['waitingForInput'] = undefined;

            // Parse assignment with input()
            const inputAssignMatch = line.match(/^(\w+)\s*=\s*(int\(|float\()?input\(['"](.*)['"](?:\))?/);
            if (inputAssignMatch) {
                const varName = inputAssignMatch[1];
                const wrapperType = inputAssignMatch[2] === 'int(' ? 'int' :
                    inputAssignMatch[2] === 'float(' ? 'float' : 'str';
                const prompt = inputAssignMatch[3];

                // Check if we have input for this
                if (this.userInputs.has(varName)) {
                    let value = this.userInputs.get(varName)!;
                    let type = typeof value === 'number' ? (wrapperType || 'int') : 'str';

                    if (wrapperType === 'int' && typeof value === 'string') {
                        value = parseInt(value) || 0;
                        type = 'int';
                    } else if (wrapperType === 'float' && typeof value === 'string') {
                        value = parseFloat(value) || 0;
                        type = 'float';
                    }

                    this.variables.set(varName, { value, type });
                    description = `משתנה ${varName} מקבל ערך "${value}" מהמשתמש`;
                } else {
                    // Wait for user input
                    waitingForInput = { varName, prompt, wrapperType };
                    description = `מחכה לקלט מהמשתמש: "${prompt}"`;
                }

                return this.createStep(lineNum, description, waitingForInput);
            }

            // Parse simple assignments: x = 10
            const assignMatch = line.match(/^(\w+)\s*=\s*(.+)$/);
            if (assignMatch) {
                const varName = assignMatch[1];
                let valueExpr = assignMatch[2];
                let value: string | number | boolean | null = valueExpr;
                let type = 'unknown';

                // Determine type and value
                if (valueExpr === 'True') { value = true; type = 'bool'; }
                else if (valueExpr === 'False') { value = false; type = 'bool'; }
                else if (valueExpr === 'None') { value = null; type = 'NoneType'; }
                else if (/^-?\d+$/.test(valueExpr)) { value = parseInt(valueExpr); type = 'int'; }
                else if (/^-?\d+\.\d+$/.test(valueExpr)) { value = parseFloat(valueExpr); type = 'float'; }
                else if (valueExpr.startsWith('"') || valueExpr.startsWith("'")) {
                    type = 'str';
                    value = valueExpr.slice(1, -1);
                }
                else if (valueExpr.startsWith('[')) {
                    type = 'list';
                    value = valueExpr;
                }
                else if (valueExpr.startsWith('{')) {
                    type = 'dict';
                    value = valueExpr;
                }
                else {
                    // Try to evaluate expression with known variables
                    value = this.evaluateExpression(valueExpr);
                    type = typeof value === 'number' ? 'int' : 'expression';
                }

                this.variables.set(varName, { value, type });
                description = `משתנה ${varName} מקבל ערך ${JSON.stringify(value)}`;

                return this.createStep(lineNum, description);
            }

            // Parse print statements
            const printMatch = line.match(/^print\s*\((.+)\)\s*$/);
            if (printMatch) {
                const content = printMatch[1];
                let outputLine = '';

                // f-string handling
                if (content.startsWith('f"') || content.startsWith("f'")) {
                    outputLine = this.evaluateFString(content);
                    description = `מדפיס פלט מעוצב`;
                }
                // Variable reference
                else if (this.variables.has(content)) {
                    outputLine = String(this.variables.get(content)?.value);
                    description = `מדפיס את הערך של ${content}`;
                }
                // Plain string
                else {
                    outputLine = content.replace(/['"]/g, '');
                    description = `מדפיס טקסט`;
                }

                this.output.push(outputLine);
                return this.createStep(lineNum, description);
            }

            // Parse if/elif statements
            if (line.startsWith('if ') || line.startsWith('elif ')) {
                const conditionMatch = line.match(/^(?:if|elif)\s+(.+?):/);
                if (conditionMatch) {
                    const condition = conditionMatch[1];
                    const result = this.evaluateCondition(condition);
                    description = `בודק תנאי: ${condition} → ${result ? 'אמת' : 'שקר'}`;
                }
                return this.createStep(lineNum, description);
            }

            if (line.startsWith('else:')) {
                description = 'מבצע את הענף האלטרנטיבי';
                return this.createStep(lineNum, description);
            }

            // Default - just show the line
            return this.createStep(lineNum, '');
        }

        return null;
    }

    private createStep(lineNumber: number, description: string, waitingForInput?: StepState['waitingForInput']): StepState {
        const currentVars: Variable[] = Array.from(this.variables.entries()).map(([name, data], idx) => ({
            name,
            value: data.value,
            type: data.type,
            address: generateAddress(idx),
        }));

        return {
            lineNumber,
            variables: [...currentVars],
            output: [...this.output],
            description,
            waitingForInput,
        };
    }

    private evaluateExpression(expr: string): string | number {
        // Try to resolve variables and simple math
        let resolved = expr;

        this.variables.forEach((data, name) => {
            const regex = new RegExp(`\\b${name}\\b`, 'g');
            resolved = resolved.replace(regex, String(data.value));
        });

        // Try to evaluate simple math
        try {
            if (/^[\d\s+\-*/().]+$/.test(resolved)) {
                return eval(resolved);
            }
        } catch {
            // Failed to evaluate
        }

        return resolved;
    }

    private evaluateFString(fstring: string): string {
        // Extract content between f" and "
        const content = fstring.slice(2, -1);

        let result = content;
        // Replace {varName} with actual values
        const matches = content.matchAll(/\{(\w+)\}/g);
        for (const match of matches) {
            const varName = match[1];
            const varData = this.variables.get(varName);
            if (varData) {
                result = result.replace(match[0], String(varData.value));
            }
        }

        return result;
    }

    private evaluateCondition(condition: string): boolean {
        // Simple condition evaluation
        let resolved = condition;

        this.variables.forEach((data, name) => {
            const regex = new RegExp(`\\b${name}\\b`, 'g');
            resolved = resolved.replace(regex, String(data.value));
        });

        try {
            // Replace Python operators with JS
            resolved = resolved.replace(' and ', ' && ').replace(' or ', ' || ');
            return Boolean(eval(resolved));
        } catch {
            return false;
        }
    }
}

export default function PyTutorStepper({
    code,
    steps: providedSteps,
    title = "סימולטור קוד",
    onStepChange,
}: PyTutorStepperProps) {
    const [currentStep, setCurrentStep] = useState(0);
    const [isPlaying, setIsPlaying] = useState(false);
    const [steps, setSteps] = useState<StepState[]>([]);
    const [inputValue, setInputValue] = useState('');
    const [waitingForInput, setWaitingForInput] = useState<StepState['waitingForInput']>(undefined);
    const interpreterRef = useRef<InteractiveInterpreter | null>(null);
    const inputRef = useRef<HTMLInputElement>(null);

    // Initialize interpreter
    useEffect(() => {
        interpreterRef.current = new InteractiveInterpreter(code);
        runToNextStep();
    }, [code]);

    const lines = code.split('\n');
    const currentState = steps[currentStep] || { lineNumber: 0, variables: [], output: [] };

    // Notify parent of step changes
    useEffect(() => {
        if (onStepChange && steps[currentStep]) {
            onStepChange(steps[currentStep], currentStep);
        }
    }, [currentStep, steps, onStepChange]);

    // Focus input when waiting
    useEffect(() => {
        if (waitingForInput && inputRef.current) {
            inputRef.current.focus();
        }
    }, [waitingForInput]);

    const runToNextStep = useCallback(() => {
        if (!interpreterRef.current) return;

        const step = interpreterRef.current.getNextStep();
        if (step) {
            setSteps(prev => [...prev, step]);
            setCurrentStep(prev => prev + 1);

            if (step.waitingForInput) {
                setWaitingForInput(step.waitingForInput);
                setIsPlaying(false);
            } else {
                setWaitingForInput(undefined);
            }
        }
    }, []);

    const handleInputSubmit = useCallback(() => {
        if (!waitingForInput || !interpreterRef.current) return;

        let value: string | number = inputValue;
        if (waitingForInput.wrapperType === 'int') {
            value = parseInt(inputValue) || 0;
        } else if (waitingForInput.wrapperType === 'float') {
            value = parseFloat(inputValue) || 0;
        }

        interpreterRef.current.setUserInput(waitingForInput.varName, value);
        setInputValue('');
        setWaitingForInput(undefined);

        // Re-run current line with input
        // Get next step with the input value applied
        const step = interpreterRef.current.getNextStep();
        if (step) {
            // Update last step with the new value
            setSteps(prev => {
                const updated = [...prev];
                updated[updated.length - 1] = {
                    ...updated[updated.length - 1],
                    variables: step.variables,
                    description: `משתנה ${waitingForInput.varName} מקבל ערך "${value}" מהמשתמש`,
                    waitingForInput: undefined,
                };
                return updated;
            });
        }
    }, [inputValue, waitingForInput]);

    const handleNext = useCallback(() => {
        if (waitingForInput) return; // Can't proceed without input

        if (currentStep < steps.length - 1) {
            setCurrentStep(prev => prev + 1);
        } else {
            runToNextStep();
        }
    }, [currentStep, steps.length, waitingForInput, runToNextStep]);

    const handlePrev = useCallback(() => {
        if (currentStep > 0) {
            setCurrentStep(prev => prev - 1);
        }
    }, [currentStep]);

    const handleReset = useCallback(() => {
        interpreterRef.current = new InteractiveInterpreter(code);
        setSteps([]);
        setCurrentStep(-1);
        setInputValue('');
        setWaitingForInput(undefined);
        setIsPlaying(false);

        // Run first step
        setTimeout(() => {
            const step = interpreterRef.current?.getNextStep();
            if (step) {
                setSteps([step]);
                setCurrentStep(0);
                if (step.waitingForInput) {
                    setWaitingForInput(step.waitingForInput);
                }
            }
        }, 0);
    }, [code]);

    // Auto-play functionality
    const handlePlay = useCallback(() => {
        if (isPlaying) {
            setIsPlaying(false);
            return;
        }
        setIsPlaying(true);
    }, [isPlaying]);

    // Auto-play effect
    useEffect(() => {
        if (!isPlaying || waitingForInput) return;

        const interval = setInterval(() => {
            if (currentStep >= steps.length - 1) {
                runToNextStep();
            } else {
                setCurrentStep(prev => prev + 1);
            }
        }, 1500);

        return () => clearInterval(interval);
    }, [isPlaying, waitingForInput, currentStep, steps.length, runToNextStep]);

    return (
        <div className="bg-surface-dark rounded-xl border border-border-dark overflow-hidden">
            {/* Header with Controls */}
            <div className="p-4 border-b border-border-dark flex items-center justify-between">
                <div>
                    <h3 className="text-lg font-bold flex items-center gap-2">
                        <span className="text-2xl">🔬</span>
                        {title}
                    </h3>
                    <p className="text-text-muted text-sm">
                        שלב {Math.max(0, currentStep) + 1} מתוך {Math.max(steps.length, 1)}
                    </p>
                </div>

                {/* Controls */}
                <div className="flex items-center gap-2">
                    <button
                        onClick={handleReset}
                        className="p-2 rounded-lg bg-border-dark hover:bg-border-dark/80 transition-colors"
                        title="התחל מחדש"
                    >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                        </svg>
                    </button>
                    <button
                        onClick={handlePrev}
                        disabled={currentStep <= 0}
                        className="p-2 rounded-lg bg-border-dark hover:bg-border-dark/80 transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
                        title="שלב קודם"
                    >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                        </svg>
                    </button>
                    <button
                        onClick={handlePlay}
                        disabled={!!waitingForInput}
                        className={`p-2 rounded-lg transition-colors ${isPlaying
                                ? 'bg-orange-500 hover:bg-orange-600'
                                : 'bg-primary hover:bg-primary/80 text-background-dark'
                            } disabled:opacity-30 disabled:cursor-not-allowed`}
                        title={isPlaying ? "עצור" : "הפעל אוטומטי"}
                    >
                        {isPlaying ? (
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 9v6m4-6v6m7-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                        ) : (
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                        )}
                    </button>
                    <button
                        onClick={handleNext}
                        disabled={!!waitingForInput}
                        className="p-2 rounded-lg bg-border-dark hover:bg-border-dark/80 transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
                        title="שלב הבא"
                    >
                        <svg className="w-5 h-5 rotate-180" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                        </svg>
                    </button>
                </div>
            </div>

            {/* Description Bar */}
            <AnimatePresence mode="wait">
                {currentState.description && (
                    <motion.div
                        key={currentStep}
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        className="px-4 py-3 bg-primary/10 border-b border-primary/30"
                    >
                        <p className="text-primary font-medium text-sm">
                            💡 {currentState.description}
                        </p>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Interactive Input Panel */}
            <AnimatePresence>
                {waitingForInput && (
                    <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        className="p-4 bg-yellow-500/10 border-b border-yellow-500/30"
                    >
                        <div className="flex items-center gap-4">
                            <div className="flex-1">
                                <label className="block text-sm font-medium text-yellow-400 mb-2">
                                    ⌨️ {waitingForInput.prompt}
                                </label>
                                <div className="flex gap-2">
                                    <input
                                        ref={inputRef}
                                        type={waitingForInput.wrapperType === 'int' || waitingForInput.wrapperType === 'float' ? 'number' : 'text'}
                                        value={inputValue}
                                        onChange={(e) => setInputValue(e.target.value)}
                                        onKeyDown={(e) => e.key === 'Enter' && handleInputSubmit()}
                                        className="flex-1 px-4 py-2 bg-black/50 border border-yellow-500/50 rounded-lg text-white font-mono focus:outline-none focus:border-yellow-400 focus:ring-1 focus:ring-yellow-400"
                                        placeholder={waitingForInput.wrapperType === 'int' ? 'הכנס מספר שלם...' : 'הכנס ערך...'}
                                        dir="ltr"
                                    />
                                    <button
                                        onClick={handleInputSubmit}
                                        disabled={!inputValue}
                                        className="px-6 py-2 bg-yellow-500 hover:bg-yellow-600 text-black font-bold rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                                    >
                                        שלח ⏎
                                    </button>
                                </div>
                                <p className="text-xs text-yellow-400/70 mt-2">
                                    הקלד ערך ולחץ Enter או לחץ על "שלח"
                                </p>
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Code Panel */}
            <div className="p-4">
                <CodeBlock
                    lines={lines.map(line => ({ code: line }))}
                    filename="example.py"
                    currentLine={currentState.lineNumber}
                />
            </div>

            {/* Output Panel (if has output) */}
            {currentState.output && currentState.output.length > 0 && (
                <div className="p-4 border-t border-border-dark">
                    <h4 className="text-xs text-text-muted mb-2 flex items-center gap-2">
                        <span>📤</span> פלט
                    </h4>
                    <div className="bg-black rounded-lg p-3 font-mono text-sm">
                        {currentState.output.map((line, idx) => (
                            <div key={idx} className="text-green-400">{line}</div>
                        ))}
                    </div>
                </div>
            )}

            {/* Progress Bar */}
            <div className="h-1 bg-border-dark">
                <motion.div
                    className="h-full bg-primary"
                    initial={{ width: 0 }}
                    animate={{ width: `${steps.length > 0 ? ((currentStep + 1) / Math.max(steps.length, 1)) * 100 : 0}%` }}
                    transition={{ duration: 0.3 }}
                />
            </div>
        </div>
    );
}

// Export types for use in parent
export type { PyTutorStepperProps };
