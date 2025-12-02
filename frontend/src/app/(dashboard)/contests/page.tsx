'use client';

import { ContestList } from '@/components/Contests/ContestList';
import { ShinyText } from '@/components/ui/shiny-text';
import { motion } from 'framer-motion';

export default function ContestsPage() {
    return (
        <div className="space-y-8">
            <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
            >
                <h2 className="text-3xl font-bold tracking-tight">
                    <ShinyText speed={4} className="text-white font-bold">Contest Calendar</ShinyText> 🗓️
                </h2>
                <p className="text-slate-400 mt-1">Don't miss the next big challenge.</p>
            </motion.div>

            <ContestList />
        </div>
    );
}
