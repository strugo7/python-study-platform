"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import Header from "@/components/Header";
import { getAllModules, getCurriculumStats } from "@/data/curriculumLoader";

export default function Dashboard() {
  const modules = getAllModules();
  const stats = getCurriculumStats();

  // Calculate progress (for now, assume first module is in-progress)
  const completedModules = 0;
  const progressPercent = Math.round((completedModules / modules.length) * 100);

  return (
    <div className="min-h-screen flex flex-col">
      <Header />

      <main className="flex flex-1 justify-center py-8">
        <div className="flex flex-col w-full max-w-[1200px] px-6 lg:px-10">
          {/* Page Heading */}
          <div className="flex flex-wrap justify-between gap-3 mb-6">
            <div className="flex min-w-72 flex-col gap-1">
              <h1 className="text-4xl font-black leading-tight tracking-tight">
                {stats.courseTitle}
              </h1>
              <p className="text-text-muted text-lg font-normal leading-normal">
                {stats.courseDescription}
              </p>
            </div>
          </div>

          {/* Progress Bar */}
          <motion.div
            className="bg-surface-dark rounded-xl p-6 mb-8 border border-border-dark shadow-sm"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <div className="flex flex-col gap-4">
              <div className="flex gap-6 justify-between items-end">
                <div className="flex flex-col gap-1">
                  <p className="text-lg font-bold leading-normal">
                    התקדמות כללית בקורס
                  </p>
                  <p className="text-text-muted text-sm font-normal">
                    {modules.length} מודולים | {stats.totalQuestions} שאלות תרגול
                  </p>
                </div>
                <p className="text-primary text-2xl font-black leading-normal">
                  {progressPercent}%
                </p>
              </div>
              <div className="h-3 rounded-full bg-border-dark overflow-hidden">
                <motion.div
                  className="h-full rounded-full bg-primary progress-glow"
                  initial={{ width: 0 }}
                  animate={{ width: `${progressPercent}%` }}
                  transition={{ duration: 1, delay: 0.5 }}
                />
              </div>
            </div>
          </motion.div>

          {/* Section Header */}
          <div className="flex items-center justify-between mb-4 px-2">
            <h2 className="text-2xl font-bold leading-tight tracking-tight">
              מודולי הקורס
            </h2>
            <Link href="/exam" className="text-primary text-sm font-bold hover:underline">
              התחל בחינה אקראית ←
            </Link>
          </div>

          {/* Module Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {modules.map((module, index) => (
              <motion.div
                key={module.id}
                className="group flex flex-col bg-surface-dark rounded-xl overflow-hidden border border-border-dark card-hover"
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
              >
                {/* Card Header */}
                <div className="relative p-6 bg-gradient-to-br from-primary/20 to-transparent">
                  <div className="flex items-center gap-4">
                    <span className="w-12 h-12 flex items-center justify-center rounded-xl bg-primary text-background-dark text-xl font-black">
                      {module.id}
                    </span>
                    <div>
                      <h3 className="text-lg font-bold">{module.title}</h3>
                      <p className="text-sm text-text-muted">{module.subtitle}</p>
                    </div>
                  </div>
                </div>

                {/* Card Content */}
                <div className="p-5 flex flex-col gap-4 flex-1">
                  {/* Learning Objectives Preview */}
                  {module.learningObjectives && (
                    <div className="flex flex-col gap-2">
                      {module.learningObjectives.slice(0, 3).map((obj, idx) => (
                        <div key={idx} className="flex items-start gap-2 text-sm text-text-muted">
                          <span className="text-primary mt-0.5">•</span>
                          <span className="line-clamp-1">{obj}</span>
                        </div>
                      ))}
                      {module.learningObjectives.length > 3 && (
                        <span className="text-xs text-text-muted">
                          +{module.learningObjectives.length - 3} נוספים...
                        </span>
                      )}
                    </div>
                  )}

                  {/* Stats */}
                  <div className="flex gap-4 mt-auto pt-4 border-t border-border-dark">
                    <div className="flex items-center gap-2 text-sm text-text-muted">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                      </svg>
                      <span>{module.theory_sections?.length || 0} סקציות</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-text-muted">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                      </svg>
                      <span>{(module.practice_questions?.length || 0) + (module.exam_prep_questions?.length || 0)} שאלות</span>
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex gap-3">
                    <Link
                      href={`/learn/${module.id}`}
                      className="flex-1 bg-primary/10 text-primary border border-primary/20 hover:bg-primary/20 font-bold py-2.5 rounded-lg text-sm transition-colors flex items-center justify-center gap-2"
                    >
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      לומדים
                    </Link>
                    <Link
                      href={`/exam?module=${module.id}`}
                      className="flex-1 bg-primary text-background-dark hover:brightness-110 font-bold py-2.5 rounded-lg text-sm transition-all flex items-center justify-center gap-2"
                    >
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                      </svg>
                      תרגול
                    </Link>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>

          {/* CTA Section */}
          <motion.div
            className="mt-12 p-8 rounded-xl bg-gradient-to-r from-primary/20 to-transparent border border-primary/30 flex flex-col md:flex-row items-center justify-between gap-6"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.8 }}
          >
            <div className="flex items-center gap-4">
              <div className="size-14 rounded-full bg-primary flex items-center justify-center text-background-dark">
                <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
                </svg>
              </div>
              <div>
                <h4 className="text-xl font-bold">📝 מבחנים מסכמים</h4>
                <p className="text-text-muted text-sm">
                  3 מבחנים ברמת המרצה עם 60 שאלות ייחודיות
                </p>
              </div>
            </div>
            <div className="flex gap-3 w-full md:w-auto">
              <Link
                href="/exam"
                className="flex-1 md:flex-none px-6 py-3 border border-primary text-primary font-bold rounded-xl hover:bg-primary/10 transition-colors text-center"
              >
                תרגול אקראי
              </Link>
              <Link
                href="/exam/final"
                className="flex-1 md:flex-none px-6 py-3 bg-white text-background-dark font-black rounded-xl hover:bg-slate-100 transition-colors text-center"
              >
                מבחנים מסכמים
              </Link>
            </div>
          </motion.div>
        </div>
      </main>

      {/* Mobile Bottom Nav */}
      <footer className="lg:hidden fixed bottom-0 left-0 right-0 bg-background-dark border-t border-border-dark p-3 flex justify-around items-center z-50">
        <button className="flex flex-col items-center gap-1 text-primary">
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
          </svg>
          <span className="text-[10px] font-bold">ראשי</span>
        </button>
        <Link href="/learn/1" className="flex flex-col items-center gap-1 text-gray-400">
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
          </svg>
          <span className="text-[10px] font-bold">שיעורים</span>
        </Link>
        <Link href="/exam" className="flex flex-col items-center gap-1 text-gray-400">
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
          </svg>
          <span className="text-[10px] font-bold">בחינה</span>
        </Link>
        <button className="flex flex-col items-center gap-1 text-gray-400">
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
          </svg>
          <span className="text-[10px] font-bold">הגדרות</span>
        </button>
      </footer>
    </div>
  );
}
