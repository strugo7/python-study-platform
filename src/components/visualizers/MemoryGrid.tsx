"use client";

import { motion, AnimatePresence } from "framer-motion";
import MemoryBox from "./MemoryBox";
import HeapObject from "./HeapObject";
import type { ComplexValue } from "@/data/curriculum.types";

interface MemorySlot {
    name?: string;
    value?: string | number;
    address: string;
    type?: string;
    isActive?: boolean;
    isNew?: boolean;
    isChanged?: boolean;
    hasPointer?: boolean;
    pointerTo?: string;
}

interface MemoryGridProps {
    slots: MemorySlot[];
    highlightedLine?: number;
    heapObjects?: ComplexValue[];
}

export default function MemoryGrid({ slots, highlightedLine, heapObjects }: MemoryGridProps) {
    const activeSlots = slots.filter(s => s.name);
    const emptySlots = slots.filter(s => !s.name);

    // Dynamic grid columns based on active variable count
    const totalActive = activeSlots.length;
    const gridCols = totalActive <= 2 ? 'grid-cols-2' :
        totalActive <= 4 ? 'grid-cols-4' :
            totalActive <= 6 ? 'grid-cols-3' : 'grid-cols-4';

    return (
        <section className="flex flex-col w-full h-full bg-[#0a150e] relative overflow-hidden">
            {/* Grid Background Pattern */}
            <div className="absolute inset-0 memory-grid opacity-20" />

            <div className="relative z-10 flex flex-col items-center justify-start h-full p-6 md:p-8">
                {/* Header */}
                <div className="text-primary/60 text-xs font-mono mb-6 self-start">
                    RAM PHYSICAL ADDRESS SPACE [0x0000 - 0xFFFF]
                </div>

                {/* Stack Variables Section */}
                <div className="w-full mb-4">
                    {activeSlots.length > 0 && (
                        <div className="text-xs text-primary/40 font-mono mb-4 uppercase tracking-wider">
                            Stack (Variables)
                        </div>
                    )}
                    <motion.div
                        className={`grid ${gridCols} gap-6 w-full max-w-md`}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ duration: 0.5 }}
                    >
                        {activeSlots.map((slot) => (
                            <div key={slot.address} className="relative pt-7 pb-5">
                                <MemoryBox
                                    name={slot.name!}
                                    value={slot.value ?? ""}
                                    address={slot.address}
                                    type={slot.type}
                                    isActive={slot.isActive}
                                    isNew={slot.isNew}
                                    isChanged={slot.isChanged}
                                    hasPointer={slot.hasPointer}
                                    pointerTo={slot.pointerTo}
                                />
                            </div>
                        ))}
                    </motion.div>
                </div>

                {/* Empty memory slots (dimmed) */}
                {emptySlots.length > 0 && (
                    <motion.div
                        className="grid grid-cols-4 gap-3 w-full max-w-md mt-4"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ duration: 0.5, delay: 0.2 }}
                    >
                        {emptySlots.slice(0, 8).map((slot, index) => (
                            <motion.div
                                key={slot.address}
                                className="aspect-square rounded-lg border border-primary/10 bg-primary/[0.02] flex items-center justify-center text-primary/10 font-mono text-[9px]"
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                transition={{ delay: index * 0.03 }}
                            >
                                {slot.address}
                            </motion.div>
                        ))}
                    </motion.div>
                )}

                {/* Heap Objects Section */}
                <AnimatePresence>
                    {heapObjects && heapObjects.length > 0 && (
                        <motion.div
                            className="w-full mt-6 space-y-3"
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: 10 }}
                        >
                            <div className="text-xs text-primary/40 font-mono uppercase tracking-wider">
                                Heap (Objects)
                            </div>
                            {heapObjects.map((obj, idx) => (
                                <HeapObject key={obj.address || idx} obj={obj} />
                            ))}
                        </motion.div>
                    )}
                </AnimatePresence>

                {/* Current Code Line Display */}
                {highlightedLine !== undefined && highlightedLine > 0 && (
                    <motion.div
                        className="mt-6 w-full max-w-sm p-3 rounded-xl bg-background-dark/80 border border-primary/30 backdrop-blur-sm"
                        initial={{ y: 20, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                    >
                        <div className="flex items-center gap-2">
                            <svg className="w-4 h-4 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 9l3 3-3 3m5 0h3M5 20h14a2 2 0 002-2V6a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                            </svg>
                            <span className="text-primary text-xs font-mono">שורה {highlightedLine}</span>
                        </div>
                    </motion.div>
                )}
            </div>
        </section>
    );
}
