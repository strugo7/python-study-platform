"use client";

import { motion } from "framer-motion";
import type { ComplexValue, ListValue, DictValue, ObjectValue } from "@/data/curriculum.types";

interface HeapObjectProps {
    obj: ComplexValue;
    isNew?: boolean;
}

function ListDisplay({ list, isNew }: { list: ListValue; isNew?: boolean }) {
    return (
        <motion.div
            className="rounded-lg border border-primary/30 bg-primary/5 overflow-hidden"
            initial={isNew ? { scale: 0.8, opacity: 0 } : { opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.4 }}
        >
            <div className="flex items-center gap-1 px-2 py-1 bg-primary/10 border-b border-primary/20">
                <span className="text-[10px] font-mono text-primary/60">{list.address}</span>
                <span className="text-[10px] font-bold text-primary ml-auto">list</span>
            </div>
            <div className="flex">
                {list.items.map((item, idx) => (
                    <div
                        key={idx}
                        className="flex flex-col items-center border-l first:border-l-0 border-primary/20 min-w-[40px]"
                    >
                        <span className="text-[9px] text-primary/40 font-mono px-1">{idx}</span>
                        <span className="text-sm font-bold text-white px-2 py-1">
                            {item === null ? 'None' : typeof item === 'string' ? `'${item}'` : String(item)}
                        </span>
                    </div>
                ))}
            </div>
        </motion.div>
    );
}

function DictDisplay({ dict, isNew }: { dict: DictValue; isNew?: boolean }) {
    return (
        <motion.div
            className="rounded-lg border border-blue-400/30 bg-blue-400/5 overflow-hidden"
            initial={isNew ? { scale: 0.8, opacity: 0 } : { opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.4 }}
        >
            <div className="flex items-center gap-1 px-2 py-1 bg-blue-400/10 border-b border-blue-400/20">
                <span className="text-[10px] font-mono text-blue-400/60">{dict.address}</span>
                <span className="text-[10px] font-bold text-blue-400 ml-auto">dict</span>
            </div>
            <div className="divide-y divide-blue-400/10">
                {dict.entries.map((entry, idx) => (
                    <div key={idx} className="flex items-center gap-2 px-2 py-1">
                        <span className="text-xs font-mono text-yellow-300">{`'${entry.key}'`}</span>
                        <span className="text-blue-400/40 text-xs">&rarr;</span>
                        <span className="text-sm font-bold text-white">
                            {entry.value === null ? 'None' : String(entry.value)}
                        </span>
                    </div>
                ))}
            </div>
        </motion.div>
    );
}

function ObjectDisplay({ obj, isNew }: { obj: ObjectValue; isNew?: boolean }) {
    return (
        <motion.div
            className="rounded-lg border border-purple-400/30 bg-purple-400/5 overflow-hidden"
            initial={isNew ? { scale: 0.8, opacity: 0 } : { opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.4 }}
        >
            <div className="flex items-center gap-1 px-2 py-1 bg-purple-400/10 border-b border-purple-400/20">
                <span className="text-[10px] font-mono text-purple-400/60">{obj.address}</span>
                <span className="text-[10px] font-bold text-purple-400 ml-auto">{obj.className}</span>
            </div>
            <div className="divide-y divide-purple-400/10">
                {obj.attributes.map((attr, idx) => (
                    <div key={idx} className="flex items-center gap-2 px-2 py-1">
                        <span className="text-xs font-mono text-purple-300">.{attr.name}</span>
                        <span className="text-purple-400/40 text-xs">=</span>
                        <span className="text-sm font-bold text-white">
                            {attr.value === null ? 'None'
                                : typeof attr.value === 'object' && attr.value !== null && 'type' in attr.value
                                    ? `[${(attr.value as ListValue).items.length} items]`
                                    : typeof attr.value === 'string' ? `'${attr.value}'` : String(attr.value)}
                        </span>
                    </div>
                ))}
            </div>
        </motion.div>
    );
}

export default function HeapObject({ obj, isNew }: HeapObjectProps) {
    switch (obj.type) {
        case 'list':
            return <ListDisplay list={obj} isNew={isNew} />;
        case 'dict':
            return <DictDisplay dict={obj} isNew={isNew} />;
        case 'object':
            return <ObjectDisplay obj={obj} isNew={isNew} />;
        default:
            return null;
    }
}
