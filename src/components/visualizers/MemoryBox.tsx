"use client";

import { motion } from "framer-motion";

interface MemoryBoxProps {
    name: string;
    value: string | number;
    address?: string;
    isActive?: boolean;
    hasPointer?: boolean;
    pointerTo?: string;
}

export default function MemoryBox({
    name,
    value,
    address = "0x4F5",
    isActive = false,
    hasPointer = false,
    pointerTo,
}: MemoryBoxProps) {
    return (
        <motion.div
            className={`relative aspect-square rounded-lg border-2 flex flex-col items-center justify-center transition-all ${isActive
                    ? "border-primary bg-primary/20 neon-glow animate-pulse-glow"
                    : "border-primary/20 bg-primary/5"
                }`}
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.3 }}
            whileHover={{ scale: 1.05 }}
        >
            {/* Variable Name */}
            <motion.span
                className="absolute -top-8 left-1/2 -translate-x-1/2 text-primary font-bold text-xl"
                initial={{ y: -10, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.2 }}
            >
                {name}
            </motion.span>

            {/* Value */}
            <motion.span
                className={`text-3xl font-black ${isActive ? "text-white" : "text-primary/30"}`}
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.3, type: "spring", stiffness: 200 }}
            >
                {value}
            </motion.span>

            {/* Memory Address */}
            <span className="absolute -bottom-6 text-[10px] text-primary/80 font-mono">
                ADDR: {address}
            </span>

            {/* Pointer Arrow */}
            {hasPointer && (
                <motion.div
                    className="absolute -right-12 top-1/2 -translate-y-1/2 text-primary flex items-center gap-1"
                    initial={{ x: -20, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    transition={{ delay: 0.4 }}
                >
                    <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                    </svg>
                    {pointerTo && (
                        <span className="text-xs font-mono">{pointerTo}</span>
                    )}
                </motion.div>
            )}
        </motion.div>
    );
}
