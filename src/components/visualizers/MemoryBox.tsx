"use client";

import { motion } from "framer-motion";

interface MemoryBoxProps {
    name: string;
    value: string | number;
    address?: string;
    type?: string;
    isActive?: boolean;
    isNew?: boolean;
    isChanged?: boolean;
    hasPointer?: boolean;
    pointerTo?: string;
}

export default function MemoryBox({
    name,
    value,
    address = "0x4F5",
    type,
    isActive = false,
    isNew = false,
    isChanged = false,
    hasPointer = false,
    pointerTo,
}: MemoryBoxProps) {
    const borderClass = isNew
        ? "border-primary bg-primary/25 shadow-[0_0_15px_rgba(43,238,108,0.4)]"
        : isChanged
            ? "border-yellow-400 bg-yellow-400/15 shadow-[0_0_12px_rgba(250,204,21,0.3)]"
            : isActive
                ? "border-primary bg-primary/20"
                : "border-primary/20 bg-primary/5";

    const valueColor = isNew || isChanged || isActive ? "text-white" : "text-primary/30";

    return (
        <motion.div
            className={`relative aspect-square rounded-lg border-2 flex flex-col items-center justify-center transition-colors ${borderClass}`}
            initial={isNew ? { scale: 0, opacity: 0 } : { scale: 0.9, opacity: 0 }}
            animate={isNew
                ? { scale: [0, 1.15, 1], opacity: 1 }
                : isChanged
                    ? { scale: 1, opacity: 1, borderColor: ['#FBBF24', '#FBBF24', '#2BEE6C'] }
                    : { scale: 1, opacity: 1 }
            }
            transition={isNew
                ? { duration: 0.5, times: [0, 0.6, 1], type: "spring", stiffness: 200 }
                : isChanged
                    ? { duration: 0.8, times: [0, 0.4, 1] }
                    : { duration: 0.3 }
            }
            whileHover={{ scale: 1.05 }}
        >
            {/* Variable Name */}
            <motion.span
                className="absolute -top-7 left-1/2 -translate-x-1/2 text-primary font-bold text-base whitespace-nowrap"
                initial={{ y: -10, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.2 }}
            >
                {name}
            </motion.span>

            {/* Value */}
            <motion.span
                className={`text-2xl font-black ${valueColor} text-center leading-tight px-1 break-all`}
                key={`${name}-${value}`}
                initial={isChanged ? { scale: 0.5, opacity: 0 } : { scale: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ delay: 0.1, type: "spring", stiffness: 200 }}
            >
                {String(value).length > 8 ? String(value).slice(0, 7) + '...' : value}
            </motion.span>

            {/* Memory Address */}
            <span className="absolute -bottom-5 text-[10px] text-primary/60 font-mono">
                {address}
            </span>

            {/* Type Badge */}
            {type && (
                <span className="absolute -bottom-5 right-0 text-[9px] text-primary/40 font-mono bg-primary/10 px-1 rounded">
                    {type}
                </span>
            )}

            {/* Pointer Arrow */}
            {hasPointer && (
                <motion.div
                    className="absolute -right-10 top-1/2 -translate-y-1/2 text-primary flex items-center gap-1"
                    initial={{ x: -20, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    transition={{ delay: 0.4 }}
                >
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                    </svg>
                    {pointerTo && (
                        <span className="text-[9px] font-mono">{pointerTo}</span>
                    )}
                </motion.div>
            )}
        </motion.div>
    );
}
