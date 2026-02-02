"use client";

import { motion } from "framer-motion";
import MemoryBox from "./MemoryBox";

interface MemorySlot {
    name?: string;
    value?: string | number;
    address: string;
    isActive?: boolean;
    hasPointer?: boolean;
    pointerTo?: string;
}

interface MemoryGridProps {
    slots: MemorySlot[];
    highlightedLine?: number;
}

export default function MemoryGrid({ slots, highlightedLine }: MemoryGridProps) {
    return (
        <section className="flex flex-col w-full h-full bg-[#0a150e] relative overflow-hidden">
            {/* Grid Background Pattern */}
            <div className="absolute inset-0 memory-grid opacity-20" />

            <div className="relative z-10 flex flex-col items-center justify-center h-full p-12">
                {/* Header */}
                <div className="text-primary/60 text-xs font-mono mb-8 self-start">
                    RAM PHYSICAL ADDRESS SPACE [0x0000 - 0xFFFF]
                </div>

                {/* Memory Grid */}
                <motion.div
                    className="grid grid-cols-4 gap-6 w-full max-w-md"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.5 }}
                >
                    {slots.map((slot, index) => (
                        <div key={slot.address} className="relative">
                            {slot.name ? (
                                <MemoryBox
                                    name={slot.name}
                                    value={slot.value ?? ""}
                                    address={slot.address}
                                    isActive={slot.isActive}
                                    hasPointer={slot.hasPointer}
                                    pointerTo={slot.pointerTo}
                                />
                            ) : (
                                <motion.div
                                    className="aspect-square rounded-lg border border-primary/20 bg-primary/5 flex items-center justify-center text-primary/10 font-mono text-xs"
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    transition={{ delay: index * 0.05 }}
                                >
                                    {slot.address}
                                </motion.div>
                            )}
                        </div>
                    ))}
                </motion.div>

                {/* Current Code Line Display */}
                {highlightedLine !== undefined && (
                    <motion.div
                        className="mt-12 w-full max-w-sm p-4 rounded-xl bg-background-dark/80 border border-primary/30 backdrop-blur-sm"
                        initial={{ y: 20, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                    >
                        <div className="flex items-center gap-2 mb-2">
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
