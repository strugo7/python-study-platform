"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import Header from "@/components/Header";
import { getAllModules, getCurriculumStats } from "@/data/curriculumLoader";

export default function Dashboard() {
  const modules = getAllModules();
  const stats = getCurriculumStats();

  const completedModules = 0;
  const progressPercent = Math.round((completedModules / modules.length) * 100);

  return (
    <div className="min-h-screen flex flex-col pb-20 lg:pb-0">
      <Header />

      <main className="flex flex-1 justify-center py-10">
        <div className="flex flex-col w-full max-w-[1200px] px-6 lg:px-10">

          {/* Page Heading — editorial asymmetric */}
          <div className="flex flex-wrap justify-between gap-3 mb-8">
            <div className="flex min-w-72 flex-col gap-2">
              <h1 className="font-display text-4xl lg:text-5xl font-bold leading-tight tracking-tight text-on-surface">
                {stats.courseTitle}
              </h1>
              <p className="text-on-surface-variant text-lg font-normal leading-normal">
                {stats.courseDescription}
              </p>
            </div>
          </div>

          {/* Progress Card — tonal surface, no border */}
          <motion.div
            className="rounded-2xl p-7 mb-10"
            style={{ background: 'var(--surface-container)' }}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <div className="flex flex-col gap-5">
              <div className="flex gap-6 justify-between items-end">
                <div className="flex flex-col gap-1">
                  <p className="font-display text-lg font-bold leading-normal text-on-surface">
                    התקדמות כללית בקורס
                  </p>
                  <p className="text-on-surface-variant text-sm">
                    {modules.length} מודולים · {stats.totalQuestions} שאלות תרגול
                  </p>
                </div>
                <p className="font-display text-3xl font-black leading-none gradient-cta-text">
                  {progressPercent}%
                </p>
              </div>
              <div className="h-1.5 rounded-full overflow-hidden" style={{ background: 'var(--surface-container-highest)' }}>
                <motion.div
                  className="h-full rounded-full gradient-cta progress-glow"
                  initial={{ width: 0 }}
                  animate={{ width: `${progressPercent}%` }}
                  transition={{ duration: 1.2, delay: 0.4, ease: [0.25, 1, 0.5, 1] }}
                />
              </div>
            </div>
          </motion.div>

          {/* Section Header */}
          <div className="flex items-center justify-between mb-6 px-1">
            <h2 className="font-display text-2xl font-bold leading-tight tracking-tight text-on-surface">
              מודולי הקורס
            </h2>
            <Link href="/exam" className="text-primary text-sm font-bold hover:opacity-80 transition-opacity">
              התחל בחינה אקראית ←
            </Link>
          </div>

          {/* Module Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {modules.map((module, index) => (
              <motion.div
                key={module.id}
                className="group flex flex-col rounded-2xl overflow-hidden card-hover"
                style={{ background: 'var(--surface-container)' }}
                initial={{ opacity: 0, y: 24 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05, ease: [0.25, 1, 0.5, 1] }}
              >
                {/* Card Header — gradient tonal */}
                <div
                  className="relative p-6"
                  style={{ background: 'linear-gradient(135deg, rgba(0,247,123,0.08) 0%, transparent 70%)' }}
                >
                  <div className="flex items-center gap-4">
                    <span className="w-11 h-11 flex items-center justify-center rounded-xl gradient-cta text-background-dark text-lg font-black">
                      {module.id}
                    </span>
                    <div>
                      <h3 className="font-display text-base font-bold text-on-surface">{module.title}</h3>
                      <p className="text-xs text-on-surface-variant mt-0.5">{module.subtitle}</p>
                    </div>
                  </div>
                </div>

                {/* Card Content */}
                <div className="p-5 flex flex-col gap-4 flex-1">
                  {module.learningObjectives && (
                    <div className="flex flex-col gap-1.5">
                      {module.learningObjectives.slice(0, 3).map((obj, idx) => (
                        <div key={idx} className="flex items-start gap-2 text-sm text-on-surface-variant">
                          <span className="text-primary mt-0.5 shrink-0">›</span>
                          <span className="line-clamp-1">{obj}</span>
                        </div>
                      ))}
                      {module.learningObjectives.length > 3 && (
                        <span className="text-xs text-on-surface-variant/60 pr-4">
                          +{module.learningObjectives.length - 3} נוספים...
                        </span>
                      )}
                    </div>
                  )}

                  {/* Stats */}
                  <div className="flex gap-4 mt-auto pt-4" style={{ borderTop: '1px solid rgba(59,75,60,0.2)' }}>
                    <div className="flex items-center gap-1.5 text-xs text-on-surface-variant">
                      <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                      </svg>
                      <span>{module.theory_sections?.length || 0} סקציות</span>
                    </div>
                    <div className="flex items-center gap-1.5 text-xs text-on-surface-variant">
                      <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                      </svg>
                      <span>{(module.practice_questions?.length || 0) + (module.exam_prep_questions?.length || 0)} שאלות</span>
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex gap-2.5">
                    <Link
                      href={`/learn/${module.id}`}
                      className="flex-1 text-primary text-sm font-bold py-2.5 rounded-xl transition-all flex items-center justify-center gap-2 hover:opacity-90"
                      style={{ background: 'rgba(0,247,123,0.1)' }}
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      לומדים
                    </Link>
                    <Link
                      href={`/exam?module=${module.id}`}
                      className="flex-1 gradient-cta text-background-dark font-bold py-2.5 rounded-xl text-sm transition-all flex items-center justify-center gap-2 hover:opacity-90 hover:shadow-[0_4px_16px_rgba(0,247,123,0.2)]"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                      </svg>
                      תרגול
                    </Link>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>

          {/* CTA Section — editorial gradient panel */}
          <motion.div
            className="mt-14 p-8 rounded-2xl flex flex-col md:flex-row items-center justify-between gap-8"
            style={{
              background: 'linear-gradient(135deg, rgba(0,247,123,0.12) 0%, rgba(0,247,123,0.04) 60%, transparent 100%)',
            }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.7 }}
          >
            <div className="flex items-center gap-5">
              <div className="size-14 rounded-2xl gradient-cta flex items-center justify-center text-background-dark shadow-[0_8px_24px_rgba(0,247,123,0.25)]">
                <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
                </svg>
              </div>
              <div>
                <h4 className="font-display text-xl font-bold text-on-surface">מבחנים מסכמים</h4>
                <p className="text-on-surface-variant text-sm mt-0.5">
                  3 מבחנים ברמת המרצה עם 60 שאלות ייחודיות
                </p>
              </div>
            </div>
            <div className="flex gap-3 w-full md:w-auto">
              <Link
                href="/exam"
                className="flex-1 md:flex-none px-6 py-3 rounded-xl text-primary font-bold text-sm transition-all text-center hover:bg-primary/10"
                style={{ border: '1px solid rgba(0,247,123,0.3)' }}
              >
                תרגול אקראי
              </Link>
              <Link
                href="/exam/final"
                className="flex-1 md:flex-none px-6 py-3 gradient-cta text-background-dark font-black rounded-xl hover:opacity-90 transition-all text-center text-sm shadow-[0_4px_20px_rgba(0,247,123,0.2)]"
              >
                מבחנים מסכמים
              </Link>
            </div>
          </motion.div>

        </div>
      </main>

      {/* Mobile Bottom Nav — glassmorphism */}
      <footer className="lg:hidden fixed bottom-0 left-0 right-0 glass py-3 px-6 flex justify-around items-center z-50" style={{ borderTop: '1px solid rgba(59,75,60,0.2)' }}>
        <button className="flex flex-col items-center gap-1 text-primary">
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
          </svg>
          <span className="text-[10px] font-bold">ראשי</span>
        </button>
        <Link href="/learn/1" className="flex flex-col items-center gap-1 text-on-surface-variant">
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
          </svg>
          <span className="text-[10px] font-bold">שיעורים</span>
        </Link>
        <Link href="/exam" className="flex flex-col items-center gap-1 text-on-surface-variant">
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
          </svg>
          <span className="text-[10px] font-bold">בחינה</span>
        </Link>
        <Link href="/exam/final" className="flex flex-col items-center gap-1 text-on-surface-variant">
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
          </svg>
          <span className="text-[10px] font-bold">מאגר</span>
        </Link>
      </footer>
    </div>
  );
}
